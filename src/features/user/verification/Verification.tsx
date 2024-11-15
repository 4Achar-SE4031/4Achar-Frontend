import React, { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import 'react-toastify/dist/ReactToastify.css';
import agent from "../../../app/api/agent";

const Verification: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "تأیید ایمیل";
    }, []);


    
    const formik = useFormik({
        initialValues: { verificationCode: "" },
        validationSchema: Yup.object({
            verificationCode: Yup.string()
                .matches(/^[0-9]+$/, "فقط اعداد مجاز هستند")
                .length(6, "کد باید ۶ رقم باشد")
                .required("لطفاً کد تأیید را وارد کنید"),
        }),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                const response = await agent.Account.verify(values.verificationCode); // Pass verification code directly
                if (response) {
                    toast.success("ایمیل شما با موفقیت تأیید شد!");
                    setTimeout(() => {
                        navigate("/home");
                    }, 4000);
                } else {
                    formik.setFieldError("verificationCode", "کد نامعتبر است یا منقضی شده است");
                }
            } catch (error) {
                console.error("خطا در ارسال داده:", error);
                toast.error("خطا در ارتباط با سرور، دوباره تلاش کنید");
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="signin" lang="fa">
            <ToastContainer
                closeOnClick
                className="toastify-container"
                position="top-right"
                toastStyle={{ backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7" }}
                pauseOnHover={false}
                autoClose={3000}
            />
            <div className="section">
                <div className="container">
                    <div className="row full-height justify-content-center">
                        <div className="col-12 text-center align-self-center py-5">
                            <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                <div className="card-3d-wrap mx-auto" style={{ height: "310px" }}>
                                    <div className="card-front">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mb-4 pb-3">تأیید ایمیل</h4>
                                                <div className="form-group mt-2">
                                                    <input
                                                        dir="rtl"
                                                        type="tel"
                                                        className="form-style"
                                                        placeholder="کد تأیید"
                                                        maxLength={6} 
                                                        {...formik.getFieldProps("verificationCode")}
                                                    />
                                                    <i className="input-icon uil uil-lock-alt"></i>
                                                </div>
                                                {formik.touched.verificationCode && formik.errors.verificationCode ? (
                                                    <p className="mb-0 mt-2 validationMsg">{formik.errors.verificationCode}</p>
                                                ) : null}
                                                <p className="mb-0 mt-2">
                                                    <a className="link cancel" href="/register">بازگشت</a>
                                                </p>
                                                <br />
                                                <button type="submit" className="btn mt-2">
                                                    تأیید کد
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

export default Verification;
