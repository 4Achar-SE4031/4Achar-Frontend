import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/navbar";
import './search.css'
import Lottie from "react-lottie";
import animationData from "../user/concertDetailsPage/Animation - 1715854965467.json";
import PageNotFound from "../user/concertDetailsPage/PageNotFound/PageNotFound";
import { useSearch } from "./searchStatus";

const Search: React.FC = () => {
  const { singer } = useParams<{ singer: string }>(); 
  const [data, setData] = useState<any>(null); 
  const [error, setError] = useState<string | null>(null); 
  const { searchStatus, setSearchStatus } = useSearch();

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
      <Navbar/>
      <div className ="searchpage">
        <h1>نتایج جستجو</h1>
        <pre style={{color:"white"}}>{JSON.stringify(data, null, 2)}</pre>
        <div style={{height:"50px"}}> </div>
      </div>
    </>
  );
};

export default Search;
