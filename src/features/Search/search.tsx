import React, { useState } from "react";
import "./search.css";
import Navbar from "../Navbar/navbar";

const SearchBar: React.FC = () => {
  const suggestions = [
    "Channel",
    "CodingLab",
    "CodingNepal",
    "YouTube",
    "YouTuber",
    "YouTube Channel",
    "Blogger",
    "Bollywood",
    "Vlogger",
    "Vehicles",
    "Facebook",
    "Freelancer",
    "Facebook Page",
    "Designer",
    "Developer",
    "Web Designer",
    "Web Developer",
    "Login Form in HTML & CSS",
    "How to learn HTML & CSS",
    "How to learn JavaScript",
    "How to become Freelancer",
    "How to become Web Designer",
    "How to start Gaming Channel",
    "How to start YouTube Channel",
    "What does HTML stands for?",
    "What does CSS stands for?",
  ];

  const [userInput, setUserInput] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUserInput(inputValue);
    if (inputValue) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleClickSuggestion = (suggestion: string) => {
    setUserInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="searchInput">
          <input
            type="text"
            placeholder="Enter a keyword..."
            value={userInput}
            onChange={handleChange}
          />
          <div className="suggestions-container">
            {showSuggestions && (
              <div className="suggestions-list">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleClickSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="icon">
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
