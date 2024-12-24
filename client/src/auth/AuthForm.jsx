import React, { useState } from 'react'
import * as Unicons from '@iconscout/react-unicons';
import InputField from '../components/InputField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from '../store/slices/auth';
import { toast } from 'react-toastify';
export default function AuthForm() {

    let registerForm = false;
    const [inputType, setInputType] = useState("loginFormFields");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const updateInputType = () => {
        if (inputType === "registerFormFiels") {
            setInputType("loginFormFields")
        } else {
            setInputType("registerFormFiels")
        }
    }

    const registerFormFiels = [
        {
            type: "text",
            name: "username",
            placeholder: "Username",
            required: true,
        },
        {
            type: "email",
            name: "email",
            placeholder: "Email",
            required: true,
        },
        {
            type: "password",
            name: "password",
            placeholder: "Password",
            required: true,
        },
        {
            type: "password",
            name: "confirmPassword",
            placeholder: "Confirm Password",
            required: true,
        },
        {
            type: "button",
            name: "Register"
        }
    ]
    const loginFormFields = [

        {
            type: "email",
            name: "email",
            placeholder: "Email",
            required: true,
        },
        {
            type: "password",
            name: "password",
            placeholder: "Password",
            required: true,
        },
        {
            type: "button",
            name: "Login"
        }
    ]


    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(event.target);
        axios.defaults.withCredentials = true;
        if (inputType === "registerFormFiels") {
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');


            if (password !== confirmPassword) {
                toast.error(`Passwords didn't match`, {
                    style: { backgroundColor: '#e11d48', color: 'white' },
                });
                return;
            }
            axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/register`, formData)
                .then(res => {
                    console.log(res);
                    const data = res.data;
                    dispatch(setAuthData({ isLogin: true, _id: data._id, role: data.role, name: data.name, email: data.email }));
                    toast.success(data.message, {
                        style: { backgroundColor: 'black', color: 'white' },
                    });
                    navigate('/');
                })
                .catch(err => {
                    toast.error(err.response.data.message, {
                        style: { backgroundColor: '#e11d48', color: 'white' },
                    });
                }
                );
        }
        else {
            const email = formData.get('email')
            const password = formData.get('password');
            axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/login`, { email, password })
                .then(res => {
                    const data = res.data;
                    dispatch(setAuthData({ isLogin: true, _id: data._id, role: data.role, name: data.name, email: data.email }));

                    toast.success(data.message, {
                        style: { backgroundColor: 'black', color: 'white' },
                    });
                    navigate('/');

                }).catch(
                    err => {
                        console.log(err.response.data.message, "error")
                        toast.error(err.response.data.message, {
                            style: { backgroundColor: '#e11d48', color: 'white' },
                        });
                    }
                );
        }
    }

    console.log(registerForm);
    return (
        <div className=' h-screen w-full flex lg:flex-row flex-col'>
            <div className=' h-40 lg:h-full w-full lg:w-2/6  flex justify-center items-center'>
                <img src="/logo1.png" alt="JIRA Logo" className="h-16 w-16 mr-2" />
                <a href='/' className="text-2xl font-semibold text-gray-800">VidVibe</a>
            </div>

            <div className='w-full lg:w-4/6 h-auto lg:h-full flex flex-col justify-center items-center'>

                <h2 className='text-5xl font-bold my-2 text-black'>
                    {inputType === "registerFormFiels" ? "Welcome" : "Welcome Back"}
                </h2>
                <h2 className='text-xl bg-black px-3 rounded font-bol text-white font-bold'>
                    {inputType === "registerFormFiels" ? "REGISTER" : "LOGIN"}
                </h2>
                <form className='flex flex-col justify-center items-center w-4/5 lg:w-2/5 my-5 h-[50vh]' onSubmit={handleSubmit}>
                    <InputField props={inputType === "registerFormFiels" ? registerFormFiels : loginFormFields} />
                    <h2 className='my-2'>
                        {inputType === "registerFormFiels" ? "Already have an account?" : "Don't have an account?"}
                        <button className='text-rose-600 font-bold mx-1' type='button' onClick={() => {
                            updateInputType();
                        }}>
                            {inputType === "registerFormFiels" ? "Login" : "Register Now"}
                        </button>
                    </h2>
                </form>



            </div>
        </div>
    )
}
