import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./Register.css";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../Authentication/authProvider";

interface UserData {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
let x = 0;
const Register: React.FC = () => {
  const navigator = useNavigate();
  const auth = useAuth();

  const [enteredRegisterUserName, setEnteredRegisterUserName] =
    useState<string>("");
  const [enteredRegisterEmail, setEnteredRegisterEmail] = useState<string>("");
  const [enteredRegisterPassword, setEnteredRegisterPassword] =
    useState<string>("");
  const [enteredRegisterPassword2, setEnteredRegisterPassword2] =
    useState<string>("");
  const [enteredName, setEnteredName] = useState<string>("");

  const [autoHeight, setAutoHeight] = useState<number>(510);

  const [showRegisterPassword, setShowRegisterPassword] =
    useState<boolean>(false);
  const [showRegisterPassword2, setShowRegisterPassword2] =
    useState<boolean>(false);

  const [showViolations, setShowViolation] = useState<boolean>(false);
  const [registerUserNameValidation, setRegisterUserNameValidation] =
    useState<boolean>(false);
  const [registerUserNameValidationMsg, setRegisterUserNameValidationMsg] =
    useState<string>(
      "نام کاربری شامل 3 تا 30 کاراکتر است و باید با حروف انگلیسی شروع شود"
    );
  const [registerEmailValidation, setRegisterEmailValidation] =
    useState<boolean>(false);
  const [registerEmailValidationMsg, setRegisterEmailValidationMsg] =
    useState<string>("فرمت ایمیل نادرست است");

  const [registerPasswordValidation, setRegisterPasswordValidation] =
    useState<boolean>(false);
  const [registerPasswordValidationMsg, setRegisterPasswordValidationMsg] =
    useState<string>("رمزعبور حداقل باید شامل 8 کاراکتر باشد");

  const [registerPasswordValidation2, setRegisterPasswordValidation2] =
    useState<boolean>(false);
  const [registerPasswordValidationMsg2, setRegisterPasswordValidationMsg2] =
    useState<string>("رمز عبور حداقل باید شامل 8 کاراکتر باشد");
  const [nameValidation, setNameValidation] = useState<boolean>(false);

  useEffect(() => {
    document.title = "عضویت در کنسرتیفای";
  }, []);

  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword((prev) => !prev);
  };

  const toggleRegisterPasswordVisibility2 = () => {
    setShowRegisterPassword2((prev) => !prev);
  };

  const autoLogin = async () => {
    const userData = {
      username: enteredRegisterUserName,
      password: enteredRegisterPassword,
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

  const registerHandler = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    x = 0;
    if (!registerUserNameValidation) x++;
    if (!registerEmailValidation) x++;
    if (!registerPasswordValidation) x++;
    if (!registerPasswordValidation2) x++;
    if (!nameValidation) x++;

    if (!showViolations && x > 0) {
      setAutoHeight((prev) => prev + x * 20);
    }
    setShowViolation(true);

    const userData: UserData = {
      userName: enteredRegisterUserName,
      firstName: enteredName,
      lastName: enteredName,
      email: enteredRegisterEmail,
      password: enteredRegisterPassword,
    };

    if (
      registerUserNameValidation &&
      registerEmailValidation &&
      registerPasswordValidation &&
      registerPasswordValidation2 &&
      nameValidation
    ) {
      axios
        .post("https://api-concertify.darkube.app/Account/signup", userData, {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        })
        .then(() => {
          setShowViolation(false);
          toast.success("ایمیل حاوی کد تایید برای شما ارسال شد");
          setTimeout(() => {
            navigator("/verify", {
              state: {
                username: enteredRegisterUserName,
                password: enteredRegisterPassword,
                email: enteredRegisterEmail,
              },
            });
          }, 4000);
          //   autoLogin();
        })
        .catch((error) => {
          //   console.log(error);
          try {
            const errorMsg = error.response.request.responseText;
            // console.log(errorMsg);
            // console.log("**************");
            if (errorMsg.includes("Username")) {
              toast.error("نام کاربری تکراری است");
            } else if (errorMsg.includes("Email")) {
              toast.error("ایمیل تکراری است");
            } else {
              toast.error("خطا در برقراری ارتباط با سرور");
            }
          } catch {
            toast.error("خطا در برقراری ارتباط با سرور");
          }
        });
    }
  };

  // سایر توابع با نوع‌دهی مشابه تایپ شده‌اند
  const registerUserNameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredRegisterUserName(event.target.value);
    const regUserName = /^[a-zA-Z][a-zA-Z0-9._]{2,29}$/;
    if (event.target.value.length < 3 || event.target.value.length > 30) {
      setRegisterUserNameValidation(false);
      setRegisterUserNameValidationMsg(
        "نام کاربری شامل 3 تا 30 کاراکتر است و باید با حروف انگلیسی شروع شود"
      );
    } else if (!regUserName.test(event.target.value)) {
      setRegisterUserNameValidation(false);
      setRegisterUserNameValidationMsg(
        "نام کاربری باید با حروف انگلیسی شروع شود و شامل حروف و اعداد انگلیسی است"
      );
    } else {
      setRegisterUserNameValidation(true);
    }
  };

  const registerEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (showViolations === true) {
      setAutoHeight(autoHeight - 20 * x);
    }
    setShowViolation(false);
    setEnteredRegisterEmail(event.target.value);
    if (
      !String(event.target.value)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setRegisterEmailValidation(false);

      setRegisterEmailValidationMsg("فرمت ایمیل نادرست است");
    } else {
      setRegisterEmailValidation(true);
    }
  };

  const registerPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (showViolations === true) {
      setAutoHeight(autoHeight - 20 * x);
    }
    setShowViolation(false);
    setEnteredRegisterPassword(event.target.value);
    if (event.target.value.length < 8) {
      setRegisterPasswordValidation(false);
      setRegisterPasswordValidationMsg(
        "رمزعبور حداقل باید شامل 8 کاراکتر باشد"
      );
    } else {
      let pattern = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)" + "(?=.*[-+_!@#$%^&*., ?]).+$"
      );
      if (!pattern.test(event.target.value)) {
        setRegisterPasswordValidationMsg(
          "رمزعبور باید شامل حروف کوچک و بزرگ انگلیسی،اعداد و نشانه های خاص باشد"
        );
        setRegisterPasswordValidation(false);
      } else {
        setRegisterPasswordValidation(true);
      }
    }
  };
  const registerPasswordHandler2 = (event: ChangeEvent<HTMLInputElement>) => {
    if (showViolations === true) {
      setAutoHeight(autoHeight - 20 * x);
    }
    setShowViolation(false);
    setEnteredRegisterPassword2(event.target.value);
    if (event.target.value !== enteredRegisterPassword) {
      //   console.log("--------------------------------");
      //   console.log(enteredRegisterPassword);
      //   console.log(event.target.value);
      setRegisterPasswordValidation2(false);
      setRegisterPasswordValidationMsg2("رمزعبور و تکرار آن باید یکسان باشند");
    } else {
      if (event.target.value.length < 8) {
        setRegisterPasswordValidation2(false);
        setRegisterPasswordValidationMsg2(
          "رمزعبور حداقل باید شامل 8 کاراکتر باشد"
        );
      } else {
        let pattern = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)" + "(?=.*[-+_!@#$%^&*., ?]).+$"
        );
        if (!pattern.test(event.target.value)) {
          setRegisterPasswordValidationMsg2(
            "رمزعبور باید شامل حروف کوچک و بزرگ انگلیسی،اعداد و نشانه های خاص باشد"
          );
          setRegisterPasswordValidation2(false);
        } else {
          setRegisterPasswordValidation2(true);
        }
      }
    }
  };

  const nameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (showViolations === true) {
      setAutoHeight(autoHeight - 20 * x);
    }
    setShowViolation(false);
    setEnteredName(event.target.value);
    const regNamePersian = /^[\u0600-\u06FF\s]+$/;
    const regNameEnglish = /^[a-zA-Z\s]+$/;
    // event.target.value.length < 5 || event.target.value.length > 30
    if (
      regNamePersian.test(event.target.value) ||
      regNameEnglish.test(event.target.value)
    ) {
      if (event.target.value.length > 4 && event.target.value.length < 31) {
        setNameValidation(true);
      } else {
        setNameValidation(false);
      }
    } else {
      setNameValidation(false);
    }
  };

  return (
    <form className="signin">
      <ToastContainer
        closeOnClick
        className="toastify-container"
        position="top-right"
        toastStyle={{
          backgroundColor: "#2b2c38",
          fontFamily: "iransansweb",
          color: "#ffeba7",
        }}
        pauseOnHover={false}
        autoClose={3000}
      />
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <div
                  className="card-3d-wrap mx-auto "
                  style={{ height: autoHeight.toString() + "px" }}
                >
                  <div className="card-back">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-3 pb-3">عضویت در کنسرتیفای</h4>
                        <div
                          className={`form-group mt-2 ${
                            !registerUserNameValidation && showViolations
                              ? "invalid"
                              : ""
                          }`}
                        >
                          <input
                            dir="rtl"
                            type="text"
                            className="form-style"
                            placeholder="نام کاربری"
                            value={enteredRegisterUserName}
                            onChange={registerUserNameHandler}
                          />
                          <i className="input-icon uil uil-user"></i>
                        </div>
                        {!registerUserNameValidation && showViolations && (
                          <p className="mb-0 mt-2 validationMsg">
                            {registerUserNameValidationMsg}
                          </p>
                        )}

                        <div
                          className={`form-group mt-2 ${
                            !nameValidation && showViolations ? "invalid" : ""
                          }`}
                        >
                          <input
                            dir="rtl"
                            type="text"
                            className="form-style"
                            placeholder="نام و نام خانوادگی"
                            value={enteredName}
                            onChange={nameHandler}
                          />
                          <i className="input-icon uil uil-user"></i>
                        </div>
                        {!nameValidation && showViolations && (
                          <p className="mb-0 mt-2 validationMsg">
                            نام و نام خانوادگی باید بین 5 تا 30 کاراکتر فارسی و
                            یا انگلیسی باشد
                          </p>
                        )}
                        <div
                          className={`form-group mt-2 ${
                            !registerEmailValidation && showViolations
                              ? "invalid"
                              : ""
                          }`}
                        >
                          <input
                            dir="rtl"
                            type="email"
                            className="form-style"
                            placeholder="ایمیل"
                            autoComplete="on"
                            value={enteredRegisterEmail}
                            onChange={registerEmailHandler}
                          />
                          <i className="input-icon uil uil-at"></i>
                        </div>
                        {!registerEmailValidation && showViolations && (
                          <p className="mb-0 mt-2 validationMsg">
                            {registerEmailValidationMsg}
                          </p>
                        )}
                        <div
                          className={`form-group mt-2 ${
                            !registerPasswordValidation && showViolations
                              ? "invalid"
                              : ""
                          }`}
                        >
                          <i
                            className={
                              showRegisterPassword
                                ? "bi bi-eye"
                                : "bi bi-eye-slash"
                            }
                            onClick={toggleRegisterPasswordVisibility}
                            style={{
                              fontSize: "20px",
                              position: "absolute",
                              top: "55%",
                              transform: "translateY(-50%)",
                              paddingLeft: "10px",
                            }}
                          ></i>
                          <input
                            dir="rtl"
                            type={showRegisterPassword ? "text" : "password"}
                            className="form-style"
                            placeholder="رمز عبور"
                            autoComplete="on"
                            value={enteredRegisterPassword}
                            onChange={registerPasswordHandler}
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        {!registerPasswordValidation && showViolations && (
                          <p className="mb-0 mt-2 validationMsg">
                            {registerPasswordValidationMsg}
                          </p>
                        )}
                        <div
                          className={`form-group mt-2 ${
                            !registerPasswordValidation2 && showViolations
                              ? "invalid"
                              : ""
                          }`}
                        >
                          <i
                            className={
                              showRegisterPassword2
                                ? "bi bi-eye"
                                : "bi bi-eye-slash"
                            }
                            onClick={toggleRegisterPasswordVisibility2}
                            style={{
                              fontSize: "20px",
                              position: "absolute",
                              top: "55%",
                              transform: "translateY(-50%)",
                              paddingLeft: "10px",
                            }}
                          ></i>
                          <input
                            dir="rtl"
                            type={showRegisterPassword2 ? "text" : "password"}
                            className="form-style"
                            placeholder="تایید رمز عبور"
                            autoComplete="on"
                            value={enteredRegisterPassword2}
                            onChange={registerPasswordHandler2}
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        {!registerPasswordValidation2 && showViolations && (
                          <p className="mb-0 mt-2 validationMsg">
                            {registerPasswordValidationMsg2}
                          </p>
                        )}
                        {/* <div className="form-group mt-2">
                              <input
                                dir="rtl"
                                type="text"
                                className="form-style"
                                placeholder="تاریخ تولد"
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => (e.target.type = "text")}
                                // value={enteredBirthDate}
                                // onChange={birthDateHandler}
                              />
                              <i className="input-icon uil uil-calendar-alt"></i>
                            </div> */}
                        <button
                          type="submit"
                          className="btn mt-4"
                          onClick={(e) => registerHandler(e)}
                        >
                          عضویت در کنسرتیفای
                        </button>
                        <p className="message">
                          قبلا عضو شده‌اید؟ <a href="/login">ورود کاربران</a>
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
};

export default Register;
