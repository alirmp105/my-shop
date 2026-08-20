import UserList from "@/components/UserList";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { EyeClosed, EyeIcon } from "lucide-react";
import { Suspense } from "react";


export async function getUsers({
  status = "all",
  role = "all",
} = {}) {
  await connectDB();

  const filter = {};

  if (status === "active") {
    filter.isActive = true;
  }

  if (status === "inactive") {
    filter.isActive = false;
  }

  if (role === "user" || role === "admin") {
    filter.role = role;
  }

  const users = await User.find(filter)
    // .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  }));
}
// import { getUsers } from "@/lib/users";

const UsersPage = async ({ searchParams }) => {
  
  const params = await searchParams;

  const status = params.status || "all";
  const role = params.role || "all";

  const users = await getUsers({
    status,
    role,
  });
  
  //  await new Promise((resolve) => setTimeout(resolve, 3000));
   

  return (
    <div>
      <h1 className="text-4xl">
        مدیریت کاربران
      </h1>
<Suspense fallback={<div>Loading...</div>}>
      <UserList
        users={users}
        status={status}
        role={role}
      />
      </Suspense>
    </div>
    
  );
};

export default UsersPage;
