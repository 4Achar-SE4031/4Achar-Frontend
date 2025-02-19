import React, { useState, useEffect } from "react";
import Card from "../../app/common/Card/Card";
// import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Lottie from "react-lottie";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";

import { Event } from "../../app/models/event";
import agent from "../../app/api/agent";
import animationData from "../../app/common/lottie/Animation - 1715854965467.json";
import "./EventsList.css";
import EventItem from "./EventItem";
import mockEvents from "../../app/common/Mock Data/MOCK_DATA.json";
import { useStore } from "../../app/store/Store";
import Pagination from "../../app/common/Pagination";
import EventsFilter from "./EventsFilter";
import Footer from "../../app/layout/Footer";
import Navbar from "../Navbar/navbar";
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};

const EventsList: React.FC = () => {
  const [posts, setPosts] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [index, setIndex] = useState<number>(1);
  const [title, setTitle] = useState<string>();
  const [filters, setFilters] = useState<any>({
    priceFrom: "",
    priceTo: "",
    province: "",
    category: "",
    sortType: "",
    dateRange: [null, null],
  });
  const [eventType, setEventType] = useState<string | undefined>();
  const { eventStore } = useStore()
  const location = useLocation()
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // useEffect(() => {
  //   let filteredEvents = [...mockEvents];

  //   // Apply filters
  //   if (filters.city) {
  //     filteredEvents = filteredEvents.filter((event) => event.city === filters.city);
  //   }
  //   if (filters.category) {
  //     filteredEvents = filteredEvents.filter((event) => event.category === filters.category);
  //   }
  //   filteredEvents = filteredEvents.filter(
  //     (event) =>
  //       event.ticket_price >= filters.priceRange[0] &&
  //       event.ticket_price <= filters.priceRange[1]
  //   );
  //   if (filters.sortType === "cheap") {
  //     filteredEvents = filteredEvents.sort((a, b) => a.ticket_price - b.ticket_price);
  //   } else if (filters.sortType === "expensive") {
  //     filteredEvents = filteredEvents.sort((a, b) => b.ticket_price - a.ticket_price);
  //   }

  //   setPosts(filteredEvents.slice(0, 15)); // Update posts based on filters
  // }, [filters]);

  const filterQueryParams = (params: Object) => {
    console.log(params)
    return Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== undefined && value !== null && value !== "0")
    );
  }
  useEffect(() => {
    setEventType(location.pathname.split("/")[2])
    if (eventType === "recent") {
      setTitle("جدیدترین رویدادها")
    } else if (eventType === "popular") {
      setTitle("محبوب ترین رویدادها")
    }
  }, [eventType])
  useEffect(() => {
    const fetchFilteredEvents = async () => {

      setLoading(true);

      try {
        const skip = 15 * (index - 1)
        const queryParams = new URLSearchParams(
          filterQueryParams({
            City: filters.province || "",
            Category: filters.category || "",
            TicketPriceRangeStart: filters.priceFrom ? filters.priceFrom.toString() : "",
            TicketPriceRangeEnd:  filters.priceTo ? filters.priceTo.toString() : "",
            sortType: filters.sortType || "",
            StartRange: filters.dateRange[0] || "",
            EndRange: filters.dateRange[1] || "",
            Skip: skip.toString(),
            Take: "15",
          })
        ).toString();
        const response = await agent.Events.list(`${queryParams}`);
        setTotalPages(Math.ceil(response.totalCount / 15));
        setPosts(response.concerts);
        console.log(posts);
        console.log(totalPages);
        if (posts.length > 0) {
          setLoading(true);
        } else {
          setLoading(false);
        }
        console.log(isFetched)
        console.log(response)
      } catch (error) {
        console.error("Error fetching filtered events:", error);
        setIsFetched(false);
      } finally {
        setLoading(false);
      }
      // console.log(loading);
    };

    fetchFilteredEvents();
  }, [filters, currentPage]);



  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await agent.Events.list();
  //       setPosts(response);
  //       setTotalPages(Math.ceil(response.length / 12));
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Failed to fetch events", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchEvents();
  // }, [currentPage]);
  // useEffect(() => {
  //   setLoading(true);
  //   let sortedEvents = [...mockEvents];
  //   if (!eventType){
  //     setEventType(location.pathname.split("/")[2])
  //   }
  //   if (eventType === "recent") {
  //     sortedEvents = sortedEvents.sort((a, b) => Date.parse(b.start_date) - Date.parse(a.start_date));
  //     setTitle("جدیدترین رویدادها")
  //   } else if (eventType === "popular") {
  //     sortedEvents = sortedEvents.sort((a, b) => b.rating - a.rating);
  //     setTitle("محبوب ترین رویدادها")
  //   }

  //   setPosts(sortedEvents.slice(15 * (index - 1), 15 * index));
  //   setTotalPages(Math.ceil(sortedEvents.length / 15));
  //   setLoading(false);
  // }, [eventType, currentPage]);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    setIndex(value)
    window.scrollTo(0, 0);

  };

  return (
    <><Navbar />
      <Card className="events-list">
        {/* Events Filter Component */}
        <div className="container custom-container mb-1" lang="fa">
          <EventsFilter onFilterChange={handleFilterChange} />
          <div className="text-right events-title">
            <h2 className="section-title pb-5" style={{ color: '#ffeba7', fontFamily: 'iransansweb' }}>
              {title}
            </h2>
          </div>
          <div className="items pb-5">
            {loading && (
              <div className="loading">
                <Lottie options={defaultOptions} />
              </div>
            )}
            {!loading && posts?.length > 0 ? posts.map((event) => (
              <div key={event.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-5">
                <EventItem event={event} />
              </div>
            )) : (
              !loading && <p className="nothing">متاسفانه رویدادی یافت نشد.</p>
            )}
            {!loading &&(
              <Stack spacing={2} className="pt-5">
                <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} />
              </Stack>)}
          </div>
        </div>
        <Footer />
      </Card>
    </>
  );
};

export default observer(EventsList);