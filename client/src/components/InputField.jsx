import React, { useState, useEffect } from 'react';

export default function InputField({ props }) {
    const [profilePicture, setProfilePicture] = useState(null);
    const [inputValues, setInputValues] = useState({});

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    useEffect(() => {
        const initialValues = props.reduce((acc, input) => {
            if (input.value) {
                acc[input.name] = input.value;
            }
            return acc;
        }, {});
        setInputValues(initialValues);
    }, [props]);

    return (
        <div className="space-y-4 w-full">
            {props.map((input, index) => (
                <div key={index}>
                    {input.label && (
                        <label className="block mb-1 font-medium text-gray-700" htmlFor={input.name}>
                            {input.label}
                        </label>
                    )}
                    {input.type === "button" ? (
                        <button className="w-full h-10 font-bold bg-rose-600 text-white rounded hover:bg-rose-500" type="submit">
                            {input.name}
                        </button>
                    ) : input.type === "file" ? (
                        <div className="space-y-4 flex flex-col justify-center items-center">
                            <img
                                src={profilePicture ? profilePicture : "/user.jpg"}
                                className="w-20 h-20 rounded-full mx-auto border border-gray-200"
                                alt="Profile Preview"
                            />
                            <input
                                className="w-1/2 h-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                type={input.type}
                                name={input.name}
                                id={input.name}
                                required={input.required}
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <input
                            className="w-full h-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            type={input.type}
                            name={input.name}
                            id={input.name}
                            placeholder={input.placeholder}
                            required={input.required}
                            value={inputValues[input.name] || ''} 
                            onChange={handleInputChange} 
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
