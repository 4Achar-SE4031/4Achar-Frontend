import React from "react";
import { Link } from "react-router-dom";
import photo1 from "../../assets/Images/events.jpg";
import { Event } from "../../app/models/event";
import { observer } from "mobx-react-lite";
import toPersianDigits from "../../app/common/toPersianDigits";
import moment from "moment-jalaali";
import { useNavigate } from "react-router-dom";

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const navigate = useNavigate();
  const replaceMonthNames = (date: any) => {
    let shamsiStartDate = moment(date, "YYYY-MM-DD").format("jYYYY-jM-jD");
    date = shamsiStartDate;
    const months = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    let [year, month, day] = date.split("-");
    if (day[0] == "0") {
      day = day[1];
    }
    const monthName = months[parseInt(month, 10) - 1];
    const start_date = `${day} ${monthName} ${year}`;
    return start_date;
  }

  const getFormattedTime = (date: string) => {
    return moment(date).locale('fa').format("HH:mm");
  };
  const formatPrice = (price: number) => {
    return toPersianDigits(price.toLocaleString());
  };

  const getMinMaxPrice = (prices: number[]) => {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { minPrice, maxPrice };
  };
  // console.log("-----------")
  // console.log(event)
  return (
    // <div>
    //   <img src={event.cardImage || photo1} alt={event.title} />
    //   <h2>{event.title}</h2>
    //   <p>{event.city} - {event.location}</p>
    //   <p>شروع: {new Date(event.startDateTime).toLocaleString()}</p>
    //   <p>قیمت بلیت: {event.ticketPrice.join(' - ')} تومان</p>
    // </div>
    
    <div
      key={event.id}
      className="concert-card"
      style={{ backgroundImage: `url(${event.cardImage}) `,marginBottom:"20px", marginTop:"20px"}}
      onClick={() => {
        navigate(`/concertDetail/${event.id}`)
        // setSearchStatus("loading")
      }}
    >
      <div className="card-content">
        <h2>{event.title}</h2>
        <p>
          <i className="bi bi-geo-alt" style={{ marginLeft: '5px', fontSize: "13px"}}></i>
          {event.location}
        </p>
        <div className="row">
          <p style={{marginTop:"6px",}}>
            <i className="bi bi-calendar-week" style={{ marginLeft: '5px', fontSize: "13px",marginRight:"15px"}}></i>
          </p>
        <p>
          {`${new Date(event.startDateTime).toLocaleString("fa-IR", {
            weekday: "long",
          })} ${new Date(event.startDateTime).toLocaleDateString("fa-IR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}، ${new Date(event.startDateTime).toLocaleString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </p>
        </div>
        
        
        <button className="buy-button" onClick={() => {
          navigate(`/concertDetail/${event.id}`)
          // setSearchStatus("loading")
          }}>
          <i className="bi bi-bag-plus" style={{ marginLeft: '0px',marginBottom:"25px" ,fontSize: "36px" }}></i>
          خرید بلیت
        </button>
      </div>
    </div>
  );
};

export default observer(EventItem);




// <Link to={`/concertdetail/${event.id}`}>
//       <div className="item mb-3">
//         <div className="event-img">
//           <img
//             alt={event.title}
//             src={event.cardImage || photo1}
//             onError={(e) => (e.currentTarget.src = photo1)}
//           />
//         </div>

//         <div className="event-info">
//           <div className="event-info__title">
//             <h1 id="event-title">{event.title}</h1>
//           </div>

//               <div className="event-info__details ml-5">
//             <h4 id="event-details" className="truncate">{event.location}</h4>
//             <i className="input-icon uil uil-document-layout-right"></i>
//           </div>
//           <div className="event-info__address"> 
//             <h4 id="event-address">{`${event.city}`} </h4>
//             <i className="input-icon uil uil-location-point"></i>
//           </div>
//           <div className="event-info__date">
//             <h4 id="event-date">{toPersianDigits(replaceMonthNames(event.startDateTime))} ساعت {toPersianDigits(getFormattedTime(event.startDateTime))}</h4>
//             <i className="input-icon uil uil-calendar-alt"></i>
//           </div>

//           {event.ticketPrice && event.ticketPrice.length > 0 && (
//             <div className="event-info__price">
//               <h4 id="event-price">
//                 {(() => {
//                   const { minPrice, maxPrice } = getMinMaxPrice(event.ticketPrice);
//                   if (minPrice === maxPrice) {
//                     return `${formatPrice(minPrice)} تومان`;
//                   }
//                   return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} تومان`;
//                 })()}
//               </h4>
//               <i className="input-icon uil uil-pricetag-alt"></i>
//             </div>
//           )}
          
//         </div>
//       </div>
//       <div className="event-info__title">
//             <h1 id="event-title">{!event.title.includes(")") ? event.title : event.title.substring(0, event.title.indexOf("("))}</h1>
//       </div>
//     </Link>