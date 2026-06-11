import User from "@/models/User";
import {connectDb} from "@/lib/db/mongoose";
import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        connectDb()
        const {email,password} =await request.json()
        const user=await User.findOne({email})
        if (!user) {
            return NextResponse.json({error:"User Not Found"},{status:404})
            
        }
        const comparePassword=await bcrypt.compare(password,user.password)

        if (!comparePassword) {
            return NextResponse.json({error:"Invalid Password"},{status:401})
            
        }
        
        return NextResponse.json({message:"Login Successfully"},{status:200})





        
    } catch (error) {
        
    }
    
}