// ModelView.jsx
import React, { useState, useEffect } from "react";
import search from "../lib/search.js"
import { Form, useLoaderData } from "react-router-dom";
import { Input } from "../../components/ui/input";
import SortByDropdown from "../components/SortDropdown";
import ModelDropdown from "../components/ModelDropdown";
import InstanceCard from "../components/InstanceCard";
import { Button } from "../../components/ui/button";
import { useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";
import { getJobs, getEmployers, getResources } from '../lib/api.js';

export async function loader({ params }) {
  const query = params.query;
  // console.log(params)
  // const instance_ctr = await axios.get(config.api_url + '/' + params.route + '/' + instance_id);
  // const instance = query

  // title
  // subheading
  // img_url
  // related_instances

  return { query };
  // return { instance }
}

const Search = () => {
  const location = useLocation();
  const { query } = useLoaderData();

  const [liveQuery, setLiveQuery] = useState(query)
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [model, setModel] = useState("Jobs");

  const modelEnum = {
    "Jobs": getJobs,
    "Employers": getEmployers,
    "Resources": getResources
  }


  const itemsPerPage = 21;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    modelEnum[model]().then((data) => {
      setData(data);
      handleSearch(liveQuery, data)
    });
  }, [model]);

  useEffect(() => {
    setLiveQuery(query)
  }, [location]);


  useEffect(() => {
    handleSearch(liveQuery, data)
    // if(!liveQuery) {
    //   setFilteredData(data);
    //   return;
    // }
    // setFilteredData(search(data, liveQuery))
  }, [liveQuery]);

  const handleSearch= (query, data) => {
    if (!query) {
      setFilteredData(data);
      return;
    }
    setFilteredData(search(data, query))
  };

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
        Search
      </h1>
      <div className="controls !w-full flex flex-col-reverse sm:flex-row justify-between content-evenly items-center sm:items-center">
        {/* <SortByDropdown className="!w-full" /> */}
        <ModelDropdown className="!w-full" onModelChange={setModel}/>
        <div className="flex sm:flex-grow w-full sm:w-auto my-2">
          <Input
            className="bg-white/50 sm:flex-grow sm:w-max mr-4 sm:ml-12"
            placeholder={"Search "}
            value={liveQuery}
            onChange={(e) => setLiveQuery(e.target.value)}
          />
          <Button className="bg-[#3b4354]">Search&nbsp;&nbsp;&nbsp;🔍</Button>
        </div>
      </div>
      <hr className="mt-4 mb-3" />
      <p className="mb-3 font-bold text-[#3b4354]">
        {filteredData.length} results found for {liveQuery}:
      </p>
      <Pagination
        totalItems={data.length}
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

export default Search;
