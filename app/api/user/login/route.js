import User from "@/app/models/userModel";
import {connectDB} from "@/lib/db/mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        connectDB()
        const { email, password } = await request.json()
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User Not Found" }, { status: 404 })

        }
        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 401 })

        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        const response = NextResponse.json({ message: 'Login successful' })

        // Cookie set karo
        response.cookies.set('token', token, {
            httpOnly: true,      // JS access nahi kar sakta
            secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
            sameSite: 'lax',     // CSRF protection
            maxAge: 60 * 60 * 24 * 7,  // 7 din (seconds mein)
            path: '/'
        })

        return response






    } catch (error) {
        console.log(error);
        
        return NextResponse.json({error:error.message},{status:500})

    }

}