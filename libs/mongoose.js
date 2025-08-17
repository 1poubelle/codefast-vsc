import mongoose from "mongoose";

const coonnectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MONGOOSE ERROR" +  error.message);
    }
}

export default coonnectMongo;