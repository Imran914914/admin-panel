"use client";
import nextConfig from "@/next.config.mjs";
import { signIn } from "@/shared/Api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
import { Alert, Card, Col, Tab, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "@/shared/Api/auth";

export default function Home() {
  const dispatch = useDispatch();
  const [err, setErr] = useState("");
  const [error, setError] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [setupKey, setSetupKey] = useState(null);
  const [showBtn, setShowBtn] = useState(true);
  const [showBtn2, setShowBtn2] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSetupKey, setShowSetupKey] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [banPopup, setBanPopup] = useState(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const loading = useSelector((state: any) => state.auth.loading);
  const userData = useSelector((state: any) => state.auth.user);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  let { basePath } = nextConfig;
  const router = useRouter();
  const RouteChange = () => {
    let path = "/dashboards/home";
    router.push(path);
  };
  const logo =
    "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Flogo.png?alt=media&token=c6c65b3d-1b55-49f4-9dcb-da1bcb6907b1";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      emailOrUsername: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail) {
      setValue("email", savedEmail); // Set email value
    }
    if (savedPassword) {
      setValue("password", savedPassword); // Set password value
    }
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const response = await signIn({ ...data, rememberMe }, dispatch);

      if (rememberMe) {
        // Store the token in localStorage for persistent login
        localStorage.setItem("email", data?.emailOrUsername);
        localStorage.setItem("password", data?.password);
      } else {
        // Store the token in sessionStorage for temporary login
      }

      if (response?.user) {
        console.log('first time in here', response?.user?.role)
        localStorage.setItem("UserRole", JSON.stringify(response?.user?.role));
        if(response?.user?.is2FAEnabled && !response?.user?.isBanned){
          setShowPopUp(true);
        }else if(response?.user?.isBanned){
          setBanPopup(true);
        }else{
          RouteChange();
        }
      } else {
        reset();
        setErr(response);
      }
    } catch (error: any) {
      setErr(error.message);
    }
  };

  
  const onSubmit2fa = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:8080/google-auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret:userData?.twoFactorSecret, token: verificationToken }),
      });

      if (response.ok) {
        const anotherResponse = await editProfile({
          ...userData,
          is2FAverified:true
        },dispatch)
        if(anotherResponse?.status===200){
          RouteChange();
        }
      } else {
        const errorData = await response.json();
        setError(errorData?.message || "Invalid token. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
    }
  };


  
    const handleVerificationTokenChange = (e:any) => {
      setVerificationToken(e.target.value);
    };
  

    const handleGenerateQRCode = async () => {
      if (!userData?.userName) {
        setError("Username is missing.");
        return;
      }
      setError("");
  
      try {
        const response = await fetch("http://localhost:8080/google-auth/setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username:userData?.userName }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }
        setShowBtn(false)
        setShowBtn2(true)
        const data = await response.json();
        console.log(data)
        setQrCodeUrl(data.qrCodeUrl);
        setSetupKey(data.secret);
        await editProfile({
          ...userData,
          twoFactorSecret:data.secret
        },dispatch)
      } catch (err:any) {
        setError(err.message || "Failed to generate QR code");
      }
    };

    const handleShowSetupKey = () => {
      setShowSetupKey(!showSetupKey); // Show the setup key
    };

  return (
    <Fragment>
      <html data-theme-mode="dark">
        <body className="authentication-background">
          {banPopup&&<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-xl p-6 relative shadow-lg">
                  <button
                    onClick={() => setBanPopup(false)}
                    className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 h-8 w-8 flex items-center justify-center rounded-full shadow z-50"
                  >
                    &times;
                  </button>
                  <div
                    className="p-0 border-0"
                  >
                    <Card className="custom-card overflow-hidden">
                      <div className="text-center mt-4">
                      Your account has been banned by the administrator  
                    </div>
                    <div className="d-flex justify-content-center mt-4 gap-2">
                      <p className="text-red-400">Reason:</p>
                      <p>{userData?.banReason}</p>
                    </div>
                    
                    <div className="d-flex justify-content-center">
  
                    </div>
                <div className="verify-token-section py-4 px-5">
                  </div>
                    </Card>
                  </div>
                </div>
              </div>}
      {showPopUp?(<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-xl p-6 relative shadow-lg">
                  <button
                    onClick={() => setShowPopUp(false)}
                    className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 h-8 w-8 flex items-center justify-center rounded-full shadow z-50"
                  >
                    &times;
                  </button>
                  <div
                    className="p-0 border-0"
                  >
                    <Card className="custom-card overflow-hidden">
                      <div className="text-center mt-4">
                      {qrCodeUrl && !showSetupKey && (
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="rounded"
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            margin: "0 auto", // Centering the QR code
                          }}
                        />
                      )}
                    </div>

                    {/* Setup Key Section */}
                    {showSetupKey && setupKey && (
                      <div className="text-center mt-3">
                        <Form.Control
                          type="text"
                          value={setupKey}
                          readOnly
                          className="text-center p-3"
                          style={{
                            fontFamily: "monospace",
                            fontSize: "18px",
                            maxWidth: "300px",
                            margin: "0 auto",
                          }}
                        />
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="d-flex justify-content-center mt-4">
                      <Button
                        variant="primary"
                        onClick={handleGenerateQRCode}
                        className="w-auto mb-3" // Use w-auto to make the button smaller
                        disabled={showBtn2}
                      >
                        Generate QR Code
                      </Button>
                    </div>
                    
                    <div className="d-flex justify-content-center">
                      <Button
                        disabled={showBtn}
                        variant="outline-secondary"
                        onClick={handleShowSetupKey}
                        className="w-auto" // Use w-auto to make the button smaller
                      >
                        {showSetupKey ? "Show QR Code" : "Show Setup Key"}
                      </Button>
                    </div>

                {/* Verify Token Section */}
                <div className="verify-token-section py-4 px-5">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="verificationToken">Enter Verification Token</label>
                        <input
                          type="text"
                          id="verificationToken"
                          className="form-control"
                          value={verificationToken}
                          onChange={handleVerificationTokenChange}
                          placeholder="Enter the token received"
                        />
                      </div>
                      {error && (
                        <p className="text-danger text-center mb-4">{error}</p>
                      )}
                      <div className="d-flex justify-content-center">
                        {loading?(<button
                          className="btn btn-primary"
                          type="button"
                          disabled
                        >
                          <FaSpinner className="spinner-border spinner-border-sm" />{" "}
                          Verifying...
                        </button>):
                        (<button
                          type="button"
                          className="btn btn-success w-auto"
                          onClick={onSubmit2fa}
                        >
                          Verify Token
                        </button>
                        )}
                      </div>
                    </form>
                  </div>
                    </Card>
                  </div>
                </div>
              </div>
              ):(<div className="container">
                <div className="row justify-content-center align-items-center authentication authentication-basic h-100">
                  <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
                    <div className="my-5 d-flex justify-content-center">
                      <Link scroll={false} href="#!">
                        <img src={logo} alt="logo" className="h-10 w-48" />
                      </Link>
                    </div>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="nextjs">
                      <Card className="custom-card my-4">
                        <Tab.Content>
                          <Tab.Pane eventKey="nextjs" className="border-0">
                            <Card.Body className="p-5 py-4">
                              <form onSubmit={handleSubmit(onSubmit)}>
                                <p className="h4 mb-2 fw-semibold">Sign In</p>
                                <div className="row gy-3">
                                  {err && <Alert variant="danger">{err}</Alert>}
                                  <Col xl={12}>
                                    <label
                                      htmlFor="signin-emailOrUsername"
                                      className="form-label text-default"
                                    >
                                      Email / Username
                                    </label>
                                    <input
                                      type="text"
                                      {...register("emailOrUsername", {
                                        required: {
                                          value: true,
                                          message: "Email or Username is required",
                                        },
                                        validate: (value) => {
                                          const emailPattern =
                                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                          const isValidEmail =
                                            emailPattern.test(value);
                                          const isValidUsername = value.length >= 3; // Assuming a valid username is at least 3 characters long
                                          if (!isValidEmail && !isValidUsername) {
                                            return "Invalid email address or username.";
                                          }
                                        },
                                      })}
                                      className="form-control"
                                    />
                                    {errors.emailOrUsername && (
                                      <p className="mt-2 text-danger">
                                        {errors.emailOrUsername?.message}
                                      </p>
                                    )}
                                  </Col>
                                  <Col xl={12} className="mb-2">
                                    <label
                                      htmlFor="signin-password"
                                      className="form-label text-default d-block"
                                    >
                                      Password
                                      <Link
                                        scroll={false}
                                        href="forget-password"
                                        className="float-end link-danger op-5 fw-medium fs-12"
                                      >
                                        Forgot password?
                                      </Link>
                                    </label>
                                    <div className="position-relative">
                                      <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", {
                                          required: {
                                            value: true,
                                            message: "Password is required",
                                          },
                                          // maxLength: {
                                          //   value: 10,
                                          //   message:
                                          //     "Password must not exceed 10 characters",
                                          // },
                                        })}
                                        className="form-control"
                                      />
                                      <span
                                        className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                      >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                      </span>
                                    </div>
                                    {errors.password && (
                                      <p className="mt-2 text-danger">
                                        {errors.password?.message}
                                      </p>
                                    )}
                                    <div className="mt-2">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          defaultValue=""
                                          id="defaultCheck1"
                                          onChange={() =>
                                            setRememberMe(!rememberMe)
                                          }
                                        />
                                        <label
                                          className="form-check-label text-muted fw-normal fs-12"
                                          htmlFor="defaultCheck1"
                                        >
                                          Remember me?
                                        </label>
                                      </div>
                                    </div>
                                  </Col>
                                </div>
    
                                <div className="d-grid mt-4">
                                  {loading ? (
                                    <button
                                      className="btn btn-primary"
                                      type="button"
                                      disabled
                                    >
                                      <FaSpinner className="spinner-border spinner-border-sm" />{" "}
                                      Loading...
                                    </button>
                                  ) : (
                                    <input
                                      className="btn btn-primary"
                                      type="submit"
                                      placeholder="Sign In"
                                      value={"Sign In"}
                                    />
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-muted mt-3 mb-0">
                                    Dont have an account?{" "}
                                    <Link
                                      scroll={false}
                                      href="/sign-up"
                                      className="text-primary"
                                    >
                                      Sign Up
                                    </Link>
                                  </p>
                                </div>
                              </form>
                            </Card.Body>
                          </Tab.Pane>
                        </Tab.Content>
                      </Card>
                    </Tab.Container>
                  </Col>
                </div>
              </div>)}
        </body>
      </html>
    </Fragment>
  );
}
