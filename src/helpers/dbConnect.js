import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log("✅ Database already connected");
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/linkedin",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    connection.isConnected = db.connections[0].readyState;
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message);
    process.exit(1);
  }
}

export default dbConnect;
