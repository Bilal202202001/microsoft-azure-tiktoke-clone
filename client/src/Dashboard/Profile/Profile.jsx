import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
const Profile = () => {

    const auth = useSelector((state) => state.auth);


    const [videos, setVideos] = useState([]);
    const getData = async (search = '') => {
        axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/video/getMyVideos`)
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
    const [profileData, setProfileData] = useState({
        profilePicture: "/logo1.png",
        username: "John Doe",
        email: "johndoe@example.com",
        bio: "Avid traveler and content creator.",
        isPrivate: false,
        following: 120,
        followers: 450,
        likes: 1024,
    });

    const [uploadedVideos, setUploadedVideos] = useState([
        { id: 1, title: "Sunset at Malibu", src: "/video0.mp4" },
        { id: 2, title: "Exploring NYC", src: "/video2.mp4" },
        { id: 3, title: "Swiss Alps Adventure", src: "/video3.mp4" },
        { id: 4, title: "Tokyo Vibes", src: "/video4.mp4" },
        { id: 5, title: "Santorini Views", src: "/video1.mp4" },
    ]);

    return (
        <div className="p-2 lg:p-8 min-h-[90vh] bg-white">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    {/* Profile Picture */}
                    <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full shadow-lg object-cover"
                    />
                    {/* Option to Change Profile Picture */}
                    <label className="absolute bottom-0 left-8 w-6 h-6 bg-gray-300 rounded-full text-center flex items-center justify-center cursor-pointer text-gray-800 text-sm font-bold">
                        +
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setProfileData({
                                        ...profileData,
                                        profilePicture: URL.createObjectURL(file),
                                    });
                                }
                            }}
                            className="hidden"
                        />
                    </label>
                </div>

                <h1 className="text-xl font-bold text-gray-800 mt-4">
                    {auth.name}
                </h1>
                {/* Email */}
                <p className="text-gray-600">{auth.email}</p>
                {/* Bio */}

                {/* Stats */}
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="text-center rounded-lg border border-gray-100 px-2 py-1 ">
                        <h2 className="text-xl font-semibold text-gray-800">{profileData.following}</h2>
                        <p className="text-sm text-gray-500">Following</p>
                    </div>
                    <div className="text-center rounded-lg border border-gray-100 px-2 py-1">
                        <h2 className="text-xl font-semibold text-gray-800">{profileData.followers}</h2>
                        <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div className="text-center rounded-lg border border-gray-100 px-2 py-1">
                        <h2 className="text-xl font-semibold text-gray-800">{profileData.likes}</h2>
                        <p className="text-sm text-gray-500">Likes</p>
                    </div>
                </div>

                <p className="mt-4 w-2/4 text-center text-gray-700">{profileData.bio}</p>
               <div className="flex justify-center">
               <a href="#" className="mt-4 mr-2 bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-700 transition">
                    Edit Profile
                </a>
                <a href="/upload" className="mt-4 bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-700 transition">
                    Upload
                </a>
               </div>
            </div>
            <div>
                <h2 className="text-xl shadow-sm py-1 shadow-gray-200 font-semibold mb-4 text-center w-full">
                    Videos
                </h2>
                {videos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
                        {videos.map((video) => (
                            <div key={video.id} className="">
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
                        <p>No videos uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
