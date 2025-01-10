import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import googleLogo from "/google-logo.png";  // لوگو گوگل
import axios from "axios";

const LoginWithGoogle: React.FC = () => {
    const login = useGoogleLogin({
        onSuccess: async (credentialResponse: any) => {
            console.log("Login Success:", credentialResponse);
            try {
                const res = await axios.post('https://api-concertify.darkube.app/api/auth/google', {
                    token: credentialResponse, // استفاده از توکن دریافتی
                });
                console.log('Server Response:', res.data);
            } catch (error) {
                console.error('Error during login:', error);
            }
        },
        onError: () => {
            console.log('Login Failed');
        },
    });

    return (
        <button
            onClick={() => login()} // فراخوانی login با کلیک روی دکمه
            style={{
                backgroundColor: 'transparent', // پس‌زمینه شفاف
                border: 'none', // مرز ندارد
                borderRadius: '5px', // حاشیه دایره‌ای
                cursor: 'pointer', // اشاره‌گر موس به شکل دست
                fontSize: '16px',
                outline: 'none',
            }}
        >
            <div className='row'>
                <img
                    src={googleLogo} // آدرس لوگو گوگل
                    style={{ width: "25px", height: "25px", paddingTop: "1px",paddingRight:"3px" }}  // اندازه لوگو
                    alt="Google Logo"
                />
                <h6 style={{paddingLeft:"0px",paddingTop:"6px"}}>ورود با گوگل</h6>
            </div>
            
        </button>
    );
};

export default LoginWithGoogle;
