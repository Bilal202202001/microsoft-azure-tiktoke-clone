import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    role: {
        type: String,
        default: "user"
    },
    email: String,
    password: String,
});

const userModel = mongoose.model("UserData", userSchema);
export default userModel;