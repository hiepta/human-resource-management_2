import User from './models/User.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'
    import dotenv from "dotenv";
    dotenv.config();

const userRegister = async() => {
    await connectToDatabase();
    try{
        const hashPassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        })
        await newUser.save();
        console.log("✅ Admin user created successfully!");
    }catch(error){
        console.log(error)
    }
}
userRegister();