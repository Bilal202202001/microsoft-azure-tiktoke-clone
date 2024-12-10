import React, { useState } from 'react';
import InputField from './InputField';
import { UilMultiply } from '@iconscout/react-unicons';
import axios from 'axios';
import { toast } from 'react-toastify';
const Modal = ({ buttonLabel, url, method, inputs, heading, handleResponse, buttonText }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        axios.defaults.withCredentials = true;
        try {
            if (method === "POST") {

                const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/${url}`, formData);
                toast.success(response.data.message, { type: 'success' })
                handleResponse();
            }
            else if (method === "PUT") {

                const response = await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}/${url}`, formData);
                toast.success(response.data.message, { type: 'success' })
                handleResponse();
            }
        } catch (error) {
            toast.error(error.response.data.message, { type: 'error' })
        }
        setIsOpen(false);
    };

    return (
        <div className="">
            <button
                className="bg-slate-950 text-white rounded px-4 py-2 z-0"
                onClick={() => setIsOpen(true)}
            >
                {buttonLabel}
            </button>

            {isOpen && (
                <div className='relative'>
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-2/6  relative ">
                            <button
                                className="absolute top-2 right-2 p-1 rounded-full text-gray-600 hover:text-gray-900"
                                onClick={() => setIsOpen(false)}
                            >
                                <UilMultiply className="h-6 w-6" />
                            </button>

                            <h2 className="text-lg w-full text-center font-bold mb-4">{heading}</h2>
                            <form onSubmit={handleSubmit} className=''>
                                <InputField props={inputs} />
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
