import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { authClient } from "@/lib/auth-client";

export default function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user) return;

    const socket = io("http://localhost:3000", {
      auth: { userId: session.user.id },
    });

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("user_connected", (userId: string) => {
      setOnlineUsers((prev) => [...prev, userId]);
    });

    socket.on("user_disconnected", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user]);

  return onlineUsers;
}
