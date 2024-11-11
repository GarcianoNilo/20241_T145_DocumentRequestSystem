// Imports
import React from "react";
import { MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import "./../components-css/StepsPanel.css";

export default function StepsPanel() {
  return (
    <div className="steps-panel">
      <h3 className="text-center mb-4">3 Easy Steps to Create a Request</h3>

      {/* Step 1 */}
      <MDBCard className="step-card mb-3">
        <MDBCardBody className="d-flex align-items-center">
          <MDBIcon
            fas
            icon="mouse-pointer"
            size="2x"
            className="me-3 text-primary"
          />
          <div>
            <h5>Step #1</h5>
            <p>Click the "Request Now" button</p>
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Step 2 */}
      <MDBCard className="step-card mb-3">
        <MDBCardBody className="d-flex align-items-center">
          <MDBIcon
            fas
            icon="file-alt"
            size="2x"
            className="me-3 text-primary"
          />
          <div>
            <h5>Step #2</h5>
            <p>Fill-out the request form</p>
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Step 3 */}
      <MDBCard className="step-card">
        <MDBCardBody className="d-flex align-items-center">
          <MDBIcon
            fas
            icon="calendar-check"
            size="2x"
            className="me-3 text-primary"
          />
          <div>
            <h5>Step #3</h5>
            <p>Set appointment date and wait for confirmation</p>
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
