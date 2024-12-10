import React, { useState } from "react";

const Profile = () => {
    const [profileData, setProfileData] = useState({
        profilePicture: "/logo1.png", // Default profile picture
        username: "John Doe",
        email: "johndoe@example.com",
        bio: "Avid traveler and content creator.",
        isPrivate: false,
    });

    const [uploadedVideos, setUploadedVideos] = useState([
        { id: 1, title: "Sunset at Malibu", src: "/video0.mp4" },
        { id: 2, title: "Exploring NYC", src: "/video2.mp4" },
        { id: 3, title: "Swiss Alps Adventure", src: "/video3.mp4" },
        { id: 4, title: "Tokyo Vibes", src: "/video4.mp4" },
        { id: 5, title: "Santorini Views", src: "/video1.mp4" },
    ]);

    return (
        <div className="p-8 min-h-[90vh] bg-white">
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
                {/* Username */}
                <h1 className="text-xl font-bold text-gray-800 mt-4">
                    {profileData.username}
                </h1>
                {/* Email */}
                <p className="text-gray-600">{profileData.email}</p>
                {/* Bio */}
                <p className="mt-4 w-3/4 text-center text-gray-700">{profileData.bio}</p>
            </div>

            {/* Uploaded Videos Section */}
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-center w-full bg-rose-600 text-white">Your Videos</h2>
                {uploadedVideos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
                        {uploadedVideos.map((video) => (
                            <div
                                key={video.id}
                                className=""
                            >
                                <video
                                    src={video.src}
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
