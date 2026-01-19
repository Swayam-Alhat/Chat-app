import { SendIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../axiosConfig/axiosInstance.js";

function ChatBox({ chatPartner, messages, setMessages, currentUser, socket }) {
  const textareaRef = useRef(null);

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent default behavior (for enter key, it is on next line)
      handleSend();
    }
  };

  const handleSend = async () => {
    if (textareaRef.current.value.trim() === "") {
      toast("Please provide message to send");
      return;
    }

    // // listen for upcoming message from server
    // socket.current.addEventListener("message", (data) => {
    //   const formattedData = JSON.parse(data.data);
    //   console.log("Data from server: ", formattedData);
    // });

    try {
      const currentMessage = textareaRef.current.value;
      // clear textarea
      textareaRef.current.value = "";

      // store message in DB with info
      const response = await axiosInstance.post(
        `/api/addmessage/${chatPartner._id}`,
        {
          message: currentMessage,
        },
      );

      // when we get successfull response, then only we should send message to ws server
      socket.current.send(
        JSON.stringify({
          type: "new_message",
          currentUser,
          chatPartner,
          messageData: response.data.messageData,
        }),
      );

      // show new message on sender's UI
      setMessages((prev) => [...prev, response.data.messageData]);

      toast.success(response.data.message);
    } catch (error) {
      // clear textarea
      textareaRef.current.value = "";
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="relative h-full flex flex-col overflow-auto">
      {/* actual message box (scrollable)*/}
      <div
        id="chatBox"
        className={`h-[calc(100%-8rem)] rounded-xl border border-neutral-800 overflow-auto scroll-smooth p-5 ${
          chatPartner
            ? "flex flex-col gap-y-3"
            : "flex justify-center items-center"
        }`}
      >
        {chatPartner ? (
          messages.map((message, index) => (
            // conditional css i.e justify end or start
            <div
              key={index}
              className={`w-full flex ${
                currentUser._id === message.sender
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <span
                className={`max-w-1/2 px-3 py-2 rounded-lg wrap-break-word font-semibold ${
                  currentUser._id === message.sender
                    ? "bg-white text-black"
                    : "bg-black text-white border border-neutral-700"
                }`}
              >
                {message.message}
              </span>
            </div>
          ))
        ) : (
          <div>
            <h1 className="font-bold text-center text-white text-6xl">
              Welcome to ChatApp
            </h1>
          </div>
        )}
      </div>

      {/* textarea for message typing (out of flow) */}
      <div className="absolute w-full bottom-4 flex gap-4 px-4">
        <textarea
          rows="3"
          name="message-input"
          onKeyDown={handleEnterKey}
          ref={textareaRef}
          disabled={chatPartner ? false : true}
          id="message-input"
          className={`flex-1 bg-neutral-950 text-gray-200 outline-none border border-neutral-700 rounded-lg resize-none px-4 py-3 transition-all ${
            chatPartner ? "opacity-100 hover:ring-1 focus:ring-1" : "opacity-30"
          }`}
        ></textarea>
        <button
          onClick={handleSend}
          disabled={chatPartner ? false : true}
          className={`h-12 bg-gray-200 px-4 py-2 rounded-lg transition-all  ${
            chatPartner
              ? "cursor-pointer opacity-100 hover:bg-gray-300"
              : "opacity-30 cursor-default"
          }`}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
