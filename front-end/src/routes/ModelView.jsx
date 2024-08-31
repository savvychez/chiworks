// ModelView.jsx
import React, { useState, useEffect } from "react";
import search from "../lib/search.js"
import { Input } from "../../components/ui/input";
import SortByDropdown from "../components/SortDropdown";
import FilterDropdown from "../components/FilterDropdown";
import InstanceCard from "../components/InstanceCard";
import { Button } from "../../components/ui/button";
import { useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";
import sorts_filters from "../lib/sorts_filters.json";

const ModelView = ({ title, renderCard, fetchData }) => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [query, setQuery] = useState("");
  const itemsPerPage = 21;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortString, setSortString] = useState("");
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    console.log("fetching data for " + title);
    fetchData(sortString, filterString).then((data) => {
      console.log("Got " + data.length+ " results")
      setData(data);
      setFilteredData(data);
    });
  }, [location, sortString, filterString]);

  useEffect(() => {
    if(!query) {
      setFilteredData(data);
      return;
    }
    setFilteredData(search(data, query))
  }, [query]);

  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-8 lg:px-20 py-12 sm:py-16 bg-slate-50 min-h-screen min-w-screen">
      <h1 className="text-5xl pt-10 pb-8 sm:py-10 font-serif font-bold text-[#3b4354]">
        {title}
      </h1>
      <div className="controls !w-full flex flex-col-reverse sm:flex-row justify-between content-evenly items-center sm:items-center">
        <div className="flex flex-col sm:flex-row w-full">
          <SortByDropdown className="fr!w-max force" sortParams={sorts_filters.sortParams[title]} propogateQueryString={setSortString}/>
          <FilterDropdown className="!w-max force" filterParams={sorts_filters.filterParams[title]} propogateQueryString={setFilterString}/>
        </div>
        <div className="flex  flex-grow w-full sm:w-auto my-2">
          <Input
            className="bg-white/50 sm:flex-grow sm:w-max sm:min-w-[300px] mr-4 sm:ml-4"
            placeholder={"Search " + title.toLowerCase()}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button className="bg-[#3b4354]">Search&nbsp;&nbsp;&nbsp;🔍</Button>
        </div>
      </div>
      <hr className="mt-4 mb-3" />
      <p className="mb-3 font-bold text-[#3b4354]">
        {filteredData.length} {title.toLowerCase()} found <em>|</em> {Math.ceil(filteredData.length / itemsPerPage)} pages
      </p>
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
      <div className="data_view flex flex-wrap w-full justify-center mt-2">
        {currentData.map((item) => (
          <div key={item.id} className="w-[20rem] sm:w-[24rem] sm:m-2 ">
            <InstanceCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelView;
