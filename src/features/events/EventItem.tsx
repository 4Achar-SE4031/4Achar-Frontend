import React from "react";
import { Link } from "react-router-dom";
import photo1 from "../../assets/Images/events.jpg";
import { Event } from "../../app/models/event";
import { observer } from "mobx-react-lite";
import toPersianDigits from "../../app/common/toPersianDigits";


interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  return (
    <Link to={`/concertdetail`}>
      <div className="item mb-3">
        <div className="event-img">
          <img
            alt={event.title}
            src={event.photo || photo1}
            onError={(e) => (e.currentTarget.src = photo1)}
          />
        </div>

        <div className="event-info">
          <div className="event-info__title">
            <h1 id="event-title">{event.title}</h1>
          </div>
          <div className="event-info__details">
            <h4 id="event-details">{event.details}</h4>
            <i className="input-icon uil uil-document-layout-right"></i>
          </div>
          <div className="event-info__address"> 
            <h4 id="event-address">{`${event.province} ${event.city}`} </h4>
            <i className="input-icon uil uil-location-point"></i>
          </div>
          <div className="event-info__date">
            <h4 id="event-date">{toPersianDigits(event.start_date)}</h4>
            <i className="input-icon uil uil-calendar-alt"></i>
          </div>
          <div className="event-info__hour">
            <h5 id="event-hour">{toPersianDigits(event.start_hour)}</h5>
            <i className="input-icon uil uil-clock"></i>
          </div>
        </div>
      </div>
      <div className="event-info__title">
            <h1 id="event-title">{event.title}</h1>
      </div>
    </Link>
  );
};

export default observer(EventItem);
