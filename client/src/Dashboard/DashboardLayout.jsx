import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FaSquarePlus } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { RiUserFollowFill } from "react-icons/ri";
import { MdExplore } from "react-icons/md";
import { BsPlusSquareDotted } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


export default function DashboardLayout() {
    const navigate = useNavigate();
    const pathname = window.location.pathname;
    console.log(pathname);
    const isActive = (link) => pathname === link || pathname.startsWith(`${link}/`);
    // useEffect(() => {
    //     const verifyLogin = async () => {
    //         try {
    //             const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/verifyLogin`);
    //         } catch (error) {
    //             navigate('/');

    //         }
    //     }
    //     verifyLogin()
    // }, [])

    const sidebarLinks = [
        { href: '/', icon: <RiHome2Fill size="24" />, label: 'For You' },
        { href: '/following', icon: <RiUserFollowFill size="24" />, label: 'Following' },
        { href: '/upload', icon: <FaSquarePlus size="24" />, label: 'Upload' },
        { href: '/profile', icon: <FaUser size="24" />, label: 'Profile' },
    ];

    return (
        <div className="flex flex-col ">
            <div className="w-full flex ">
                <div className={`w-1/5 p-5 min-h-[90vh] bg-transparent text-gray-800 hidden lg:flex flex-col space-y-6 relative h-screen`}>
                    <div className="flex w-full justify-start items-center">
                        <img src="/logo1.png" alt="JIRA Logo" className="h-16 w-16 mr-2" />
                        <h2 className="text-2xl font-semibold text-gray-800">VidVibe</h2>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <input type="text" placeholder='Search' className='w-full py-2 px-4 mr-2 border border-gray-300 rounded-lg' />
                        <button className='bg-rose-600 text-white py-2 px-4 rounded font-semibold' >
                            Search
                        </button>
                    </div>

                    <>
                        <h2 className="text-xl font-bold  mb-4">Menu</h2>
                        <div className="space-y-4">
                            {sidebarLinks.map((link) => (
                                <a key={link.href} href={link.href} className={`flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition ${isActive(link.href) ? 'text-rose-600' : 'text-gray-900'}`}>
                                    {link.icon}
                                    <span className="text-sm font-medium ">{link.label}</span>
                                </a>
                            ))}
                        </div>
                    </>


                    <a href="/login" className="w-4/5 p-2 bg-rose-600 text-white text-center hover:bg-rose-500 rounded-lg font-semibold"> Login </a>
                    <div className='w-full  flex flex-col justify-center items-center'>
                        <a className='font-semibold cursor-pointer'>
                            Company
                            Program
                            Terms & Policies
                        </a>
                        <h2 className='cursor-pointer'>
                            © 2024 VidVibe
                        </h2>
                    </div>
                </div>
                <div className='min-h-[90vh] w-full'>
                    <Outlet />
                </div>
                {/* Mobile Bottom Navbar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950 shadow-lg border-t border-gray-300 flex justify-around items-center py-2">
                    {[
                        { href: '/', icon: <RiHome2Fill size="24" />, label: '' },
                        { href: '/upload', icon: <BsPlusSquareDotted size="40" />, label: '' },
                        { href: '/profile', icon: <FaUser size="24" />, label: '' },
                    ].map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center text-sm ${pathname === link.href ? 'text-white' : 'text-gray-600'}`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>

            </div>
        </div>
    );
}
