import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebardSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Sidebar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          return (
            <button
              key={user._id}
              className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                selectedUser?._id === user._id
                  ? "bg-base-200 text-primary"
                  : "hover:bg-base-200/50"
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="relative mx-auto lg:mx-0">
                <div
                  className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium ${
                    isOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.fullName.charAt(0).toUpperCase()}
                      className="rounded-full"
                    />
                  ) : (
                    user.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                {isOnline && (
                  <div className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0 flex-1">
                <h3 className="font-medium truncate">{user.fullName}</h3>
                <p className="text-sm text-base-content/70 truncate">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
