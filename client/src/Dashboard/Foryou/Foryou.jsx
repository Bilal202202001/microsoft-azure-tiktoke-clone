import React, { useState, useEffect } from "react";
import Videos from "../../components/Videos";
import axios from "axios";

function Foryou() {
    const [videos, setVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const getData = async (search = '') => {
        axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/video/getVideos?search=${search}`)
            .then(res => {
                setVideos(res.data.videos);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className="flex justify-center items-center w-full lg:h-screen relative">

                {videos.length > 0 ? <Videos videos={videos} refetch={getData} /> : <h1 className="text-2xl font-bold">No Videos Found</h1>}


                <div className='flex items-center justify-center absolute top-2 right-4 '>
                    <input
                        type="text"
                        placeholder='Search'
                        className='w-full py-2 px-4 mr-2 border border-gray-300 rounded-lg'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className='bg-rose-600 text-white py-2 px-4 rounded font-semibold'
                        onClick={() => getData(searchQuery)}
                    >
                        Search
                    </button>
                </div>
            </div>
        </>
    );
}

export default Foryou;
