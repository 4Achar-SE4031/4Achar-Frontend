import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../user/login/authProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
// import Wallet from "../Wallet/wallet";
import axios from "axios";
import blogo from '/concertify-logo.png';
import slogo from '/logo-small.png';
import profile from '/profile.png';
import agent from "../../app/api/agent";

interface UserData {
  email?: string;
  firstName?:string;
  lastName?:string;
  userName?:string;
  profilePicture?:string;
}

const Navbar: React.FC = () => {
  const auth = useAuth();
  const [userData, setUserData] = useState<UserData | null>(
    JSON.parse(localStorage.getItem("userData") || "null")
  );
  const navigate = useNavigate();
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchBoxText, setSearchBoxText] = useState<string>("");
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [logo, setLogo] = useState(window.innerWidth > 1040 ? blogo : slogo);

  const mockSuggestions = [
    "کنسرت کلاسیک تهران",
    "کنسرت پاپ اصفهان",
    "نمایشگاه موسیقی",
    "کنسرت گروه راک",
    "کنسرت جاستین بیبر",
    "کنسرت کنسرتی"
  ];
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const fetchSuggestions = async (query: string) => {
    console.log("fetching suggestions")
    if (query.length >= 1) {  // جستجو تنها زمانی شروع شود که حداقل 3 حرف تایپ شده باشد
      try {
        // const response = await axios.get(`your-api-endpoint?query=${query}`);
        // setSuggestions(response.data);
        const filteredSuggestions = mockSuggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(query.toLowerCase())
        );

        setSuggestions(filteredSuggestions);
        console.log("Filtered Suggestions:", suggestions);  // چاپ فیلتر شده‌ها

      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };
  
  useEffect(() => {
    console.log("------------------")
    console.log("user data: "+ userData)
    console.log("token: "+ auth.token)
  },[]);
  useEffect(() => {
    console.log("Updated Suggestions:", suggestions);
  }, [suggestions]);
  
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData") || "null");
    setUserData(storedUserData);
    
    if (auth.token) {
      if (!isLoggedIn) {
        const fetchUserData = async () => {
          try {
            const response = await axios.get<UserData>("https://api-concertify.darkube.app/account/me/", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${auth.token}`,
              },
            });
            console.log(response)
            localStorage.setItem("userData", JSON.stringify(response.data));
            setUserData(response.data);
            setIsLoggedIn(true);
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              auth.logOut();
            }
          }
        };

        fetchUserData();
      }
    } else {
      setIsLoggedIn(false);
    }

    const handleResize = () => {
      if (window.innerWidth > 1040) {
        setLogo(blogo)
      }else{
        setLogo(slogo)
      }
      if (window.innerWidth > 630) {
        setShowDrawer(false);
        setShowBorder(true);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [auth, isLoggedIn, isOpen]);

  const handleShowDrawer = () => {
    
    setShowDrawer(!showDrawer);
    if (!showBorder) {
      setTimeout(() => setShowBorder(!showBorder), 300);
    } else {
      setShowBorder(!showBorder);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchBoxText(query);
    fetchSuggestions(query);
  };
  
  const searchHandler = () => {
    // Add your search logic here
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div>
          <NavLink to="/home">
            <img
              className="logo"
              src={logo}
              style={{ paddingBottom: "15px" }}
              alt="Logo"
            />
          </NavLink>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="جستجو..."
            className="search-input"
            value={searchBoxText}
            // onChange={(e) => setSearchBoxText(e.target.value)}
            onChange={handleSearchInputChange}
          />
          <button className="search-button" onClick={searchHandler}>
            <p className="bi bi-search search-icon"></p>
          </button>
          <div className="suggestions-container">
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="suggestion-item">
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="menu-icon" onClick={handleShowDrawer}>
          <i className="bi bi-list" style={{ fontSize: "28px", paddingBottom: "15px" }}></i>
        </div>

        <div className={`nav-elements ${showDrawer && "active"}`}>
          <ul>
            {/* {!showDrawer && auth.token && (
              <li>
                <Wallet balance={userData?.balance || 0} />
              </li>
            )} */}
            <li>
              <NavLink to="/home" >خانه</NavLink>
            </li>
            <li>
              <NavLink to="/create-event">ویترین</NavLink>
            </li>
            <li>
              <NavLink to="/create-event"> خرید ها</NavLink>
            </li>
            {/* <li>
              <NavLink to="/create-event">ایجاد کنسرت </NavLink>
            </li> */}
            
            {!showDrawer && !auth.token && showBorder && (
              <div className="auth-link">
                  <NavLink to="/register" style={{marginLeft:"30px",marginBottom:"3px",marginRight:"13px"}}>عضویت</NavLink>
                
                <li className="auth-link-li">
                  <NavLink to="/login">ورود</NavLink>
                </li>
              </div>
            )}

                {!showDrawer && auth.token && 
                        <div className="dropdown-container" onMouseEnter={() => setIsOpen(true)}>
                        
                        <div className="row" >
                            {userData && <p className="pt-2 px-2 ellipsis"> {userData.userName}</p>}
                            {/* {userData!.profilePicture && <img src={userData!.profilePicture} style={{height:"40px",width:"40px",borderRadius: "50%"  }} alt="profile"/>}
                            {!userData!.profilePicture && <img src={profile} style={{height:"40px",width:"40px",borderRadius: "50%"  }} alt="profile"/>} */}
                            
                            {userData?.profilePicture ? (
                                <img
                                  src={userData.profilePicture}
                                  style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                                  alt="profile"
                                />
                              ) : (
                                <img
                                  src={profile}
                                  style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                                  alt="profile"
                                />
                            )}
                        </div>
                          
                        
                        {isOpen && (
                          <div className="col dropdown-contentt">
                            {/* <div className="row"> ردیف 1</div>
                            <div className="row"> ردیف 2</div> */}
                                <div className="row pr-2 pt-2  dropdown-item1" onClick={() =>navigate('/user-info')}>
                                        <i className="pl-1 ml-0  uil uil-user"></i>
                                        <p className="pt-0 mb-0">حساب کاربری</p>
                                </div>
                                <div className="row pr-2 dropdown-item2" >
                                        <i className=" pl-2 pr-1 mt-1 bi bi-box-arrow-right"></i>
                                          <p className="mt-1" onClick={() => {
                                toast.error("از حساب کاربری خارج شدید")
                                setTimeout(() => {
                                    auth.logOut()
                                    setIsLoggedIn(false)
                                  }, 4000);
                            }}>خروج </p>

                                </div>
                        </div>
                        
                        )}
                        </div>
                }

            {showDrawer && !auth.token && (
              <>
                <li className="auth-link-li-drawer">
                  <NavLink to="/login">ورود</NavLink>
                </li>
                <li className="auth-link-li-drawer">
                  <NavLink to="/register">عضویت</NavLink>
                </li>
              </>
            )}

            {showDrawer && auth.token && (
              <>
                <li className="auth-link-li">
                  <NavLink to="/user-info">حساب کاربری</NavLink>
                </li>
                {/* <li className="auth-link-li" style={{ marginRight: "15px" }}>
                  <Wallet balance={userData?.balance || 0} />
                </li> */}
                <li
                  className="auth-link-li pb-1"
                  onClick={() => {
                    toast.error("از حساب کاربری خارج شدید");
                    setTimeout(() => {
                      auth.logOut();
                      setIsLoggedIn(false);
                    }, 4000);
                  }}
                >
                  خروج
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
