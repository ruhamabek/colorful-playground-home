import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { authClient } from "@/lib/auth-client";
import useOnlineUsers from "@/hooks/useOnlineUsers";
import { useParams } from "react-router-dom";
import Avatar from "@/components/Avatar";
import uploadFile from "../helpers/uploadFile";
import Header from "@/components/Header";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const { data: session } = authClient.useSession();
  const onlineUsers = useOnlineUsers();
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const { id } = useParams();

  console.log("this user datauser this isssssssssssssssssss :", dataUser);

  console.log("Online Users:from hooks", onlineUsers);
  console.log("this is about upplode ", message);

  useEffect(() => {
    // Connect to Socket.IO server
    if (session?.user?.id) {
      const newSocket = io("http://localhost:4000", {
        reconnectionAttempts: 5,
        query: {
          userid: session.user.id,
        },
      });

      newSocket.on("connect", () => {
        console.log("✅ Connected:", newSocket.id);
        setSocket(newSocket);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (socket) {
      socket.emit("message", id);
      // console.log("this is is is ", id);

      socket.on("userDetails", (userdetails: object) => {
        setDataUser(userdetails);
      });

      socket.on("message", (data) => {
        console.log("this is new message frommmmmmmmmmmmmmmmmmmmm", data);
        setAllMessage(data);
      });
    }
  }, [socket, id, session?.user.id]);
  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      };
    });
  };
  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url,
      };
    });
  };
  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socket) {
        socket.emit("new message", {
          sender: session?.user.id,
          receiver: id,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: session?.user.id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <div>
      <header className="sticky top-0 h-16 bg-white">
        <Header />
        <div className="flex items-center  mt-14 gap-4 p-4">
            <div>
            <img
              width={50}
              height={50}
              src={dataUser?.profileUrl}
              alt={dataUser?.title}
              className="rounded-full object-cover w-[50px] h-[50px]"
            />
            </div>
          <div>
            <h3>{dataUser?.title}</h3>
            <p>online</p>
          </div>
        </div>
      </header>

      <section className="h-[80vh] overflow-x-hidden overflow-y-scroll scrollbar">
        {/**all message display */}

        {/**all message show here */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => {
            return (
              <div
                key={index}
                className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                  session?.user?.id === msg?.msgByUserId
                    ? "ml-auto bg-teal-100"
                    : "bg-white"
                }`}
              >
                <div className="w-full relative">
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  )}
                </div>
                <p className="px-2">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {/* {msg.createdAt.format("hh:mm")} */}
                </p>
              </div>
            );
          })}
        </div>

        {/**upload Image display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              {/* <IoClose size={30} /> */}
              close
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              {/* <IoClose size={30} /> */}
              close
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            {/* <Loading /> */}
            loading...
          </div>
        )}
      </section>

      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative ">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
          >
            +
          </button>

          {/**video and image */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    {/* <FaImage size={18} /> */}
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    {/* <FaVideo size={18} /> */}
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/**input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-secondary">
            {/* <IoMdSend size={28} />
             */}
            send
          </button>
        </form>
      </section>
    </div>
  );
}
