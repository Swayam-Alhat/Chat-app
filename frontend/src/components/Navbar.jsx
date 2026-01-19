import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig/axiosInstance";

function Navbar() {
  const navigate = useNavigate();

  // logout
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/logout");
      console.log("response on logout: ", response);
      navigate("/login");
    } catch (error) {
      console.log("Error while logout", error);
      if (error.response?.data?.error) {
        toast(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="w-full relative h-16 flex justify-between items-center px-4 py-2">
      {/* 1st flex element in navbar box */}
      <div className="md:min-w-xl flex gap-4 px-2 items-center justify-between">
        <h1 className="sm:text-2xl font-bold text-white">Chat App</h1>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search"
          className="flex-1 bg-neutral-950 border border-neutral-700 text-gray-300 px-3  py-1 md:py-2 focus:outline-none focus:ring-1 rounded-lg"
        />
      </div>

      {/* second flex item */}
      <div className="hidden md:flex gap-3 items-center justify-center">
        <button
          onClick={handleLogout}
          className="bg-gray-200 flex justify-center gap-2 hover:bg-gray-300 px-3 py-2 text-black rounded-lg cursor-pointer font-semibold"
        >
          Logout <LogOut />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
