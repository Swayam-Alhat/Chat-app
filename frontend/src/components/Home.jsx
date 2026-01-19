import { useEffect, useRef } from "react";
import Navbar from "./Navbar.jsx";
import UsersList from "./UsersList.jsx";
import ChatBox from "./ChatBox.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../axiosConfig/axiosInstance.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

function Home() {
  const [usersData, setUsersData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // to have global scope, we are declaring it as ref
  const socket = useRef(null); // socket's value is {current:null}

  const navigate = useNavigate();

  // define function to fetch users data
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/users");

      // set isDataFetched
      setIsDataFetched(true);
      // set current user
      setCurrentUser(response.data.currentUser);

      // set all users data
      setUsersData(response.data.users);
    } catch (error) {
      navigate("/login");
    }
  };

  // useEffect to fetch data (users)
  useEffect(() => {
    fetchData();
  }, []);

  // useEffect to form websocket connection.
  useEffect(() => {
    if (!isDataFetched) {
      return;
    }

    // form connection
    socket.current = new WebSocket("http://localhost:3000");

    socket.current.addEventListener("open", () => {
      // toast message
      toast.success("websocket connection successfull");

      // define listener
      const handleOnlineUsers = (data) => {
        const connectedUsers = JSON.parse(data.data);

        if (connectedUsers.type === "online_users") {
          setOnlineUsers(connectedUsers.onlineUsers);
        }
      };

      socket.current.addEventListener("message", handleOnlineUsers);
    });
    // clean up function
    return () => {
      socket.current.addEventListener("close", () => {
        toast("websocket Connection closed ");
        console.log("websocket Connection closed");
      });
      socket.current.close();
    };
  }, [isDataFetched]);

  // useEffect to scroll down chatbox
  useEffect(() => {
    if (!chatPartner) {
      return;
    }

    // define function for scrolling
    const scrollToBottom = () => {
      const chatBox = document.getElementById("chatBox");
      chatBox.scrollTop = chatBox.scrollHeight;
    };

    scrollToBottom();
  }, [messages]);

  // useEffect to add event listener on updated chatPartner
  // since, when we assign listener, it takes current value and set it. When value updates, it does not update listener. Thats why we useEffect
  useEffect(() => {
    // if null, return
    if (!chatPartner || !currentUser) {
      return;
    }

    // define function (listener) for events
    const handleServerData = (data) => {
      const serverData = JSON.parse(data.data);

      if (serverData.type === "new_message") {
        // check if sender (i.e currentUser in Data) is selected as chatPartner by currentUser (receiver)
        // if yes -> render message if No -> only notify about message
        if (serverData.currentUser._id === chatPartner._id) {
          setMessages((prev) => [...prev, serverData.messageData]);
        } else {
          toast(`${serverData.currentUser.name} sent you a message`);
        }
      }
    };

    // add listener for socket connection
    socket.current.addEventListener("message", handleServerData);

    // remove old listener when values changes
    return () => {
      socket.current.removeEventListener("message", handleServerData);
    };
  }, [chatPartner, currentUser]);

  return (
    <div
      id="parent"
      className={`h-screen flex flex-col ${
        isDataFetched ? "" : "justify-center items-center"
      }`}
    >
      {/* render Home Page if Data fetched successfully */}
      {isDataFetched ? (
        <div id="home-container" className="h-full w-full">
          <Toaster position="top-right" />
          <Navbar />

          {/* main chatpage container */}
          <div className="h-[calc(100vh-4rem)] grid grid-cols-[1fr_2fr] pr-3">
            <UsersList
              setMessages={setMessages}
              usersData={usersData}
              setChatPartner={setChatPartner}
              chatPartner={chatPartner}
              onlineUsers={onlineUsers}
              socket={socket}
            />

            <ChatBox
              chatPartner={chatPartner}
              messages={messages}
              setMessages={setMessages}
              currentUser={currentUser}
              socket={socket}
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner color="white" size={54} />
      )}
    </div>
  );
}

export default Home;
