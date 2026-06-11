import User from  '@/app/models/userModel'
import {connectDB} from "@/lib/db/mongoose";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        connectDB()
        const users=await User.find({})
        return NextResponse.json(users)
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({status:500},{error:error.message})
        
        
    }
    
}

