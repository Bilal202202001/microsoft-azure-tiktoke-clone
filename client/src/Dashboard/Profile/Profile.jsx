import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
const Profile = () => {

    const auth = useSelector((state) => state.auth);

    const [videos, setVideos] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const getData = async (search = '') => {
        axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/video/getMyVideos`)
            .then(res => {
                setVideos(res.data.videos);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const GetLikedVideos = async (search = '') => {
        axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/video/getLikedVideos`)
            .then(res => {
                setVideos(res.data.videos);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
            if(auth &&  auth.role === "creator"){
                getData();
            }    
            else{
                GetLikedVideos();
            }
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
                <h1 className="text-xl font-bold text-gray-800 mt-4">
                    {auth.name}
                </h1>
                <p className="text-gray-600">{auth.email}</p>
                {
                    auth.role === "creator" && (
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
                    )
                }

                <div className="flex flex-col items-center w-full">
                    <h2 className="text-xl shadow-sm py-1 shadow-gray-200 font-semibold mt-4 text-center w-1/12">
                        Bio
                    </h2>
                    <p className="mt-4 w-2/4 text-center text-gray-700">{profileData.bio}</p>
                </div>
                <div className="flex justify-center">
                    {
                        auth.role === "creator" && (<a href="/upload" className="mt-4 bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-700 transition">
                            Upload
                        </a>)
                    }
                </div>
            </div>
            <div>
                <h2 className="text-xl shadow-sm py-1 shadow-gray-200 font-semibold mb-4 text-center w-full">
                    {
                        auth.role === "creator" ? "Videos" : "Liked Videos"
                    }
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
                        <p>No videos found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
