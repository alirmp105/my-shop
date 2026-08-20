import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

   

    const users = await User.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(users);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "خطا در دریافت کاربران" },
      { status: 500 }
    );
  }
}