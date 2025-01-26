"use client";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { FaSpinner } from "react-icons/fa";

type ConfirmPasswordtypes = {
  onBtnClick: () => void;
  setConfirmPassword: any;
  setPassword: any;
  password: any;
  confirmPassword: any;
  error: string;
  loading: boolean;
};

const ConfirmPassword: React.FC<ConfirmPasswordtypes> = ({
  onBtnClick,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  error,
}) => {
  const [passwordshow1, setpasswordshow1] = useState(false);
  const [passwordshow2, setpasswordshow2] = useState(false);
  return (
    <Fragment>
      <Seo title={"CreateBasic"} />
      <div className="authentication-background">
        <div className="container-lg">
          <div className="authentication-background row justify-content-center authentication authentication-basic align-items-center h-100">
            <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
              <div className="my-5 d-flex justify-content-center">
                <Link scroll={false} href="/dashboards/home">
                  <img
                    src="../../../assets/images/brand-logos/desktop-dark.png"
                    alt="logo"
                    className="desktop-dark"
                  />
                </Link>
              </div>
              <Card className="custom-card my-4">
                <Card.Body className="p-5">
                  <p className="h4 fw-semibold mb-2">Reset Password</p>
                  <p className="mb-4 text-muted fw-normal">Hello Jack !</p>
                  <div className="row gy-3">
                    <Col xl={12}>
                      <label
                        htmlFor="create-password"
                        className="form-label text-default"
                      >
                        Password
                      </label>
                      <div className="position-relative">
                        <Form.Control
                          type={passwordshow1 ? "text" : "password"}
                          className="form-control"
                          id="create-password"
                          placeholder="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Link
                          scroll={false}
                          href="#!"
                          onClick={() => setpasswordshow1(!passwordshow1)}
                          className="show-password-button text-muted"
                        >
                          <i
                            className={`${
                              passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"
                            } align-middle`}
                          ></i>
                        </Link>
                      </div>
                    </Col>
                    <Col xl={12}>
                      <label
                        htmlFor="create-confirmpassword"
                        className="form-label text-default"
                      >
                        Confirm Password
                      </label>
                      <div className="position-relative">
                        <Form.Control
                          type={passwordshow2 ? "text" : "password"}
                          className="form-control"
                          id="create-confirmpassword"
                          placeholder="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Link
                          scroll={false}
                          href="#!"
                          onClick={() => setpasswordshow2(!passwordshow2)}
                          className="show-password-button text-muted"
                        >
                          <i
                            className={`${
                              passwordshow2 ? "ri-eye-line" : "ri-eye-off-line"
                            } align-middle`}
                          ></i>
                        </Link>
                      </div>
                      <div className="mt-2">
                        <div className="form-check mb-0">
                          <Form.Check
                            className=""
                            type="checkbox"
                            defaultValue=""
                            id="defaultCheck1"
                          />
                          <label
                            className="form-check-label text-muted fw-normal fs-12"
                            htmlFor="defaultCheck1"
                          >
                            Remember password ?
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
                      <div
                        className="btn btn-primary"
                        onClick={() => onBtnClick()}
                      >
                        Save Password
                      </div>
                    )}
                  </div>

                  {error && (
                    <p className="text-red-400 font-semibold text-center">
                      {error}
                    </p>
                  )}
                  <div className="text-center">
                    <p className="text-muted mt-3 mb-0">
                      Back to home ?{" "}
                      <Link scroll={false} href="/" className="text-primary">
                        Click Here
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmPassword;
