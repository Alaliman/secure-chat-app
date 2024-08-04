// components/Sidebar.tsx

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {Badge} from "@/components/ui/badge"

import { getServerSession } from 'next-auth';
import FriendsList from './FriendsList';
import UserPanel from './UserPanel';
import SignOut from './SignOut';

import { authOptions } from '@/lib/auth';

const Sidebar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex w-full flex-row items-center rounded-lg bg-gray-800 text-white shadow-lg md:h-full md:flex-col">
      {session && <UserPanel username={session.user.username} />}
      <div className="w-full flex-1">
        {session && <FriendsList userId={session.user.id} />}
      </div>
      <div className="hidden md:inline-block">
        <SignOut />
      </div>
    </div>
  );
};

export default Sidebar;
