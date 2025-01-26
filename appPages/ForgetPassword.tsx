"use client";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import CodeScreen from "@/components/CodeScreen";
import ConfirmPassword from "@/components/ConfirmPassword";
import { ForgotPassword, ResetPassword, VerifyOtp } from "@/shared/Api/auth";
import { useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa";

enum Step {
  EmailSent = "Email sent",
  CodeSent = "code sent",
  Success = "success",
}

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState<Step>(Step.EmailSent);
  const [btnText, setBtnText] = useState<string>("Send Email");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<any>("");
  const [otp, setOtp] = useState<any>("");
  const [emailloading, setEmailLoading] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [successLoading, setSuccessLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();

  const onBtnClick = async () => {
    try {
      switch (step) {
        case Step.EmailSent:
          setEmailLoading(true);
          const response = await ForgotPassword(email, dispatch);

          if (response.status === 200) {
            setEmailLoading(false);
            setBtnText("Verify");
            setStep(Step.CodeSent);
          } else {
            setEmailLoading(false)
            console.error("Failed to send email. Status:", response.status);
          }
          break;

        case Step.CodeSent:
          setVerifyLoading(true);
          const verifyotpResponse = await VerifyOtp({ email, otp }, dispatch);
          if (verifyotpResponse.status == 200) {
            setVerifyLoading(false);
            setBtnText("Save Password");
            setStep(Step.Success);
          }
          break;

        case Step.Success:
          if (password == confirmPassword) {
            setSuccessLoading(true);
            const resetResponse = await ResetPassword(
              { email, password },
              dispatch
            );
            if (resetResponse.status == 200) {
              setSuccessLoading(false)

              router.push("/"); // Navigate to the sign-in screen
            }
          } else {
            setError("password and Confirm Password should match");
          }

          break;

        default:
          console.error("Unexpected step:", step);
          break;
      }
    } catch (error) {
      setEmailLoading(false);
      setVerifyLoading(false);
      console.error("An error occurred:", error);
      setError(error);
      // You can display an error message to the user or handle it in other ways
    }
  };

  return (
    <Fragment>
      {btnText == "Send Email" ? (
        <Fragment>
          <Seo title={"Forget-password"} />
          <div className="authentication-background">
            <div className="container-lg">
              <div className="row justify-content-center authentication authentication-basic align-items-center h-100">
                <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
                  <div className="my-5 d-flex justify-content-center">
                    <Link scroll={false} href="/dashboards/home/">
                      <img
                        src="../../../assets/images/brand-logos/logo.png"
                        alt="logo"
                        className="h-10 w-48"
                      />
                    </Link>
                  </div>
                  <Card className="custom-card">
                    <Card.Body className="p-5">
                      <p className="h4 mb-2 fw-semibold">Forgot Password</p>
                      <p className="mb-3 text-muted fw-normal">
                        Please Enter your Email to receive Code
                      </p>
                      <Row className="gy-3">
                        <Col xl={12} className="mb-2">
                          <label className="form-label text-default mb-2">
                            Email
                          </label>
                          <div className="position-relative mb-2">
                            <Form.Control
                              type={"email"}
                              className="form-control"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          {error && <p className="text-red-400 font-semibold text-center">{error}</p>}
                        </Col>
                        <Col xl={12} className="d-grid mt-2">
                          {emailloading ? (
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
                              Send Email
                            </div>
                          )}
                        </Col>
                      </Row>
                      <div className="mt-2 text-center">
                        <div className="form-check">
                          <label
                            className="form-check-label text-muted fw-normal fs-12"
                            htmlFor="defaultCheck1"
                          >
                            Back to Home ?{" "}
                            <Link className="text-primary" href={"/"}>
                              Click here
                            </Link>
                          </label>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </div>
            </div>
          </div>
        </Fragment>
      ) : btnText == "Verify" ? (
        <CodeScreen
          onBtnClick={onBtnClick}
          setOtp={setOtp}
          otp={otp}
          loading={verifyLoading}
          error={error}
        />
      ) : (
        <ConfirmPassword
          setConfirmPassword={setConfirmPassword}
          setPassword={setPassword}
          password={password}
          confirmPassword={confirmPassword}
          onBtnClick={onBtnClick}
          error={error}
          loading={successLoading}
        />
      )}
    </Fragment>
  );
};

export default ForgetPassword;
