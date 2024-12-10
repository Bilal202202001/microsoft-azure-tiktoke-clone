import React, { useState, useRef, useEffect } from "react";
import { FaHeart, FaCommentDots, FaVolumeMute, FaVolumeUp, FaPlay, FaPause } from "react-icons/fa";
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
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [showIcon, setShowIcon] = useState(null);
    const videoRef = useRef(null);

    const handleScroll = (e) => {
        if (e.deltaY > 0) {
            setCurrentVideoIndex((prev) =>
                prev < videos.length - 1 ? prev + 1 : prev
            );
        } else {
            setCurrentVideoIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setShowIcon(
                    <FaPlay className="text-gray-300 text-6xl animate-pulse" />
                );
                setTimeout(() => setShowIcon(null), 1000);
                setIsPaused(false);
            } else {
                videoRef.current.pause();
                setShowIcon(
                    <FaPause className="text-gray-300 text-6xl animate-pulse" />
                );
                setTimeout(() => setShowIcon(null), 1000);
                setIsPaused(true);
            }
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener("play", () => setIsPaused(false));
            videoRef.current.addEventListener("pause", () => setIsPaused(true));
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener("play", () => setIsPaused(false));
                videoRef.current.removeEventListener("pause", () => setIsPaused(true));
            }
        };
    }, []);

    const currentVideo = videos[currentVideoIndex];

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            onWheel={handleScroll}
        >
            <div className="relative w-full max-w-md aspect-video h-[95vh] bg-gray-800 rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    src={currentVideo.src}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    onClick={togglePlayPause}
                ></video>

                {/* Play/Pause Icons */}
                {showIcon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        {showIcon}
                    </div>
                )}

                <button
                    onClick={toggleMute}
                    className="absolute top-4 left-4 bg-gray-900 bg-opacity-75 text-white rounded-full p-2 hover:bg-opacity-100 transition"
                >
                    {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
                </button>

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
