import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/navbar";
import './search.css'
import Lottie from "react-lottie";
import animationData from "../user/concertDetailsPage/Animation - 1715854965467.json";
import PageNotFound from "../user/concertDetailsPage/PageNotFound/PageNotFound";
import { useSearch } from "./searchStatus";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  const { singer } = useParams<{ singer: string }>(); 
  const [data, setData] = useState<any>(null); 
  const [error, setError] = useState<string | null>(null); 
  const { searchStatus, setSearchStatus } = useSearch();
  const navigate = useNavigate();
  
  const defaultOptions = {
      loop: true,
      autoplay: true,
      clickToPause: true,
      animationData: animationData,
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!singer) {
        setError("ID معتبر نیست.");
        console.log("ID is not valid");
        return;
      }
      let searchTerm = singer.split('/').pop()?.replace(/-/g, " ").normalize("NFC").trim(); 
      if (!searchTerm) {
        setError("مقدار جستجو پیدا نشد.");
        console.log("Search term is not valid");
        return;
      }
      

      try {
        const response = await axios.post(
          "https://api-concertify.darkube.app/Concert/search",
          { searchTerm:  searchTerm }, 
          {
            headers: {
              "Content-Type": "application/json",
              accept: "text/plain",
            },
          }
        );
        console.log("Loaded data: "+response.data)
        setTimeout(() => {
          if (response.data && Object.keys(response.data).length > 0){
            setData(response.data); 
            console.log("Data to show "+response.data);
            setSearchStatus("Loaded");
            console.log("search status in SEARCH: "+searchStatus);
          }else{
            setSearchStatus("gotError");
            console.log("Nothing to show "+response.data);
            console.log("search status in SEARCH: "+searchStatus);
          }
          
        }, 1000);
      } catch (err) {
        console.error("Error during API call:", err);
        setError("خطا در دریافت داده‌ها!");
        setTimeout(() => {
          setSearchStatus("gotError");
        }, 1000);
      }
    };
    fetchData();
  }, [singer]); 

  if(searchStatus == "gotError"){
    return <PageNotFound />;
  }

  if(searchStatus == "Loading"){
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

  return (
    <>
      <Navbar />
      <div className="searchpage">
        <div className="results">
          {data.map((item: any) => (
            <div
              key={item.id}
              className="result-card"
              style={{ backgroundImage: `url(${item.cardImage})` }}
            >
              <div className="card-content">
                <h2>{item.title}</h2>
                <p>
                  <i className="bi bi-geo-alt" style={{ marginLeft: '5px', fontSize: "13px"}}></i>
                  {item.location}
                </p>
                <p>
                  <i className="bi bi-calendar-week" style={{ marginLeft: '5px', fontSize: "13px"}}></i>
                  {`${new Date(item.startDateTime).toLocaleString("fa-IR", {
                    weekday: "long",
                  })} ${new Date(item.startDateTime).toLocaleDateString("fa-IR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}، ${new Date(item.startDateTime).toLocaleString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                </p>
                
                <button className="buy-button" onClick={() => {
                  navigate(`/concertDetail/${item.id}`)
                  setSearchStatus("loading")
                  }}>
                  <i className="bi bi-bag-plus" style={{ marginLeft: '5px', fontSize: "16px" }}></i>
                  خرید بلیت
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>

  );
  
};

export default Search;


