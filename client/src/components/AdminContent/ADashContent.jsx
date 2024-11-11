import React, { useState, useEffect } from "react"; // Importing useState and useEffect
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import "./../components-css/ADashContent.css";

export default function ADashContent({ isSidebarOpen }) {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch("/api/announcements");
        if (!response.ok) {
          throw new Error("Failed to fetch announcement");
        }
        const data = await response.json();
        setAnnouncement(data.length > 0 ? data[0] : null);
      } catch (error) {
        setError("Error loading announcement");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  return (
    <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
      <p>
        <i>Quality Assurance Office's Document Request System</i>
      </p>
      <h2>Process Documents With Ease</h2>
      <p>
        View Document Requests submitted by the <strong> users</strong>.
      </p>

      <div className="d-flex gap-3 mt-auto">
        <MDBBtn
          color="primary"
          className="mb-4 d-flex align-items-center justify-content-center"
        >
          View requests <MDBIcon fas icon="arrow-right" className="ms-2" />
        </MDBBtn>
      </div>

      <div className="d-flex gap-3 mt-auto">
        <MDBCard className="flex-fill">
          <MDBCardHeader className="bg-warning text-black text-center">
            Announcement
          </MDBCardHeader>
          <MDBCardBody>
            {loading ? (
              <p>Loading announcement...</p>
            ) : error ? (
              <p>{error}</p>
            ) : announcement ? (
              <p>{announcement.content}</p>
            ) : (
              <p>No announcements available</p>
            )}
          </MDBCardBody>
        </MDBCard>

        <MDBCard className="flex-fill">
          <MDBCardHeader className="bg-warning text-black text-center">
            Transaction Days
          </MDBCardHeader>
          <MDBCardBody>
            <p>
              01/13/2024 - no transaction
              <br />
              01/31/2024 - 7:00 a.m. to 11:50 a.m.
              <br />
              02/14/2024 - no in-person transaction
            </p>
          </MDBCardBody>
        </MDBCard>
      </div>
    </div>
  );
}
