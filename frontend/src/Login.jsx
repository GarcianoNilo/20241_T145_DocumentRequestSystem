//Imports
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { MDBContainer, MDBCol, MDBRow, MDBCard, MDBCardBody, MDBCheckbox } from 'mdb-react-ui-kit';
import './css/Login.css';
import Backdrop from './components/Backdrop.jsx';



//API Keys for FUNCTIONALITY TESTING PURPOSES ONLY!
const clientId = "790582912542-vimq5t0ojh5r5TO 1d4d7i5daqu2gb9ts2p.apps.googleusercontent.com";
const recaptchaSiteKey = "6LdRb2kqAAAAAIFoEyyUBq6oPshF1LqQKGLuv3bP";

function Login() {

  //Executes ReCaptcha
  const { executeRecaptcha } = useGoogleReCaptcha();

  //Login Checker
  const onSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);
    if (credentialResponse.credential) {
      alert("Login successful!");
    }
  };
  const onError = () => {
    console.log("Login Failed");
    alert("Login failed. Please try again.");
  };

  //Handles ReCaptcha
  const handleCaptcha = async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }
    const token = await executeRecaptcha('login_page');
    console.log('Recaptcha token:', token);
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <MDBContainer fluid className="p-0 m-0 login-container">
        <MDBRow className="h-100 d-flex align-items-center">

          {/* Left Side */}
          <MDBCol col="12" md="6" className="d-flex justify-content-center align-items-center background-overlay">
            <div className="d-flex flex-column justify-content-center align-items-center login-component">
              <img src="./src/assets/newbuksu.png" className="img-fluid buksulogo" alt="Logo" />
              <img src="./src/assets/logo.png" className="img-fluid qaologo" alt="Logo" />
              <h3 className="text-center mt-3 text-white login-txt">Document Request System</h3>
              <p className="text-center text-white login-txt1">Quick, Easy and Secure: Quality Assurance Office Document Request System</p>
            </div>
          </MDBCol>

          {/* Right Side */}
          <MDBCol col="12" md="6" className="d-flex justify-content-center">
            <MDBCard>
              <MDBCardBody className="d-flex flex-column align-items-center shadow-lg login-card">
                <h4 className="text-center mb-2 login-txt1">LOG IN TO YOUR ACCOUNT</h4>
                <p className="text-center login-txt2">Effortlessly Request Documents Online</p>
                <GoogleOAuthProvider clientId={clientId}>
                  <div className="login mb-4 mt-4">
                    <GoogleLogin onSuccess={onSuccess} onError={onError} />
                  </div>
                </GoogleOAuthProvider>

                <div className="recaptcha">
                  <MDBCheckbox label="I'm not a Robot" id="recaptcha-check" onClick={handleCaptcha} />
                </div>

                <div className="assistance-link mt-5">
                  <Backdrop />
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

        </MDBRow>
      </MDBContainer>
    </GoogleReCaptchaProvider>
  );
}

export default Login;
