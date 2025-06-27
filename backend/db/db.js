import mongoose from "mongoose";

const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");
    } catch(error){
        console.log("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
}

export default connectToDatabase 