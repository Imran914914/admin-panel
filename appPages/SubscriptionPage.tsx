"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Nav, Row, Tab, Form, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "@/shared/Api/auth";
import moment from "moment";
import { FaSpinner } from "react-icons/fa";
import Success from "@/components/SuccessPop";
import { createSubscriptionHistory, createSubscription } from "@/shared/Api/dashboard";

const SubscriptionPage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [popUptext, setpopUptext] = useState({ title: "", desc: "" });
  const auth = useSelector((state: any) => state.auth);
  const subscriptions = useSelector((state: any) => state.dash.subscriptions);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [redeemCode, setRedeemCode] = useState('');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(
    auth?.user?.subscription?.type ?? "Basic"
  );

  useEffect(() => {
    const updatedSubscriptions = subscriptions.filter(
      (sub: any) => sub?.type != "redeem"
    );
    setPlans(updatedSubscriptions);
  }, [subscriptions]);

  const updateSubscription = async (
    type: any,
    duration: any,
    subscriptionId: any
  ) => {
    try {
      let expireDate;
      let currentDate = new Date();

      expireDate = new Date(currentDate);

      expireDate.setMonth(currentDate.getMonth() + duration);
      const payload = {
        userId: auth?.user?._id,
        subscriptionId,
        startDate: currentDate,
        expireDate,
        active: true,
        redeem: false,
      };
      setLoading(type);
      const result: any = await createSubscriptionHistory(payload, dispatch);
      if (result?.status == 201) {
        setOpen(true);
        setpopUptext({
          title: "🎉 Congratulations",
          desc: "Your subscription has been activated successfully. Enjoy exclusive features and benefits!",
        });
        setTimeout(() => {
          setOpen(false);
        }, 2000);
        setLoading(false);
      } else if (result?.status == 409) {
        setOpen(true);
        setpopUptext({
          title: "🛑 Data Conflict Alert",
          desc: result?.response?.data?.message ?? result.message,
        });
        setTimeout(() => {
          setOpen(false);
        }, 2000);
        setLoading(false);
      }
    } catch (error) {
      console.log("error while procedding", error);
    }
  };

  // console.log(auth?.user?._id)

  const handleSubmit = async () => {
    // // Validate fields before submission
    // if (!type || !duration || !amount || (type === "redeem" && !redeemCode)) {
    //   alert("Please fill in all required fields.");
    //   return;
    // }

    // const payload = {
    //   type,
    //   createdBy: auth?.user?._id,
    //   duration,
    //   amount,
    //   redeemCode: type === "redeem" ? redeemCode : undefined,
    // };

    // const response = await createSubscription(payload, dispatch);
    // console.log("Response:", response);

    // if (response.message === "Subscription created successfully.") {
    //   alert("Subscription created!");
    // } else {
    //   alert("Failed to create subscription.");
    // }
  };

  return (
    <Fragment>
      <Seo title={"Subscription"} />
      <Success
        isOpen={open}
        title={popUptext?.title}
        description={popUptext?.desc}
      />
      {/* Page Header */}
      <Pageheader
        Heading="Pricing"
        Pages={[
          { title: "Dashboard", active: true },
          { title: "Subscription", active: false },
        ]}
        v2={false}
      />
      {/* Page Header Close */}

      {/* Start:: row-1 */}
      <div className="row d-flex align-items-center justify-content-center mb-5">
        {plans && plans?.length
          ? plans.map((plan: any) => (
              <Col lg={8} xl={4} xxl={4} md={8} sm={12} className="">
                <div
                  className={`card custom-card pricing-card cursor-pointer ${
                    selectedPlan == plan?.type ? "hover" : ""
                  }`}
                  onClick={() => setSelectedPlan(plan?.type)}
                >
                  <div className="card-body p-5">
                    <div className="text-center">
                      {plan?.type == "pro" && (
                        <div className="ribbon-2 ribbon-primary ribbon-right">
                          Best Plan
                        </div>
                      )}
                      <h4 className="fw-medium mb-1">
                        {plan?.type?.toUpperCase()}
                      </h4>
                      <span className="mb-1 text-muted d-block">
                        Essential features for a magical start
                      </span>
                      <h2 className="mb-0 fw-bold d-block text-gradient">
                        ${plan?.amount}/
                        <span className="fs-12 text-default fw-medium ms-1">
                          {plan?.duration == 1
                            ? "Price Per Month"
                            : `Price for ${plan?.duration} Month`}
                        </span>
                      </h2>
                    </div>
                    <hr className="border-top my-4" />
                    <ul className="list-unstyled pricing-body">
                      <li>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-xs svg-success">
                            <i className="ti ti-check text-success fs-18"></i>
                          </span>
                          <span className="ms-2 my-auto flex-fill">
                            Unlimited Support
                          </span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-xs svg-success">
                            <i className="ti ti-check text-success fs-18"></i>
                          </span>
                          <span className="ms-2 my-auto">
                            Always Updated Links
                          </span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-xs svg-success">
                            <i className="ti ti-check text-success fs-18"></i>
                          </span>
                          <span className="ms-2 my-auto flex-fill">
                            Database lookup
                          </span>
                          <span className="badge bg-light text-default rounded-pill border">
                            <i className="ri-flashlight-fill text-warning me-1"></i>
                            coming soon
                          </span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-xs svg-success">
                            <i className="ti ti-check text-success fs-18"></i>
                          </span>
                          <span className="ms-2 my-auto">Subscriber rank</span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-xs svg-success">
                            <i className="ti ti-check text-success fs-18"></i>
                          </span>
                          <span className="ms-2 my-auto">Instant Support</span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-xs svg-success">
                            <i className="ti ti-check text-success fs-18"></i>
                          </span>
                          <span className="ms-2 my-auto flex-fill">
                            Url Shortner
                          </span>
                          <span className="text-muted fs-12 fw-medium">
                            Coming Soon
                          </span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-xs svg-success">
                            <i className="ti ti-check text-success fs-18"></i>
                          </span>
                          <span className="ms-2 my-auto flex-fill">
                            Mailer tool
                          </span>
                          <span className="text-muted fs-12 fw-medium">
                            Coming Soon
                          </span>
                        </div>
                      </li>
                    </ul>
                    <hr className="border-top my-4" />

                    <Button
                      variant=""
                      type="button"
                      className={`btn btn-lg ${
                        plan?.type == "pro"
                          ? "btn-primary-gradient"
                          : "btn-outline-primary"
                      } d-grid w-100 btn-wave`}
                      onClick={() =>
                        updateSubscription(plan.type, plan.duration, plan?._id)
                      }
                    >
                      {loading == plan.type ? (
                        <span className="ms-4 me-4">
                          {" "}
                          <FaSpinner className="spinner-border spinner-border-sm" />{" "}
                          Loading...
                        </span>
                      ) : (
                        <span className="ms-4 me-4">Start Today</span>
                      )}
                    </Button>
                  </div>
                </div>
              </Col>
            ))
          : null}
        {/* <Col lg={8} xl={4} xxl={4} md={8} sm={12} className="">
          <div
            className={`card custom-card pricing-card cursor-pointer ${
              selectedPlan == "Pro" ? "hover" : ""
            }`}
            onClick={() => setSelectedPlan("Pro")}
          >
            <div className="card-body p-5">
              <div className="ribbon-2 ribbon-primary ribbon-right">
                Best Plan
              </div>
              <div className="text-center">
                <h4 className="fw-medium mb-1">Pro</h4>
                <span className="mb-1 text-muted d-block">
                  Next-level tools for advanced users
                </span>
                <h2 className="mb-0 fw-bold d-block text-gradient">
                  $80/
                  <span className="fs-12 text-default fw-medium ms-1">
                    Price for 3 months
                  </span>
                </h2>
              </div>
              <hr className="border-top my-4" />
              <ul className="list-unstyled pricing-body">
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto flex-fill">
                      Unlimited Support
                    </span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto">Always Updated Links</span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto flex-fill">
                      Database lookup
                    </span>
                    <span className="badge bg-light text-default rounded-pill border">
                      <i className="ri-flashlight-fill text-warning me-1"></i>
                      coming soon
                    </span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto">Subscriber rank</span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto">Instant Support</span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto flex-fill">Url Shortner</span>
                    <span className="text-muted fs-12 fw-medium">
                      Coming Soon
                    </span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto flex-fill">Mailer tool</span>
                    <span className="text-muted fs-12 fw-medium">
                      Coming Soon
                    </span>
                  </div>
                </li>
              </ul>
              <hr className="border-top my-4" />
              <Button
                variant=""
                type="button"
                className="btn btn-lg btn-primary-gradient d-grid w-100 btn-wave"
                onClick={() => updateSubscription("pro", 3)}
              >
                {loading == "pro" ? (
                  <span className="ms-4 me-4">
                    {" "}
                    <FaSpinner className="spinner-border spinner-border-sm" />{" "}
                    Loading...
                  </span>
                ) : (
                  <span className="ms-4 me-4">Start Today</span>
                )}
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={8} xl={4} xxl={4} md={8} sm={12} className="">
          <div
            className={`card custom-card pricing-card cursor-pointer ${
              selectedPlan == "Premium" ? "hover" : ""
            }`}
            onClick={() => setSelectedPlan("Premium")}
          >
            <div className="card-body p-5">
              <div className="text-center">
                <h4 className="fw-medium mb-1">Premium</h4>
                <span className="mb-1 text-muted d-block">
                  Pinnacle excellence, VIP support.
                </span>
                <h2 className="mb-0 fw-bold d-block text-gradient">
                  $125/
                  <span className="fs-12 text-default fw-medium ms-1">
                    Price for 6 months
                  </span>
                </h2>
              </div>
              <hr className="border-top my-4" />
              <ul className="list-unstyled pricing-body">
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto flex-fill">
                      Unlimited Support
                    </span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto">Always Updated Links</span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto flex-fill">
                      Database lookup
                    </span>
                    <span className="badge bg-light text-default rounded-pill border">
                      <i className="ri-flashlight-fill text-warning me-1"></i>
                      coming soon
                    </span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto">Subscriber rank</span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto">Instant Support</span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto flex-fill">Url Shortner</span>
                    <span className="text-muted fs-12 fw-medium">
                      Coming Soon
                    </span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-xs svg-success">
                      <i className="ti ti-check text-success fs-18"></i>
                    </span>
                    <span className="ms-2 my-auto flex-fill">Mailer tool</span>
                    <span className="text-muted fs-12 fw-medium">
                      Coming Soon
                    </span>
                  </div>
                </li>
              </ul>
              <hr className="border-top my-4" />
              <Button
                variant=""
                type="button"
                className="btn btn-lg btn-outline-primary d-grid w-100 btn-wave"
                onClick={() => updateSubscription("premium", 6)}
              >
                {loading == "premium" ? (
                  <span className="ms-4 me-4">
                    {" "}
                    <FaSpinner className="spinner-border spinner-border-sm" />{" "}
                    Loading...
                  </span>
                ) : (
                  <span className="ms-4 me-4">Start Today</span>
                )}
              </Button>
            </div>
          </div>
        </Col> */}
      </div>
      <div className="d-flex justify-content-center align-items-center bg-light">
  <div className="card custom-card shadow-lg border-0" style={{ maxWidth: "1000px", width: "100%" }}>
    <div className="card-body p-4">
      <h4 className="fw-bold text-center mb-4">Create a New Subscription</h4>

      {/* Subscription Type */}
      {/* <div className="mb-3">
        <label htmlFor="type" className="form-label fw-semibold">
          Subscription Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="form-select"
          id="type"
        >
          <option value="">Select Type</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="premium">Premium</option>
        </select>
      </div> */}

      {/* Duration (in months) */}
      <div className="mb-3">
        <label htmlFor="duration" className="form-label fw-semibold">
          Duration (in months)
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="form-control"
          placeholder="Enter duration in months"
          id="duration"
          min="1"
        />
      </div>

      {/* Amount */}
      <div className="mb-3">
        <label htmlFor="amount" className="form-label fw-semibold">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-control"
          placeholder="Enter amount"
          id="amount"
          min="1"
        />
      </div>
        <div className="mb-3">
          <label htmlFor="redeemCode" className="form-label fw-semibold">
            Redeem Code
          </label>
          <input
            type="text"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            className="form-control"
            placeholder="Enter redeem code"
            id="redeemCode"
          />
        </div>
      <div className="text-center">
        <button
          type="button"
          className="btn btn-primary px-5 py-2"
          onClick={handleSubmit}
          disabled={loading} // Disable when loading
        >
          {loading ? (
            <>
              <i className="spinner-border spinner-border-sm me-2"></i>
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  </div>
</div>
      {/* End:: row-1 */}

      {/* Start:: row-3 */}
      {/* <Row>
        <Col xl={12}>
          <Tab.Container defaultActiveKey="first">
            <div className="text-center my-5">
              <div className="tab-style-1 border p-1 bg-white shadow-sm rounded-pill d-inline-block">
                <Nav className="nav nav-pills">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="first"
                      type="button"
                      className="nav-link rounded-pill  fw-medium"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-monthly"
                    >
                      Monthly
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="second"
                      type="button"
                      className="nav-link rounded-pill fw-medium"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-yearly"
                    >
                      Yearly
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </div>
            <Tab.Content>
              <Tab.Pane
                eventKey="first"
                className="show  p-0 border-0"
                id="pills-monthly"
              >
                <div className="card shadow-none overflow-hidden border-0">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-bordered pricing-table mb-0">
                        <thead>
                          <tr>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <span className="avatar avatar-lg rounded bg-white-transparent fs-24">
                                    <i className="bx bx-headphone"></i>
                                  </span>
                                </div>
                                <div className="flex-grow-1 text-start">
                                  <p className="h5 mb-0 text-fixed-white">
                                    Contact Us!
                                  </p>
                                  <a
                                    href="#!"
                                    className="text-fixed-white op-8"
                                  >
                                    Start{" "}
                                    <i className="fe fe-chevrons-right ms-1 fs-14"></i>
                                  </a>
                                </div>
                              </div>
                            </th>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <p className="badge badge-lg bg-white-transparent rounded fw-semibold mb-2">
                                Newest
                              </p>
                              <p className="h5 mb-0 text-fixed-white">Free</p>
                              <p className="h3 text-fixed-white mb-0">
                                $0
                                <span className="fs-13 op-5 ms-1">/ month</span>
                              </p>
                            </th>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <p className="badge badge-lg bg-white-transparent rounded fw-semibold mb-2">
                                Popular
                              </p>
                              <p className="h5 mb-0 text-fixed-white">
                                Starter
                              </p>
                              <p className="h3 text-fixed-white mb-0">
                                $9
                                <span className="fs-13 op-5 ms-1">/ month</span>
                              </p>
                            </th>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <p className="badge badge-lg bg-warning rounded fw-semibold mb-2">
                                Recommended
                              </p>
                              <p className="h5 mb-0 text-fixed-white">Pro</p>
                              <p className="h3 text-fixed-white mb-0">
                                $15
                                <span className="fs-13 op-5 ms-1">/ month</span>
                              </p>
                            </th>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <p className="badge badge-lg bg-white-transparent rounded fw-semibold mb-2">
                                Most Used
                              </p>
                              <p className="h5 mb-0 text-fixed-white">
                                Business
                              </p>
                              <p className="h3 text-fixed-white mb-0">
                                $29
                                <span className="fs-13 op-5 ms-1">/ month</span>
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border">
                            <td colSpan={5} className="pricing-feature fw-bold">
                              Site Features
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Drag and Drop Builder
                            </td>
                            <td>1</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              No of Pages
                            </td>
                            <td>1</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Customizable footer
                            </td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Responsive Design
                            </td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              SEO Optimization
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Social Media Management
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Custom Forms
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              E-commerce
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Content Management
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr className="border">
                            <td colSpan={5} className="pricing-feature fw-bold">
                              Functionality
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Search Functionality
                            </td>
                            <td>Upto 5</td>
                            <td>Upto 10</td>
                            <td>Upto 25</td>
                            <td>Unlimited</td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Custom Forms
                            </td>
                            <td>3%</td>
                            <td>3%</td>
                            <td>3%</td>
                            <td>0%</td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Blogging Platform
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Analytics Integration
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Membership System
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Video Integration
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>
                              <div>
                                <a
                                  href="#!"
                                  className="btn btn-lg btn-w-lg btn-primary-gradient btn-wave"
                                >
                                  Get Started
                                  <i className="ti ti-arrow-narrow-right ms-1"></i>
                                </a>
                              </div>
                            </td>
                            <td>
                              <div>
                                <a
                                  href="#!"
                                  className="btn btn-lg btn-w-lg btn-primary-gradient btn-wave"
                                >
                                  Get Started
                                  <i className="ti ti-arrow-narrow-right ms-1"></i>
                                </a>
                              </div>
                            </td>
                            <td>
                              <div>
                                <a
                                  href="#!"
                                  className="btn btn-lg btn-w-lg btn-primary-gradient btn-wave"
                                >
                                  Get Started
                                  <i className="ti ti-arrow-narrow-right ms-1"></i>
                                </a>
                              </div>
                            </td>
                            <td>
                              <div>
                                <a
                                  href="#!"
                                  className="btn btn-lg btn-w-lg btn-primary-gradient btn-wave"
                                >
                                  Get Started
                                  <i className="ti ti-arrow-narrow-right ms-1"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane
                eventKey="second"
                className="p-0 border-0"
                id="pills-yearly"
              >
                <div className="card shadow-none border-0 reveal">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-bordered pricing-table mb-0 table-hover">
                        <thead>
                          <tr>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <span className="avatar avatar-lg rounded bg-white-transparent fs-24">
                                    <i className="bx bx-headphone"></i>
                                  </span>
                                </div>
                                <div className="flex-grow-1 text-start">
                                  <p className="h5 mb-0 text-fixed-white">
                                    Contact Us!
                                  </p>
                                  <a
                                    href="#!"
                                    className="text-fixed-white op-8"
                                  >
                                    Start{" "}
                                    <i className="fe fe-chevrons-right ms-1 fs-14"></i>
                                  </a>
                                </div>
                              </div>
                            </th>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <p className="badge badge-lg bg-white-transparent rounded fw-semibold mb-2">
                                Newest
                              </p>
                              <p className="h5 mb-0 text-fixed-white">Free</p>
                              <p className="h3 text-fixed-white mb-0">
                                $19
                                <span className="fs-13 op-5 ms-1">/ year</span>
                              </p>
                            </th>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <p className="badge badge-lg bg-white-transparent rounded fw-semibold mb-2">
                                Popular
                              </p>
                              <p className="h5 mb-0 text-fixed-white">
                                Starter
                              </p>
                              <p className="h3 text-fixed-white mb-0">
                                $49
                                <span className="fs-13 op-5 ms-1">/ year</span>
                              </p>
                            </th>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white border-right border-white-1"
                            >
                              <p className="badge badge-lg bg-warning fs-white rounded fw-semibold mb-2">
                                Recommended
                              </p>
                              <p className="h5 mb-0 text-fixed-white">Pro</p>
                              <p className="h3 text-fixed-white mb-0">
                                $75
                                <span className="fs-13 op-5 ms-1">/ year</span>
                              </p>
                            </th>
                            <th
                              scope="row"
                              className="bg-primary text-fixed-white p-4"
                            >
                              <p className="badge badge-lg bg-white-transparent rounded fw-semibold mb-2">
                                Most Used
                              </p>
                              <p className="h5 mb-0 text-fixed-white">
                                Business
                              </p>
                              <p className="h3 text-fixed-white mb-0">
                                $99
                                <span className="fs-13 op-5 ms-1">/ year</span>
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border">
                            <td colSpan={5} className="pricing-feature fw-bold">
                              Site Features
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Drag and Drop Builder
                            </td>
                            <td>1</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              No of Pages
                            </td>
                            <td>1</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Customizable footer
                            </td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Responsive Design
                            </td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              SEO Optimization
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Social Media Management
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Custom Forms
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              E-commerce
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Content Management
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr className="border">
                            <td colSpan={5} className="pricing-feature fw-bold">
                              Functionality
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Search Functionality
                            </td>
                            <td>Upto 5</td>
                            <td>Upto 10</td>
                            <td>Upto 25</td>
                            <td>Unlimited</td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Custom Forms
                            </td>
                            <td>3%</td>
                            <td>3%</td>
                            <td>3%</td>
                            <td>0%</td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Blogging Platform
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Analytics Integration
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Membership System
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td className="pricing-feature fw-semibold">
                              Video Integration
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                              <i className="fe fe-check-circle text-success"></i>
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>
                              <div className="d-grid">
                                <a
                                  href="#!"
                                  className="btn btn-lg btn-w-lg btn-primary-gradient btn-wave"
                                >
                                  Get Started
                                  <i className="ti ti-arrow-narrow-right ms-1"></i>
                                </a>
                              </div>
                            </td>
                            <td>
                              <div className="d-grid">
                                <a
                                  href="#!"
                                  className="btn btn-lg btn-w-lg btn-primary-gradient btn-wave"
                                >
                                  Get Started
                                  <i className="ti ti-arrow-narrow-right ms-1"></i>
                                </a>
                              </div>
                            </td>
                            <td>
                              <div className="d-grid">
                                <a
                                  href="#!"
                                  className="btn btn-lg btn-w-lg btn-primary-gradient btn-wave"
                                >
                                  Get Started
                                  <i className="ti ti-arrow-narrow-right ms-1"></i>
                                </a>
                              </div>
                            </td>
                            <td>
                              <div className="d-grid">
                                <a
                                  href="#!"
                                  className="btn btn-lg btn-w-lg btn-primary-gradient btn-wave"
                                >
                                  Get Started
                                  <i className="ti ti-arrow-narrow-right ms-1"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row> */}
      {/* End:: row-3 */}
    </Fragment>
  );
};

export default SubscriptionPage;
