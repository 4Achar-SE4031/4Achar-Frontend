import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import copy from "clipboard-copy";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PageNotFound from "./PageNotFound/PageNotFound.tsx";

import Navbar from "../../Navbar/navbar.tsx";
import "./c_details.css";
import OrganizerInfoModal from "./organizer-contact-info.tsx";

import MainComment from "../../Comment/MainComment.tsx";

import moment from "moment-jalaali";
import animationData from "./Animation - 1715854965467.json";
import Lottie from "react-lottie";
// import { Alert } from 'react-alert'
// import { toast } from "react-toastify";
import MapComponent from "./MapComponent/MapComponent.tsx";

import { useAuth } from "../Authentication/authProvider.tsx";
import HoverRating from "./Rating.tsx";
import MusicNotes from "./MusicNotes.tsx";
import Footer from "../../../app/layout/Footer.tsx";
import AdvertisementCard from "../Ads/Ads.tsx";
import ads_sample_image1 from "../Ads/sample_picture.jpg";
import ads_sample_image2 from "../Ads/sample_picture2.jpg";
import { height } from "@mui/system";
import Suggestion from "./Suggestion.tsx";

const ConcertDetails: React.FC = () => {
    const [show, setShow] = useState(false);
    const [canPurchase, setCanPurchase] = useState(true);
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
    const monthDict = {
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
    const dayDict = {
        Monday: "دوشنبه",
        Tuesday: "سه شنبه",
        Wednesday: "چهارشنبه",
        Thursday: "پنج شنبه",
        Friday: "جمعه",
        Saturday: "شنبه",
        Sunday: "یک شنبه",
    };
    const [eventDateTime, setEventDateTime] = useState({
        startWeekDay: "جمعه",
        startMonth: "آذر",
        startTime: "21:00",
        startYear: "1403",
        startDay: "25",
        endWeekDay: "جمعه",
        endMonth: "آذر",
        endTime: "23:00",
        endYear: "1403",
        endDay: "25",
    });
    const [eventDetails, setEventDetails] = useState({
        title: "کنسرت ارکستر سمفونیک قاف (منظومه سیمرغ)",
        ticket_price: "600000",
        attendance: "I",
        province: "تهران",
        city: "تهران",
        photo: "/img.png",
        category: "ارکستر سمفونی",
        organizer_photo: "/profile2.png",
        organizer_name: "4AChar-Band",
        organizer_phone: "09123456789",
        organizer_email: "organizer@gmail.com",
        location_lat: "35.7021",
        location_lon: "51.4051",
        address: "تهران، خیابان حافظ، تالار وحدت",
        description: `
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
        tags: [],
    });

    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isBookmarked, setBookmark] = useState(false);
    let userData = localStorage.getItem("userData");
    if (userData) {
        try {
            userData = JSON.parse(userData);
        } catch (e) {
            console.error("Error parsing userData:", e);
            // Handle the error or set a default value if needed
            userData = null; // or some default empty object
        }
    } else {
        userData = null; // Handle the case where there's no data in localStorage
    }

    const bookmarkToggler = async () => {
        if (auth.token !== "") {
            try {
                const response = await axios.post(
                    "https://eventify.liara.run/events/" + id + "/bookmark/",
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
                    toast.success("رویداد به علاقه مندی ها اضافه شد ");

                    // return "bi bi-bookmark-plus";
                } else {
                    setBookmark(false);
                    toast.error("رویداد از علاقه مندی ها حذف شد ");

                    // return "bi bi-bookmark-plus-fill";
                }
            } catch (error) {}
        } else {
            // toast.error('برای افزودن به علاقه مندی ها باید وارد سیستم شوید!');
            // setTimeout(() => {
            //     navigator('/login');
            // }, 2500);
        }
    };
    const [screenSize, setScreenSize] = useState<string>("");

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);

        // const fetchData = async () => {
        //     try {
        //         if(auth.token!==""){
        //             const response = await axios.get('https://api-concertify.darkube.app/Concert/'+id,{headers: {
        //                 "Content-Type": "application/json",
        //                 accept: "application/json",
        //                 Authorization:`JWT ${auth.token}`,
        //             }},);
        //             setEventDetails(response.data);
        //             // setBookmark(response.data.bookmarked)

        //         }
        //         else{
        //             const response = await axios.get('https://api-concertify.darkube.app/Concert/'+id,{headers: {
        //                 "Content-Type": "application/json",
        //                 accept: "application/json",
        //             }},);
        //             setEventDetails(response.data);

        //         }
        //     } catch (error) {
        //         if (error.response && error.response.status === 401) {
        //             auth.logOut()
        //         } else {
        //         }
        //         setError(true);
        //         setTimeout(() => {
        //             setLoading(false);
        //         }, 1000);

        //     } finally {
        //         // setLoading(false);
        //     }
        // };
        // fetchData();

        //disable vertical scrollbar
        document.documentElement.style.overflowY = "hidden";
        //change title of html page dynamically
        document.title = "جزئیات رویداد";
        let width = window.innerWidth;
        if (width < 576) {
            setScreenSize("extra small");
        } else if (width >= 576 && width < 768) {
            setScreenSize("small");
        } else if (width >= 768 && width < 1200) {
            setScreenSize("medium");
        } else {
            setScreenSize("large");
        }
    }, []);
    useEffect(() => {
        const handleResize = () => {
            let width = window.innerWidth;
            if (width < 576) {
                setScreenSize("extra small");
            } else if (width >= 576 && width < 865) {
                setScreenSize("small");
            } else if (width >= 865 && width < 1200) {
                setScreenSize("medium");
            } else {
                setScreenSize("large");
            }
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });

    // useEffect(() => {
    //     if (eventDetails.starts && eventDetails.ends) {
    //         const sdayOfWeek = moment(eventDetails.starts).format('dddd');
    //         const stime = moment(eventDetails.starts).format('HH:mm:ss');
    //         const syear = moment(eventDetails.starts).format('jYYYY');
    //         const sday = moment(eventDetails.starts).format('jD');

    //         const edayOfWeek = moment(eventDetails.ends).format('dddd');
    //         const etime = moment(eventDetails.ends).format('HH:mm:ss');
    //         const eyear = moment(eventDetails.ends).format('jYYYY');
    //         const eday = moment(eventDetails.ends).format('jD');
    //         setEventDateTime({
    //             startWeekDay: dayDict[sdayOfWeek],
    //             startMonth: monthDict[moment(eventDetails.starts).locale('fa').jMonth()],
    //             startTime: moment(stime, 'HH:mm:ss').subtract(3, 'hours').subtract(30, 'minutes').format('HH:mm:ss').substring(0, 5),
    //             startYear: syear,
    //             startDay: sday,

    //             endWeekDay: dayDict[edayOfWeek],
    //             endMonth: monthDict[moment(eventDetails.ends).locale('fa').jMonth()],
    //             endTime: moment(etime, 'HH:mm:ss').subtract(3, 'hours').subtract(30, 'minutes').format('HH:mm:ss').substring(0, 5),
    //             endYear: eyear,
    //             endDay: eday,
    //         });
    //         const inputDate = moment(eventDetails.starts);
    //         const inputTime = moment(moment(stime, 'HH:mm:ss').subtract(3, 'hours').subtract(30, 'minutes').format('HH:mm:ss'), 'HH:mm:ss');
    //         const currentDate = moment();
    //         const currentTime = moment().format('HH:mm:ss');
    //         const currentTimeMoment = moment(currentTime, 'HH:mm:ss');
    //         if (inputDate.isBefore(currentDate, 'day')) {
    //             setCanPurchase(false);
    //         }
    //         if (inputDate.isSame(currentDate, 'day')) {
    //             if (inputTime.isBefore(currentTimeMoment)) {
    //                 setCanPurchase(false);
    //             }

    //         }
    //         setTimeout(() => {
    //             setLoading(false);
    //         }, 1000);

    //     }
    // }, [eventDetails]);

    const copyToClipboard = () => {
        copy(currentUrl)
            .then(() => {})
            .catch((err) => {});
    };

    const copyLinkToClipboard = () => {
        copy(window.location.href)
            .then(() => {})
            .catch((err) => {
                console.error("خطا در کپی کردن لینک برگزاری:", err);
            });
    };

    const handleMapData = (data: { lat: any; lng: any }) => {
        console.log("Latitude:", data.lat);
        console.log("Longitude:", data.lng);
        // Implement additional logic with 'data' here
    };

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
                <Navbar />

                <div
                    className="container col loading"
                    style={{
                        height: "200px",
                        width: "200px",
                        marginTop: "15%",
                    }}
                >
                    <Lottie options={defaultOptions} />
                </div>
            </div>
        );
    }
    if (error) {
        return <PageNotFound />;
    }

    return (
        <>
            <Navbar />
            {/* <ToastContainer closeOnClick  className="toastify-container"position="top-right" toastStyle={{backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7",marginTop:"60px"}} pauseOnHover={false} autoClose={3000} /> */}
            <div className="music-notes-container">
                <MusicNotes count={30} />
            </div>

            <div className="concert-details">
                {screenSize === "large" && (
                    <>
                        <div
                            className="row justify-content-center"
                            style={{ marginTop: "30px" }}
                        >
                            {/* Left Section */}
                            <div className="col-md-2 left-section">
                                <AdvertisementCard
                                    title="Special Offer"
                                    description="Get 50% off on all premium features this week!"
                                    linkUrl="https://www.digikala.com/product/dkp-13969461/%DA%AF%D9%88%D8%B4%DB%8C-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D8%B3%D8%A7%D9%85%D8%B3%D9%88%D9%86%DA%AF-%D9%85%D8%AF%D9%84-galaxy-a15-%D8%AF%D9%88-%D8%B3%DB%8C%D9%85-%DA%A9%D8%A7%D8%B1%D8%AA-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-128-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA-%D9%88-%D8%B1%D9%85-6-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA-%D9%88%DB%8C%D8%AA%D9%86%D8%A7%D9%85/"
                                    linkText="Claim Offer"
                                    imageUrl={ads_sample_image1}
                                />
                            </div>

                            <div
                                className="event-details-mcard py-3 mr-0  px-3 mb-2"
                                style={{ width: "350px", maxWidth: "350px" }}
                            >
                                <p className="pb-3 ed-message text-right">
                                    {eventDateTime.startDay}{" "}
                                    {eventDateTime.startMonth}{" "}
                                    {eventDateTime.startYear} ساعت{" "}
                                    {eventDateTime.startTime}{" "}
                                </p>
                                <h4 className=" pb-3 text-right">
                                    {" "}
                                    {eventDetails.title}{" "}
                                </h4>
                                <div className="row px-3 mb-2">
                                    <i className="bi bi-tag-fill icons-style"></i>
                                    <p className="ed-message">
                                        {eventDetails.ticket_price.toLocaleString()}{" "}
                                        تومان
                                    </p>
                                </div>

                                <div className="row px-3 mb-2">
                                    <i className="bi bi-geo-alt-fill icons-style"></i>
                                    <p className="ed-message">
                                        {eventDetails.province}-
                                        {eventDetails.city}
                                    </p>
                                </div>

                                <div className="row px-3 pb-3 mb-2">
                                    <p className="bi bi-grid icons-style"></p>
                                    <p className="ed-message">
                                        {eventDetails.category}
                                    </p>
                                </div>
                                <div className="row px-3 pt-1">
                                    <img
                                        className="mt-1"
                                        src={
                                            eventDetails.organizer_photo !==
                                                "" &&
                                            eventDetails.organizer_photo !==
                                                null
                                                ? eventDetails.organizer_photo
                                                : require("src/features/user/concertDetailsPage/profile.png")
                                        }
                                        style={{
                                            height: "45px",
                                            borderRadius: "6px",
                                        }}
                                        alt="profile"
                                    />
                                    <div className="col">
                                        <p className="pt-3 px-0 text-right">
                                            {" "}
                                            {eventDetails.organizer_name}{" "}
                                        </p>
                                    </div>
                                </div>
                                <center>
                                    <HoverRating />
                                </center>
                                <center>
                                    <button
                                        className="btn  mt-1 mx-1"
                                        onClick={handleShow}
                                    >
                                        <div className="row">
                                            <h6 className="bi bi-bookmark-plus mb-0"></h6>
                                            بعدا یادآوری کن
                                        </div>
                                    </button>
                                </center>
                            </div>

                            <div>
                                <img
                                    src={
                                        eventDetails.photo !== "" &&
                                        eventDetails.photo !== null
                                            ? eventDetails.photo
                                            : require("../../assets/events.jpg")
                                    }
                                    alt="Your Image"
                                    style={{
                                        width: "770px",
                                        height: "400px",
                                        zIndex: 10,
                                        position: "relative",
                                        borderRadius: "6px"
                                    }}
                                />
                            </div>

                            {/* Right Section */}
                            <div className="col-md-2 right-section">
                                {/* <div className="side-content"> */}
                                {/* <h4>Right Section</h4>
                                    <div className="side-widget">
                                        <p>Additional Information</p>
                                        <button className="btn btn-outline-secondary">Action</button>
                                    </div> */}
                                {/* </div> */}
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            {/* Left Section */}
                            <div className="col-md-2 left-section"></div>

                            <div
                                className="event-details-card py-3 mr-0  px-3 mb-2"
                                style={{
                                    width: "350px",
                                    height: "fit-content",
                                }}
                            >
                                <div className="row px-3">
                                    <i className="bi bi-clock  icons-style"></i>
                                    <p className="pb-1 ed-message">
                                        شروع: {eventDateTime.startWeekDay}{" "}
                                        {eventDateTime.startDay}{" "}
                                        {eventDateTime.startMonth}{" "}
                                        {eventDateTime.startYear} ساعت{" "}
                                        {eventDateTime.startTime}{" "}
                                    </p>
                                </div>
                                <div className="row px-3">
                                    <i className="bi bi-clock  icons-style"></i>
                                    <p className="pb-3 ed-message">
                                        پایان: {eventDateTime.endWeekDay}{" "}
                                        {eventDateTime.endDay}{" "}
                                        {eventDateTime.endMonth}{" "}
                                        {eventDateTime.endYear} ساعت{" "}
                                        {eventDateTime.endTime}{" "}
                                    </p>
                                </div>
                                <>
                                    <div className="row px-3 pt-1">
                                        <div className="col">
                                            <p className="pt-2 px-0 mb-0 text-right">
                                                آدرس برگزاری
                                            </p>
                                            <div className="row px-3">
                                                <p className="pb-3 ed-message">
                                                    {eventDetails.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <MapComponent
                                        sendDataToParent={handleMapData}
                                        lati={eventDetails.location_lat}
                                        long={eventDetails.location_lon}
                                        onlyShow={true}
                                        name="EventDetails"
                                    />
                                </>

                                <div className="row px-3 pt-1">
                                    <div className="col">
                                        <p className="pt-2 px-0 mb-0 text-right">
                                            {" "}
                                            اشتراک گذاری رویداد
                                        </p>
                                        <div
                                            className="row"
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <p
                                                className="ed-message ellipsis"
                                                style={{ fontSize: "12px" }}
                                            >
                                                {window.location.href}
                                            </p>
                                            <button
                                                className="btn  mt-1 mx-1"
                                                onClick={copyToClipboard}
                                            >
                                                کپی
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* <center className="mt-2">
                                    
                                        <div className="row px-3">
                                            <a class={isBookmarked ? 'bi bi-bookmark-plus-fill': 'bi bi-bookmark-plus'} 
                                            onClick={bookmarkToggler}></a>
                                            <p className="message">افزودن به علاقه مندی ها</p>
                                        </div>
                                    </center> */}
                            </div>

                            <div>
                                <div
                                    className="event-details-card py-3 mr-0 ml-2 px-3 mb-2"
                                    style={{
                                        width: "765px",
                                        maxWidth: "100%",
                                        height: "480px",
                                        zIndex: 10,
                                        position: "relative",
                                    }}
                                >
                                    <h4
                                        className="pb-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        توضیحات
                                    </h4>
                                    <p
                                        className="ed-message"
                                        style={{
                                            whiteSpace: "pre-line",
                                            textAlign: "right",
                                        }}
                                    >
                                        {eventDetails.description}
                                    </p>
                                    <center>
                                        {canPurchase && (
                                            <button
                                                className="btn  mt-1 mx-1"
                                                onClick={(e) =>
                                                    navigator(
                                                        "/register-event/" +
                                                            Number(
                                                                id
                                                            ).toString()
                                                    )
                                                }
                                            >
                                                خرید بلیت
                                            </button>
                                        )}
                                    </center>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        flexWrap: "wrap",
                                        marginBottom: "25px",
                                        marginTop: "5px",
                                        width: "770px",
                                        maxWidth: "100%",
                                    }}
                                >
                                    {eventTags}
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="col-md-2 left-section">
                                <AdvertisementCard
                                    title=""
                                    description=""
                                    linkUrl="https://www.snapptrip.com/"
                                    linkText="با اسنپ خیالت از سفر راحته!"
                                    imageUrl={ads_sample_image2}
                                    height="480px"
                                />
                            </div>
                        </div>
                    </>
                )}

                {(screenSize === "medium" ||
                    screenSize === "small" ||
                    screenSize === "extra small") && (
                    <center>
                        <>
                            <div>
                                <img
                                    className=""
                                    src={
                                        eventDetails.photo !== "" &&
                                        eventDetails.photo !== null
                                            ? eventDetails.photo
                                            : require("../../assets/events.jpg")
                                    }
                                    alt="Your Image"
                                    style={{
                                        maxWidth: "90%",
                                        width: "770px",
                                        height: "fit-content",
                                        marginTop: "30px",
                                        marginLeft: "10px",
                                        zIndex: 10,
                                        position: "relative",
                                        borderRadius: "6px"
                                    }}
                                />
                            </div>
                            <div>
                                <div
                                    className="event-details-card py-3 mr-0 ml-2 px-3 mb-2"
                                    style={{ zIndex: 10, position: "relative" }}
                                >
                                    <h4 className="pb-3">توضیحات</h4>
                                    <p
                                        className="ed-message"
                                        style={{
                                            whiteSpace: "pre-line",
                                            textAlign: "right",
                                        }}
                                    >
                                        {eventDetails.description}
                                    </p>
                                    <center>
                                        {canPurchase && (
                                            <button
                                                className="btn  mt-1 mx-1"
                                                onClick={(e) =>
                                                    navigator(
                                                        "/register-concert/" +
                                                            Number(
                                                                id
                                                            ).toString()
                                                    )
                                                }
                                            >
                                                خرید بلیت
                                            </button>
                                        )}
                                    </center>
                                </div>
                            </div>

                            {screenSize === "medium" && (
                                <div
                                    className="row justify-content-right"
                                    style={{
                                        width: "780px",
                                        zIndex: 10,
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        className="event-details-card  py-3 mr-0 ml-2 px-3 mb-2"
                                        style={{
                                            height: "fit-content",
                                            width: "380px",
                                        }}
                                    >
                                        <div className="row px-3">
                                            <i className="bi bi-clock  icons-style"></i>
                                            <p className="pb-1 ed-message">
                                                شروع:{" "}
                                                {eventDateTime.startWeekDay}{" "}
                                                {eventDateTime.startDay}{" "}
                                                {eventDateTime.startMonth}{" "}
                                                {eventDateTime.startYear} ساعت{" "}
                                                {eventDateTime.startTime}{" "}
                                            </p>
                                        </div>
                                        <div className="row px-3">
                                            <i className="bi bi-clock  icons-style"></i>
                                            <p className="pb-3 ed-message">
                                                پایان:{" "}
                                                {eventDateTime.endWeekDay}{" "}
                                                {eventDateTime.endDay}{" "}
                                                {eventDateTime.endMonth}{" "}
                                                {eventDateTime.endYear} ساعت{" "}
                                                {eventDateTime.endTime}{" "}
                                            </p>
                                        </div>
                                        <>
                                            <div className="row px-3 pt-1">
                                                <div className="col">
                                                    <p className="pt-2 px-0 mb-0 text-right">
                                                        آدرس برگزاری
                                                    </p>
                                                    <div className="row px-3">
                                                        <p className="pb-3 ed-message">
                                                            {
                                                                eventDetails.address
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <MapComponent
                                                sendDataToParent={handleMapData}
                                                lati={eventDetails.location_lat}
                                                long={eventDetails.location_lon}
                                                onlyShow={true}
                                                name="EventDetails"
                                            />
                                        </>

                                        <div className="row px-3 pt-1">
                                            <div className="col">
                                                <p className="pt-2 px-0 mb-0 text-right">
                                                    {" "}
                                                    اشتراک گذاری رویداد
                                                </p>
                                                <div
                                                    className="row"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <p
                                                        className="ed-message ellipsis"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {window.location.href}
                                                    </p>
                                                    <button
                                                        className="btn  mt-1 mx-1"
                                                        onClick={
                                                            copyToClipboard
                                                        }
                                                    >
                                                        کپی
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="event-details-card  py-3 mr-0 ml-2 px-3 mb-2"
                                        style={{
                                            height: "fit-content",
                                            width: "380px",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        <p className="pb-3 ed-message text-right">
                                            {eventDateTime.startDay}{" "}
                                            {eventDateTime.startMonth}{" "}
                                            {eventDateTime.startYear} ساعت{" "}
                                            {eventDateTime.startTime}{" "}
                                        </p>
                                        <h4 className=" pb-3 text-right">
                                            {" "}
                                            {eventDetails.title}{" "}
                                        </h4>
                                        <div className="row px-3">
                                            <i className="bi bi-tag-fill icons-style"></i>
                                            <p className="ed-message">
                                                {eventDetails.ticket_price.toLocaleString()}{" "}
                                                تومان
                                            </p>
                                        </div>
                                        <div className="row px-3">
                                            <i className="bi bi-geo-alt-fill icons-style"></i>
                                            <p className="ed-message">
                                                {eventDetails.province}-
                                                {eventDetails.city}
                                            </p>
                                        </div>
                                        <div className="row px-3 pb-3">
                                            <p className="bi bi-grid icons-style"></p>
                                            <p className="ed-message">
                                                {eventDetails.category}
                                            </p>
                                        </div>
                                        <div className="row px-3 pt-4">
                                            <img
                                                className="mt-1"
                                                src={
                                                    eventDetails.organizer_photo !==
                                                        "" &&
                                                    eventDetails.organizer_photo !==
                                                        null
                                                        ? eventDetails.organizer_photo
                                                        : require("src/features/user/concertDetailsPage/profile.png")
                                                }
                                                style={{
                                                    height: "45px",
                                                    borderRadius: "6px",
                                                }}
                                                alt="profile"
                                            />
                                            <div className="col">
                                                <p className="pt-3 px-0 text-right">
                                                    {" "}
                                                    {
                                                        eventDetails.organizer_name
                                                    }{" "}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="row px-3"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <center>
                                                <HoverRating />
                                            </center>
                                            <center>
                                                <button
                                                    className="btn  mt-1 mx-1"
                                                    onClick={handleShow}
                                                >
                                                    <div className="row">
                                                        <h6 className="bi bi-bookmark-plus mb-0"></h6>
                                                        بعدا یادآوری کن
                                                    </div>
                                                </button>
                                            </center>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(screenSize === "small" ||
                                screenSize === "extra small") && (
                                <>
                                    <div
                                        className="event-details-card  py-3 mr-0 ml-2 px-3 mb-2"
                                        style={{
                                            height: "fit-content",
                                            marginLeft: "10px",
                                            zIndex: 10,
                                            position: "relative",
                                        }}
                                    >
                                        <p className="pb-3 ed-message text-right">
                                            {eventDateTime.startDay}{" "}
                                            {eventDateTime.startMonth}{" "}
                                            {eventDateTime.startYear} ساعت{" "}
                                            {eventDateTime.startTime}{" "}
                                        </p>
                                        <h4 className=" pb-3 text-right">
                                            {" "}
                                            {eventDetails.title}{" "}
                                        </h4>
                                        <div className="row px-3">
                                            <i className="bi bi-tag-fill icons-style"></i>
                                            <p className="ed-message">
                                                {eventDetails.ticket_price.toLocaleString()}{" "}
                                                تومان
                                            </p>
                                        </div>

                                        <div className="row px-3">
                                            <i className="bi bi-geo-alt-fill icons-style"></i>
                                            <p className="ed-message">
                                                {eventDetails.province}-
                                                {eventDetails.city}
                                            </p>
                                        </div>
                                        <div className="row px-3 pb-3">
                                            <p className="bi bi-grid icons-style"></p>
                                            <p className="ed-message">
                                                {eventDetails.category}
                                            </p>
                                        </div>
                                        <div className="row px-3 pt-4">
                                            <img
                                                className="mt-1"
                                                src={
                                                    eventDetails.organizer_photo !==
                                                        "" &&
                                                    eventDetails.organizer_photo !==
                                                        null
                                                        ? eventDetails.organizer_photo
                                                        : require("src/features/user/concertDetailsPage/profile.png")
                                                }
                                                style={{
                                                    height: "45px",
                                                    borderRadius: "6px",
                                                }}
                                                alt="profile"
                                            />
                                            <div className="col">
                                                <p className="pt-3 px-0 text-right">
                                                    {" "}
                                                    {
                                                        eventDetails.organizer_name
                                                    }{" "}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="row px-3"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <HoverRating />
                                            <center>
                                                <button
                                                    className="btn  mt-1 mx-1"
                                                    onClick={handleShow}
                                                >
                                                    <div className="row">
                                                        <h6 className="bi bi-bookmark-plus mb-0"></h6>
                                                        بعدا یادآوری کن
                                                    </div>
                                                </button>
                                            </center>
                                        </div>
                                    </div>

                                    <div
                                        className="event-details-card  py-3 mr-0 ml-2 px-3 mb-2"
                                        style={{
                                            height: "fit-content",
                                            zIndex: 10,
                                            position: "relative",
                                        }}
                                    >
                                        <div className="row px-3">
                                            <i className="bi bi-clock  icons-style"></i>
                                            <p className="pb-1 ed-message">
                                                شروع:{" "}
                                                {eventDateTime.startWeekDay}{" "}
                                                {eventDateTime.startDay}{" "}
                                                {eventDateTime.startMonth}{" "}
                                                {eventDateTime.startYear} ساعت{" "}
                                                {eventDateTime.startTime}{" "}
                                            </p>
                                        </div>
                                        <div className="row px-3">
                                            <i className="bi bi-clock  icons-style"></i>
                                            <p className="pb-3 ed-message">
                                                پایان:{" "}
                                                {eventDateTime.endWeekDay}{" "}
                                                {eventDateTime.endDay}{" "}
                                                {eventDateTime.endMonth}{" "}
                                                {eventDateTime.endYear} ساعت{" "}
                                                {eventDateTime.endTime}{" "}
                                            </p>
                                        </div>

                                        <>
                                            <div className="row px-3 pt-1">
                                                <div className="col">
                                                    <p className="pt-2 px-0 mb-0 text-right">
                                                        آدرس برگزاری
                                                    </p>
                                                    <div className="row px-3">
                                                        <p className="pb-3 ed-message">
                                                            {
                                                                eventDetails.address
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <MapComponent
                                                sendDataToParent={handleMapData}
                                                lati={eventDetails.location_lat}
                                                long={eventDetails.location_lon}
                                                onlyShow={true}
                                                name="EventDetails"
                                            />
                                        </>

                                        <div className="row px-3 pt-1">
                                            <div className="col">
                                                <p className="pt-2 px-0 mb-0 text-right">
                                                    {" "}
                                                    اشتراک گذاری رویداد
                                                </p>
                                                <div
                                                    className="row"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <p
                                                        className="ed-message ellipsis"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {window.location.href}
                                                    </p>
                                                    <button
                                                        className="btn  mt-1 mx-1"
                                                        onClick={
                                                            copyToClipboard
                                                        }
                                                    >
                                                        کپی
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row-reverse",
                                    flexWrap: "wrap",
                                    marginBottom: "25px",
                                    marginTop: "5px",
                                    width: "770px",
                                    maxWidth: "90%",
                                }}
                            >
                                {eventTags}
                            </div>
                        </>
                    </center>
                )}
                {/* <div> */}
                {/* Left Section */}
                {/* <div className="col-md-2 left-section">
                        <AdvertisementCard
                        title="Special Offer"
                        description="Get 50% off on all premium features this week!"
                        linkUrl="/special-offer"
                        linkText="Claim Offer"
                        imageUrl={ads_sample_image}
                        />
                    </div> */}
                <Suggestion />
                <MainComment id={Number(id)} />
                {/* Left Section */}
                {/* <div className="col-md-2 left-section">
                        <AdvertisementCard
                        title="Special Offer"
                        description="Get 50% off on all premium features this week!"
                        linkUrl="/special-offer"
                        linkText="Claim Offer"
                        imageUrl={ads_sample_image}
                        />
                    </div> */}
                {/* </div> */}

                <Footer />
            </div>
        </>
    );
};

export default ConcertDetails;
