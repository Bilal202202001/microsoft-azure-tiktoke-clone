import React, { useEffect, useState } from "react";
import axios from "axios";
import ResponseView from "../../components/ResponseView";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const JqlConverter = () => {
    const [query, setQuery] = useState("");
    const [responses, setResponses] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [viewType, setViewType] = useState(null);
    const [key, setKey] = useState(null);
    useEffect(() => {
        const verifyLogin = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/verifyLogin`);
            } catch (error) {
                navigate('/');
            }
        }
        verifyLogin();
    }, []);

    const handleConvert = async () => {
        if (!query.trim()) {
            alert("Please enter a query to convert.");
            return;
        }
        setKey(null);
        setViewType(null);
        setResponses([]);
        setErrors([]);
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/openai/convert-query`, { query });
            if (response.data && response.data?.results && response.data.results[0].success == true) {
                setResponses(response.data?.results);
                if (response.data.results[0].operation) {
                    if (response.data?.results[0]?.operation.ViewToLoad.toLowerCase() === 'issue' || response.data.results[0]?.operation.ViewToLoad.toLowerCase() === 'project' || response.data.results[0]?.operation.ViewToLoad.toLowerCase() === 'issues' || response.data.results[0]?.operation.ViewToLoad.toLowerCase() === 'users') {
                        setViewType(response.data.results[0]?.operation?.ViewToLoad);
                        if (response.data.results[0]?.operation?.ViewToLoad === 'issue') {
                            setKey(response.data.results[0]?.operation?.Parameters?.fields?.project.key);
                        }
                    }
                }
                else {
                    setViewType(null);
                }

            }
            else {
                console.log();
                setErrors((prev) => [...prev, response.data.results[0].error]);

            }
        } catch (error) {
            console.error("Error converting query", error);
            setErrors((prev) => [...prev, error.message]);
            alert("Error converting query. Please try again.");
        } finally {
            setLoading(false);
            setQuery("");
        }
    };

    const renderData = (data) => {
        if (typeof data === 'object' && data !== null) {
            return (
                <div>
                    {Object.entries(data).map(([key, value], index) => (
                        <div key={index}>
                            <h3 className="text-lg font-semibold">{key}:</h3>
                            {renderData(value)}
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p>{data}</p>;
        }
    };


    return (
        <div className="flex flex-col h-full bg-gray-50 p-4">
            {
                viewType ? <ResponseView viewType={viewType} issueKey={key} /> : <div className="flex-1 overflow-y-auto bg-white shadow-md rounded-lg p-6 mb-4">
                    <div className="space-y-4">
                        {responses.length > 0 && responses[0]?.data && (
                            <div className="bg-green-100 p-4 rounded-lg overflow-x-auto border-l-4 border-green-500">
                                {renderData(responses[0].data)}
                            </div>
                        )}

                        {errors.map((error, index) => (
                            <div key={index} className="bg-red-100 p-4 rounded-lg overflow-x-auto border-l-4 border-red-500 w-1/4 h-full">
                                {error}
                            </div>
                        ))}
                    </div>
                </div>
            }

            <div className="bg-white shadow-md rounded-lg p-4 flex items-start justify-start">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your natural language query"
                    rows={3}
                    className="border border-gray-300 rounded-lg p-2 flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
                />
                <button
                    onClick={handleConvert}
                    className={`bg-slate-950 text-white rounded-lg px-4 py-2 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-950"}`}
                    disabled={loading}
                >
                    {loading ? "Converting..." : "Convert"}
                </button>
            </div>
        </div>
    );
};

export default JqlConverter;
