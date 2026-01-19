import axiosInstance from "../axiosConfig/axiosInstance";
import toast from "react-hot-toast";

function UsersList({
  usersData,
  setChatPartner,
  chatPartner,
  setMessages,
  onlineUsers,
  socket,
}) {
  const handleUserClick = async (user) => {
    // Return if clicked on user box who is already selected.
    if (chatPartner && chatPartner?._id === user._id) {
      return;
    }

    // set chatPartner
    setChatPartner(user);

    // fetch previous messages
    try {
      const response = await axiosInstance.get(`/api/messages/${user._id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.log("Error while message fetch: ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="h-full flex flex-col gap-3 overflow-auto p-4">
      {usersData.map((user) => {
        return (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`w-full flex items-center rounded-xl border  border-neutral-800 px-3 py-2 cursor-pointer ${
              chatPartner
                ? chatPartner._id === user._id
                  ? "bg-neutral-800"
                  : "bg-transparent hover:bg-neutral-950"
                : "bg-transparent hover:bg-neutral-950"
            }`}
          >
            <div className="h-12 w-12 rounded-full flex justify-center items-center bg-white font-semibold text-black text-xl mr-2">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 px-2 py-1 truncate">
              <h1 className="font-semibold text-gray-300 truncate">
                {user.name}
              </h1>
            </div>
            <p className="text-white">
              {onlineUsers.includes(user._id) ? "online" : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default UsersList;
