"use client";
import React, { Fragment } from "react";
import { Breadcrumb } from "react-bootstrap";

const Pageheader = (props: any) => {
  return (
    <Fragment>
      <div
        className={`${
          props.Pagetitle === true
            ? "d-md-flex d-block align-items-center justify-content-between page-header-breadcrumb"
            : "my-4 page-header-breadcrumb d-flex align-items-center justify-content-between flex-wrap gap-2"
        }`}
      >
        <div>
          {props.Pagetitle === true ? (
            ""
          ) : (
            <h1 className="page-title fw-medium fs-18 mb-2">{props.Heading}</h1>
          )}
          <Breadcrumb className="mb-0">
            {props.Pages.map((ele: any, index: any) => (
              <Breadcrumb.Item
                key={index}
                as="li"
                className={`${ele.active ? "" : "noActive"}`}
              >
                {ele.title}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
        {props.v2 == true ? (
          props.Pagetitle === true ? (
            <p className="mb-0">
              <span className="text-muted">Updated on </span> Yesterday
            </p>
          ) : (
            <div className="btn-list">
              <button className="btn btn-primary-light btn-wave me-2">
                <i className="bx bx-crown align-middle"></i> Plan Upgrade
              </button>
              <button className="btn btn-secondary-light btn-wave me-0">
                <i className="ri-upload-cloud-line align-middle"></i> Export
                Report
              </button>
            </div>
          )
        ) : null}
      </div>
    </Fragment>
  );
};

export default Pageheader;
