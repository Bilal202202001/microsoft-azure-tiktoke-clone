import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData"
    },
    title: String,
    location: String,
    hashtags: String,
    url: String,
    comments: {
        type: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "UserData"
                },
                comment: String,
                timestamp: { type: Date, default: Date.now },
            }
        ]
    },
    likes: {
        type: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "UserData"
                }
            }
        ]
    },
    timestamp: { type: Date, default: Date.now },

});

const videoModel = mongoose.model("Videos", videoSchema);
export default videoModel;