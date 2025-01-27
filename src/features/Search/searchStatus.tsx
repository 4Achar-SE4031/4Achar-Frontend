import React, { createContext, useContext, useState } from "react";

interface SearchContextType {
  searchStatus: string;
  setSearchStatus: (status: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchStatus, setSearchStatus] = useState<string>("Loading");
  
  return (
    <SearchContext.Provider value={{ searchStatus, setSearchStatus }}>
      {children}
    </SearchContext.Provider>
  );
};
export default SearchProvider;

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
