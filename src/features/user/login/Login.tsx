import React, { useState,useEffect } from "react";
import "./login.css";

import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
// import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
// import axios from 'axios';

import googleLogo from "/google-logo.png";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "./authProvider.tsx";

let x=0;
const Login : React.FC = () => {
    const auth = useAuth();
    const navigator=useNavigate();

    const [enteredLoginUserName, setEnteredLoginUserName] = useState("");
    const [enteredLoginPassword, setEnteredLoginPassword] = useState("");

    const [autoHeight,setAutoHeight] = useState(350);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showViolations, setShowViolation] = useState(false);

    const [loginUserNameValidation, setLoginUserNameValidation] = useState(false);
    const [loginUserNameValidationMsg, setLoginUserNameValidationMsg] = useState("نام کاربری شامل 3 تا 30 کاراکتر است و باید با حروف انگلیسی شروع شود");
    
    const [loginPasswordValidation, setLoginPasswordValidation] = useState(false);
    const [loginPasswordValidationMsg, setLoginPasswordValidationMsg] = useState("رمزعبور حداقل باید شامل 8 کاراکتر باشد");

    
  
    useEffect(() => {
      //disable vertical scrollbar
      // document.documentElement.style.overflowY = 'hidden';
      //changing title of html pages dynamically
      document.title = "ورود کاربران";

    }, []);

    

    const toggleLoginPasswordVisibility = () => {
        setShowLoginPassword(!showLoginPassword);
    };

 
    // const loginWithGoogle = useGoogleLogin({
    //     onSuccess: async (tokenResponse: TokenResponse) => {
    //       try {
    //         const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
    //           headers: {
    //             Authorization: `Bearer ${tokenResponse.access_token}`,
    //           },
    //         });
    //         toast.success("!با موفقیت وارد شدید");
    //         setTimeout(() => {
    //           navigator('/home');
    //         }, 4000);
    //       } catch (err) {
    //         console.error(err); // برای مدیریت خطاها
    //       }
    //     },
    //   });


    const loginHandler = async (event: React.MouseEvent<HTMLButtonElement>, action: string) => {
        event.preventDefault();
        x=0;
        if(loginUserNameValidation===false){
        x++;
        }
        if(loginPasswordValidation===false){
        x++;
        }

        if(showViolations===false && x>0){
            setAutoHeight(autoHeight+x*20);
          }
        setShowViolation(true)
        event.preventDefault();
        
        let userData = {
            username: enteredLoginUserName,
            password: enteredLoginPassword,
        };

        if(loginUserNameValidation && loginPasswordValidation){
            setShowViolation(false);
            try{
              let result = await auth.loginAction(userData);
              if (result ==="Data received successfully"){
                setEnteredLoginUserName("");
                setEnteredLoginPassword("");
                toast.success("!با موفقیت وارد شدید");
                
              // const response2 = await axios.get(`https://eventify.liara.run/account/me/`,{headers: {
              //     "Content-Type": "application/json",
              //     Authorization:`JWT ${response.data.access}`,
              // }});
                setTimeout(() => {
                  navigator('/home');
                }, 4000);
              }else if(result==="username does not exist"){
                setShowViolation(true);
                setLoginUserNameValidation(false);
                setLoginUserNameValidationMsg("نام کاربری وارد شده در سیستم وجود ندارد");
                toast.error("نام کاربری وارد شده در سیستم وجود ندارد");

              }else if(result==="password incorrect"){
                setShowViolation(true);
                setLoginPasswordValidation(false);
                setLoginPasswordValidationMsg("رمزعبور نادرست است");
                toast.error("رمز عبور نادرست است");
              }else{
                toast.error("نام کاربری یا رمزعبور نادرست است");
              }
            }catch(error){
              
              toast.error("خطا در برقرای ارتباط با سرور");
              
            }
          
          }
    };


   //Login validations
  //--------------------------------------------------------------------------------------------------
    const regUserName = /^[a-zA-Z][a-zA-Z0-9._]{2,29}$/;

    const loginUserNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(showViolations===true){
        setAutoHeight(autoHeight-20*x);
        }
        setShowViolation(false)
        setEnteredLoginUserName(event.target.value);
        if (event.target.value.length<3 || event.target.value.length>30){
        setLoginUserNameValidation(false);
        setLoginUserNameValidationMsg("نام کاربری شامل 3 تا 30 کاراکتر است و باید با حروف انگلیسی شروع شود")
        }
        else{
            if (regUserName.test(event.target.value)){
                setLoginUserNameValidation(true);
            }else{
                setLoginUserNameValidation(false);
                setLoginUserNameValidationMsg("نام کاربری باید با حروف انگلیسی شروع شود و شامل حروف و اعداد انگلیسی است")
            }
        }
    }

    const loginPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(showViolations===true){
        setAutoHeight(autoHeight-20*x);
        }
        setShowViolation(false)
        setEnteredLoginPassword(event.target.value);
        if(event.target.value.length<8){
        setLoginPasswordValidation(false);
        setLoginPasswordValidationMsg("رمزعبور حداقل باید شامل 8 کاراکتر باشد")
        }else{
        let pattern=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)" + "(?=.*[-+_!@#$%^&*., ?]).+$")
        if(!pattern.test(event.target.value)){
            setLoginPasswordValidationMsg("رمزعبور باید شامل حروف کوچک و بزرگ انگلیسی،اعداد و نشانه های خاص باشد")
            setLoginPasswordValidation(false);
        }else{
            setLoginPasswordValidation(true);
        }
        
        }

    };


    return(
    <form className="signin" lang="fa">
       <ToastContainer closeOnClick  className="toastify-container"position="top-right" toastStyle={{backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7"}} pauseOnHover={false} autoClose={3000} />
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <div className="card-3d-wrap mx-auto " style={{height: autoHeight.toString()+"px"}}>
                    <div className="card-front ">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">ورود کاربران</h4>
                          <div className={`form-group mt-2 ${(!loginUserNameValidation && showViolations) ? "invalid" : ""}`}>
                            <input 
                              dir="rtl"
                              type="text"
                              className="form-style"
                              placeholder="نام کاربری"
                              value={enteredLoginUserName}
                              onChange={loginUserNameHandler}
                            />
                            <i className="input-icon uil uil-user"></i>
                          </div>
                          {!loginUserNameValidation && showViolations &&(<p className="mb-0 mt-2 validationMsg">{loginUserNameValidationMsg}</p>)}
                          <div className={`form-group mt-2 ${!loginPasswordValidation && showViolations ? "invalid" : ""}`}>
                            <i  
                                role="button"
                                aria-label="toggle password visibility" // Matches the test's expectation
                                className={showLoginPassword ? "bi bi-eye":"bi bi-eye-slash"} 
                                onClick={toggleLoginPasswordVisibility} 
                                style={{fontSize: "20px", 
                                        position: "absolute",
                                        top: "55%",
                                        transform: "translateY(-50%)",
                                        paddingLeft: "10px"
                                        }}>
                            </i>
                            <input lang="fa"
                              dir="rtl"
                              type={showLoginPassword ? "text":"password"}
                              className="form-style"
                              placeholder="رمز عبور"
                              value={enteredLoginPassword}
                              onChange={loginPasswordHandler} 
                            />
                            <i className="input-icon uil uil-lock-alt" ></i>
                          </div>
                          {!loginPasswordValidation && showViolations &&(<p className="mb-0 mt-2 validationMsg">{loginPasswordValidationMsg}</p>)}
                          <p className="mb-0 mt-2">
                            <a className="link" href="/forget-password">بازیابی رمز عبور</a>
                          </p>
                          <button
                            type="submit"
                            className="btn mt-2"
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => loginHandler(event, "login")}
                          >
                            ورود
                          </button>
                          {/* <div className="container">
                            <div className="row"> 
                                <hr className="custom-hr"/>
                                <h6 className="separator-text">یا</h6>
                                <hr className="custom-hr"/>
                            </div>
                          </div>
                          <button className="google-login-button" style={{display: "flex" ,justifyContent: "center" ,alignItems: "center",marginLeft:"120px"}}>
                              <div className="row">
                                  <div style={{marginTop: "2px"}}>
                                      <img 
                                          src={ googleLogo}
                                          style={{width: "25px", height: "25px",paddingTop:"1px"}}
                                          alt="Google Logo"
                                      />
                                  </div>
                                  <h6 style={{paddingLeft:"5px",paddingTop:"5px"}}>ورود با گوگل</h6>
                              </div> 
                          </button> */}
                          <p className="message">
                           حساب کاربری ندارید؟{" "}
                            <a href="/register">
                              همین حالا عضو شوید
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    
  );



}

export default Login;