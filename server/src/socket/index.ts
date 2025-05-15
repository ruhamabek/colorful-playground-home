import { any } from "better-auth/*";
import { Server } from "socket.io";
import Profile from "../model/profile";
import { ConversationModel, MessageModel } from "../model/ConversationModel";

export default function socketHandler(server: any) {
  // Track online users
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for testing
      methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: true,
    },
  });

  io.on("connection", async (socket) => {
    console.log("🔥 New connection:", socket.id);

    const userId = socket.handshake.query.userid;
    console.log("User ID: sender ", userId);
    //create rom

    socket.join(userId as string);
    onlineUsers.set(socket.id, userId as string);

    io.emit("onlineUser", Array.from(onlineUsers));

    //thi is params user id
    socket.on("message", async (id: string) => {
      const userdetails = await Profile.findOne({ userid: id });
      const user = userdetails?.toObject();
      console.log("User Details: bbbbbbbbbbbbbbbb", userdetails);

      socket.emit("userDetails", userdetails);

      //get previous message
      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: userId, receiver: user?.userid },
          { sender: user?.userid, receiver: userId },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    });
    // Notify all clients about new online user
    io.emit("online_users", Array.from(onlineUsers.values()));
    //new message

    socket.on("new message", async (data) => {
      //check conversation is available both user

      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      //if conversation is not available
      if (!conversation) {
        const createConversation = await new ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        conversation = await createConversation.save();
      }

      const message = new MessageModel({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
      });
      const saveMessage = await message.save();

      const updateConversation = await ConversationModel.updateOne(
        { _id: conversation?._id },
        {
          $push: { messages: saveMessage?._id },
        }
      );

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(data?.sender).emit(
        "message",
        getConversationMessage?.messages || []
      );
      io.to(data?.receiver).emit(
        "message",
        getConversationMessage?.messages || []
      );

      // //send conversation
      // const conversationSender = await getConversation(data?.sender);
      // const conversationReceiver = await getConversationme(data?.receiver);

      // io.to(data?.sender).emit("conversation", conversationSender);
      // io.to(data?.receiver).emit("conversation", conversationReceiver);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      console.log("💀 Disconnected:", socket.id);
    });
  });

  return io;
}
