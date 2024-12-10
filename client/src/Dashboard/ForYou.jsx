import React, { useState } from 'react';
import { FaHeart, FaCommentDots } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";

const videos = [
    {
        src: "/video0.mp4",
        location: "Malibu Beach",
        account: "Zile Hassan",
        description: "Beautiful sunset at the beach 🌅",
        hashtags: "#sunset #beachlife #nature #travel",
    },
    {
        src: "/video2.mp4",
        location: "New York City",
        account: "John Doe",
        description: "Exploring the city that never sleeps 🗽",
        hashtags: "#nyc #citylife #travel",
    },
    {
        src: "/video3.mp4",
        location: "Swiss Alps",
        account: "Anna Marie",
        description: "Snowy adventure in the Alps 🏔️",
        hashtags: "#snow #mountains #adventure",
    },
    {
        src: "/video4.mp4",
        location: "Tokyo, Japan",
        account: "Haruto Sato",
        description: "Cherry blossoms and city vibes 🌸",
        hashtags: "#japan #tokyo #sakura",
    },
    {
        src: "/video1.mp4",
        location: "Santorini, Greece",
        account: "Maria Ioannou",
        description: "Blue domes and breathtaking views 🌊",
        hashtags: "#greece #santorini #travel",
    },
];

export default function Foryou() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const handleScroll = (e) => {
        if (e.deltaY > 0) {
            // Scroll down
            setCurrentVideoIndex((prev) =>
                prev < videos.length - 1 ? prev + 1 : prev
            );
        } else {
            // Scroll up
            setCurrentVideoIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
    };

    const currentVideo = videos[currentVideoIndex];

    return (
        <div
            className="flex items-center justify-center min-h-screen "
            onWheel={handleScroll}
        >
            {/* Video Container */}
            <div className="relative w-full max-w-md aspect-video h-[95vh] bg-gray-800 rounded-lg overflow-hidden">
                {/* Video */}
                <video
                    src={currentVideo.src}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                ></video>

                {/* Right Buttons */}
                <div className="absolute right-4 bottom-8 space-y-4 text-white">
                    <button className="flex items-center justify-center w-12 h-12 bg-gray-900 bg-opacity-75 rounded-full hover:bg-opacity-100 transition">
                        <CiCirclePlus className="text-white text-xl " size={40} />
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 bg-gray-900 bg-opacity-75 rounded-full hover:bg-opacity-100 transition">
                        <FaHeart className="text-rose-600 text-xl" />
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 bg-gray-900 bg-opacity-75 rounded-full hover:bg-opacity-100 transition">
                        <FaCommentDots className="text-white text-xl" />
                    </button>
                </div>

                {/* Video Info */}
                <div className="absolute left-4 bottom-8 text-white space-y-2">
                    <p className="text-sm text-gray-400 flex items-center justify-start bg-white bg-opacity-10 p-2 rounded-lg">
                        <IoLocationSharp className="mr-2 text-green-500 h-6 w-6" />{" "}
                        {currentVideo.location}
                    </p>
                    <p className="font-semibold">{currentVideo.account}</p>
                    <p className="text-sm">{currentVideo.description}</p>
                    <p className="text-sm text-gray-300">{currentVideo.hashtags}</p>
                </div>
            </div>
        </div>
    );
}
