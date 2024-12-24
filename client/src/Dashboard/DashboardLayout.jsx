import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FaSquarePlus } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { RiUserFollowFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { RiLoginBoxFill } from "react-icons/ri";
import { BsCameraVideoFill } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from '../store/slices/auth';
import axios from 'axios';
export default function DashboardLayout() {
    const pathname = window.location.pathname;
    const dispatch = useDispatch();
    const isActive = (link) => pathname === link || pathname.startsWith(`${link}/`);
    const auth = useSelector((state) => state.auth);
    console.log(auth, "auth");

    useEffect(() => {
        const verifyLogin = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/getUser`, { withCredentials: true });
                const data = res.data.user;
                dispatch(setAuthData({ isLogin: true, _id: data._id, role: data.role, name: data.name, email: data.email }));

            } catch (error) {
                dispatch(setAuthData({ isLogin: false, role: '', name: '', email: '', _id: '' }));
            }
        }
        verifyLogin()
    }, [])

    const handleLogout = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
            dispatch(setAuthData({ isLogin: false, role: '', name: '', email: '', _id: '' }));
        } catch (error) {
            dispatch(setAuthData({ isLogin: false, role: '', name: '', email: '', _id: '' }));
        }
    }

    const contentCreator = [
        { href: '/', icon: <RiHome2Fill size="24" />, label: 'Videos' },
        { href: '/upload', icon: <FaSquarePlus size="24" />, label: 'Upload' },
        { href: '/profile', icon: <FaUser size="24" />, label: 'Profile' },
    ];


    const contentCreatorMobile = [
        { href: '/', icon: <RiHome2Fill size="24" />, label: 'Videos' },
        { href: '/foryou', icon: <BsCameraVideoFill size="24" />, label: 'Foryou' },
        { href: '/upload', icon: <FaSquarePlus size="40" />, label: '' },
        { href: '/profile', icon: <FaUser size="24" />, label: 'Profile' },
        { href: '/auth', icon: <RiLoginBoxFill size="24" />, label: 'Login' },
    ];


    const nativeUser = [
        { href: '/', icon: <RiHome2Fill size="24" />, label: 'Videos' },
        { href: '/foryou', icon: <BsCameraVideoFill size="24" />, label: 'Foryou' },
        { href: '/following', icon: <RiUserFollowFill size="24" />, label: 'Following' },
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
                    {/* <div className='flex items-center justify-center w-full'>
                        <input type="text" placeholder='Search' className='w-full py-2 px-4 mr-2 border border-gray-300 rounded-lg' />
                        <button className='bg-rose-600 text-white py-2 px-4 rounded font-semibold' >
                            Search
                        </button>
                    </div> */}

                    <>
                        <h2 className="text-xl font-bold  mb-4">Menu</h2>
                        <div className="space-y-4">
                            {contentCreator.map((link) => (
                                <a key={link.href} href={link.href} className={`flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition ${isActive(link.href) ? 'text-rose-600' : 'text-gray-900'}`}>
                                    {link.icon}
                                    <span className="text-sm font-medium ">{link.label}</span>
                                </a>
                            ))}
                        </div>
                    </>

                    {
                        auth.isLogin ?
                            <>
                                <div className='flex justify-center items-center w-full space-x-2 border-y-2 py-2 border-gray-100'>
                                    <h2 className="text-sm font-normal  ">{auth.name}</h2>
                                    <IoLogOut size="40" className='text-gray-500 cursor-pointer hover:text-rose-600' onClick={() => {
                                        handleLogout();
                                    }} />
                                </div>
                            </> :
                            <>
                                <a href="/auth" className="w-4/5 p-2 bg-rose-600 text-white text-center hover:bg-rose-500 rounded-lg font-semibold"> Login </a>
                            </>
                    }

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

                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black shadow-lg flex justify-around items-center py-2">
                    {contentCreatorMobile.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center text-xs ${pathname === link.href ? 'text-white' : 'text-gray-600'}`}
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
