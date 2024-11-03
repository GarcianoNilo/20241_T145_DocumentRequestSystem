import React, { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardHeader, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import './components-css/UDashContent.css';

export default function UDashContent() {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the announcement data
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch('/api/announcements'); // Update the URL if needed
        if (!response.ok) {
          throw new Error('Failed to fetch announcement');
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setAnnouncement(data[0]); // Assuming you want the latest announcement
        } else {
          setAnnouncement(null); // No announcements available
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
        setError("Error loading announcement");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  return (
    <div className="main-content d-flex flex-column justify-content-between">
      {/* Info Section */}
      <p><i>Quality Assurance Office's Document Request System</i></p>
      <h2>Request Documents With Ease</h2>
      <p>Request your Documents from the University <strong>Online</strong>.</p>

      {/* Request Button */}
      <div className="d-flex gap-3 mt-auto">
        <MDBBtn color="primary" className="mb-4 d-flex align-items-center justify-content-center">
          Request Now <MDBIcon fas icon="arrow-right" className="ms-2" />
        </MDBBtn>
      </div>

      <div className="d-flex gap-3 mt-auto">
        {/* Announcement Card */}
        <MDBCard className="flex-fill">
          <MDBCardHeader className="bg-primary text-white">Announcement</MDBCardHeader>
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

        {/* Transaction Days - Static Placeholder */}
        <MDBCard className="flex-fill">
          <MDBCardHeader className="bg-primary text-white">Transaction Days</MDBCardHeader>
          <MDBCardBody>
            <p>01/13/2024 - no transaction<br/>01/31/2024 - 7:00 a.m. to 11:50 a.m.<br/>02/14/2024 - no in-person transaction </p>
          </MDBCardBody>
        </MDBCard>
      </div>
    </div>
  );
}
