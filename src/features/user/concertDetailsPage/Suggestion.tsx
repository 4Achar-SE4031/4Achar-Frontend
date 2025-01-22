import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";

import Card from "../../../app/common/Card/Card";
import animationData from "../../../app/common/lottie/Animation - 1715854965467.json";
import "../../events/EventsList.css";
import { useNavigate } from "react-router-dom";
import agent from "../../../app/api/agent";
import { Event } from "../../../app/models/event";
import EventItem from "../../events/EventItem";

const Suggestion: React.FC = () => {
  const [recentEventIndex, setRecentEventIndex] = useState(0);
  const [recentEvents, setRecentEvents] = useState<Event[] | undefined>();
  const [loading, setLoading] = useState(false);
  const eventsToShow = 5;
  // const mockEvents = mock.slice(0, 10)

  const navigate = useNavigate();

  // const recentEvents = [...mockEvents]
  //   .sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate))
  //   .slice(recentEventIndex, recentEventIndex + eventsToShow);

  // const popularEvents = [...mockEvents]
  //   .sort((a, b) => b.rating - a.rating)
  //   .slice(popularEventIndex, popularEventIndex + eventsToShow);
  useEffect(() => {
    const fetchFilteredEvents = async () => {

      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          Skip: "0",
          Take: "20",
        }).toString();
        const response = await agent.Events.list(`${queryParams}`);
        setRecentEvents(response.concerts.slice(0, 10));

        console.log(response)
      } catch (error) {
        console.error("Error fetching filtered events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEvents();
  }, []);
  useEffect(() => {
    const autoAdvance = setInterval(() => {
      setRecentEventIndex((prevIndex) => (prevIndex + 1) % 10);
    }, 6000); // 6 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(autoAdvance);
  }, []);
  const handleIndexChange = (
    currentIndex: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    direction: "next" | "prev"
  ) => {
    setIndex((prevIndex) => {
      if (direction === "next") {
        return (prevIndex + 1) % 10;
      } else {
        return (prevIndex - 1 + 10) % 10;
      }
    });
  };

  const getVisibleEvents = (events: Event[], currentIndex: number) => {
    return [
      ...events.slice(currentIndex, currentIndex + eventsToShow),
      ...events.slice(0, Math.max(0, currentIndex + eventsToShow - 10)),
    ].slice(0, eventsToShow);
  };


  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setRecentEventIndex((prevIndex) =>
  //       prevIndex + 1 >= 10 ? 0 : prevIndex + 1
  //     );
  //     setPopularEventIndex((prevIndex) =>
  //       prevIndex + 1 >= 10 ? 0 : prevIndex + 1
  //     );
  //   }, 5000);

  //   return () => clearInterval(timer);
  // }, [recentEventIndex, popularEventIndex]);





  const handleShowTypeButton = (value: string) => {
    console.log(value)
    navigate(`/events/${value}`)
  }


  return (
    <div className="RecentEvents mb-5">
      <Card className="events-list pb-5" lang="fa" >
        <div className="container-fluid" lang="fa">
          <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
            <button
              className="btn btn-primary show-all ml-5"
              onClick={() => handleShowTypeButton("recent")}
            >
              نمایش همه
            </button>
            <h2 className="section-title" style={{ color: '#ffeba7', fontFamily: 'iransansweb' }}>
              رویدادهای پیشنهادی
            </h2>
          </div>
          <div className="position-relative row justify-content-center align-content-center">
            <button
              className="slider-arrow left col ml-5"
              onClick={() =>
                handleIndexChange(recentEventIndex, setRecentEventIndex, "prev")
              }
            >
              &#8249;
            </button>
            <div className="items col-lg-11 col-sm-9">
              {/* {loading && (
            <div className="loading">
              <Lottie options={defaultOptions} />
            </div>
          )} */}

              {getVisibleEvents(recentEvents || [], recentEventIndex).map((event) => (
                <div key={event.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                  <EventItem event={event} />
                </div>
              ))}


            </div>
            <button
              className="slider-arrow right col mr-5"
              onClick={() =>
                handleIndexChange(recentEventIndex, setRecentEventIndex, "next")
              }
            >
              &#8250;
            </button>

          </div>
          {/* {renderIndicators(recentEventIndex, mockEvents.length, setRecentEventIndex)} */}


        </div>
      </Card>
    </div>
  );
};

export default observer(Suggestion);
