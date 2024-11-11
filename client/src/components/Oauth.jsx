// src/components/Login.jsx
import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import './components-css/Oauth.css';

const clientId = '96467309918-sjb49jofskdnaffpravkqgu1o6p0a8eh.apps.googleusercontent.com';
const recaptchaKey = '6Lfty3MqAAAAACp-CJm8DFxDW1GfjdR1aXqHbqpg';

export default function Oauth() {
    const navigate = useNavigate();
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [isRecaptchaValid, setIsRecaptchaValid] = useState(false);

    const onSuccess = async (credentialResponse) => {
        console.log("Login Success:", credentialResponse);

        if (!recaptchaValue) {
            alert("Please complete the reCAPTCHA.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credentialResponse.credential, recaptcha: recaptchaValue }),
            });

            const data = await response.json();

            console.log("Backend response:", data);

            if (response.ok) {
                sessionStorage.setItem('authToken', credentialResponse.credential);
                sessionStorage.setItem('userInfo', JSON.stringify(data.user));
                sessionStorage.setItem('sessionToken', data.token);
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else if (data.user.role === 'user') {
                    navigate('/user');
                }
            } else {
                console.log("Login Failed:", data.message);
                alert("Login failed: " + data.message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred while logging in.");
        }
    };

    const onError = () => {
        console.log("Login Failed");
        alert("Login failed. Please try again.");
    };

    const onRecaptchaChange = (value) => {
        setRecaptchaValue(value);
        setIsRecaptchaValid(true);
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <MDBContainer fluid className="p-0 m-0 login-container">
                <MDBRow className="h-100 d-flex align-items-center">
                    {/* Left Side */}
                    <MDBCol col="12" md="6" className="d-flex justify-content-center align-items-center background-overlay">
                        <div className="d-flex flex-column justify-content-center align-items-center login-component">
                            <img src="./src/assets/newbuksu.png" className="buksulogo" alt="Buksu Logo" />
                            <img src="./src/assets/logo.png" className="qaologo" alt="QAO Logo" />
                            <h3 className="text-center mt-3 text-white login-txt">Document Request System</h3>
                            <p className="text-center text-white login-txt1">Quick, Easy and Secure: Quality Assurance Office Document Request System</p>
                        </div>
                    </MDBCol>

                    {/* Right Side */}
                    <MDBCol col="12" md="6" className="d-flex justify-content-center">
                        <MDBCard className="transparent-card">
                            <MDBCardBody className="d-flex flex-column justify-content-center align-items-center login-card">
                                <h4 className="text-center mb-2 login-txt1">LOG IN TO YOUR ACCOUNT</h4>
                                <p className="text-center login-txt2">Effortlessly Request Documents Online</p>

                                <div className="login mb-3 mt-3">
                                    {/* Google Login */}
                                    <GoogleLogin
                                        onSuccess={onSuccess}
                                        onError={onError}
                                        disabled={!isRecaptchaValid}
                                    />
                                </div>
                                {/* reCAPTCHA */}
                                <ReCAPTCHA
                                    sitekey={recaptchaKey}
                                    onChange={onRecaptchaChange}
                                />
                                <div className="assistance-link mt-5">
                                    {/* Place for any additional links or information */}
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </GoogleOAuthProvider>
    );
}
