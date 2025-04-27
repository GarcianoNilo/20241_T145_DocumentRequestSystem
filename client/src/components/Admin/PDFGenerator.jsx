import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import DocumentRequestPDF from './DocumentRequestPDF';
import MultiPageDocumentRequestPDF from './MultiPageDocumentRequestPDF';
import { preparePdfData, prepareDocumentRows, validatePdfForm } from '../../services/pdfDataService';
import { downloadPdf } from '../../services/pdfGenerationService';
import { Modal, Button, Form, Row, Col, Nav, Tab } from 'react-bootstrap';
import '../components-css/PDFGenerator.css';

const PDFGenerator = ({ documentData, selectedDocuments = [], onClose }) => {
  // Initialize with empty data structure or provided document data
  const [formData, setFormData] = useState({
    formNumber: '',
    docCode: '',
    date: new Date().toISOString().split('T')[0],
    requestorName: '',
    requestorOffice: '',
    targetOffice: 'Quality Assurance Office',
    purpose: '',
    isaChecked: false,
    monitoringChecked: false,
    accreditationChecked: false,
    certificationChecked: false,
    otherChecked: false,
    otherSpecify: '',
    effectivityDate: new Date().toISOString().split('T')[0],
    requestorDate: new Date().toISOString().split('T')[0],
    adminDate: new Date().toISOString().split('T')[0],
    documentRows: Array(5).fill({}).map(() => ({ area: '', docName: '', status: '' }))
  });
  
  // State for validation and UI
  const [validation, setValidation] = useState({ isValid: false, errors: {}, touchedFields: {} });
  const [activeTab, setActiveTab] = useState('form');
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  
  // Populate form with document data if provided
  useEffect(() => {
    if (documentData) {
      // Get document rows from selectedDocuments if available, otherwise use single document
      const docRows = selectedDocuments && selectedDocuments.length > 0
        ? selectedDocuments.map(doc => ({
            area: doc.department || '',
            docName: doc.title || '',
            status: doc.status || ''
          }))
        : [{ 
            area: documentData.department || '', 
            docName: documentData.title || '', 
            status: documentData.status || ''
          }];
          
      // Fill in at least 5 rows (required minimum)
      while (docRows.length < 5) {
        docRows.push({ area: '', docName: '', status: '' });
      }
      
      const initialData = {
        formNumber: `REQ-${documentData.docID || ''}`,
        docCode: `${documentData.docID || ''}`,
        date: new Date().toISOString().split('T')[0],
        requestorName: documentData.email || '',
        requestorOffice: documentData.department || '',
        targetOffice: 'Quality Assurance Office',
        purpose: documentData.title || '',
        documentRows: docRows,
        isaChecked: true // Default to Internal Self-Assessment checked
      };
      
      setFormData({...formData, ...initialData});
    }
  }, [documentData, selectedDocuments]);
  
  // Validate form whenever data changes
  useEffect(() => {
    const validationResult = validatePdfForm(formData);
    setValidation(prev => ({
      ...prev,
      isValid: validationResult.isValid,
      errors: validationResult.errors
    }));
  }, [formData]);
  
  // Handle input changes for general form fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Mark field as touched for validation display
    setValidation(prev => ({
      ...prev,
      touchedFields: {
        ...prev.touchedFields,
        [name]: true
      }
    }));
    
    // If "Other" checkbox is unchecked, clear the otherSpecify field
    if (name === 'otherChecked' && !checked) {
      setFormData(prevData => ({
        ...prevData,
        otherSpecify: ''
      }));
    }
  };
  
  // Handle document row changes
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...formData.documentRows];
    if (!updatedRows[index]) {
      updatedRows[index] = {};
    }
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    
    setFormData(prevData => ({
      ...prevData,
      documentRows: updatedRows
    }));
    
    // Mark row field as touched
    setValidation(prev => ({
      ...prev,
      touchedFields: {
        ...prev.touchedFields,
        [`row_${index}_${field}`]: true
      }
    }));
  };
  
  // Add a new row to the document table
  const addRow = () => {
    // Remove the row limit (previously 10) to allow more rows
    setFormData(prevData => ({
      ...prevData,
      documentRows: [
        ...prevData.documentRows, 
        { area: '', docName: '', status: '' }
      ]
    }));
  };
  
  // Remove the last row from the document table
  const removeRow = () => {
    if (formData.documentRows.length > 5) {
      setFormData(prevData => ({
        ...prevData,
        documentRows: prevData.documentRows.slice(0, -1)
      }));
    }
  };
  
  // Handle preview button click
  const handlePreview = () => {
    // Mark all fields as touched to show validation errors
    const allFields = {
      formNumber: true,
      docCode: true,
      date: true,
      requestorName: true,
      requestorOffice: true,
      targetOffice: true,
      purpose: true,
      checkboxes: true,
      otherSpecify: formData.otherChecked,
      effectivityDate: true,
      requestorDate: true,
      adminDate: true
    };
    
    // Mark all row fields as touched
    formData.documentRows.forEach((_, index) => {
      allFields[`row_${index}_area`] = true;
      allFields[`row_${index}_docName`] = true;
      allFields[`row_${index}_status`] = true;
    });
    
    setValidation(prev => ({
      ...prev,
      touchedFields: allFields
    }));
    
    if (!validation.isValid) {
      setShowValidationSummary(true);
      return;
    }
    
    setActiveTab('preview');
  };
  
  // Should display error for a field?
  const showError = (fieldName) => {
    return validation.touchedFields[fieldName] && validation.errors[fieldName];
  };
  
  // Should display error for a row field?
  const showRowError = (index, field) => {
    if (!validation.errors.rowErrors) return false;
    
    return validation.touchedFields[`row_${index}_${field}`] && 
      validation.errors.rowErrors.some(err => 
        err.rowIndex === index && err[field]
      );
  };
  
  // Display error message for a field
  const getErrorMessage = (fieldName) => {
    return validation.errors[fieldName];
  };
  
  // Handle download button click
  const handleDownload = async () => {
    if (!validation.isValid) {
      setShowValidationSummary(true);
      return;
    }
    
    try {
      await downloadPdf(formData, `document-request-${formData.docCode || 'form'}.pdf`);
      onClose();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };
  
  // Prepare data for PDF rendering
  const pdfData = preparePdfData(formData);
  const documentRows = prepareDocumentRows(formData);
  
  // Use MultiPageDocumentRequestPDF when there are more than 15 rows
  const PdfComponent = documentRows.length > 15 
    ? MultiPageDocumentRequestPDF 
    : DocumentRequestPDF;

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal-container">
        <div className="pdf-modal-header">
          <h2>Document Request Form</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="pdf-modal-tabs">
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="form">Form Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="preview">PDF Preview</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        
        <div className="pdf-modal-content">
          {activeTab === 'form' ? (
            <div className="pdf-form-container">
              {/* Form Summary */}
              {selectedDocuments && selectedDocuments.length > 1 && (
                <div className="document-summary">
                  <h5>Selected Documents: {selectedDocuments.length}</h5>
                  <div className="status-pills">
                    {Object.entries(selectedDocuments.reduce((acc, doc) => {
                      acc[doc.status] = (acc[doc.status] || 0) + 1;
                      return acc;
                    }, {})).map(([status, count]) => (
                      <span key={status} className={`status-pill ${status.toLowerCase()}`}>
                        {status}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Validation Summary */}
              {!validation.isValid && showValidationSummary && (
                <div className="validation-summary">
                  <h5>Please correct the following issues:</h5>
                  <ul>
                    {Object.entries(validation.errors).map(([key, value]) => {
                      if (key !== 'rowErrors') {
                        return <li key={key}>{value}</li>;
                      }
                      return null;
                    })}
                    {validation.errors.rowErrors && (
                      <li>Some document rows have incomplete information</li>
                    )}
                  </ul>
                </div>
              )}
              
              {/* Form Fields */}
              <Form>
                <section className="form-section">
                  <h5>Form Information</h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Form Number <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="formNumber"
                          value={formData.formNumber}
                          onChange={handleInputChange}
                          isInvalid={showError('formNumber')}
                        />
                        {showError('formNumber') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('formNumber')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Document Code <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="docCode"
                          value={formData.docCode}
                          onChange={handleInputChange}
                          isInvalid={showError('docCode')}
                        />
                        {showError('docCode') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('docCode')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="date" 
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          isInvalid={showError('date')}
                        />
                        {showError('date') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('date')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </section>
                
                <section className="form-section">
                  <h5>Requestor Information</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="requestorName"
                          value={formData.requestorName}
                          onChange={handleInputChange}
                          isInvalid={showError('requestorName')}
                        />
                        {showError('requestorName') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('requestorName')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Office/Department <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="requestorOffice"
                          value={formData.requestorOffice}
                          onChange={handleInputChange}
                          isInvalid={showError('requestorOffice')}
                        />
                        {showError('requestorOffice') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('requestorOffice')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Target Office <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="targetOffice"
                          value={formData.targetOffice}
                          onChange={handleInputChange}
                          isInvalid={showError('targetOffice')}
                        />
                        {showError('targetOffice') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('targetOffice')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Purpose <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          isInvalid={showError('purpose')}
                        />
                        {showError('purpose') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('purpose')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </section>
                
                <section className="form-section">
                  <h5>Document Processing</h5>
                  <div className={showError('checkboxes') ? 'is-invalid' : ''}>
                    <Form.Check 
                      type="checkbox"
                      id="isaCheck"
                      label="Internal Self-Assessment"
                      name="isaChecked"
                      checked={formData.isaChecked}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Check 
                      type="checkbox"
                      id="monitoringCheck"
                      label="Monitoring & Evaluation"
                      name="monitoringChecked"
                      checked={formData.monitoringChecked}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Check 
                      type="checkbox"
                      id="accreditationCheck"
                      label="Accreditation"
                      name="accreditationChecked"
                      checked={formData.accreditationChecked}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Check 
                      type="checkbox"
                      id="certificationCheck"
                      label="ISO Certification"
                      name="certificationChecked"
                      checked={formData.certificationChecked}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <div className="d-flex align-items-center mb-2">
                      <Form.Check 
                        type="checkbox"
                        id="otherCheck"
                        label="Other:"
                        name="otherChecked"
                        checked={formData.otherChecked}
                        onChange={handleInputChange}
                        className="me-2"
                      />
                      <Form.Control 
                        type="text"
                        name="otherSpecify"
                        value={formData.otherSpecify}
                        onChange={handleInputChange}
                        placeholder="Please specify"
                        disabled={!formData.otherChecked}
                        isInvalid={showError('otherSpecify') && formData.otherChecked}
                        style={{width: '200px'}}
                        size="sm"
                      />
                    </div>
                    {showError('checkboxes') && (
                      <div className="invalid-feedback d-block">
                        {getErrorMessage('checkboxes')}
                      </div>
                    )}
                  </div>
                </section>
                
                <section className="form-section">
                  <h5>Document Table</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th width="50">No.</th>
                          <th width="25%">Area/Category <span className="required">*</span></th>
                          <th>Document Name/Description <span className="required">*</span></th>
                          <th width="20%">Status <span className="required">*</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.documentRows.map((row, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>
                              <Form.Control 
                                size="sm"
                                type="text"
                                value={row.area || ''}
                                onChange={(e) => handleRowChange(index, 'area', e.target.value)}
                                isInvalid={showRowError(index, 'area')}
                              />
                            </td>
                            <td>
                              <Form.Control 
                                size="sm"
                                type="text"
                                value={row.docName || ''}
                                onChange={(e) => handleRowChange(index, 'docName', e.target.value)}
                                isInvalid={showRowError(index, 'docName')}
                              />
                            </td>
                            <td>
                              <Form.Control 
                                size="sm"
                                type="text"
                                value={row.status || ''}
                                onChange={(e) => handleRowChange(index, 'status', e.target.value)}
                                isInvalid={showRowError(index, 'status')}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {showError('documentRows') && (
                    <div className="invalid-feedback d-block mb-3">
                      {getErrorMessage('documentRows')}
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={addRow}
                      className="me-2">
                      + Add Row
                    </Button>
                    {formData.documentRows.length > 5 && (
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={removeRow}
                        className="me-2">
                        - Remove Row
                      </Button>
                    )}
                    <span className="text-muted small">
                      {formData.documentRows.length} rows (minimum: 5)
                    </span>
                  </div>
                </section>
                
                <section className="form-section">
                  <h5>Dates</h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Effectivity Date <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="date" 
                          name="effectivityDate"
                          value={formData.effectivityDate}
                          onChange={handleInputChange}
                          isInvalid={showError('effectivityDate')}
                        />
                        {showError('effectivityDate') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('effectivityDate')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Requestor Date <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="date" 
                          name="requestorDate"
                          value={formData.requestorDate}
                          onChange={handleInputChange}
                          isInvalid={showError('requestorDate')}
                        />
                        {showError('requestorDate') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('requestorDate')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Admin Date <span className="required">*</span></Form.Label>
                        <Form.Control 
                          type="date" 
                          name="adminDate"
                          value={formData.adminDate}
                          onChange={handleInputChange}
                          isInvalid={showError('adminDate')}
                        />
                        {showError('adminDate') && (
                          <Form.Control.Feedback type="invalid">
                            {getErrorMessage('adminDate')}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </section>
              </Form>
            </div>
          ) : (
            <div className="pdf-preview-container">
              <PDFViewer width="100%" height="600px">
                <PdfComponent data={pdfData} documentRows={documentRows} />
              </PDFViewer>
            </div>
          )}
        </div>
        
        <div className="pdf-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {activeTab === 'form' ? (
            <Button 
              variant="primary"
              onClick={() => setActiveTab('preview')}>
              Preview PDF
            </Button>
          ) : (
            <Button 
              variant="success"
              onClick={handleDownload}
              disabled={!validation.isValid}>
              Download PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;
