import React, { useState, useRef, useEffect } from "react";
import { FaHeart, FaCommentDots, FaVolumeMute, FaVolumeUp, FaPlay, FaPause } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsSendFill } from "react-icons/bs";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Videos({ videos, refetch }) {
    const auth = useSelector((state) => state.auth);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [showIcon, setShowIcon] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [liked, setLiked] = useState(false);
    const videoRef = useRef(null);

    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    useEffect(() => {
        if (videos && videos[currentVideoIndex]?.likes) {
            const hasLiked = videos[currentVideoIndex].likes.some(
                (like) => like.userId === auth.id
            );
            setLiked(hasLiked);
        }
    }, [videos, currentVideoIndex, auth.id]);

    const handleScroll = (deltaY) => {
        if (isModalOpen) return;
        if (deltaY > 0) {
            setCurrentVideoIndex((prev) =>
                prev < videos.length - 1 ? prev + 1 : prev
            );
        } else {
            setCurrentVideoIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
    };

    const handleWheel = (e) => {
        handleScroll(e.deltaY);
    };

    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        if (isModalOpen) return;
        const deltaY = touchStartY.current - touchEndY.current;
        if (Math.abs(deltaY) > 50) {
            handleScroll(deltaY);
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
                setShowIcon(<FaPlay className="text-gray-300 text-6xl animate-pulse" />);
                setTimeout(() => setShowIcon(null), 1000);
                setIsPaused(false);
            } else {
                videoRef.current.pause();
                setShowIcon(<FaPause className="text-gray-300 text-6xl animate-pulse" />);
                setTimeout(() => setShowIcon(null), 1000);
                setIsPaused(true);
            }
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddComment = async () => {
        if (newComment.trim() !== "") {
            try {
                await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/video/addComment`, {
                    videoId: currentVideo._id,
                    comment: newComment,
                });
                refetch();
            } catch (error) {
                toast.error(error.response.data.message, {
                    style: { backgroundColor: '#e11d48', color: 'white' },
                });
            }
            setNewComment("");
        }
    };

    const handleLike = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/video/likeVideo`, {
                videoId: currentVideo._id,
            });
            refetch();
        } catch (error) {
            toast.error(error.response.data.message, {
                style: { backgroundColor: '#e11d48', color: 'white' },
            });
        }
    };

    const currentVideo = videos[currentVideoIndex];

    return (
        <div
            className="flex items-center justify-center h-full lg:min-h-screen lg:bg-transparent w-full bg-black"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative w-full max-w-md lg:max-w-lg h-[100vh] lg:h-[95vh] bg-gray-800 rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    src={currentVideo.url}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    onClick={togglePlayPause}
                ></video>

                {showIcon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        {showIcon}
                    </div>
                )}

                <button
                    onClick={toggleMute}
                    className="absolute top-4 left-4 bg-gray-900 text-white rounded-full p-2 hover:bg-opacity-100 transition"
                >
                    {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
                </button>
                <div className="absolute right-4 lg:bottom-8  bottom-16 space-y-2 lg:space-y-4 text-white p-2 bg-white bg-opacity-10 rounded-lg">
                    <div className="flex flex-col items-center">
                        <button onClick={handleLike} className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                            <FaHeart className={`${liked ? "text-rose-600" : "text-white"} text-xl`} />
                        </button>
                        {currentVideo.likes.length}
                    </div>
                    <div className="flex flex-col items-center">
                        <button onClick={openModal} className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                            <FaCommentDots />
                        </button>
                        {currentVideo.comments.length}
                    </div>
                </div>

                <div className="absolute left-4 lg:bottom-8  bottom-20 text-white space-y-2">
                    <p className="text-sm text-gray-400 flex items-center justify-start bg-white bg-opacity-10 p-2 rounded-lg">
                        <IoLocationSharp className="mr-2 text-green-500 h-6 w-6" />{" "}
                        {currentVideo.location}
                    </p>
                    <p className="font-semibold">{currentVideo.userId.name}</p>
                    <p className="text-sm">{currentVideo.title}</p>
                    <p className="text-sm text-gray-300">{currentVideo.hashtags}</p>
                </div>

                {isModalOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-end justify-center z-50 p-2">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-white">✖</button>
                        <div className="bg-white px-3 pb-6 rounded-lg w-full max-w-md">
                            <h2 className="text-xl font-semibold py-2 my-2 text-center" >Comments</h2>
                            <div className="h-[50vh] overflow-y-auto">
                                {
                                    currentVideo.comments.length > 0 ?
                                        currentVideo.comments.map((comment, index) => (
                                            <div index={index} className="mb-2 border border-gray-300 bg-gray-100  p-2 rounded-lg">
                                                <p className="text-black font-semibold text-sm flex items-center">  <img src={'/profile.png'}  className="mr-2 h-7 w-7 rounded-full" /> {comment.userId.name}</p>
                                                <p className="text-gray-600 pl-9">{comment.comment}</p>
                                            </div>
                                        )) :
                                        <h1 className="text-xl font-semibold text-gray-400 text-center">No Comments Found</h1>
                                }
                            </div>
                            <div className="flex items-center w-full">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                                <button onClick={handleAddComment} className="ml-2 text-rose-600"><BsSendFill size={20} /></button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}










// import React, { useState, useRef, useEffect } from "react";
// import { FaHeart, FaCommentDots, FaVolumeMute, FaVolumeUp, FaPlay, FaPause } from "react-icons/fa";
// import { IoLocationSharp } from "react-icons/io5";
// import { BsSendFill } from "react-icons/bs";
// import { FaCircleUser } from "react-icons/fa6";
// import { useSelector } from "react-redux";
// import { toast } from 'react-toastify';
// import axios from "axios";
// axios.defaults.withCredentials = true;
// export default function Videos({ videos, refetch }) {
//     const auth = useSelector((state) => state.auth);
//     const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//     const [isMuted, setIsMuted] = useState(true);
//     const [isPaused, setIsPaused] = useState(false);
//     const [showIcon, setShowIcon] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [newComment, setNewComment] = useState("");
//     const videoRef = useRef(null);

//     const touchStartY = useRef(0);
//     const touchEndY = useRef(0);
//     useEffect(() => {
//         if (videos && videos.likes) {
//             const hasLiked = videos.likes.some(
//                 (like) => like.userId === auth.id
//             );
//             setLiked(hasLiked);
//         }
//     }, [videos, auth.id]);

//     const handleScroll = (deltaY) => {
//         if (isModalOpen) return;

//         if (deltaY > 0) {
//             setCurrentVideoIndex((prev) =>
//                 prev < videos.length - 1 ? prev + 1 : prev
//             );
//         } else {
//             setCurrentVideoIndex((prev) => (prev > 0 ? prev - 1 : prev));
//         }
//     };

//     const handleWheel = (e) => {
//         handleScroll(e.deltaY);
//     };


//     const handleTouchStart = (e) => {
//         touchStartY.current = e.touches[0].clientY;
//     };

//     const handleTouchMove = (e) => {
//         touchEndY.current = e.touches[0].clientY;
//     };


//     const handleTouchEnd = () => {
//         if (isModalOpen) return;

//         const deltaY = touchStartY.current - touchEndY.current;
//         if (Math.abs(deltaY) > 50) {
//             handleScroll(deltaY);
//         }
//     };

//     const toggleMute = () => {
//         if (videoRef.current) {
//             videoRef.current.muted = !isMuted;
//             setIsMuted(!isMuted);
//         }
//     };

//     const togglePlayPause = () => {
//         if (videoRef.current) {
//             if (videoRef.current.paused) {
//                 videoRef.current.play();
//                 setShowIcon(
//                     <FaPlay className="text-gray-300 text-6xl animate-pulse" />
//                 );
//                 setTimeout(() => setShowIcon(null), 1000);
//                 setIsPaused(false);
//             } else {
//                 videoRef.current.pause();
//                 setShowIcon(
//                     <FaPause className="text-gray-300 text-6xl animate-pulse" />
//                 );
//                 setTimeout(() => setShowIcon(null), 1000);
//                 setIsPaused(true);
//             }
//         }
//     };
//     const openModal = () => {
//         setIsModalOpen(true);
//     };
//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleAddComment = async () => {
//         if (newComment.trim() !== "") {
//             try {
//                 const res = await axios.post(
//                     ${ import.meta.env.VITE_APP_BACKEND_URL } / video / addComment,
//                     {
//                         videoId: currentVideo._id,
//                         comment: newComment,
//                     }
//                 )
//                 console.log(res);
//                 refetch();
//             } catch (error) {
//                 toast.error(error.response.data.message, {
//                     style: { backgroundColor: '#e11d48', color: 'white' },
//                 });
//             }
//             setNewComment("");
//         }
//     };

//     const handleLike = async () => {
//         try {
//             const res = await axios.post(
//                 ${ import.meta.env.VITE_APP_BACKEND_URL } / video / likeVideo,
//                 {
//                     videoId: currentVideo._id,
//                 }
//             )
//             console.log(res);
//             refetch();
//         } catch (error) {
//             toast.error(error.response.data.message, {
//                 style: { backgroundColor: '#e11d48', color: 'white' },
//             });
//         }
//     };

//     useEffect(() => {
//         if (videoRef.current) {
//             videoRef.current.addEventListener("play", () => setIsPaused(false));
//             videoRef.current.addEventListener("pause", () => setIsPaused(true));
//         }

//         return () => {
//             if (videoRef.current) {
//                 videoRef.current.removeEventListener("play", () => setIsPaused(false));
//                 videoRef.current.removeEventListener("pause", () => setIsPaused(true));
//             }
//         };

//     }, [videos, auth]);

//     const [liked, setLiked] = useState(false);

//     useEffect(() => {
//         if (videos && videos[currentVideoIndex]?.likes) {
//             const hasLiked = videos[currentVideoIndex].likes.some(
//                 (like) => like.userId === auth.id
//             );
//             setLiked(hasLiked);
//         }
//     }, [videos, currentVideoIndex, auth.id]);


//     const currentVideo = videos[currentVideoIndex];

//     return (
//         <div
//             className="flex items-center lg:items-center justify-center h-full lg:min-h-screen"
//             onWheel={handleWheel}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//         >
//             <div className="relative w-full max-w-md aspect-video h-[100vh] lg:h-[95vh] bg-gray-800 rounded-lg overflow-hidden">
//                 <video
//                     ref={videoRef}
//                     src={currentVideo.url}
//                     className="w-full h-full object-cover"
//                     autoPlay
//                     loop
//                     muted={isMuted}
//                     onClick={togglePlayPause}
//                 ></video>
//                 {showIcon && (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                         {showIcon}
//                     </div>
//                 )}

//                 {/* Mute Button */}
//                 <button
//                     onClick={toggleMute}
//                     className="absolute top-4 left-4 bg-gray-900 bg-opacity-75 text-white rounded-full p-2 hover:bg-opacity-100 transition"
//                 >
//                     {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
//                 </button>
//                 <div className="absolute right-4 bottom-8 space-y-4 text-white p-3 bg-white bg-opacity-10 rounded-lg">
//                     <div className="flex flex-col items-center">
//                         <button className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full" onClick={handleLike}>
//                             <FaHeart className={${liked ? "text-rose-600" : "text-white"} text-xl} />

//                         </button>
//                         {currentVideo.likes.length}
//                     </div>

//                     <div className="flex flex-col items-center">
//                         <button onClick={openModal} className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full">
//                             <FaCommentDots />
//                         </button>
//                         {currentVideo.comments.length}
//                     </div>
//                 </div>
// <div className="absolute left-4 bottom-8 text-white space-y-2">
//     <p className="text-sm text-gray-400 flex items-center justify-start bg-white bg-opacity-10 p-2 rounded-lg">
//         <IoLocationSharp className="mr-2 text-green-500 h-6 w-6" />{" "}
//         {currentVideo.location}
//     </p>
//     <p className="font-semibold">{currentVideo.userId.name}</p>
//     <p className="text-sm">{currentVideo.title}</p>
//     <p className="text-sm text-gray-300">{currentVideo.hashtags}</p>
// </div>

//             </div>
//         </div>
//     );
// }