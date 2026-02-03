import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb"; // <-- add this
import { getUsers } from "../../../lib/dbConnect";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    } catch (err) {
      return Response.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const userCollection = await getUsers();

    // Convert string _id to ObjectId
    const user = await userCollection.findOne({
      _id: new ObjectId(decoded._id),
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    delete user.password; // hide password

    return Response.json(
      {
        message: "User profile fetched successfully",
        success: true,
        result: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        message: "Failed to fetch profile",
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
