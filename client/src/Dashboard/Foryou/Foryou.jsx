import React from "react";
import Videos from "../../components/Videos";

function Foryou() {
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
    return (
        <Videos videos={videos} />
    );
}

export default Foryou;
