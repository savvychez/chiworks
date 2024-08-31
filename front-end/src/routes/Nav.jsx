import Navbar from 'react-bootstrap/Navbar';
import { Terminal, Waves } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Link, Outlet, useLocation } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import Bean from "../assets/bean.svg"

function Nav() {
  const location = useLocation();
  const [colors, setColors] = useState({
    background: "#3b4354",
    text: "#fafafa",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState(''); // State for input's text value

  const handleSearch = () => {
    console.log('Search triggered with value:', globalSearch);
    navigate(`/search/${globalSearch}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (event) => {
    setGlobalSearch(event.target.value); // Update the state with the new input value
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if(location.pathname === "/") {
      setColors({
        background: "#3b4354",
        text: "#fafafa",
      })
    }
  }, [location])

  return (
    <>
    <div className={`flex flex-col sm:flex-row px-4 sm:px-12 min-w-max py-2 justify-between fixed w-full ${menuOpen && ' shadow-lg border-b-2 border-b-[#252a35]'}`} style={{color: colors.text, backgroundColor: colors.background}}>
        <div className="flex items-center justify-between w-full">
          <Link to={"/"}>
            <img src={Bean} alt="" className='w-8 h-8 mx-4' />
          </Link>
          <button className="sm:hidden text-xl mb-1" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
        
        <div className={`mt-4 sm:mt-0 flex flex-col sm:flex-row mb-1 rounded ${menuOpen ? ' sm:flex' : 'hidden sm:flex list-none'}`}>
          <Link onClick={() => setMenuOpen(false)} to='/jobs'><li className='mx-2 my-1 px-2 py-[4px] md:mt-[7px] lg:mt-1 md:text-[0.9em] lg:text-[1em] rounded-lg list-none hover:bg-[#00000017] transition duration-100'>jobs</li></Link>
          <Link onClick={() => setMenuOpen(false)} to='/employers'><li className='mx-2 my-1 px-2 py-[4px] md:mt-[7px] lg:mt-1 md:text-[0.9em] lg:text-[1em]  rounded-md list-none hover:bg-[#00000017] transition duration-100'>employers</li></Link>
          <Link onClick={() => setMenuOpen(false)} to='/resources'><li className='mx-2 my-1 px-2 py-[4px] md:mt-[7px] lg:mt-1 md:text-[0.9em] lg:text-[1em]  rounded-md list-none hover:bg-[#00000017] transition duration-100'>resources</li></Link>
          <Link onClick={() => setMenuOpen(false)} to={'/about'}><li className='mx-2 my-1 px-2 py-[4px] md:mt-[7px] lg:mt-1 md:text-[0.9em] lg:text-[1em]  rounded-md list-none hover:bg-[#00000017] transition duration-100'>about</li></Link>
          <Link onClick={() => setMenuOpen(false)} to={'/visualizations'}><li className='mx-2 my-1 px-2 py-[4px] md:mt-[7px] lg:mt-1 md:text-[0.9em] lg:text-[1em]  rounded-md list-none hover:bg-[#00000017] transition duration-100'>visualizations</li></Link>
          <a href='https://documenter.getpostman.com/view/29722655/2s9YJXakN2' target='_blank'><li className='mx-2 my-1 md:mt-[7px] lg:mt-1 px-2 py-[4px] md:text-[0.9em] lg:text-[1em]  rounded-md list-none hover:bg-[#00000017] transition duration-100'>api</li></a>
          <div className="flex sm:flex-grow w-full sm:w-auto mx-2 items-center content-center my-2 sm:my-0">
            <Input
        ref={inputRef}
        value={globalSearch} // Bind the input value to the state
        onChange={handleInputChange} // Update the state on input change
        className="bg-[#444d60] text-white md:hidden lg:block placeholder:text-[white]/50 mt-1  h-9 sm:flex-grow sm:w-max mr-4 mx-2 sm:ml-12"
        placeholder={"Search "}
        onKeyPress={handleKeyPress}
      />
      <Button className="bg-[#6C63FF] hover:bg-[#7971ff] h-9 mx-2 mt-1" onClick={handleSearch}>
        Search
      </Button>
          </div>
        </div>
      </div>
      <div className=''>
        <Outlet/>
      </div>
    </>
  );
}

export default Nav;
