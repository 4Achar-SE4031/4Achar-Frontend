import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import copy from 'clipboard-copy';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import PageNotFound from "./PageNotFound/PageNotFound";
// import Navbar from "../Navbar/navbar";
// import './eventdetails.css'; ----------------------------------------------------------------
import './eventdetails_old.css';
// import OrganizerInfoModal from "./organizer-contact-info";
// import MainComment from "./Comment/MainComment";
import moment from 'moment-jalaali';
import animationData from "./Animation - 1715854965467.json";
import Lottie from "react-lottie";
import MapComponent from "./MapComponent/MapComponent";
import { useAuth } from "../Authentication/authProvider";

interface EventDateTime {
  startWeekDay: string;
  startMonth: string;
  startTime: string;
  startYear: string;
  startDay: string;
  endWeekDay: string;
  endMonth: string;
  endTime: string;
  endYear: string;
  endDay: string;
}

interface EventDetails {
  eventTitle: string;
  ticket_price: number;
  attendance: string;
  onlineevent: { url: string };
  province: string;
  city: string;
  photo: string;
  category: string;
  organizer_photo: string;
  organizer_name: string;
  organizer_phone: string;
  organizer_email: string;
  description: string;
  tags: string[];
  starts?: string;
  ends?: string;
  inpersonevent?: {
    province: string;
    city: string;
    address: string;
    location_lat: number;
    location_lon: number;
  };
  is_paid?: boolean;
  enrolled?: boolean;
  creator_id?: number;
  bookmarked?: boolean;
  title?: string;
}

// change
const OpenTabButton = () => {
    const openNewTab = () => {
      // URL to open in the new tab
      const url = 'https://www.iranconcert.com/concert/16472/';
      
      // Open the URL in a new tab
      window.open(url, '_blank');
    };
}


const EventDetails: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [canPurchase, setCanPurchase] = useState<boolean>(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const currentUrl = window.location.href;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    clickToPause: true,
    animationData: animationData,
  };
  const navigator = useNavigate();
  let { id } = useParams<{ id: string }>();
  const monthDict: { [key: number]: string } = {
    0: "فروردین",
    1: "اردیبهشت",
    2: "خرداد",
    3: "تیر",
    4: "مرداد",
    5: "شهریور",
    6: "مهر",
    7: "آبان",
    8: "آذر",
    9: "دی",
    10: "بهمن",
    11: "اسفند",
  };
  const dayDict: { [key: string]: string } = {
    Monday: "دوشنبه",
    Tuesday: "سه شنبه",
    Wednesday: "چهارشنبه",
    Thursday: "پنج شنبه",
    Friday: "جمعه",
    Saturday: "شنبه",
    Sunday: "یک شنبه",
  };
  const [eventDateTime, setEventDateTime] = useState<EventDateTime>({
    startWeekDay: "",
    startMonth: "",
    startTime: "",
    startYear: "",
    startDay: "",
    endWeekDay: "",
    endMonth: "",
    endTime: "",
    endYear: "",
    endDay: "",
  });
//   const [eventDetails, setEventDetails] = useState<EventDetails>({
//     eventTitle: "",
//     ticket_price: 0,
//     attendance: "O",
//     onlineevent: { url: "" },
//     province: "",
//     city: "",
//     photo: "",
//     category: "",
//     organizer_photo: "",
//     organizer_name: "",
//     organizer_phone: "09123456789",
//     organizer_email: "organizer@gmail.com",
//     description: "",
//     tags: [],
//   });


  const [eventDetails, setEventDetails] = useState({
    startDay:"پنج شنبه",
    startDate:[1403,"آبان",30],
    startTime:[21,30],
    endDay:"جمعه",
    endDate:[1403,"آذر",7],
    endTime:[21,30],
    eventName:"کنسرت ارکستر سمفونیک قاف (منظومه سیمرغ) (تمدید شد)",
    price:600000,
    // type:"آنلاین",
    category:"ارکستر سمفونی",
    organizerPhoto:"./img.webp",
    organizerName:"فرهاد فخر الدینی",
    organizerPhone:"09123456789",
    organizerEmail:"organizer@gmail.com",
    description:`
        رعایت شئونات اسلامی در تالار وحدت الزامی می باشد.

        کنسرت  قاف (منظومه سیمرغ)
        به رهبری فرهاد فخرالدینی و آرش امینی
        خوانندگان:
        مهدی محمدی 
        علی تفرشی
        سولیست ویلن:
        امین غفاری

        با همکاری :
        ارکستر سمفونیک تهران

        تهیه کننده: حبیب صبور
        با حمایت: شرکت کرمان موتور


    `,
    tags:["هوش مصنوعی","پایتون","دیتاماینینگ","پردازش تصویر","LLM مدل زبانی بزرگ"]
  })



// change
//   const [loading, setLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isBookmarked, setBookmark] = useState<boolean>(false);
  let userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const auth = useAuth();

  const bookmarkToggler = async () => {
    if (auth.token !== "") {
      try {
        const response = await axios.post(
          `https://eventify.liara.run/events/${id}/bookmark/`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `JWT ${auth.token}`,
            },
          }
        );
        if (isBookmarked === false) {
          setBookmark(true);
          toast.success('رویداد به علاقه مندی ها اضافه شد ');
        } else {
          setBookmark(false);
          toast.error('رویداد از علاقه مندی ها حذف شد ');
        }
      } catch (error) {}
    } else {
      // Handle unauthenticated state
    }
  };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (auth.token !== "") {
//           const response = await axios.get(
//             `https://eventify.liara.run/events/${id}`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 accept: "application/json",
//                 Authorization: `JWT ${auth.token}`,
//               },
//             }
//           );
//           setEventDetails(response.data);
//           setBookmark(response.data.bookmarked);
//         } else {
//           const response = await axios.get(
//             `https://eventify.liara.run/events/${id}`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 accept: "application/json",
//               },
//             }
//           );
//           setEventDetails(response.data);
//         }
//       } catch (error: any) {
//         if (error.response && error.response.status === 401) {
//           auth.logOut();
//         } else {
//         }
//         setError(true);
//         setTimeout(() => {
//           setLoading(false);
//         }, 1000);
//       } finally {
//         // setLoading(false);
//       }
//     };
//     fetchData();
//     document.documentElement.style.overflowY = 'hidden';
//     document.title = "جزئیات رویداد";
//     let width = window.innerWidth;
//     if (width < 576) {
//       setScreenSize('extra small');
//     } else if (width >= 576 && width < 768) {
//       setScreenSize('small');
//     } else if (width >= 768 && width < 1200) {
//       setScreenSize('medium');
//     } else {
//       setScreenSize('large');
//     }
//   }, []);

  const [screenSize, setScreenSize] = useState<string>();
  useEffect(() => {
    const handleResize = () => {
      let width = window.innerWidth;
      if (width < 576) {
        setScreenSize('extra small');
      } else if (width >= 576 && width < 865) {
        setScreenSize('small');
      } else if (width >= 865 && width < 1200) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    if (eventDetails.starts && eventDetails.ends) {
      const sdayOfWeek = moment(eventDetails.starts).format('dddd');
      const stime = moment(eventDetails.starts).format('HH:mm:ss');
      const syear = moment(eventDetails.starts).format('jYYYY');
      const sday = moment(eventDetails.starts).format('jD');

      const edayOfWeek = moment(eventDetails.ends).format('dddd');
      const etime = moment(eventDetails.ends).format('HH:mm:ss');
      const eyear = moment(eventDetails.ends).format('jYYYY');
      const eday = moment(eventDetails.ends).format('jD');
      setEventDateTime({
        startWeekDay: dayDict[sdayOfWeek],
        startMonth: monthDict[moment(eventDetails.starts).locale('fa').jMonth()],
        startTime: moment(stime, 'HH:mm:ss').subtract(3, 'hours').subtract(30, 'minutes').format('HH:mm:ss').substring(0, 5),
        startYear: syear,
        startDay: sday,
        endWeekDay: dayDict[edayOfWeek],
        endMonth: monthDict[moment(eventDetails.ends).locale('fa').jMonth()],
        endTime: moment(etime, 'HH:mm:ss').subtract(3, 'hours').subtract(30, 'minutes').format('HH:mm:ss').substring(0, 5),
        endYear: eyear,
        endDay: eday,
      });
      const inputDate = moment(eventDetails.starts);
      const inputTime = moment(moment(stime, 'HH:mm:ss').subtract(3, 'hours').subtract(30, 'minutes').format('HH:mm:ss'), 'HH:mm:ss');
      const currentDate = moment();
      const currentTime = moment().format('HH:mm:ss');
      const currentTimeMoment = moment(currentTime, 'HH:mm:ss');
      if (inputDate.isBefore(currentDate, 'day')) {
        setCanPurchase(false);
      }
      if (inputDate.isSame(currentDate, 'day')) {
        if (inputTime.isBefore(currentTimeMoment)) {
          setCanPurchase(false);
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [eventDetails]);

  const copyToClipboard = () => {
    copy(currentUrl)
      .then(() => {})
      .catch((err) => {});
  };

  const copyLinkToClipboard = () => {
    copy(eventDetails.onlineevent.url)
      .then(() => {})
      .catch((err) => {
        console.error('خطا در کپی کردن لینک برگزاری:', err);
      });
  };

  const handleMapData = (data: any) => {};

  const searchTagHandler = (tag: string) => {};
  const eventTags = eventDetails.tags.map((tag) => (
    <div
      className="container"
      onClick={() => searchTagHandler(tag)}
      style={{
        cursor: "pointer",
        borderRadius: "5px",
        margin: "5px",
        paddingTop: "3px",
        paddingBottom: "2px",
        paddingLeft: "4px",
        paddingRight: "4px",
        background: "#808080",
        width: "fit-content",
        fontSize: "12px",
        height: "20px",
      }}
    >
      {tag}#
    </div>
  ));
  if (loading) {
    return (
      <div className="event-details">
        {/* <Navbar /> */}

        <div className="container col loading" style={{ height: "200px", width: "200px", marginTop: "15%" }}>
          <Lottie options={defaultOptions} />
        </div>
      </div>
    );
  }
  if (error) {
    return <PageNotFound />;
  }

  return (
    // <>
    //   {/* <Navbar /> */}
    //   {/* <ToastContainer closeOnClick  className="toastify-container"position="top-right" toastStyle={{backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7",marginTop:"60px"}} pauseOnHover={false} autoClose={3000} /> */}

    //   <div className="event-details">
    //     {screenSize === 'large' && (
    //       <>
    //         <div className="row justify-content-center" style={{ marginTop: "30px" }}>
    //           <div className="event-details-mcard py-3 mr-0 ml-2 px-3 mb-2" style={{ width: "350px", maxWidth: "350px" }}>
    //             <p className="pb-3 ed-message text-right" style={{ fontSize: "14px" }}>
    //               {eventDateTime.startDay} {eventDateTime.startMonth} {eventDateTime.startYear} ساعت {eventDateTime.startTime}
    //             </p>
    //             <h4 className=" pb-3 text-right"> {eventDetails.title} </h4>
    //             <div className="row px-3">
    //               <i className="bi bi-tag-fill icons-style"></i>
    //               {eventDetails.is_paid && <p className="ed-message">{eventDetails.ticket_price.toLocaleString()} تومان</p>}
    //               {!eventDetails.is_paid && <p className="ed-message">رایگان</p>}
    //             </div>
    //             {eventDetails.attendance === "O" && (
    //               <div className="row px-3">
    //                 <i className="bi bi-geo-alt-fill icons-style"></i>
    //                 <p className="ed-message" style={{ fontSize: "14px" }}>
    //                   آنلاین
    //                 </p>
    //               </div>
    //             )}

    //             {eventDetails.attendance === "I" && (
    //               <div className="row px-3">
    //                 <i className="bi bi-geo-alt-fill icons-style"></i>
    //                 <p className="ed-message" style={{ fontSize: "14px" }}>
    //                   {eventDetails.inpersonevent?.province}-{eventDetails.inpersonevent?.city}
    //                 </p>
    //               </div>
    //             )}
    //             <div className="row px-3 pb-3">
    //               <p className="bi bi-grid icons-style"></p>
    //               <p className="ed-message" style={{ fontSize: "14px" }}>
    //                 {eventDetails.category}
    //               </p>
    //             </div>
    //             <div className="row px-3 pt-4">
    //               <img
    //                 className="mt-1"
    //                 src={
    //                   eventDetails.organizer_photo !== "" && eventDetails.organizer_photo !== null
    //                     ? eventDetails.organizer_photo
    //                     : require("../../assets/profile.png")
    //                 }
    //                 style={{ height: "45px", borderRadius: "50%" }}
    //                 alt="profile"
    //               />
    //               <div className="col">
    //                 <p className="pt-3 px-0 text-right"> {eventDetails.organizer_name} </p>
    //               </div>
    //             </div>
    //             <div className="row px-3" style={{ display: 'flex', justifyContent: 'center' }}>
    //               <button className="btn  mt-1 mx-1">دنبال کردن</button>
    //               <button className="btn  mt-1 mx-1" onClick={handleShow}>
    //                 تماس
    //               </button>
    //             </div>
    //           </div>

    //           <div>
    //             <img
    //               className=""
    //               src={eventDetails.photo !== "" && eventDetails.photo !== null ? eventDetails.photo : require("../../assets/events.jpg")}
    //               alt="Your Image"
    //               style={{ width: "770px", height: "400px" }}
    //             />
    //           </div>
    //         </div>

    //         <div className="row justify-content-center">
    //           <div className="event-details-card py-3 mr-0 ml-2 px-3 mb-2" style={{ width: "350px", height: "fit-content" }}>
    //             <div className="row px-3">
    //               <i className="bi bi-clock  icons-style"></i>
    //               <p className="pb-1 ed-message">
    //                 شروع: {eventDateTime.startWeekDay} {eventDateTime.startDay} {eventDateTime.startMonth} {eventDateTime.startYear} ساعت{" "}
    //                 {eventDateTime.startTime}
    //               </p>
    //             </div>
    //             <div className="row px-3">
    //               <i className="bi bi-clock  icons-style"></i>
    //               <p className="pb-3 ed-message">
    //                 پایان: {eventDateTime.endWeekDay} {eventDateTime.endDay} {eventDateTime.endMonth} {eventDateTime.endYear} ساعت{" "}
    //                 {eventDateTime.endTime}
    //               </p>
    //             </div>
    //             {eventDetails.attendance === "I" && auth.token !== "" && eventDetails.enrolled && (
    //               <>
    //                 <div className="row px-3 pt-1">
    //                   <div className="col">
    //                     <p className="pt-2 px-0 mb-0 text-right">آدرس برگزاری</p>
    //                     <div className="row px-3">
    //                       <p className="pb-3 ed-message">{eventDetails.inpersonevent?.address}</p>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 {/* <MapComponent
    //                   sendDataToParent={handleMapData}
    //                   lati={eventDetails.inpersonevent?.location_lat}
    //                   long={eventDetails.inpersonevent?.location_lon}
    //                   onlyShow={true}
    //                   name="EventDetails"
    //                 /> */}
    //               </>
    //             )}
    //             {eventDetails.attendance === "O" && auth.token !== "" && eventDetails.enrolled && (
    //               <div className="row px-3 pt-1">
    //                 <div className="col">
    //                   <p className="pt-2 px-0 mb-0 text-right">لینک برگزاری</p>
    //                   <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //                     <p className="ed-message ellipsis" style={{ fontSize: "12px" }}>
    //                       {eventDetails.onlineevent.url}
    //                     </p>
    //                     <button className="btn  mt-1 mx-1" onClick={copyLinkToClipboard}>
    //                       کپی لینک
    //                     </button>
    //                   </div>
    //                 </div>
    //               </div>
    //             )}
    //             <div className="row px-3 pt-1">
    //               <div className="col">
    //                 <p className="pt-2 px-0 mb-0 text-right"> اشتراک گذاری رویداد</p>
    //                 <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //                   <p className="ed-message ellipsis" style={{ fontSize: "12px" }}>
    //                     {window.location.href}
    //                   </p>
    //                   <button className="btn  mt-1 mx-1" onClick={copyToClipboard}>
    //                     کپی
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>

    //             <center className="mt-2">
    //               <div className="row px-3">
    //                 <a
    //                   className={isBookmarked ? 'bi bi-bookmark-plus-fill' : 'bi bi-bookmark-plus'}
    //                   onClick={bookmarkToggler}
    //                 ></a>
    //                 <p className="message">افزودن به علاقه مندی ها</p>
    //               </div>
    //             </center>
    //           </div>

    //           <div>
    //             <div className="event-details-card py-3 mr-0 ml-2 px-3 mb-2" style={{ width: "770px", maxWidth: "100%" }}>
    //               <h4 className="pb-3" style={{ textAlign: "center" }}>
    //                 توضیحات
    //               </h4>
    //               <p className="ed-message" style={{ whiteSpace: "pre-line", textAlign: "right" }}>
    //                 {eventDetails.description}
    //               </p>
    //               <center>
    //                 {canPurchase && (
    //                   <button className="btn  mt-1 mx-1" onClick={(e) => navigator('/register-event/' + id?.toString())}>
    //                     ثبت نام
    //                   </button>
    //                 )}
    //               </center>
    //             </div>
    //             <div
    //               style={{
    //                 display: 'flex',
    //                 flexDirection: 'row-reverse',
    //                 flexWrap: 'wrap',
    //                 marginBottom: "25px",
    //                 marginTop: "5px",
    //                 width: "770px",
    //                 maxWidth: "100%",
    //               }}
    //             >
    //               {eventTags}
    //             </div>
    //           </div>
    //         </div>
    //       </>
    //     )}

    //     {(screenSize === 'medium' || screenSize === "small" || screenSize === "extra small") && (
    //       <center>
    //         <>
    //           <div>
    //             <img
    //               className=""
    //               src={eventDetails.photo !== "" && eventDetails.photo !== null ? eventDetails.photo : require("../../assets/events.jpg")}
    //               alt="Your Image"
    //               style={{ maxWidth: '90%', width: "770px", height: "fit-content", marginTop: "30px", marginLeft: "15px" }}
    //             />
    //           </div>
    //           <div>
    //             <div className="event-details-card py-3 mr-0 ml-2 px-3 mb-2">
    //               <h4 className="pb-3">توضیحات</h4>
    //               <p className="ed-message" style={{ whiteSpace: "pre-line", textAlign: "right" }}>
    //                 {eventDetails.description}
    //               </p>
    //               <center>
    //                 {canPurchase && (
    //                   <button className="btn  mt-1 mx-1" onClick={(e) => navigator('/register-event/' + id?.toString())}>
    //                     ثبت نام
    //                   </button>
    //                 )}
    //               </center>
    //             </div>
    //           </div>

    //           {screenSize === 'medium' && (
    //             <div className="row justify-content-right" style={{ width: "770px" }}>
    //               <div className="event-details-card  py-3 mr-0 ml-2 px-3 mb-2" style={{ height: "fit-content", width: "372px" }}>
    //                 <div className="row px-3">
    //                   <i className="bi bi-clock  icons-style"></i>
    //                   <p className="pb-1 ed-message">
    //                     شروع: {eventDateTime.startWeekDay} {eventDateTime.startDay} {eventDateTime.startMonth}{" "}
    //                     {eventDateTime.startYear} ساعت {eventDateTime.startTime}
    //                   </p>
    //                 </div>
    //                 <div className="row px-3">
    //                   <i className="bi bi-clock  icons-style"></i>
    //                   <p className="pb-3 ed-message">
    //                     پایان: {eventDateTime.endWeekDay} {eventDateTime.endDay} {eventDateTime.endMonth} {eventDateTime.endYear} ساعت{" "}
    //                     {eventDateTime.endTime}
    //                   </p>
    //                 </div>
    //                 {eventDetails.attendance === "O" && auth.token !== "" && eventDetails.enrolled && (
    //                   <div className="row px-3 pt-1">
    //                     <div className="col">
    //                       <p className="pt-2 px-0 mb-0 text-right">لینک برگزاری</p>
    //                       <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //                         <p className="ed-message ellipsis" style={{ fontSize: "12px" }}>
    //                           {eventDetails.onlineevent.url}
    //                         </p>
    //                         <button className="btn  mt-1 mx-1" onClick={copyLinkToClipboard}>
    //                           کپی لینک
    //                         </button>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 )}
    //                 {eventDetails.attendance === "I" && auth.token !== "" && eventDetails.enrolled && (
    //                   <>
    //                     <div className="row px-3 pt-1">
    //                       <div className="col">
    //                         <p className="pt-2 px-0 mb-0 text-right">آدرس برگزاری</p>
    //                         <div className="row px-3">
    //                           <p className="pb-3 ed-message">{eventDetails.inpersonevent?.address}</p>
    //                         </div>
    //                       </div>
    //                     </div>
    //                     {/* <MapComponent
    //                       sendDataToParent={handleMapData}
    //                       lati={eventDetails.inpersonevent?.location_lat}
    //                       long={eventDetails.inpersonevent?.location_lon}
    //                       onlyShow={true}
    //                       name="EventDetails"
    //                     /> */}
    //                   </>
    //                 )}
    //                 <div className="row px-3 pt-1">
    //                   <div className="col">
    //                     <p className="pt-2 px-0 mb-0 text-right"> اشتراک گذاری رویداد</p>
    //                     <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //                       <p className="ed-message ellipsis" style={{ fontSize: "12px" }}>
    //                         {window.location.href}
    //                       </p>
    //                       <button className="btn  mt-1 mx-1" onClick={copyToClipboard}>
    //                         کپی
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <center className="mt-2">
    //                   <div className="row px-3">
    //                     <a
    //                       className={isBookmarked ? 'bi bi-bookmark-plus-fill' : 'bi bi-bookmark-plus'}
    //                       onClick={bookmarkToggler}
    //                     ></a>
    //                     <p className="message">افزودن به علاقه مندی ها</p>
    //                   </div>
    //                 </center>
    //               </div>
    //               <div className="event-details-card  py-3 mr-0 ml-2 px-3 mb-2" style={{ height: "fit-content", width: "372px", marginLeft: "10px" }}>
    //                 <p className="pb-3 ed-message text-right">
    //                   {eventDateTime.startDay} {eventDateTime.startMonth} {eventDateTime.startYear} ساعت {eventDateTime.startTime}
    //                 </p>
    //                 <h4 className=" pb-3 text-right"> {eventDetails.title} </h4>
    //                 <div className="row px-3">
    //                   <i className="bi bi-tag-fill icons-style"></i>
    //                   {eventDetails.is_paid && <p className="ed-message">{eventDetails.ticket_price.toLocaleString()} تومان</p>}
    //                   {!eventDetails.is_paid && <p className="ed-message">رایگان</p>}
    //                 </div>
    //                 {eventDetails.attendance === "O" && (
    //                   <div className="row px-3">
    //                     <i className="bi bi-geo-alt-fill icons-style"></i>
    //                     <p className="ed-message">آنلاین</p>
    //                   </div>
    //                 )}

    //                 {eventDetails.attendance === "I" && (
    //                   <div className="row px-3">
    //                     <i className="bi bi-geo-alt-fill icons-style"></i>
    //                     <p className="ed-message">
    //                       {eventDetails.inpersonevent?.province}-{eventDetails.inpersonevent?.city}
    //                     </p>
    //                   </div>
    //                 )}
    //                 <div className="row px-3 pb-3">
    //                   <p className="bi bi-grid icons-style"></p>
    //                   <p className="ed-message">{eventDetails.category}</p>
    //                 </div>
    //                 <div className="row px-3 pt-4">
    //                   <img
    //                     className="mt-1"
    //                     src={
    //                       eventDetails.organizer_photo !== "" && eventDetails.organizer_photo !== null
    //                         ? eventDetails.organizer_photo
    //                         : require("../../assets/profile.png")
    //                     }
    //                     style={{ height: "45px", borderRadius: "50%" }}
    //                     alt="profile"
    //                   />
    //                   <div className="col">
    //                     <p className="pt-3 px-0 text-right"> {eventDetails.organizer_name} </p>
    //                   </div>
    //                 </div>
    //                 <div className="row px-3" style={{ display: 'flex', justifyContent: 'center' }}>
    //                   <button className="btn  mt-1 mx-1">دنبال کردن</button>
    //                   <button className="btn  mt-1 mx-1" onClick={handleShow}>
    //                     تماس
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>
    //           )}

    //           {(screenSize === 'small' || screenSize === 'extra small') && (
    //             <>
    //               <div className="event-details-card  py-3 mr-0 ml-2 px-3 mb-2" style={{ height: "fit-content", marginLeft: "10px" }}>
    //                 <p className="pb-3 ed-message text-right">
    //                   {eventDateTime.startDay} {eventDateTime.startMonth} {eventDateTime.startYear} ساعت {eventDateTime.startTime}
    //                 </p>
    //                 <h4 className=" pb-3 text-right"> {eventDetails.title} </h4>
    //                 <div className="row px-3">
    //                   <i className="bi bi-tag-fill icons-style"></i>
    //                   {eventDetails.is_paid && <p className="ed-message">{eventDetails.ticket_price.toLocaleString()} تومان</p>}
    //                   {!eventDetails.is_paid && <p className="ed-message">رایگان</p>}
    //                 </div>
    //                 {eventDetails.attendance === "O" && (
    //                   <div className="row px-3">
    //                     <i className="bi bi-geo-alt-fill icons-style"></i>
    //                     <p className="ed-message">آنلاین</p>
    //                   </div>
    //                 )}

    //                 {eventDetails.attendance === "I" && (
    //                   <div className="row px-3">
    //                     <i className="bi bi-geo-alt-fill icons-style"></i>
    //                     <p className="ed-message">
    //                       {eventDetails.inpersonevent?.province}-{eventDetails.inpersonevent?.city}
    //                     </p>
    //                   </div>
    //                 )}
    //                 <div className="row px-3 pb-3">
    //                   <p className="bi bi-grid icons-style"></p>
    //                   <p className="ed-message">{eventDetails.category}</p>
    //                 </div>
    //                 <div className="row px-3 pt-4">
    //                   <img
    //                     className="mt-1"
    //                     src={
    //                       eventDetails.organizer_photo !== "" && eventDetails.organizer_photo !== null
    //                         ? eventDetails.organizer_photo
    //                         : require("../../assets/profile.png")
    //                     }
    //                     style={{ height: "45px", borderRadius: "50%" }}
    //                     alt="profile"
    //                   />
    //                   <div className="col">
    //                     <p className="pt-3 px-0 text-right"> {eventDetails.organizer_name} </p>
    //                   </div>
    //                 </div>
    //                 <div className="row px-3" style={{ display: 'flex', justifyContent: 'center' }}>
    //                   <button className="btn  mt-1 mx-1">دنبال کردن</button>
    //                   <button className="btn  mt-1 mx-1" onClick={handleShow}>
    //                     تماس
    //                   </button>
    //                 </div>
    //               </div>

    //               <div className="event-details-card  py-3 mr-0 ml-2 px-3 mb-2" style={{ height: "fit-content" }}>
    //                 <div className="row px-3">
    //                   <i className="bi bi-clock  icons-style"></i>
    //                   <p className="pb-1 ed-message">
    //                     شروع: {eventDateTime.startWeekDay} {eventDateTime.startDay} {eventDateTime.startMonth}{" "}
    //                     {eventDateTime.startYear} ساعت {eventDateTime.startTime}
    //                   </p>
    //                 </div>
    //                 <div className="row px-3">
    //                   <i className="bi bi-clock  icons-style"></i>
    //                   <p className="pb-3 ed-message">
    //                     پایان: {eventDateTime.endWeekDay} {eventDateTime.endDay} {eventDateTime.endMonth} {eventDateTime.endYear} ساعت{" "}
    //                     {eventDateTime.endTime}
    //                   </p>
    //                 </div>
    //                 {eventDetails.attendance === "O" && auth.token !== "" && eventDetails.enrolled && (
    //                   <div className="row px-3 pt-1">
    //                     <div className="col">
    //                       <p className="pt-2 px-0 mb-0 text-right">لینک برگزاری</p>
    //                       <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //                         <p className="ed-message ellipsis" style={{ fontSize: "12px" }}>
    //                           {eventDetails.onlineevent.url}
    //                         </p>
    //                         <button className="btn  mt-1 mx-1" onClick={copyLinkToClipboard}>
    //                           کپی لینک
    //                         </button>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 )}
    //                 {eventDetails.attendance === "I" && auth.token !== "" && eventDetails.enrolled && (
    //                   <>
    //                     <div className="row px-3 pt-1">
    //                       <div className="col">
    //                         <p className="pt-2 px-0 mb-0 text-right">آدرس برگزاری</p>
    //                         <div className="row px-3">
    //                           <p className="pb-3 ed-message">{eventDetails.inpersonevent?.address}</p>
    //                         </div>
    //                       </div>
    //                     </div>

    //                     {/* <MapComponent
    //                       sendDataToParent={handleMapData}
    //                       lati={eventDetails.inpersonevent?.location_lat}
    //                       long={eventDetails.inpersonevent?.location_lon}
    //                       onlyShow={true}
    //                       name="EventDetails"
    //                     /> */}
    //                   </>
    //                 )}
    //                 <div className="row px-3 pt-1">
    //                   <div className="col">
    //                     <p className="pt-2 px-0 mb-0 text-right"> اشتراک گذاری رویداد</p>
    //                     <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //                       <p className="ed-message ellipsis" style={{ fontSize: "12px" }}>
    //                         {window.location.href}
    //                       </p>
    //                       <button className="btn  mt-1 mx-1" onClick={copyToClipboard}>
    //                         کپی
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <center className="mt-2">
    //                   <div className="row px-3">
    //                     <a
    //                       className={isBookmarked ? 'bi bi-bookmark-plus-fill' : 'bi bi-bookmark-plus'}
    //                       onClick={bookmarkToggler}
    //                     ></a>
    //                     <p className="message">افزودن به علاقه مندی ها</p>
    //                   </div>
    //                 </center>
    //               </div>
    //             </>
    //           )}
    //           <div
    //             style={{
    //               display: 'flex',
    //               flexDirection: 'row-reverse',
    //               flexWrap: 'wrap',
    //               marginBottom: "25px",
    //               marginTop: "5px",
    //               width: "770px",
    //               maxWidth: "90%",
    //             }}
    //           >
    //             {eventTags}
    //           </div>
    //         </>
    //       </center>
    //     )}

    //     {/* <MainComment id={id} /> */}
    //   </div>

    //   {/* <OrganizerInfoModal
    //     show={show}
    //     handleClose={handleClose}
    //     email={eventDetails.organizer_email}
    //     phone={eventDetails.organizer_phone}
    //     id={eventDetails.creator_id}
    //   /> */}
    // </>








<>
{/* <Navbar/> */}
<ToastContainer className="toastify-container"position="top-right" toastStyle={{backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7",marginTop:"60px"}} pauseOnHover={false} autoClose={3000} />

<div className="event-details"> 
    <div className="section pb-0">
        <div className="row justify-content-center">
            <div className="card-3d-wrap-ce" style={{height:"400px", width:"350px"}}>
                <div className="card-back text-right px-3 py-4">
                    <p className="pb-3 message">{eventDetails.day} {eventDetails.startDate[2]} {eventDetails.startDate[1]} {eventDetails.startDate[0]} ساعت {eventDetails.startTime[0]}:{eventDetails.startTime[1]}</p>
                    <h4 className=" pb-3"> {eventDetails.eventName} </h4>
                    <div className="row px-3">
                        <i className="bi bi-tag-fill icons-style"></i>
                        <p className="message">{eventDetails.price.toLocaleString()} تومان</p>
                    </div>
                    <div className="row px-3">
                        <i className="bi bi-geo-alt-fill icons-style"></i>
                        <p className="message">{eventDetails.type}</p>
                    </div>
                    <div className="row px-3 pb-3">
                        <p className="bi bi-grid icons-style"></p>
                        <p className="message">{eventDetails.category}</p>
                    </div>
                    <div className="row px-3 pt-4" >
                        <img className="mt-1" src="src\features\user\concertDetailsPage\profile.png" style={{height:"45px",borderRadius: "50%" }} alt="profile"/>
                        <div className="col">
                            <p className="pt-2 px-0"> {eventDetails.organizerName}</p>
                        </div>
                    </div>
                    <div className="row px-3">
                        <button
                            className="btn  mt-1 mx-1"
                            >
                            دنبال کردن 
                        </button>
                        <button
                            className="btn  mt-1 mx-1"
                            onClick={handleShow}
                            >
                            تماس  
                        </button>
                    </div>
                </div>
                
            </div>
            <div>
                <img
                    src="src\features\user\concertDetailsPage\img.png"
                    alt="Your Image"
                    style={{ width: "770px", height: "400px" ,marginTop:"30px"}}
                />
            </div>
        </div>
    </div>
    <div className="section pb-0" style={{marginLeft:"80px"}}>
        <div className="row justify-content-center">
            <div className="card-3d-wrap-ce" style={{height:"260px", width:"335px" , marginTop:"15px"}}>
                <div className="card-back text-right px-3 py-4">
                    <div className="row px-3">
                        <i className="bi bi-clock  icons-style"></i>
                        <p className="pb-1 message">شروع: {eventDetails.startDay} {eventDetails.startDate[2]} {eventDetails.startDate[1]} {eventDetails.startDate[0]} ساعت {eventDetails.startTime[0]}:{eventDetails.startTime[1]}</p>
                    </div>
                    <div className="row px-3">
                        <i className="bi bi-clock  icons-style"></i>
                        <p className="pb-3 message">پایان: {eventDetails.endDay} {eventDetails.endDate[2]} {eventDetails.endDate[1]} {eventDetails.endDate[0]} ساعت {eventDetails.endTime[0]}:{eventDetails.endTime[1]}</p>
                    </div>
                    <div className="row px-3 pt-1" >
                        <div className="col">
                            <p className="pt-2 px-0"> اشتراک گذاری رویداد</p>
                            <div className="row">
                                <p className="message ellipsis" style={{fontSize:"12px"}}>{window.location.href}</p>
                                <button className="btn  mt-1 mx-1" onClick={copyToClipboard}>
                                    کپی لینک  
                                </button>
                            </div>
                            
                        </div>
                    </div>
                    <center className="mt-2">
                        <button
                            className="btn  mt-1 mx-1"
                            onClick={handleShow}
                            >
                            <div className="row">
                                <h6 className="bi bi-bookmark-plus mb-0" ></h6>
                                 بعدا یادآوری کن
                                
                            </div>
                        </button>
                    </center>
                        
                </div>
            </div>
            <div>
            <div className="section py-1 mr-0 ml-2 px-0 mb-2 pb-5">
                    <div className="card-3d-wrap-description pb-5 mb-5 mx-0 px-0" style={{height:"455px"}} >
                        <div className="card-back text-right px-3 pt-4  pb-1 mb-1" >
                        <h4 className="pb-3">توضیحات</h4>
                        <p className="message" style={{whiteSpace:"pre-line"}}>{eventDetails.description}</p>
                        <center>
                            <button
                                className="btn  mt-1 mx-1"
                                // onClick={(e) => navigator('https://www.iranconcert.com/concert/16472/')}
                                onClick={() => window.open('https://www.iranconcert.com/concert/16472/', '_blank')}
                                >
                                ثبت نام  
                            </button>
                        </center>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 

{/* <OrganizerInfoModal show = {show} handleClose={handleClose} email={eventDetails.organizerEmail} phone={eventDetails.organizerPhone}/> */}



</>


  );
};

export default EventDetails;
