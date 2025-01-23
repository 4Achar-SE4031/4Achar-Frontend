import React, { useState,useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import copy from 'clipboard-copy';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import PageNotFound from "./PageNotFound/PageNotFound.tsx";

import Navbar from "../../Navbar/navbar.tsx";
import './c_details.css'
import OrganizerInfoModal from "./organizer-contact-info.tsx";

import MainComment from "../../Comment/MainComment.tsx";

import moment from 'moment-jalaali';
import animationData from "./Animation - 1715854965467.json";
import Lottie from "react-lottie";
import MapComponent from "./MapComponent/MapComponent.tsx";

import { useAuth } from "../Authentication/authProvider.tsx";
import HoverRating from "./Rating.tsx"
import MusicNotes from './MusicNotes.tsx';
import Footer from "../../../app/layout/Footer.tsx";

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
    const navigator=useNavigate();
    let { id } = useParams<{ id: string }>();
    const monthDict ={0:"فروردین", 1:"اردیبهشت",2:"خرداد",3:"تیر",4:"مرداد",5:"شهریور",6:"مهر",7:"آبان",8:"آذر",9:"دی",10:"بهمن",11:"اسفند"};
    const dayDict ={"Monday":"دوشنبه","Tuesday":"سه شنبه","Wednesday":"چهارشنبه","Thursday":"پنج شنبه","Friday":"جمعه","Saturday":"شنبه","Sunday":"یک شنبه"};
    const [eventDateTime,setEventDateTime] = useState(
        {
        startWeekDay:"جمعه",
        startMonth:"آذر",
        startTime:"21:00",
        startYear:"1403",
        startDay:"25",
        endWeekDay:"جمعه",
        endMonth:"آذر",
        endTime:"23:00",
        endYear:"1403",
        endDay:"25",
    }
        );
    const [eventDetails, setEventDetails] = useState({
        title:"کنسرت ارکستر سمفونیک قاف (منظومه سیمرغ)",
        ticket_price:"600000",
        attendance:"I",
        province:"تهران",
        city:"تهران",
        photo:"/img.png",
        category:"ارکستر سمفونی",
        organizer_photo:"/profile2.png",
        organizer_name:"4AChar-Band",
        organizer_phone:"09123456789",
        organizer_email:"organizer@gmail.com",
        location_lat:"35.7021",
        location_lon:"51.4051",
        address:"تهران، خیابان حافظ، تالار وحدت",
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
        tags:[]

    })
   
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

    

    const bookmarkToggler = async () =>{
            if(auth.token!==""){
                try{
                    const response = await axios.post('https://eventify.liara.run/events/'+id+'/bookmark/',{},{headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                        Authorization:`JWT ${auth.token}`,
                    }},);
                    if (isBookmarked === false){
                        setBookmark(true);
                        toast.success('رویداد به علاقه مندی ها اضافه شد ');

                    // return "bi bi-bookmark-plus";
                    }
                    else{
                        setBookmark(false);
                        toast.error('رویداد از علاقه مندی ها حذف شد ');

                        // return "bi bi-bookmark-plus-fill";
                    }
                }catch (error) {


                }
                
            }else{
                // toast.error('برای افزودن به علاقه مندی ها باید وارد سیستم شوید!');
            // setTimeout(() => {
            //     navigator('/login');
            // }, 2500);
        }
            
           
        
    }
    const [screenSize, setScreenSize] = useState<string>('');

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);

        //disable vertical scrollbar
        document.documentElement.style.overflowY = 'hidden';
        //change title of html page dynamically
        document.title = "جزئیات رویداد";
        let width = window.innerWidth;
        if(width<576){
            setScreenSize('extra small');
        }else if(width>=576 && width<768){
            setScreenSize('small');
        }
        else if(width>=768 && width<1200){
            setScreenSize('medium');
        }else{
            setScreenSize('large');
        }
    }, []);
    useEffect(() => {
        const handleResize = () => {
            let width = window.innerWidth;
            if(width<576){
                setScreenSize('extra small');
            }else if(width>=576 && width<865){
                setScreenSize('small');
            }
            else if(width>=865 && width<1200){
                setScreenSize('medium');
            }else{
                setScreenSize('large');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    })


    const copyToClipboard = () => {
        copy(currentUrl)
        .then(() => {
        })
        .catch(err => {
        });
    };

    const copyLinkToClipboard = () => {
        copy(window.location.href)
        .then(() => {
        })
        .catch(err => {
            console.error('خطا در کپی کردن لینک برگزاری:', err);
        });
    };

    const handleMapData = (data: { lat: any; lng: any }) => {
        console.log("Latitude:", data.lat);
        console.log("Longitude:", data.lng);
        // Implement additional logic with 'data' here
    }

    const searchTagHandler = (tag: string) =>{
    }
    const eventTags = eventDetails.tags.map(tag => <div className="container" onClick={() =>searchTagHandler(tag)} style={{cursor:"pointer",borderRadius:"5px",margin:"5px",paddingTop:"3px",paddingBottom:"2px",paddingLeft:"4px",paddingRight:"4px",background:"#808080",width:"fit-content",fontSize:"12px",height:"20px"}}>{tag}#</div>);
    if (loading) {
        return(
            <div className="event-details"> 
                <Navbar/>
                
                <div className="container col loading" style={{height:"200px",width:"200px" ,marginTop:"15%"}}>
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
            <Navbar/>
            <div className="music-notes-container">
                    <MusicNotes count={30}/>
            </div>

            <div className="concert-details"> 
                {screenSize==='large' && <>
                        <div className="row justify-content-center" style={{marginTop:"30px"}}>
                            
                            <div className="event-details-mcard py-3 mr-0  px-3 mb-2" style={{width:"350px",maxWidth:"350px"}}>
                                    <p className="pb-3 ed-message text-right">{eventDateTime.startDay} {eventDateTime.startMonth} {eventDateTime.startYear} ساعت {eventDateTime.startTime} </p>
                                    <h4 className=" pb-3 text-right"> {eventDetails.title} </h4>
                                    <div className="row px-3 mb-2"> 
                                        <i className="bi bi-tag-fill icons-style"></i>
                                        <p className="ed-message">{eventDetails.ticket_price.toLocaleString()} تومان</p>
                                        
                                    </div>
                                    
                                    <div className="row px-3 mb-2">
                                        <i className="bi bi-geo-alt-fill icons-style"></i>
                                        <p className="ed-message">{eventDetails.province}-{eventDetails.city}</p>
                                    </div>

                                    <div className="row px-3 pb-3 mb-2">
                                        <p className="bi bi-grid icons-style"></p>
                                        <p className="ed-message">{eventDetails.category}</p>
                                    </div>
                                    <div className="row px-3 pt-1" >
                                        <img className="mt-1" 
                                        src={(eventDetails.organizer_photo!=="" && eventDetails.organizer_photo!== null)?eventDetails.organizer_photo : require("src/features/user/concertDetailsPage/profile.png")}
                                        
                                        style={{height:"45px",borderRadius: "50%" }} alt="profile"/>
                                        <div className="col">
                                            <p className="pt-3 px-0 text-right"> {eventDetails.organizer_name} </p>
                                        </div>
                                    </div>
                                    <center>
                                        <HoverRating/>
                                    </center>
                                    <center>
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

                            <div>
                            <img 
                                        src={(eventDetails.photo!=="" && eventDetails.photo!== null)?eventDetails.photo : require("../../assets/events.jpg")}
                                        alt="Your Image"
                                        style={{ width: "770px", height: "400px",zIndex: 10,position: "relative"}}
                                    />
                                
                            </div>
                        </div> 

                    <div className="row justify-content-center">
                    <div className="event-details-card py-3 mr-0  px-3 mb-2" style={{width:"350px",height:"fit-content"}}>
                                <div className="row px-3">
                                    <i className="bi bi-clock  icons-style"></i>
                                    <p className="pb-1 ed-message">شروع: {eventDateTime.startWeekDay} {eventDateTime.startDay} {eventDateTime.startMonth} {eventDateTime.startYear} ساعت {eventDateTime.startTime} </p>

                                </div>
                                <div className="row px-3">
                                    <i className="bi bi-clock  icons-style"></i>
                                    <p className="pb-3 ed-message">پایان: {eventDateTime.endWeekDay} {eventDateTime.endDay} {eventDateTime.endMonth} {eventDateTime.endYear} ساعت {eventDateTime.endTime} </p>

                                </div>
                                <>
                                    <div className="row px-3 pt-1" >
                                        <div className="col">
                                            <p className="pt-2 px-0 mb-0 text-right">آدرس برگزاری</p>
                                            <div className="row px-3">
                                                <p className="pb-3 ed-message">{eventDetails.address}</p>
                                            </div>
                                        
                                        </div>
                                    </div>
                                    <MapComponent  
                                        sendDataToParent={handleMapData} 
                                        lati={eventDetails.location_lat} 
                                        long={eventDetails.location_lon} 
                                        address={eventDetails.address}
                                        onlyShow={true} 
                                        name="EventDetails"
                                        />
                                </>
                                
                                
                                <div className="row px-3 pt-1" >
                                    <div className="col">
                                        <p className="pt-2 px-0 mb-0 text-right"> اشتراک گذاری رویداد</p>
                                        <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p className="ed-message ellipsis" style={{fontSize:"12px"}}>{window.location.href}</p>
                                            <button className="btn  mt-1 mx-1" onClick={copyToClipboard}>
                                                کپی   
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                        <div>
                            <div className="event-details-card py-3 mr-0 ml-2 px-3 mb-2" style={{width:"765px",maxWidth:"100%",zIndex: 10,position: "relative"}}>
                                    <h4 className="pb-3" style={{textAlign: "center"}}>توضیحات</h4>
                                    <p className="ed-message" style={{whiteSpace:"pre-line", textAlign: "right"}}>{eventDetails.description}</p>
                                    <center>
                                    {canPurchase && 
                                        <button
                                            className="btn  mt-1 mx-1"
                                            onClick={(e) => navigator('/register-event/'+Number(id).toString())}
                                            >
                                            خرید بلیت  
                                        </button>
                                    }
                                        
                                    </center>
                                    
                                    </div>
                                  <div style={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: "25px", marginTop: "5px", width: "770px", maxWidth: "100%" }}>
                                    {eventTags}
                                </div>  
                            </div>
                </div> 
                </>
                }
                <MainComment id={Number(id)}/>
                <Footer />
            </div> 
            
        </>
    );
}

export default ConcertDetails;














