import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";

const DRMainContent = () => {
  return (
    <MDBContainer className="dr-content p-4">
      <h4 className="text-primary">Quality Assurance Office's Document Request System</h4>
      <MDBRow className="mt-3">
        <MDBCol md="12" className="border rounded p-4">
          <h5 className="mb-3 text-primary">Document Request Form</h5>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScwoskRjQfGYIlgGH5h8ZPXmsMDT5L7inTNh3J9kLFwnTtCgw/viewform?embedded=true"  // Replace this with your actual Google Forms URL
            width="100%"
            height="500px"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Document Request Form"
            style={{ borderRadius: '8px' }}
          >
            Loading…
          </iframe>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default DRMainContent;
