import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';
// import CityList from '../CreateEvent/cityList';
import { useFormik } from 'formik';
// import { userInfoValidation } from './UserInfoValidation';
import { useAuth } from '../Authentication/authProvider';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateUser, User } from '../../../app/models/user';
import agent from '../../../app/api/agent';
import ChangePassword from './ChangePassword';
import { userInfoValidation } from './UserInfoValidation';
import Footer from '../../../app/layout/Footer';

const UserInfo: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [dateValue, setDateValue] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true');

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await agent.Account.current();
        setUserData(response);
        setSelectedGender(response.gender || '');
        setDateValue(response.birthDate || '');
        setSelectedProvince(response.province || '');
        setSelectedCity(response.city || '');
        setImagePreviewUrl(response.profilePictureUrl || imagePreviewUrl);
        formik.setValues({
          userName: response.userName || '',
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          email: response.email || ''
        });
        console.log(response)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      userName: userData?.userName || '',
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || ''
    },
    validateOnChange: true, 
    validateOnBlur: true,   
    validationSchema: userInfoValidation,
    onSubmit: async (values) => {
      try {
        // const formData = new FormData();
        // formData.append('username', values.username);
        // formData.append('gender', selectedGender);
        // formData.append('city', selectedCity);
        // formData.append('province', selectedProvince);
        // formData.append('birth_date', dateValue);
        // if (file) formData.append('profile_picture', file);
        const data: UpdateUser = {
          userName: values.userName,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email
        }
        await agent.Account.updateUser(data);
        toast.success('پروفایل با موفقیت به‌روز شد');
        // setTimeout(() => navigate('/home'), 3000);
      } catch (error) {
        toast.error('خطا در به‌روزرسانی پروفایل');
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const reader = new FileReader();
      const selectedFile = e.target.files[0];
      reader.onloadend = () => {
        setFile(selectedFile);
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <center>
      {/* <Navbar /> */}
      {/* <ProfileSidebar /> */}
      <div className="user-info" lang="fa">
        <form className="userinfo" onSubmit={formik.handleSubmit}>
          <div className="container">
            <div className="row">
              <div className="section">
                <div className="card-3d-wrap-ce">
                  <div className="card-back ">
                    <div className="center-wrap">
                      <div className="section">
                        <div className="userinfo__title">
                          <h2 className="mb-4 pb-3">مشخصات فردی</h2>
                          <h4>
                            در این قسمت می‌توانید مشخصات فردی خود را مشاهده و
                            تغییر دهید
                          </h4>
                        </div>
                        <div className="userinfo__content">
                          <div className="row">
                            <div className="column   col-md-12 col-lg-7 mb-lg-5">
                              <div className="userinfo__content__username">
                                <div className="col-10 text-right ">
                                  <label>تغییر نام کاربری</label>
                                  <div className={`form-group mt-1`}>
                                    <input
                                      id="username"
                                      type="text"
                                      {...formik.getFieldProps('userName')}
                                      className={formik.touched.userName && formik.errors.userName ? 'input-error' : ''}
                                    />
                                    {formik.touched.userName && formik.errors.userName ? (
                                      <div className="error">{formik.errors.userName}</div>
                                    ) : null}
                                  <i className="input-icon uil uil-user"></i>
                                  </div>
                                </div>
                              </div>
                              {/* Firstname */}
                              <div className="userinfo__content__firstname mt-3">
                                <div className="col-10 text-right">
                                  <label>تغییر نام</label>
                                  <div className={`form-group mt-1`}>
                                    <input
                                      id="firstname"
                                      type="text"
                                      {...formik.getFieldProps('firstName')}
                                      className={formik.touched.firstName && formik.errors.firstName ? 'input-error' : ''}
                                    />
                                    {formik.touched.firstName && formik.errors.firstName ? (
                                      <div className="error">{formik.errors.firstName}</div>
                                    ) : null}
                                    <i className="input-icon uil uil-user"></i>
                                  </div>
                                </div>
                              </div>
                              {/* <div className="userinfo__content__gender">
                                <div className="col-10 text-right">
                                  <label>جنسیت</label>
                                  <div className={`form-group mt-1`}>
                                    <select
                                      {...formik.getFieldProps('gender')}
                                      className="form-control"
                                    >
                                      <option value="">انتخاب کنید</option>
                                      <option value="M">مرد</option>
                                      <option value="F">زن</option>
                                      <option value="X">ترجیح می‌دهم نگویم</option>
                                    </select>
                                  </div>
                                </div>
                              </div> */}
                              {/* <div className="userinfo__content__birthdate">
                                <div className="col-10 text-right">
                                  <label>تاریخ تولد</label>
                                  <div className={`form-group mt-1`}>
                                    <DatePicker
                                      calendar={persian}
                                      locale={persian_fa}
                                      // value={formik}
                                      onChange={(value) => {
                                        formik.setFieldValue('birthDate', value);
                                      }}
                                    />
                                  <i className="input-icon uil uil-calendar-alt"></i>
                                  </div>
                                </div>
                              </div> */}

                               {/* Lastname */}
                               <div className="userinfo__content__lastname mt-3">
                                <div className="col-10 text-right">
                                  <label>تغییر نام خانوادگی</label>
                                  <div className={`form-group mt-1`}>
                                    <input
                                      id="lastname"
                                      type="text"
                                      {...formik.getFieldProps('lastName')}
                                      className={formik.touched.lastName && formik.errors.lastName ? 'input-error' : ''}
                                    />
                                    {formik.touched.lastName && formik.errors.lastName ? (
                                      <div className="error">{formik.errors.lastName}</div>
                                    ) : null}
                                    <i className="input-icon uil uil-user"></i>
                                  </div>
                                </div>
                              </div>

                              {/* Email */}
                              <div className="userinfo__content__email mt-3">
                                <div className="col-10 text-right">
                                  <label>تغییر ایمیل</label>
                                  <div className={`form-group mt-1 `}>
                                    <input
                                      id="email"
                                      type="email"
                                      {...formik.getFieldProps('email')}
                                      className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                      <div className="error">{formik.errors.email}</div>
                                    ) : null}
                                    <i className="input-icon uil-envelope"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          
                          {/* <div className="column col-md-8 pull-left col-lg-5">
                            <div className="userinfo__content__profile">
                              <div className="custom-file-upload">
                                <input type="file" onChange={handleFileChange} />
                                {imagePreviewUrl && (<div className="img-wrap img-upload">
                                  <img className="" src={imagePreviewUrl} alt="Profile" />
                                </div>)}
                              </div>
                            </div>
                          </div> */}
                          </div>
                          {/* <div className="userinfo__content__city">
                            <div className="col-lg-10 col-md-10 text-right">
                              <div className="text-right mt-2">
                                <CityList
                              selectedProvince={selectedProvince}
                              setSelectedProvince={setSelectedProvince}
                              selectedCity={selectedCity}
                              setSelectedCity={setSelectedCity}
                            />
                              </div>
                            </div>
                          </div> */}
                          <br></br>
                          <br></br>

                          <button type="submit">ذخیره تغییرات</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <ChangePassword />
      <Footer />
      </div>
    </center>
  );
};

export default UserInfo;
