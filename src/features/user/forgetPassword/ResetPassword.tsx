import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./ForgetPassword.css";

import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../Authentication/authProvider";

interface UserData {
    userEmail:string;
    newPassword: string;
    confirmNewPassword:string;
  passwordResetToken:string;
}
let x = 0;
const ResetPassword: React.FC = () => {
  const navigator = useNavigate();
  const auth = useAuth();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token: string = queryParams.get("PasswordResetToken") || "NoTokenProvided";
 
  const [enteredRegisterPassword, setEnteredRegisterPassword] = useState<string>("");
  const [enteredRegisterPassword2, setEnteredRegisterPassword2] = useState<string>("");

  const [autoHeight, setAutoHeight] = useState<number>(310);

  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);
  const [showRegisterPassword2, setShowRegisterPassword2] = useState<boolean>(false);

  const [showViolations, setShowViolation] = useState<boolean>(false);

  const [registerPasswordValidation, setRegisterPasswordValidation] = useState<boolean>(false);
  const [registerPasswordValidationMsg, setRegisterPasswordValidationMsg] = useState<string>(
    "رمزعبور حداقل باید شامل 8 کاراکتر باشد"
  );

  const [registerPasswordValidation2, setRegisterPasswordValidation2] = useState<boolean>(false);
  const [registerPasswordValidationMsg2, setRegisterPasswordValidationMsg2] = useState<string>(
    "رمز عبور حداقل باید شامل 8 کاراکتر باشد"
  );

  useEffect(() => {
    document.title = "تغییر رمزعبور";
  }, []);

  const replaceSpacesWithPlus = (input: string): string => {
    return input.replace(/ /g, "+");
  };
  
  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword((prev) => !prev);
  };

  const toggleRegisterPasswordVisibility2 = () => {
    setShowRegisterPassword2((prev) => !prev);
  };



  const registerHandler = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    x = 0;
    if (!registerPasswordValidation) x++;
    if (!registerPasswordValidation2) x++;

    if (!showViolations && x > 0) {
      setAutoHeight((prev) => prev + x * 20);
    }
    setShowViolation(true);

    const userData: UserData = {
      userEmail:"aaghz1381@gmail.com",
      newPassword: enteredRegisterPassword,
      confirmNewPassword : enteredRegisterPassword2,
      passwordResetToken:replaceSpacesWithPlus(token),
    };
"System.Exception: Failed to reset password!\n   at Concertify.Application.Services.AccountService.ResetPasswordAsync(UserPasswordResetDto passwordResetDto) in /src/Concertify.Application/Services/AccountService.cs:line 198\n   at Concertify.API.Controllers.AccountController.ResetPasswordAsync(UserPasswordResetDto passwordResetDto) in /src/Concertify.API/Controllers/AccountController.cs:line 157\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.TaskOfIActionResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeInnerFilterAsync>g__Awaited|13_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)\n   at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)\n   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)\n   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)\n\nHEADERS\n=======\nAccept: application/json\nConnection: keep-alive\nHost: localhost:5000\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36\nAccept-Encoding: gzip, deflate, br, zstd\nAccept-Language: en-US,en;q=0.9,fa;q=0.8\nContent-Type: application/json\nOrigin: http://localhost:3000\nReferer: http://localhost:3000/\nContent-Length: 358\nsec-ch-ua-platform: \"Windows\"\nsec-ch-ua: \"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"\nsec-ch-ua-mobile: ?0\nSec-Fetch-Site: same-site\nSec-Fetch-Mode: cors\nSec-Fetch-Dest: empty\n"

    console.log("UserData")
    console.log(userData)
    if (
      registerPasswordValidation &&
      registerPasswordValidation2 
      
    ) {
      axios
        .post("http://localhost:5000/Account/reset_password", userData,{headers:{
            "Content-Type": "application/json",
            accept: "application/json",
        }})
        .then(() => {
          setShowViolation(false);
          toast.success("رمزعبور با موفقیت بازیابی شد");
          setTimeout(() => {
            navigator("/login")
          }, 4000);
        })
        .catch((error) => {
            console.log(error)
          try {
            const errorMsg = error.response.request.responseText
            console.log(errorMsg)
            console.log("**************")
            if (errorMsg.includes("Username")) {
              toast.error("نام کاربری تکراری است");
            } else {
              toast.error("توکن معتبر نمی باشد");
            }
          } catch {
            toast.error("خطا در برقراری ارتباط با سرور");
          }
        });
    }
  };

  



  

  const registerPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (showViolations === true) {
      setAutoHeight(autoHeight - 20 * x);
    }
    setShowViolation(false)
    setEnteredRegisterPassword(event.target.value);
    if (event.target.value.length < 8) {
      setRegisterPasswordValidation(false);
      setRegisterPasswordValidationMsg("رمزعبور حداقل باید شامل 8 کاراکتر باشد");
    } else {
      let pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)" + "(?=.*[-+_!@#$%^&*., ?]).+$");
      if (!pattern.test(event.target.value)) {
        setRegisterPasswordValidationMsg("رمزعبور باید شامل حروف کوچک و بزرگ انگلیسی،اعداد و نشانه های خاص باشد")
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
    setShowViolation(false)
    setEnteredRegisterPassword2(event.target.value);
    if (event.target.value !== enteredRegisterPassword) {
        console.log("--------------------------------")
        console.log(enteredRegisterPassword)
        console.log(event.target.value)
      setRegisterPasswordValidation2(false);
      setRegisterPasswordValidationMsg2("رمزعبور و تکرار آن باید یکسان باشند");
    } else {
      if (event.target.value.length < 8) {
        setRegisterPasswordValidation2(false);
        setRegisterPasswordValidationMsg2("رمزعبور حداقل باید شامل 8 کاراکتر باشد");
      } else {
        let pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)" + "(?=.*[-+_!@#$%^&*., ?]).+$");
        if (!pattern.test(event.target.value)) {
          setRegisterPasswordValidationMsg2("رمزعبور باید شامل حروف کوچک و بزرگ انگلیسی،اعداد و نشانه های خاص باشد");
          setRegisterPasswordValidation2(false);
        } else {
          setRegisterPasswordValidation2(true);
        }

      }
    }

  };




  return (
    <form className="signin">
      <ToastContainer closeOnClick  className="toastify-container" position="top-right" toastStyle={{ backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7" }} pauseOnHover={false} autoClose={3000} />
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <div className="card-3d-wrap mx-auto " style={{ height: autoHeight.toString() + "px" }}>

                  <div className="card-back">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-3 pb-3"> تغییر رمز عبور </h4>
                        <div className={`form-group mt-2 ${!registerPasswordValidation && showViolations ? "invalid" : ""}`}>
                          <i className={showRegisterPassword ? "bi bi-eye" : "bi bi-eye-slash"} onClick={toggleRegisterPasswordVisibility} style={{ fontSize: "20px", position: "absolute", top: "55%", transform: "translateY(-50%)", paddingLeft: "10px" }}></i>
                          <input
                            dir="rtl"
                            type={showRegisterPassword ? "text" : "password"}
                            className="form-style"
                            placeholder="رمز‌ عبور جدید"
                            autoComplete="on"
                            value={enteredRegisterPassword}
                            onChange={registerPasswordHandler}
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        {!registerPasswordValidation && showViolations && (<p className="mb-0 mt-2 validationMsg">{registerPasswordValidationMsg}</p>)}
                        <div className={`form-group mt-2 ${!registerPasswordValidation2 && showViolations ? "invalid" : ""}`}>
                          <i className={showRegisterPassword2 ? "bi bi-eye" : "bi bi-eye-slash"} onClick={toggleRegisterPasswordVisibility2} style={{ fontSize: "20px", position: "absolute", top: "55%", transform: "translateY(-50%)", paddingLeft: "10px" }}></i>
                          <input
                            dir="rtl"
                            type={showRegisterPassword2 ? "text" : "password"}
                            className="form-style"
                            placeholder="تکرار رمز عبور جدید"
                            autoComplete="on"
                            value={enteredRegisterPassword2}
                            onChange={registerPasswordHandler2}
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        {!registerPasswordValidation2 && showViolations && (<p className="mb-0 mt-2 validationMsg">{registerPasswordValidationMsg2}</p>)}
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
                            تایید
                        </button>
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

export default ResetPassword;
