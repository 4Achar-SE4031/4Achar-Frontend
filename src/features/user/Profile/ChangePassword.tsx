import { useState } from "react";
import { useFormik } from "formik";
import { changePasswordValidation } from "./UserInfoValidation";
import agent from "../../../app/api/agent";
import { toast } from "react-toastify";
const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const togglePasswordVisibility3 = () => {
    setShowPassword3(!showPassword3);
  };

  const InitialValues = {
    password: "",
    newPassword: "",
    confirmPassword: "",
  };
  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: InitialValues,
    validationSchema: changePasswordValidation,
    onSubmit: async (values) => {
      try {


        const data = {
          oldPassword: values.password,
          newPassword: values.newPassword,
        }
        await agent.Account.updatePassword(data)
        toast.success('رمز عبور با موفقیت تغییر یافت');
      }
      catch (error) {

        toast.error('خطا در تغییر رمز عبور');
      }


    },
  });
  return (
    <form className="change-password" onSubmit={handleSubmit}>
      <div className="container pb-5">
        <div className="row">
          <div className="section pb-5">
            <div className="card-3d-wrap-ce" style={{ height: "650px" }}>
              <div className="card-back ">
                <div className="center-wrap">
                  <div className="section">
                    <div className="change-password__title">
                      <h2 className="mb-4 pb-3">فرم تغییر رمز عبور</h2>
                    </div>
                    <div className="change-password__content">
                      <div className="change-password__content-current">
                        <div className="col-lg-6 col-sm-10 text-right">
                          <label htmlFor="password">رمز عبور فعلی</label>
                          <div className={`form-group mt-1`}>
                            <input
                              id="password"
                              className={errors.password ? "input-error password" : "password"}
                              dir="ltr"
                              type={showPassword ? "text" : "password"}
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="password"
                            />
                            <i
                              className={
                                showPassword ? "bi bi-eye" : "bi bi-eye-slash"
                              }
                              onClick={togglePasswordVisibility}
                              style={{
                                fontSize: "20px",
                                position: "absolute",
                                top: "55%",
                                left: "18%",
                                transform: "translateY(-50%)",
                                marginLeft: "20px",
                              }}
                            ></i>
                            {errors.password && (
                              <p className="error">{errors.password}</p>
                            )}
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                        </div>
                      </div>
                      <div className="change-password__content-new">
                        <div className="col-lg-6 col-sm-10 text-right">
                          <label htmlFor="newPassword">رمز عبور جدید</label>
                          <div className={`form-group mt-1`}>
                            <input
                              id="newPassword"
                              className={
                                errors.newPassword ? "input-error newPassword" : "newPassword"
                              }
                              dir="ltr"
                              type={showPassword2 ? "text" : "password"}
                              value={values.newPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="newPassword"
                            />
                            <i
                              className={
                                showPassword2 ? "bi bi-eye" : "bi bi-eye-slash"
                              }
                              onClick={togglePasswordVisibility2}
                              style={{
                                fontSize: "20px",
                                position: "absolute",
                                top: "55%",
                                left: "18%",
                                transform: "translateY(-50%)",
                                marginLeft: "20px",
                              }}
                            ></i>
                            {errors.newPassword && (
                              <p className="error">{errors.newPassword}</p>
                            )}
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                        </div>
                      </div>
                      <div className="change-password__content-confirm">
                        <div className="col-lg-6 col-sm-10 text-right">
                          <label htmlFor="confirmPassword">تکرار رمز عبور جدید</label>
                          <div className={`form-group mt-1`}>
                            <input
                              id="confirmPassword"
                              className={
                                errors.confirmPassword ? "input-error confirmPassword" : "confirmPassword"
                              }
                              dir="ltr"
                              type={showPassword3 ? "text" : "password"}
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="confirmPassword"
                            />
                            <i
                              className={
                                showPassword3 ? "bi bi-eye" : "bi bi-eye-slash"
                              }
                              onClick={togglePasswordVisibility3}
                              style={{
                                fontSize: "20px",
                                position: "absolute",
                                top: "55%",
                                left: "18%",
                                transform: "translateY(-50%)",
                                marginLeft: "20px",
                              }}
                            ></i>
                            {errors.confirmPassword && (
                              <p className="error">{errors.confirmPassword}</p>
                            )}
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                        </div>
                      </div>

                    </div>
                    <button disabled={isSubmitting} type="submit">
                      تغییر رمز عبور
                    </button>
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
export default ChangePassword;
