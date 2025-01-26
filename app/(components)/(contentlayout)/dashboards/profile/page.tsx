"use client";
import { ProfileGallery, projectsdata } from "@/shared/data/profileData";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Camera } from "lucide-react";
import { useDispatch } from "react-redux";
import Success from "@/components/SuccessPop";

import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  ListGroup,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import { createReview } from "@/shared/Api/dashboard";
import { editProfile } from "@/shared/Api/auth";

const Profile = () => {
  const createOption = (label: any) => ({
    label,
    value: label,
  });
  const dispatch = useDispatch();
  const [val, setVal] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const userData = useSelector((state: any) => state?.auth);
  console.log("userData: ",userData);
  const user = userData.user;
  console.log("user: ",user);
  const profileImage =
    user?.profileImage ??
    "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b";

  const coverImage =
    user?.coverImage ??
    "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Fcoveravatar.webp?alt=media&token=4e68f36e-5f29-453c-a333-f4c68452f9d3";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };
  const pages = [ "OTP", "Bank Pin", "Auth Code" ]
  const handleSubmitReview = async () => {
    const reviewData = {
      userId: user?._id,
      content: val,
    };

    if (!val) {
      alert("Review content is required!");
      return;
    } else {
      await createReview(reviewData, dispatch);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      setVal("");
    }
  };
  console.log("Selected in here:  ",selected);
  const toggleSelect = async (page: any) => {
    const updatedSelected = selected.includes(page)
      ? selected.filter((item: any) => item !== page)
      : [...selected, page];
    setSelected(updatedSelected);
    const updatedUser = { 
      ...user,
      profileImage, 
      coverImage,
      skipPages: updatedSelected 
    };
  
    // Call editProfile without password
    await editProfile(updatedUser, dispatch);
  };

  return (
    <Fragment>
      <Seo title={"Profile"} />
      <Pageheader
        Heading="Profile"
        Pages={[
          { title: "Pages", active: true },
          { title: "Profile", active: false },
        ]}
      />
      <Success isOpen={open} description={"Review submitted successfully!"} />
      <Tab.Container defaultActiveKey="first">
        <Row>
          <Col xl={12}>
            <Card className="custom-card profile-card">
              <span className="group flex justify-end items-end">
                <img
                  src={coverImage}
                  className="card-img-top max-h-[200px] object-cover "
                  alt="..."
                />
                {/* <button className="absolute group flex justify-center mx-4 mb-4">
                  <Camera className="absolute hidden text-blue-400 group-hover:block" />
                </button> */}
              </span>
              <Card.Body className="p-4 pb-0 position-relative">
                <span className="avatar avatar-xxl avatar-rounded bg-info online group">
                  <img src={profileImage} alt="" />
                </span>
                <div className="mt-4 mb-3 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                  <div>
                    <h5 className="fw-semibold mb-1">{user?.userName}</h5>
                    <p className="fs-12 mb-0 fw-medium text-muted">
                      {" "}
                      <span className="me-3">
                        <i className="ri-building-line me-1 align-middle"></i>
                        {user?.location?.country}
                      </span>{" "}
                      <span>
                        <i className="ri-map-pin-line me-1 align-middle"></i>
                        {user?.location?.city}
                      </span>{" "}
                    </p>
                  </div>
                </div>
                <Nav
                  className="nav nav-tabs mb-0 tab-style-8 scaleX"
                  id="myTab"
                  role="tablist"
                >
                  <Nav.Item role="presentation">
                    <Nav.Link
                      eventKey="first"
                      className=""
                      id="profile-about-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-about-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="profile-about-tab-pane"
                      aria-selected="true"
                    >
                      About
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item role="presentation">
                    <Nav.Link
                      eventKey="second"
                      className=""
                      id="edit-profile-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#edit-profile-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="edit-profile-tab-pane"
                      aria-selected="true"
                    >
                      Add Review
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item role="presentation">
                    <Dropdown>
                      <Dropdown.Toggle className="nav-link" variant="" id="dropdown-basic">
                        Toggle Pages
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {pages.map((page, index) => (
                          <Dropdown.Item
                            key={index}
                            as="div"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <label className="d-flex align-items-center">
                              <input
                                className="mr-2"
                                type="checkbox"
                                checked={selected.includes(page)}
                                onChange={() => {
                                  toggleSelect(page)
                                }}
                              />
                              {page}
                            </label>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={9}>
            <Tab.Content className="" id="profile-tabs">
              <Tab.Pane
                eventKey="first"
                className="show p-0 border-0"
                id="profile-about-tab-pane"
                role="tabpanel"
                aria-labelledby="profile-about-tab"
                tabIndex={0}
              >
                <Card className="custom-card overflow-hidden">
                  <Card.Body className="p-0">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item p-4">
                        <span className="fw-medium fs-15 d-block mb-3">
                          <span className="me-1">&#10024;</span>ABOUT ME :
                        </span>
                        <p className="text-muted mb-2">{user?.bio}</p>
                      </li>
                      {/* <li className="list-group-item p-4">
                        <span className="fw-medium fs-15 d-block mb-3">
                          SKILLS :
                        </span>
                        <div className="w-75">
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Project Management
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Data Analysis
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Marketing Strategy
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Graphic Design
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Content Creation
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Market Research
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Client Relations
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Event Planning
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Budgeting and Finance
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Negotiation Skills
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Team Collaboration
                            </span>
                          </Link>
                          <Link scroll={false} href="#!">
                            <span className="badge bg-light text-muted m-1 border">
                              Adaptability
                            </span>
                          </Link>
                        </div>
                      </li> */}
                      <li className="list-group-item p-4">
                        <span className="fw-medium fs-15 d-block mb-3">
                          CONTACT INFORMATION :
                        </span>
                        <div className="text-muted">
                          <p className="mb-2">
                            <span className="avatar avatar-sm avatar-rounded text-primary">
                              <i className="ri-mail-line align-middle fs-15"></i>
                            </span>
                            <span className="fw-medium text-default">
                              Email :{" "}
                            </span>{" "}
                            {user?.email}
                          </p>
                          {/* <p className="mb-2">
                            <span className="avatar avatar-sm avatar-rounded text-secondary">
                              <i className="ri-phone-line align-middle fs-15"></i>
                            </span>
                            <span className="fw-medium text-default">
                              Phone :{" "}
                            </span>{" "}
                            +1 (555) 123-4567
                          </p>
                          <p className="mb-2">
                            <span className="avatar avatar-sm avatar-rounded text-success">
                              <i className="ri-map-pin-line align-middle fs-15"></i>
                            </span>
                            <span className="fw-medium text-default">
                              Website :{" "}
                            </span>{" "}
                            www.yourwebsite.com
                          </p> */}
                          <p className="mb-0">
                            <span className="avatar avatar-sm avatar-rounded text-orange">
                              <i className="ri-building-line align-middle fs-15"></i>
                            </span>
                            <span className="fw-medium text-default">
                              Location :{" "}
                            </span>{" "}
                            {user?.location?.city}, {user?.location?.country}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane
                eventKey="second"
                className="p-0 border-0"
                id="edit-profile-tab-pane"
                role="tabpanel"
                aria-labelledby="edit-profile-tab"
                tabIndex={0}
              >
                <Card className="custom-card overflow-hidden">
                  <Card.Body className="p-0">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item p-8">
                        <div className="row gy-4 align-items-center">
                          <Col xl={9}>
                            <Form.Control
                              as="textarea"
                              className="form-control"
                              id="text-area"
                              rows={4}
                              value={val} // Use val for the URL input
                              onChange={handleChange}
                            ></Form.Control>
                            <Button
                              className="mt-3"
                              onClick={handleSubmitReview}
                            >
                              Submit Review
                            </Button>
                          </Col>
                        </div>
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
          <Col xl={3}>
            <Card className="custom-card overflow-hidden">
              <Card.Header>
                <Card.Title>PERSONAL INFO</Card.Title>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup className="list-group list-group-flush">
                  <ListGroup.Item>
                    <div>
                      <span className="fw-medium me-2">Name :</span>
                      <span className="text-muted">{user?.userName}</span>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>
                      <span className="fw-medium me-2">Email :</span>
                      <span className="text-muted text-[11px]">
                        {user?.email}
                      </span>
                    </div>
                  </ListGroup.Item>
                  {/* <ListGroup.Item>
                    <div>
                      <span className="fw-medium me-2">Phone :</span>
                      <span className="text-muted">+1 (555) 123-4567</span>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>
                      <span className="fw-medium me-2">Designation :</span>
                      <span className="text-muted">C.E.O</span>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>
                      <span className="fw-medium me-2">Age :</span>
                      <span className="text-muted">30</span>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>
                      <span className="fw-medium me-2">Experience :</span>
                      <span className="text-muted">12 Years</span>
                    </div>
                  </ListGroup.Item> */}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Fragment>
  );
};

export default Profile;
