import React from "react";
import { Link } from "react-router-dom";
import photo1 from "../../assets/Images/events.jpg";
import { Event } from "../../app/models/event";
import { observer } from "mobx-react-lite";
import toPersianDigits from "../../app/common/toPersianDigits";
import moment from "moment-jalaali";


interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
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
  return (
    <Link to={"/concertdetail"}>
      <div className="item mb-3">
        <div className="event-img">
          <img
            alt={event.title}
            src={event.cardImage || photo1}
            onError={(e) => (e.currentTarget.src = photo1)}
          />
        </div>

        <div className="event-info">
          <div className="event-info__title">
            <h1 id="event-title">{event.title}</h1>
          </div>
          {/* <div className="event-info__details">
            <h4 id="event-details">{event.details}</h4>
            <i className="input-icon uil uil-document-layout-right"></i>
          </div> */}
              <div className="event-info__details ml-5">
            <h4 id="event-details" className="truncate">{event.location}</h4>
            <i className="input-icon uil uil-document-layout-right"></i>
          </div>
          <div className="event-info__address"> 
            <h4 id="event-address">{`${event.city}`} </h4>
            <i className="input-icon uil uil-location-point"></i>
          </div>
          <div className="event-info__date">
            <h4 id="event-date">{toPersianDigits(replaceMonthNames(event.startDateTime))} ساعت {toPersianDigits(getFormattedTime(event.startDateTime))}</h4>
            <i className="input-icon uil uil-calendar-alt"></i>
          </div>
          {/* <div className="event-info__hour">
            <h5 id="event-hour">{toPersianDigits(getFormattedTime(event.startDateTime))}</h5>
            <i className="input-icon uil uil-clock"></i>
          </div> */}
          {event.ticketPrice && event.ticketPrice.length > 0 && (
            <div className="event-info__price">
              <h4 id="event-price">
                {(() => {
                  const { minPrice, maxPrice } = getMinMaxPrice(event.ticketPrice);
                  if (minPrice === maxPrice) {
                    return `${formatPrice(minPrice)} تومان`;
                  }
                  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} تومان`;
                })()}
              </h4>
              <i className="input-icon uil uil-pricetag-alt"></i>
            </div>
          )}
          
        </div>
      </div>
      <div className="event-info__title">
            <h1 id="event-title">{!event.title.includes(")") ? event.title : event.title.substring(0, event.title.indexOf("("))}</h1>
      </div>
    </Link>
  );
};

export default observer(EventItem);