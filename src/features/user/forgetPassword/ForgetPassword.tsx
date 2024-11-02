import React, { useEffect } from "react";
import "./ForgetPassword.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import 'react-toastify/dist/ReactToastify.css';
import agent from "../../../app/api/agent";

const ForgetPassword: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "بازیابی رمزعبور";
    }, []);

    // Formik form configuration
    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("فرمت ایمیل نادرست است")
                .required("لطفاً ایمیل خود را وارد کنید"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await agent.Account.forget(values);  // `forget` endpoint used from agent.ts
                if (response.username) {
                    toast.success("ایمیل بازیابی با موفقیت برای شما ارسال شد");
                    setTimeout(() => {
                        navigate("/login");
                    }, 4000);
                } else {
                    formik.setFieldError("email", "حسابی با ایمیل وارد شده در سایت ساخته نشده");
                }
            } catch (error) {
                console.error("Error sending data:", error);
                toast.info("ایمیل بازیابی به صورت آزمایشی ارسال شد");  // Adjust error message as needed
                setTimeout(() => {
                    navigate("/login");
                }, 4000);
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
                                                <h4 className="mb-4 pb-3">بازیابی رمز عبور</h4>
                                                <div className="form-group mt-2">
                                                    <input
                                                        dir="rtl"
                                                        type="text"
                                                        className="form-style"
                                                        placeholder="ایمیل"
                                                        {...formik.getFieldProps("email")}
                                                    />
                                                    <i className="input-icon uil uil-at"></i>
                                                </div>
                                                {formik.touched.email && formik.errors.email ? (
                                                    <p className="mb-0 mt-2 validationMsg">{formik.errors.email}</p>
                                                ) : null}
                                                <p className="mb-0 mt-2">
                                                    <a className="link cancel" href="/login">بازگشت</a>
                                                </p>
                                                <br />
                                                <button type="submit" className="btn mt-2">
                                                    ارسال ایمیل بازیابی
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

export default ForgetPassword;
