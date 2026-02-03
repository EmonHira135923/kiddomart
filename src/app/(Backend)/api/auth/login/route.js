import { getUsers } from "../../../lib/dbConnect";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const userCollection = await getUsers();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await userCollection.findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 },
      );
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 },
      );
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.NEXTAUTH_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // ✅ Fix: await cookies() before using set()
    const cookieStore = await cookies();
    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json(
      {
        message: "User Login Successfully.",
        success: true,
        result: accessToken,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        message: "Login Failed",
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
