import mongooser from "mongoose";

const userSchema = new mongooser.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default:false,
    }
});

const User = mongooser.models.User || mongooser.model("User", userSchema);

export default User;