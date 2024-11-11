import React from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';

export default function App({ isSidebarOpen }) {
  return (
    <div className={`table-content ${isSidebarOpen ? 'shifted' : ''}`}>
      <p><i>Quality Assurance Office's Document Request System</i></p>
      <h2>Document Status</h2>
      <p>If Documents is Not Available click <strong>Request Now</strong>!</p>

      <div className="d-flex gap-3 mt-auto">
        <MDBBtn href="/request" color="primary" className="mb-4 d-flex align-items-center justify-content-center">
          Request Now <MDBIcon fas icon="arrow-right" className="ms-2" />
        </MDBBtn>
      </div>

    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>Title</th>
          <th scope='col'>Description</th>
          <th scope='col'>Status</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>
            <div className='d-flex align-items-center'>
              <i className="fas fa-book fa-2x" style={{ color: '#6c757d', marginRight: '15px' }}></i>
              <div className='ms-3'>
                <p className='fw-bold mb-1'>Program Profiles</p>
              </div>
            </div>
          </td>
          <td>
            <p className='text-muted mb-0'>Detailed descriptions of specific academic program</p>
          </td>
          <td>
            <MDBBadge color='success' pill>
              Available
            </MDBBadge>
          </td>
        </tr>
        <tr>
          <td>
            <div className='d-flex align-items-center'>
              <i className="fas fa-book fa-2x" style={{ color: '#6c757d', marginRight: '15px' }}></i>
              <div className='ms-3'>
                <p className='fw-bold mb-1'>Operational Plans</p>
              </div>
            </div>
          </td>
          <td>
            <p className='text-muted mb-0'>Plans for program implementation and monitoring</p>
          </td>
          <td>
            <MDBBadge color='danger' pill>
              Not Available
            </MDBBadge>
          </td>
        </tr>
        <tr>
          <td>
            <div className='d-flex align-items-center'>
              <i className="fas fa-book fa-2x" style={{ color: '#6c757d', marginRight: '15px' }}></i>
              <div className='ms-3'>
                <p className='fw-bold mb-1'>Student Directories</p>
              </div>
            </div>
          </td>
          <td>
            <p className='text-muted mb-0'>Lists of enrolled students</p>
          </td>
          <td>
            <MDBBadge color='success' pill>
              Available
            </MDBBadge>
          </td>
        </tr>
      </MDBTableBody>
    </MDBTable>
    </div>
  );
}
