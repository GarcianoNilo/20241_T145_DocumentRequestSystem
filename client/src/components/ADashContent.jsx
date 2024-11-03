import React from 'react';
import { MDBCard, MDBCardBody, MDBCardHeader, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import './components-css/ADashContent.css';

export default function ADashContent() {
  return (
    <div className="main-content d-flex flex-column justify-content-between">
      
      {/* Info Section */}
      <p><i>Quality Assurance Office's Document Request System</i></p>
      <h2>Process Documents with Ease</h2>
      <p>View Document Requests submitted by the <strong>Users</strong>.</p>

      {/* View Request Button */}
      <div className="d-flex gap-3 mt-auto">
        <MDBBtn color="primary" className="mb-4 d-flex align-items-center justify-content-center">
         View Requests <MDBIcon fas icon="arrow-right" className="ms-2" />
        </MDBBtn>
      </div>
      
      <div className="d-flex gap-3 mt-auto">

        {/* Announcements ITEMS DISPLAYED IN THE CARD IS JUST A PLACEHOLDER */}
        <MDBCard className="flex-fill">
          <MDBCardHeader className="bg-warning text-black text-center">Announcement</MDBCardHeader>
          <MDBCardBody>
            <p>Please be advised that the Quality Assurance Office will be conducting the Year-End Strategic Planning on M-Date-Date-Year. <br /> 
            <br /> Hence, the in-person transaction of our clients on the said dates can be accommodated from 7:00 a.m. to 11:30 a.m.</p>
          </MDBCardBody>
          <MDBBtn color="warning" className="">
                Edit
            </MDBBtn>
            <MDBBtn color="success" className="publish">
                Publish
            </MDBBtn>
        </MDBCard>

        {/* Transactions ITEMS DISPLAYED IN THE CARD IS JUST A PLACEHOLDER */}
        <MDBCard className="flex-fill">
          <MDBCardHeader className="bg-warning text-black text-center">Transaction Days</MDBCardHeader>
          <MDBCardBody>
            <p>01/13/2024 - no transaction<br/>01/31/2024 - 7:00 a.m. to 11:50 a.m.<br/>02/14/2024 - no in-person transaction </p>
          </MDBCardBody>
          <MDBBtn color="warning" className="">
                Edit
            </MDBBtn>
            <MDBBtn color="success" className="publish">
                Publish
            </MDBBtn>
        </MDBCard>

      </div>
    </div>
  );
}
