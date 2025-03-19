import mongoose from "mongoose";


const connection = {};

async function dbConnect() {
    if (connection.isConnected) {
        console.log("database already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log("error connecting to database", error);
        process.exit(1);
    }

}

export default dbConnect;