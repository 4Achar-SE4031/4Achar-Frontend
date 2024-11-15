import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./verification.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useAuth } from "../Authentication/authProvider";
import { useLocation } from 'react-router-dom';
import OTPInput from "./otp";

const Verification: React.FC = () => {
  const navigator = useNavigate();
  const auth = useAuth();
  const [otp, setOtp] = useState<string[]>(["", "", "", "","",""]);
  const [isRunning1, setisRunning1] = useState(false);
  const [isRunning2, setisRunning2] = useState(false);
  const location = useLocation();

  const username = location.state.username || " "
  const password = location.state.password || " "
  const email = location.state.email || " "
  useEffect(() => {
    // disable vertical scrollbar
    // document.documentElement.style.overflowY = 'hidden';
    //changing title of html pages dynamically
    document.title = "تایید ایمیل";
  }, []);

  const autoLogin = async () => {
    const userData = {
      username: username,
      password: password,
    };
    try {
      await auth.loginAction(userData);
      toast.success("!با موفقیت حساب کاربری خود را ساختید");
      setTimeout(() => {
        navigator("/home");
      }, 4000);
    } catch (error) {
      toast.error("خطا در برقرای ارتباط با سرور");
    }
  };

  const checkVerificationCode = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!isRunning1){
        setisRunning1(true)
        // console.log(otp.join(""))
        console.log({confirmationToken:otp.join(""),email:email})
        console.log(location)
        axios
        .post("http://localhost:5000/Account/confirm_email", {confirmationToken:otp.join(""),email:email},{headers:{
            "Content-Type": "application/json",
            accept: "application/json",
        }})
        .then(() => {
        //   navigator('/verify', { state: { username: enteredRegisterUserName, password: enteredRegisterPassword, email:enteredRegisterEmail } })
          autoLogin();
        })
        .catch((error) => {
            console.log(error)
            toast.error("کد وارد شده اشتباه است");
        });
        setisRunning1(false)

    }
  }

  const resendVerificationCode = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (!isRunning2){
        setisRunning2(true)
        
        axios
        .post("http://localhost:5000/Account/send_confirmation_email", {email:email},{headers:{
            "Content-Type": "application/json",
            accept: "application/json",
        }})
        .then(() => {
          toast.success("کد تایید جدید ارسال شد");
        })
        .catch((error) => {
            console.log(error)
            toast.error("خطا در ارسال کد تایید");
        });
        setisRunning1(false)

    }
  }

 
  return (
    <form className="signin">
      <ToastContainer closeOnClick className="toastify-container" position="top-right" toastStyle={{ backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7" }} pauseOnHover={false} autoClose={3000} />
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <div className="card-3d-wrap mx-auto " style={{ height: "290px" }}>
                  <div className="card-front ">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">تایید ایمیل</h4>
                        {/* <div className="form-group mt-2"> */}
                        <div className={`form-group mt-2}`}>
                            <OTPInput otp={otp} setOtp={setOtp} />
                        </div>
                        <p className="mb-0 mt-2">
                          <a className="link cancel" href="/register">تغییر ایمیل</a>
                        </p>
                        <button
                          type="submit"
                          className="btn mt-2"
                          onClick={(e) => checkVerificationCode(e)}
                          disabled={isRunning1}
                        >
                            تایید کد
                        </button>
                        <p className="message">
                              کد تایید را دریافت نکردید؟{" "}
                            <a onClick={(e) => resendVerificationCode(e)}>
                            ارسال مجدد
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

export default Verification;




