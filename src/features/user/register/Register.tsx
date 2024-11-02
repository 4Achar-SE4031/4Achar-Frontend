import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../Authentication/authProvider";
import "./Register.css"
import agent from "../../../app/api/agent";

// Define validation schema using Yup
const validationSchema = Yup.object({
  username: Yup.string()
    .matches(/^[a-zA-Z][a-zA-Z0-9._]{2,29}$/, "نام کاربری شامل 3 تا 30 کاراکتر است و باید با حروف انگلیسی شروع شود")
    .required("نام کاربری الزامی است"),
  first_name: Yup.string()
    .matches(/^[\u0600-\u06FF\s]+$|^[a-zA-Z\s]+$/, "نام باید شامل حروف فارسی یا انگلیسی باشد")
    .min(5, "نام و نام خانوادگی باید حداقل 5 کاراکتر باشد")
    .max(30, "نام و نام خانوادگی باید حداکثر 30 کاراکتر باشد")
    .required("نام و نام خانوادگی الزامی است"),
  email: Yup.string()
    .email("فرمت ایمیل نادرست است")
    .required("ایمیل الزامی است"),
  password: Yup.string()
    .min(8, "رمزعبور حداقل باید شامل 8 کاراکتر باشد")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-+_!@#$%^&*., ?]).+$/, "رمزعبور باید شامل حروف کوچک و بزرگ، اعداد و نشانه‌های خاص باشد")
    .required("رمزعبور الزامی است"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "رمزعبور و تکرار آن باید یکسان باشند")
    .required("تکرار رمزعبور الزامی است")
});

const Register: React.FC = () => {
  const navigator = useNavigate();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { username, first_name, email, password } = values;
      const userData = { username, first_name, email, password };

      try {
        await  agent.Account.register(userData);
        toast.success("!با موفقیت حساب کاربری خود را ساختید");
        setTimeout(() => {
          navigator('/home');
        }, 4000);
      } catch (error) {
        toast.error("خطا در برقراری ارتباط با سرور");
      }
    },
  });

  return (
    <form className="signin" onSubmit={formik.handleSubmit} lang="fa">
      <ToastContainer
        closeOnClick
        className="toastify-container"
        position="top-right"
        toastStyle={{ backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7" }}
        pauseOnHover={false}
        autoClose={3000}
      />

      <div className="section text-center">
        <h4 className="mb-3 pb-3">عضویت در کنسرتیفای</h4>
        
        {/* Username Field */}
        <div className={`form-group mt-2 ${formik.touched.username && formik.errors.username ? "invalid" : ""}`}>
          <input
            type="text"
            className="form-style"
            placeholder="نام کاربری"
            {...formik.getFieldProps("username")}
          />
          <i className="input-icon uil uil-user"></i>
          {formik.touched.username && formik.errors.username && <p className="validationMsg">{formik.errors.username}</p>}
        </div>

        {/* Full Name Field */}
        <div className={`form-group mt-2 ${formik.touched.first_name && formik.errors.first_name ? "invalid" : ""}`}>
          <input
            type="text"
            className="form-style"
            placeholder="نام و نام خانوادگی"
            {...formik.getFieldProps("first_name")}
          />
          <i className="input-icon uil uil-user"></i>
          {formik.touched.first_name && formik.errors.first_name && <p className="validationMsg">{formik.errors.first_name}</p>}
        </div>

        {/* Email Field */}
        <div className={`form-group mt-2 ${formik.touched.email && formik.errors.email ? "invalid" : ""}`}>
          <input
            type="email"
            className="form-style"
            placeholder="ایمیل"
            {...formik.getFieldProps("email")}
          />
          <i className="input-icon uil uil-at"></i>
          {formik.touched.email && formik.errors.email && <p className="validationMsg">{formik.errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className={`form-group mt-2 ${formik.touched.password && formik.errors.password ? "invalid" : ""}`}>
          <input
            type="password"
            className="form-style"
            placeholder="رمز عبور"
            {...formik.getFieldProps("password")}
          />
          <i className="input-icon uil uil-lock-alt"></i>
          {formik.touched.password && formik.errors.password && <p className="validationMsg">{formik.errors.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className={`form-group mt-2 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "invalid" : ""}`}>
          <input
            type="password"
            className="form-style"
            placeholder="تکرار رمز عبور"
            {...formik.getFieldProps("confirmPassword")}
          />
          <i className="input-icon uil uil-lock-alt"></i>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="validationMsg">{formik.errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="btn mt-4">عضویت</button>
      </div>
    </form>
  );
};

export default Register;
