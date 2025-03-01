"use client";

//wrong url
//http://localhost:3000/?bgColor=%23000&modColor=%230000FF&btnColor=%23fff?userId=67b951d4a6d3d4369aad79fb&cryptoLogId=67bc076eb685279ecc2a9432

//right url
//http://localhost:3000/?bgColor=%23000&modColor=%230000FF&btnColor=%23fff&userId=67b951d4a6d3d4369aad79fb&cryptoLogId=67bc076eb685279ecc2a9432




import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createUrl,
  createPost,
  updatePost,
  updateUrl,
  createIp,
} from "@/shared/Api/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Form, Nav, Row, Tab, Button } from "react-bootstrap";
import { editProfile } from "@/shared/Api/auth";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/shared/Api/firebase";

const Popup = ({
  ipPopup,
  postPopup,
  isOpen,
  onClose,
  val,
  ipVal,
  setIpVal,
  setVal,
  updateId,
  descVal,
  setDescVal,
  setUpdate,
  ipBlock,
  usermanagment,
  userValue,
  setUserValue,
}: any) => {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.auth.user);
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const colorbtnInputRef = useRef<HTMLInputElement | null>(null);
  const colorModInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [validUrl, setValidUrl] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");
  const [error, setError] = useState("");
  const [appName, setAppName] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [selectedModColor, setSelectedModColor] = useState("");
  const [selectedBtnColor, setSelectedBtnColor] = useState("");
  const [image, setImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b"
  );

  if (!isOpen) return null;

  console.log(selectedImage)

  const handleSubmitPost = () => {
    if (updateId) {
      updatePost(
        {
          title: val,
          description: descVal,
          userId: user?._id,
          id: updateId,
        },
        dispatch
      );
    } else {
      createPost(
        { title: val, description: descVal, userId: user?._id },
        dispatch
      );
    }
    onClose();
    setVal("");
    setDescVal("");
    setUpdate("");
  };

  const updateUser = async () => {
    const userPayload = {
      userName: userValue?.userName,
      email: userValue?.email,
      password: userValue?.password ?? "",
    };
    const response = await editProfile(userPayload, dispatch);
    onClose();
  };

  const handleChangePost = (e: any) => {
    setVal(e.target.value);
  };
  const handleChangePostDesc = (e: any) => {
    setDescVal(e.target.value);
  };
  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescVal(e.target.value);
  };
  const handleChangeIp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpVal(e.target.value);
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true; // URL is valid
    } catch (error) {
      return false; // URL is invalid
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    console.log("Selected Color:", selectedColor);
    setSelectedColor(selectedColor);
  };

  const handleModColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    console.log("Selected Color:", selectedColor);
    setSelectedModColor(selectedColor);
  };
  
  const handleBtnColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    console.log("Selected Color:", selectedColor);
    setSelectedBtnColor(selectedColor);
  };
  const handleChangeAppName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppName(e.target.value);
  };
  const handleChangeRedirectUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRedirectLink(e.target.value);
  };


  const handleSubmitUrl = () => {
    if (isValidUrl(descVal)) {
      const encodedColor = selectedColor ? selectedColor.replace("#", "%23") : null;
      const encodedModColor = selectedModColor ? selectedModColor.replace("#", "%23") : null;
      const encodedBtnColor = selectedBtnColor ? selectedBtnColor.replace("#", "%23") : null;

      const queryParams = [];
      if (encodedColor) queryParams.push(`bgColor=${encodedColor}`);
      if (encodedModColor) queryParams.push(`modColor=${encodedModColor}`);
      if (encodedBtnColor) queryParams.push(`btnColor=${encodedBtnColor}`);
      // if (selectedImage) queryParams.push(`appLogo=${selectedImage}`);

      const urlWithColor =
      queryParams.length > 0
        ? `${descVal}${descVal.includes("?") ? "&" : "?"}${queryParams.join("&")}`
        : descVal;

      const urlData = {
        description: urlWithColor,
        userId: user?._id,
        id: updateId,
        appName: appName,
        redirectUrl: redirectLink,
        appLogo: selectedImage,
        backgroundcolor: selectedColor,
        btnColor: selectedBtnColor,
        modalColor: selectedModColor,
      };
      if (updateId) {
        updateUrl(urlData, dispatch);
      } else {
        createUrl(urlData, dispatch);
      }

      // Reset states and close the modal
      onClose();
      setDescVal("");
      setUpdate("");
      setValidUrl(false);
      setSelectedBtnColor("")
      setSelectedColor("")
      setSelectedImage("https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b")
      setAppName("")
      setRedirectLink("")
      setSelectedModColor("")
    } else {
      setValidUrl(true); // Trigger an invalid URL message or state
      console.log("Invalid URL entered");
    }
  };

  const isValidIp = (ip: string) => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  // Helper function to convert an IP address to an integer
  const ipToInt = (ip: string): number => {
    return ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
  };

  // Helper function to convert an integer back to an IP address
  const intToIp = (int: number): string => {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join(".");
  };

  // Main function to block a range of IPs
  const blockIpRange = async (
    startIp: string,
    endIp: string,
    userId: any,
    dispatch: any,
    createIp: (data: { blockerId: any; ip: string }, dispatch: any) => void
  ) => {
    onClose();
    setStartRange("");
    setEndRange("");
    const startInt = ipToInt(startIp);
    const endInt = ipToInt(endIp);

    if (startInt > endInt) {
      console.error("Start IP cannot be greater than End IP");
      return;
    }

    for (let currentInt = startInt; currentInt <= endInt; currentInt++) {
      const currentIp = intToIp(currentInt);

      // Call the createIp function for each IP in the range
      await createIp({ blockerId: userId?._id, ip: currentIp }, dispatch);
    }

    console.log(`Blocked all IPs from ${startIp} to ${endIp}`);
  };

  const handleSubmitIp = () => {
    if (!isValidIp(ipVal)) {
      setError("Please enter a valid IP address.");
      return;
    }
    setError("");
    createIp({ blockerId: user?._id, ip: ipVal }, dispatch);
    console.log("Blocked IP:", ipVal);
    setIpVal("");
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create a storage reference
      const imageRef = ref(storage, `crypto-images/${file.name + v4()}`);

      try {
        // Upload the file to Firebase Storage
        await uploadBytes(imageRef, file);

        // Get the download URL
        const imageUrl = await getDownloadURL(imageRef);
        console.log('selected image in here', imageUrl)
        setImage(imageUrl);
        setSelectedImage(imageUrl);
      } catch (error) {
        console.error("Error uploading the image:", error);
        // Handle the error (e.g., show a message to the user)
      }
    }
  };

  return (
    <>
      {postPopup ? (
        <div className="fixed inset-0 bg-['rgba(0, 0, 0, 0.5)'] bg-opacity-30 backdrop-blur-sm z-10 w-full h-screen flex justify-center items-center">
          <div className="flex flex-col items-center w-[500px] mt-2">
            <button
              title="close"
              onClick={() => {
                onClose();
                setVal("");
                setDescVal("");
              }}
              className=""
            >
              <X className="rounded-md hover:bg-[#4f5763] relative left-[230px] top-[32px]" />
            </button>
            <div className="bg-[#12111d] w-full py-10 rounded-md flex flex-col justify-center items-center gap-4 text-center">
              <p className="text-lg font-bold">Add New News</p>
              <input
                type="text"
                className="form-control rounded-md px-2 py-2 w-4/5"
                placeholder="title"
                value={val}
                onChange={(e) => {
                  handleChangePost(e);
                }}
              />
              <input
                type="text"
                className="form-control rounded-md px-2 py-2 w-4/5"
                placeholder="description"
                value={descVal}
                onChange={(e) => {
                  handleChangePostDesc(e);
                }}
              />
              <button
                onClick={handleSubmitPost}
                className="text-sm font-semibold px-5 py-2 rounded-md bg-[#1c64f2] hover:bg-gradient-to-bl"
              >
                Submit post
              </button>
            </div>
          </div>
        </div>
      ) : ipPopup ? (
        <div className="fixed inset-0 bg-['rgba(0, 0, 0, 0.5)'] bg-opacity-30 backdrop-blur-sm z-10 w-full h-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[500px] mt-2">
            <button
              title="close"
              onClick={() => {
                onClose();
                setIpVal("");
                setStartRange("");
                setEndRange("");
                setError("");
              }}
            >
              <X className="rounded-md hover:bg-[#4f5763] relative left-[230px] top-[32px]" />
            </button>
            <div className="bg-[#12111d] w-full py-20 rounded-lg flex flex-col justify-center items-center gap-4 text-center">
              <input
                type="text"
                className="form-control rounded-md px-2 py-2 w-4/5"
                placeholder="Enter IP"
                value={ipVal}
                onChange={handleChangeIp}
              />
              {error && <p className="text-red-400 text-[15px]">{error}</p>}
              <button
                onClick={handleSubmitIp}
                className="text-sm font-semibold px-5 py-2 rounded-md bg-[#1c64f2] hover:bg-gradient-to-bl"
              >
                Block IP
              </button>
              <div className="flex flex-col gap-4 w-full">
                <p>Range IPs</p>
                <div className="d-flex gap-3 flex-col justify-center items-center">
                  <input
                    type="text"
                    placeholder="Start Range (e.g., 90.201.1.1)"
                    value={startRange}
                    onChange={(e) => setStartRange(e.target.value)}
                    className="form-control rounded-md px-2 py-2 w-4/5"
                  />
                  <input
                    type="text"
                    placeholder="End Range (e.g., 90.201.999.999)"
                    value={endRange}
                    onChange={(e) => setEndRange(e.target.value)}
                    className="form-control rounded-md px-2 py-2 w-4/5"
                  />
                </div>
                <div>
                  <button
                    onClick={() => {
                      blockIpRange(
                        startRange,
                        endRange,
                        user?._id,
                        dispatch,
                        createIp
                      );
                    }}
                    className="text-sm font-semibold px-5 py-2 rounded-md bg-[#1c64f2] hover:bg-gradient-to-bl"
                  >
                    Block Range
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : ipBlock ? (
        <div className="fixed inset-0 bg-['rgba(0, 0, 0, 0.5)'] bg-opacity-30 backdrop-blur-sm z-10 w-full h-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[650px] mt-2">
            <button
              title="close"
              onClick={() => {
                onClose();
              }}
              className="cursor-pointer"
            >
              <X className="rounded-md hover:bg-[#4f5763] relative left-[230px] top-[32px]" />
            </button>
            <div className="bg-[#12111d] w-full py-10 px-5 rounded-lg flex flex-col justify-center items-center text-center text-lg text-red-400 font-semibold">
              Access Denied: This user has been blocked.
            </div>
          </div>
        </div>
      ) : usermanagment ? (
        <div className="fixed inset-0 bg-['rgba(0, 0, 0, 0.5)']  bg-opacity-30 backdrop-blur-sm z-10 w-full h-screen flex justify-center items-center">
          <div className="flex flex-col items-center w-[700px] mt-2">
            <ul className="list-group list-group-flush">
              <button
                title="close"
                onClick={() => {
                  onClose();
                }}
                className="z-10"
              >
                <X className="rounded-md hover:bg-[#4f5763] relative left-[650px] top-[32px]" />
              </button>
              <li className="list-group-item p-4">
                <span className="fw-medium fs-15 mb-3">PERSONAL INFO :</span>
                <div className="row gy-4 align-items-center">
                  <Col xl={3}>
                    <div className="lh-1">
                      <span className="fw-medium">User Name :</span>
                    </div>
                  </Col>
                  <Col xl={9}>
                    <Form.Control
                      type="text"
                      className="form-control"
                      placeholder="User name"
                      onChange={(e) =>
                        setUserValue({ ...userValue, userName: e.target.value })
                      }
                      defaultValue={userValue?.userName}
                    />
                  </Col>
                </div>
              </li>
              <li className="list-group-item p-4">
                <span className="fw-medium fs-15 d-block mb-3">
                  CONTACT INFO :
                </span>
                <div className="row gy-4 align-items-center">
                  <Col xl={3}>
                    <div className="lh-1">
                      <span className="fw-medium">Email :</span>
                    </div>
                  </Col>
                  <Col xl={9}>
                    <Form.Control
                      type="email"
                      disabled
                      className="form-control"
                      placeholder="email"
                      defaultValue={userValue?.email}
                    />
                  </Col>
                  <Col xl={3}>
                    <div className="lh-1">
                      <span className="fw-medium">Password :</span>
                    </div>
                  </Col>
                  <Col xl={9}>
                    <Form.Control
                      type="text"
                      className="form-control"
                      placeholder="Password"
                      defaultValue={userValue?.password}
                    />
                  </Col>
                  <Col xl={3}>
                    <div className="lh-1">
                      <span className="fw-medium">Location :</span>
                    </div>
                  </Col>
                  <Col xl={9}>
                    <Form.Control
                      type="text"
                      disabled
                      className="form-control"
                      placeholder="location"
                      defaultValue={[userValue?.city, userValue?.country]}
                    />
                  </Col>
                </div>
              </li>
              <li className="list-group-item p-4">
                <span className="fw-medium fs-15 d-block mb-3">ABOUT :</span>
                <div className="row gy-4 align-items-center">
                  <Col xl={3}>
                    <div className="lh-1">
                      <span className="fw-medium">Biographical Info :</span>
                    </div>
                  </Col>
                  <Col xl={9}>
                    <Form.Control
                      as="textarea"
                      className="form-control"
                      id="text-area"
                      onChange={(e) =>
                        setUserValue({ ...userValue, bio: e.target.value })
                      }
                      rows={4}
                      defaultValue={userValue?.bio}
                    ></Form.Control>
                    <button
                      onClick={updateUser}
                      className="text-sm font-semibold px-5 mt-8 py-2 rounded-md bg-[#1c64f2] hover:bg-gradient-to-bl"
                    >
                      UpdateUser
                    </button>
                  </Col>
                </div>
              </li>
            </ul>
          </div>
          {/* <div className="flex flex-col items-center w-[500px] mt-2">
            <button
              title="close"
              onClick={() => {
                onClose();
              }}
              className=""
            >
              <X className="rounded-md hover:bg-[#4f5763] relative left-[230px] top-[32px]" />
            </button>
            <div className="bg-[#12111d] w-full py-10 rounded-md flex flex-col justify-center items-center gap-4 text-center">
              <p className="text-lg font-bold">Edit User</p>
              <input
                type="text"
                className="form-control rounded-md px-2 py-2 w-4/5"
                placeholder="User Name"
                value={userValue?.userName}
                onChange={(e) => {
                  setUserValue({ ...userValue, userName: e.target.value });
                }}
              />
              <input
                type="email"
                className="form-control rounded-md px-2 py-2 w-4/5"
                placeholder="Email"
                value={userValue?.email}
                onChange={(e) => {
                  setUserValue({ ...userValue, email: e.target.value });
                }}
              />
              <input
                type="text"
                className="form-control rounded-md px-2 py-2 w-4/5"
                placeholder="Password"
                value={userValue?.password}
                onChange={(e) => {
                  setUserValue({ ...userValue, password: e.target.value });
                }}
              />
              <button
                onClick={updateUser}
                className="text-sm font-semibold px-5 py-2 rounded-md bg-[#1c64f2] hover:bg-gradient-to-bl"
              >
                UpdateUser
              </button>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="fixed inset-0 bg-['rgba(0, 0, 0, 0.5)'] bg-opacity-30 backdrop-blur-sm z-10 w-full h-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[500px] mt-2">
            <button
              title="close"
              onClick={() => {
                onClose();
                setDescVal("");
                setAppName("");
                setRedirectLink("");
                setSelectedModColor("")
                setSelectedBtnColor("")
                setSelectedColor("")
                setSelectedImage("https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b")
              }}
              className="cursor-pointer"
            >
              <X className="rounded-md hover:bg-[#4f5763] relative left-[230px] top-[32px]" />
            </button>
            <div className="bg-[#12111d] w-full py-20 rounded-lg flex flex-col justify-center items-center gap-4 text-center">
              {/* URL Input */}
              <input
                type="text"
                className="form-control rounded-md px-2 py-2 w-4/5"
                placeholder="Enter URL"
                value={descVal}
                onChange={handleChangeUrl}
              />
              {validUrl && (
                <p className="text-red-400 text-[15px]">Not a valid URL</p>
              )}
              <input
                type="text"
                placeholder="Enter app name"
                value={appName}
                onChange={handleChangeAppName}
                className="form-control rounded-md px-2 py-2 w-4/5"
              />
              <input
                type="text"
                placeholder="Enter redirect link"
                value={redirectLink}
                onChange={handleChangeRedirectUrl}
                className="form-control rounded-md px-2 py-2 w-4/5"
              />
              <div className="flex flex-row w-full items-center justify-between px-12">
                <div className="text-sm font-semibold rounded-sm p-2 cursor-pointer">
                  Choose background Color
                </div>
                <div
                  className="relative w-16 h-8 rounded-sm cursor-pointer"
                  style={{ border: "1px solid white" }}
                >
                  <input
                    type="color"
                    id="colorPicker"
                    ref={colorInputRef}
                    className="absolute inset-0 invisible opacity-0"
                    onChange={handleColorChange}
                  />
                  <div
                    className="absolute inset-0 w-[full] h-full"
                    onClick={() => colorInputRef.current?.click()}
                    style={{ backgroundColor: selectedColor || "#000" }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-row w-full items-center justify-between px-12">
                <div className="text-sm font-semibold rounded-sm p-2 cursor-pointer">
                  Choose Modal Color
                </div>
                <div
                  className="relative w-16 h-8 rounded-sm cursor-pointer"
                  style={{ border: "1px solid white" }}
                >
                  <input
                    type="color"
                    id="colorPicker"
                    ref={colorModInputRef}
                    className="absolute inset-0 invisible opacity-0"
                    onChange={handleModColorChange}
                  />
                  <div
                    className="absolute inset-0 w-[full] h-full"
                    onClick={() => colorModInputRef.current?.click()}
                    style={{ backgroundColor: selectedModColor || "#0000FF" }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-row w-full items-center justify-between px-12">
                <div className="text-sm font-semibold rounded-sm p-2 cursor-pointer">
                  Choose Button Color
                </div>
                <div
                  className="relative w-16 h-8 rounded-sm cursor-pointer"
                  style={{ border: "1px solid white" }}
                >
                  <input
                    type="color"
                    id="colorPicker"
                    ref={colorbtnInputRef}
                    className="absolute inset-0 invisible opacity-0"
                    onChange={handleBtnColorChange}
                  />
                  <div
                    className="absolute inset-0 w-[full] h-full"
                    onClick={() => colorbtnInputRef.current?.click()}
                    style={{ backgroundColor: selectedBtnColor || "#fff" }}
                  ></div>
                </div>
              </div>
              {/* Image Picker */}
              <div className="flex flex-row w-full justify-between items-center px-12">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  id="imagePicker"
                  onChange={(e) => {
                    handleImageChange(e, setImage);
                  }}
                  className="hidden"
                />
                <div className="text-sm font-semibold rounded-sm p-2 cursor-pointer">
                  Upload Logo
                </div>
                <div
                  className="me-xl-2 me-0"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <img
                    src={
                      selectedImage != ""
                        ? selectedImage
                        : "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b"
                    }
                    alt="img"
                    className="avatar avatar-lg avatar-rounded cursor-pointer"
                  />
                </div>
                {/* {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-32 h-32 object-cover rounded-md mt-2"
                  />
                )} */}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitUrl}
                className="text-sm font-semibold px-5 py-2 rounded-md bg-[#1c64f2] hover:bg-gradient-to-bl"
              >
                Submit URL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
