"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert, Card, Col } from "react-bootstrap";
import { FaSpinner } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { editProfile } from "@/shared/Api/auth";

export default function Verify2FA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.auth.user);
  const RouteChange = () => {
    let path = "/dashboards/home";
    router.push(path);
  };
  const logo =
    "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Flogo.png?alt=media&token=c6c65b3d-1b55-49f4-9dcb-da1bcb6907b1";

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    console.log(data)
    try {
      const response = await fetch("http://localhost:8080/google-auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret:user?.twoFactorSecret, token: data.token }),
      });

      if (response.ok) {
        const anotherResponse = await editProfile({
          ...user,
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
      setLoading(false);
    }
  };


  return (
    <Fragment>
      <html data-theme-mode="dark">
        <body className="authentication-background">
          <div className="container">
            <div className="row justify-content-center align-items-center authentication authentication-basic h-100">
              <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
                <div className="my-5 d-flex justify-content-center">
                  <Link scroll={false} href="#!">
                    <img src={logo} alt="logo" className="h-10 w-48" />
                  </Link>
                </div>
                <Card className="custom-card my-4">
                  <Card.Body className="p-5 py-4">
                    <h4 className="mb-3 text-center">Verify 2FA</h4>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row gy-3">
                        <Col xl={12}>
                          <label
                            htmlFor="token"
                            className="form-label text-default"
                          >
                            Verification Token
                          </label>
                          <input
                            type="text"
                            id="token"
                            {...register("token", {
                              required: "Token is required",
                            })}
                            className="form-control"
                          />
                          {errors.token && (
                            <p className="mt-2 text-danger">
                              {errors.token.message}
                            </p>
                          )}
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
                            Verifying...
                          </button>
                        ) : (
                          <button className="btn btn-primary" type="submit">
                            Verify
                          </button>
                        )}
                      </div>
                      <p>Open your two-factor authenticator (TOTP) app or browser extension to view your authentication code.</p>
                      <div className="text-center mt-3">
                        <Link href="/" className="text-primary">
                          Back to Login
                        </Link>
                      </div>
                    </form>
                  </Card.Body>
                </Card>
              </Col>
            </div>
          </div>
        </body>
      </html>
    </Fragment>
  );
}
