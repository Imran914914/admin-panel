"use client";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useCallback, useRef } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { FaSpinner } from "react-icons/fa";

type CodeScreenTypes = {
  onBtnClick: () => void;
  otp: any;
  setOtp: any;
  loading: boolean;
  error: string;
};

const CodeScreen: React.FC<CodeScreenTypes> = ({
  onBtnClick,
  otp,
  setOtp,
  loading,
  error,
}) => {
  const inputRefs: any = {
    one: useRef(null),
    two: useRef(null),
    three: useRef(null),
    four: useRef(null),
  };

  const handleInputChange = useCallback(
    (currentId: any, nextId: any) => {
      const currentInput = inputRefs[currentId].current;

      if (currentInput && currentInput.value.length === 1) {
        const nextInput = inputRefs[nextId] ? inputRefs[nextId].current : null;

        if (nextInput) {
          nextInput.focus();
        }

        // Update the code in the state
        const newCode = [
          inputRefs.one.current.value,
          inputRefs.two.current.value,
          inputRefs.three.current.value,
          inputRefs.four.current.value,
        ].join("");

        setOtp(newCode);
      }
    },
    [inputRefs]
  );
  return (
    <Fragment>
      <Seo title={"TwostepBasic"} />
      <div className="authentication-background">
        <div className="container-lg">
          <div className="row justify-content-center align-items-center authentication two-step-verification authentication-basic h-100">
            <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
              <div className="my-5 d-flex justify-content-center">
                <Link scroll={false} href="/dashboards/home/">
                  <img
                    src="../../../assets/images/brand-logos/logo.png"
                    alt="logo"
                    className="desktop-dark"
                  />
                </Link>
              </div>
              <Card className="custom-card my-4">
                <Card.Body className="p-5">
                  <p className="h4 mb-2 fw-semibold">Verify Your Account</p>
                  <p className="mb-4 text-muted fw-normal">
                    Enter the 4 digit code sent to the registered email Id.
                  </p>
                  <Row className="gy-3">
                    <Col xl={12} className="mb-2">
                      <Row>
                        <div className="col-3">
                          <Form.Control
                            type="text"
                            className="form-control text-center"
                            id="one"
                            maxLength={1}
                            onChange={() => handleInputChange("one", "two")}
                            ref={inputRefs.one}
                          />
                        </div>
                        <div className="col-3">
                          <Form.Control
                            type="text"
                            className="form-control text-center"
                            id="two"
                            maxLength={1}
                            onChange={() => handleInputChange("two", "three")}
                            ref={inputRefs.two}
                          />
                        </div>
                        <div className="col-3">
                          <Form.Control
                            type="text"
                            className="form-control text-center"
                            id="three"
                            maxLength={1}
                            onChange={() => handleInputChange("three", "four")}
                            ref={inputRefs.three}
                          />
                        </div>
                        <div className="col-3">
                          <Form.Control
                            type="text"
                            className="form-control text-center"
                            onChange={() =>
                              handleInputChange("four", "nextInputId")
                            }
                            ref={inputRefs.four}
                            id="four"
                            maxLength={1}
                          />
                        </div>
                      </Row>
                      <div className="form-check mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="defaultCheck1"
                        />
                        <label
                          className="form-check-label text-muted fw-normal fs-12"
                          htmlFor="defaultCheck1"
                        >
                          Did not recieve a code ?
                          <Link
                            scroll={false}
                            href="/pages/email/mailapp/"
                            className="text-primary ms-2 d-inline-block fw-medium"
                          >
                            Resend
                          </Link>
                        </label>
                      </div>
                    </Col>
                    <Col xl={12} className="d-grid mt-3">
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
                          Verify
                        </div>
                      )}
                    </Col>

                    {error && (
                      <p className="text-red-400 font-semibold text-center">
                        {error}
                      </p>
                    )}
                  </Row>
                  <div className="text-center">
                    <p className="fs-12 text-danger mt-3 mb-0">
                      <sup>
                        <i className="ri-asterisk"></i>
                      </sup>
                      Don't share the verification code with anyone !
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

export default CodeScreen;
