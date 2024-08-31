import Navbar from 'react-bootstrap/Navbar';
import { Terminal, Waves } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "../../components/ui/navigation-menu"

import Workers from "../assets/workers.svg"
import { Link, Outlet, useLocation } from "react-router-dom";


const HomePage = () => {
    return (
        <div className='pt-32 lg:pt-60'>
            <div className='px-20  min-w-full flex flex-col-reverse lg:px-40 lg:flex-row items-center justify-between  '>
                <div className='flex flex-col mt-8'>
                    <h1 className='block text-white text-5xl font-serif font-bold text-center lg:text-start'>chiworks</h1>
                    <p className='block text-white text-lg lg:text-2xl font-sans my-3 text-center lg:text-start w-full'>your guide to working in the<br />windy city</p>
                    <Link to='/jobs' className='mx-auto lg:mx-0 w-full lg:w-auto block'>
                        <button className='text-white w-full lg:w-auto text-xl my-5 bg-[#6C63FF] px-8 py-[12px] rounded-sm hover:bg-[#5A52D2] transition duration-100'>browse jobs</button>
                    </Link>
                </div>
                <div className='block'>
                    <img src={Workers} alt="" className='max-w-xs md:max-w-xs lg:max-w-lg' />
                </div>
            </div>
        </div>
    );
}

export default HomePage;