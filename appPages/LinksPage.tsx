"use client"
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment } from "react";
import dynamic from "next/dynamic";

import { Button, Col, Dropdown, Pagination, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
function LinksPage() {
  return (
    <Fragment>
      <Seo title={"Links"} />
      <Row className="mt-2">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>Logs</Card.Title>
              <div className="d-flex flex-wrap gap-2">
                <div>
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Search Here"
                    aria-label=".form-control-sm example"
                  />
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant=""
                    href="#!"
                    className="btn btn-primary btn-sm btn-wave waves-effect waves-light no-caret"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {" "}
                    Sort By
                    <i className="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu role="menu">
                    <li>
                      <Dropdown.Item href="#!">New</Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item href="#!">Popular</Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item href="#!">Relevant</Dropdown.Item>
                    </li>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table text-nowrap">
                  <thead>
                    <tr>
                      <th scope="row" className="ps-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabeljob1"
                          value=""
                          aria-label="..."
                        />
                      </th>
                      <th scope="col">Product</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Date Ordered</th>
                      <th scope="col" className="text-center">
                        Total Sales
                      </th>
                      <th scope="col">Price</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ps-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabeljob2"
                          value=""
                          aria-label="..."
                        />
                      </td>
                      <td>
                        <div className="d-flex">
                          <span className="avatar avatar-md">
                            <img
                              src="../../assets/images/ecommerce/jpg/1.jpg"
                              className=""
                              alt="..."
                            />
                          </span>
                          <div className="ms-2">
                            <p className="fw-semibold fs-13 mb-0 d-flex align-items-center">
                              <Link scroll={false} href="#!">
                                Flower Pot
                              </Link>
                            </p>
                            <p className="fs-12 text-muted mb-0">
                              Accusam Brand
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>Furniture</td>
                      <td>
                        <span className="badge bg-primary-transparent">
                          Pending
                        </span>
                      </td>
                      <td>
                        <span className="d-block fw-semibold fs-13">
                          Mayor Kelly
                        </span>
                        <span className="d-block text-muted fs-12 fw-normal">
                          mayorkelly213@gmail.com
                        </span>
                      </td>
                      <td>6</td>
                      <td>03 Sep 2024</td>
                      <td className="text-center">10</td>
                      <td className="fw-semibold">$15,000</td>
                      <td>
                        <div className="btn-list">
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-primary-light btn-wave"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-secondary-light btn-wave"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabeljob3"
                          value=""
                          aria-label="..."
                          defaultChecked
                        />
                      </td>
                      <td>
                        <div className="d-flex">
                          <span className="avatar avatar-md">
                            <img
                              src="../../assets/images/ecommerce/jpg/2.jpg"
                              className=""
                              alt="..."
                            />
                          </span>
                          <div className="ms-2">
                            <p className="fw-semibold fs-13 mb-0 d-flex align-items-center">
                              <Link scroll={false} href="#!">
                                Head Phones
                              </Link>
                            </p>
                            <p className="fs-12 text-muted mb-0">
                              Vellintn Brand
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>Electronics</td>
                      <td>
                        <span className="badge bg-success-transparent">
                          Processing
                        </span>
                      </td>
                      <td>
                        <span className="d-block fw-semibold fs-13">
                          Andrew Garfield
                        </span>
                        <span className="d-block text-muted fs-12 fw-normal">
                          andrewgarfield1994@gmail.com
                        </span>
                      </td>
                      <td>1</td>
                      <td>05 Oct 2024</td>
                      <td className="text-center">20</td>
                      <td className="fw-semibold">$25,000</td>
                      <td>
                        <div className="btn-list">
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-primary-light btn-wave"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-secondary-light btn-wave"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabeljob4"
                          value=""
                          aria-label="..."
                          defaultChecked
                        />
                      </td>
                      <td>
                        <div className="d-flex">
                          <span className="avatar avatar-md">
                            <img
                              src="../../assets/images/ecommerce/jpg/4.jpg"
                              className=""
                              alt="..."
                            />
                          </span>
                          <div className="ms-2">
                            <p className="fw-semibold mb-0 fs-13 d-flex align-items-center">
                              <Link scroll={false} href="#!">
                                Kiwi Fruit
                              </Link>
                            </p>
                            <p className="fs-12 text-muted mb-0">Top Brand</p>
                          </div>
                        </div>
                      </td>
                      <td>Food</td>
                      <td>
                        <span className="badge bg-secondary-transparent">
                          Shipped
                        </span>
                      </td>
                      <td>
                        <span className="d-block fw-semibold fs-13">
                          Simon Cowel
                        </span>
                        <span className="d-block text-muted fs-12 fw-normal">
                          simoncowel26@gmail.com
                        </span>
                      </td>
                      <td>2</td>
                      <td>13 Nov 2024</td>
                      <td className="text-center">27</td>
                      <td className="fw-semibold">$43,000</td>
                      <td>
                        <div className="btn-list">
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-primary-light btn-wave"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-secondary-light btn-wave"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabeljob5"
                          value=""
                          aria-label="..."
                        />
                      </td>
                      <td>
                        <div className="d-flex">
                          <span className="avatar avatar-md">
                            <img
                              src="../../assets/images/ecommerce/jpg/5.jpg"
                              className=""
                              alt="..."
                            />
                          </span>
                          <div className="ms-2">
                            <p className="fw-semibold mb-0 fs-13 d-flex align-items-center">
                              <Link scroll={false} href="#!">
                                Donut
                              </Link>
                            </p>
                            <p className="fs-12 text-muted mb-0">Erat Brand</p>
                          </div>
                        </div>
                      </td>
                      <td>Food</td>
                      <td>
                        <span className="badge bg-warning-transparent">
                          On Hold
                        </span>
                      </td>
                      <td>
                        <span className="d-block fw-semibold fs-13">
                          Mirinda Hers
                        </span>
                        <span className="d-block text-muted fs-12 fw-normal">
                          mirindahers@hotmail.com
                        </span>
                      </td>
                      <td>2</td>
                      <td>15 Dec 2024</td>
                      <td className="text-center">34</td>
                      <td className="fw-semibold">$10,000</td>
                      <td>
                        <div className="btn-list">
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-primary-light btn-wave"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-secondary-light btn-wave"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabeljob6"
                          value=""
                          aria-label="..."
                          defaultChecked
                        />
                      </td>
                      <td>
                        <div className="d-flex">
                          <span className="avatar avatar-md">
                            <img
                              src="../../assets/images/ecommerce/jpg/2.jpg"
                              className=""
                              alt="..."
                            />
                          </span>
                          <div className="ms-2">
                            <p className="fw-semibold mb-0 fs-13 d-flex align-items-center">
                              <Link scroll={false} href="#!">
                                Head Phones
                              </Link>
                            </p>
                            <p className="fs-12 text-muted mb-0">Boalt Audio</p>
                          </div>
                        </div>
                      </td>
                      <td>Electronics</td>
                      <td>
                        <span className="badge bg-info-transparent">
                          Delivered
                        </span>
                      </td>
                      <td>
                        <span className="d-block fw-semibold fs-13">
                          Alicia Keys
                        </span>
                        <span className="d-block text-muted fs-12 fw-normal">
                          aliciakeys@gmail.com
                        </span>
                      </td>
                      <td>1</td>
                      <td>28 Dec 2024</td>
                      <td className="text-center">77</td>
                      <td className="fw-semibold">$4,000</td>
                      <td>
                        <div className="btn-list">
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-primary-light btn-wave"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-secondary-light btn-wave"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-4 border-bottom-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabeljob7"
                          value=""
                          aria-label="..."
                        />
                      </td>
                      <td className="border-bottom-0">
                        <div className="d-flex">
                          <span className="avatar avatar-md">
                            <img
                              src="../../assets/images/ecommerce/jpg/3.jpg"
                              className=""
                              alt="..."
                            />
                          </span>
                          <div className="ms-2">
                            <p className="fw-semibold mb-0 fs-13 d-flex align-items-center">
                              <Link scroll={false} href="#!">
                                Camera
                              </Link>
                            </p>
                            <p className="fs-12 text-muted mb-0">Analog.Comp</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-bottom-0">Electronics</td>
                      <td className="border-bottom-0">
                        <span className="badge bg-danger-transparent">
                          Cancelled
                        </span>
                      </td>
                      <td className="border-bottom-0">
                        <span className="d-block fw-semibold fs-13">
                          Jeremy Lewis
                        </span>
                        <span className="d-block text-muted fs-12 fw-normal">
                          jeremylewis2000@gmail.com
                        </span>
                      </td>
                      <td className="border-bottom-0">3</td>
                      <td className="border-bottom-0">15 Dec 2024</td>
                      <td className="border-bottom-0 text-center">19</td>
                      <td className="fw-semibold border-bottom-0">$16,000</td>
                      <td className="border-bottom-0">
                        <div className="btn-list">
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-primary-light btn-wave"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant=""
                            className="btn btn-sm btn-icon btn-secondary-light btn-wave"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex align-items-center">
                <div>
                  {" "}
                  Showing 6 Entries{" "}
                  <i className="bi bi-arrow-right ms-2 fw-semibold"></i>{" "}
                </div>
                <div className="ms-auto">
                  <nav
                    aria-label="Page navigation"
                    className="pagination-style-4"
                  >
                    <Pagination className="pagination mb-0">
                      <Pagination.Item disabled> Prev </Pagination.Item>
                      <Pagination.Item active>1</Pagination.Item>
                      <Pagination.Item>2</Pagination.Item>
                      <Pagination.Item className="pagination-next">
                        next{" "}
                      </Pagination.Item>
                    </Pagination>
                  </nav>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default LinksPage;
