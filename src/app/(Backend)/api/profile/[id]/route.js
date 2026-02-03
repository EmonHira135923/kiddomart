import { getUsers } from "../../../lib/dbConnect";
import { ObjectId } from "mongodb"; // ObjectId ইমপোর্ট করতে ভুলবেন না
import { revalidatePath } from "next/cache";

export async function PATCH(request, { params }) {
  try {
    const userCollection = await getUsers();
    const { id } = await params;

    // ১. আইডি ভ্যালিডেশন
    if (!id || id.length !== 24) {
      return Response.json({ status: 400, message: "Invalid User ID format" });
    }

    const query = { _id: new ObjectId(id) };

    // ২. ফ্রন্টএন্ড থেকে পাঠানো ডাটা রিসিভ করা (name, phone, image)
    const { name, phone, image } = await request.json();

    // ৩. আপডেট অবজেক্ট তৈরি করা (শুধু যে ডাটাগুলো পাঠানো হয়েছে সেগুলো সেট হবে)
    const updateData = {
      updated_at: new Date(),
    };

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (image) updateData.image = image; // ক্লাউডিনারি থেকে আসা সিকিউর URL

    const update = {
      $set: updateData,
    };

    // ৪. ডাটাবেস আপডেট করা
    const result = await userCollection.updateOne(query, update);

    if (result.matchedCount === 0) {
      return Response.json({ status: 404, message: "User not found" });
    }

    // ৫. ক্যাশ ক্লিয়ার করা যাতে প্রোফাইল পেজে আপডেট ডাটা দেখা যায়
    revalidatePath("/profile");

    return Response.json(
      {
        message: "Profile updated successfully!",
        success: true,
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        message: "Failed to update profile",
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
