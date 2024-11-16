import React from "react";
import { Link } from "react-router-dom";
import photo1 from "../../assets/Images/events.jpg";
import { Event } from "../../app/models/event";

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  return (
    <div className="item mb-3">
      {/* <Link to={`/concertdetail/${event.id}`}></Link> */}
      <Link to={`/concertdetail`}>
        <div className="event-img">
          <img
            alt={event.title}
            src={event.photo || photo1}
            onError={(e) => (e.currentTarget.src = photo1)}
          />
        </div>
      </Link>
      
      {/* <Link to={`/concertdetail/${event.id}`}></Link> */}
      <Link to={`/concertdetail`}>
        <div className="event-info">
          <h1>{event.title}</h1>
          <h4>تاریخ: {event.start_date}</h4>
          {/* {event.attendance === "O" ? <h4>آنلاین</h4> : <h4>{`${event.province} ${event.city}`}</h4>} */}
          {/* <h4>{event.category}</h4> */}
          <h5>{event.is_paid ? `${event.ticket_price} تومان` : "رایگان"}</h5>
        </div>
      </Link>
    </div>
  );
};

export default EventItem;
