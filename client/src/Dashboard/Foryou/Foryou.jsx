import React, { useState, useEffect } from "react";
import Videos from "../../components/Videos";
import axios from "axios";
import { IoMdRefreshCircle } from "react-icons/io";
function Foryou() {
    const [videos, setVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const getData = async (search = '') => {
        axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/video/getVideos?search=${search}`)
            .then(res => {
                setVideos(res.data.videos);
                setSearchQuery('');
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
            <div className="flex justify-center items-center w-full lg:h-screen h-screen relative">

                {videos.length > 0 ? <Videos videos={videos} refetch={getData} /> : <h1 className="text-2xl font-bold">No Videos Found</h1>}




                <div className='w-5/6 px-2  lg:w-2/6 flex items-center justify-end lg:justify-center absolute top-3  right-1 lg:right-4'>
                    <input
                        type="text"
                        placeholder='Search'
                        className='w-full lg:w-3/4 py-2 px-4 mr-2  placeholder:text-white text-white font-semibold outline-none  bg-black bg-opacity-50 rounded-lg'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') getData(searchQuery) }}
                    />

                    <IoMdRefreshCircle className="text-slate-950 text-2xl cursor-pointer" size={40} onClick={() => getData('')} />
                </div>
            </div>
        </>
    );
}

export default Foryou;
