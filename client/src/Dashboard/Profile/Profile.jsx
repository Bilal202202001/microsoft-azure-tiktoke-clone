import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

axios.defaults.withCredentials = true;

const Profile = () => {
    const auth = useSelector((state) => state.auth);

    const [videos, setVideos] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [activeTab, setActiveTab] = useState('uploaded'); // State to manage active tab

    const getData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/video/getMyVideos`);
            setVideos(res.data.videos);
        } catch (err) {
            console.error(err);
        }
    }

    const getLikedVideos = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/video/getLikedVideos`);
            setLikedVideos(res.data.videos);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getData();
        getLikedVideos();
    }, []);

    const [profileData, setProfileData] = useState({
        profilePicture: "/profile.png",
        username: "John Doe",
        email: "johndoe@example.com",
        bio: "A traveler and content creator.",
        isPrivate: false,
        following: 120,
        followers: 450,
        likes: 1024,
    });

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-2 lg:p-8 min-h-[90vh] bg-white">
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full shadow-lg object-cover"
                    />
                </div>
                <h1 className="text-xl font-bold text-gray-800 mt-4">{auth.name}</h1>
                <p className="text-gray-600">{auth.email}</p>
                <div className="mt-4">
                    <button
                        onClick={() => handleTabSwitch('uploaded')}
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'uploaded' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Uploaded Videos
                    </button>
                    <button
                        onClick={() => handleTabSwitch('liked')}
                        className={`px-4 py-2 ml-2 rounded-lg font-semibold ${activeTab === 'liked' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Liked Videos
                    </button>
                </div>
            </div>
            <div>
                <div className="text-xl shadow-sm py-1 shadow-gray-200 font-semibold mb-4 text-center w-full">
                    {activeTab === 'uploaded' ? 'Uploaded Videos' : 'Liked Videos'}
                </div>
                {(activeTab === 'uploaded' ? videos : likedVideos).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
                        {(activeTab === 'uploaded' ? videos : likedVideos).map((video) => (
                            <div key={video.id}>
                                <video
                                    src={video.url}
                                    controls
                                    className="w-full h-80 rounded-lg object-cover"
                                ></video>
                                <h3 className="mt-2 text-md font-semibold">{video.title}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>No videos found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
