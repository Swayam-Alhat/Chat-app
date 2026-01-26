import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig/axiosInstance.js";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { Toaster, toast } from "react-hot-toast";

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/signup", {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      navigate("/");
    } catch (error) {
      console.log("error", error);

      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
      e.target.name.value = "";
      e.target.email.value = "";
      e.target.password.value = "";
    }
  };

  // navigate to login page
  const navigateLogin = () => {
    navigate("/");
  };
  return (
    <div>
      <div className="max-w-2xl p-3 mx-auto">
        <h1 className="text-2xl text-center py-2 font-bold text-white">
          Sign up
        </h1>
        {/* toast box */}
        <Toaster position="top-right" />
        <form onSubmit={handleSignup} className="flex flex-col gap-3 p-3">
          <label htmlFor="name" className="text-gray-200">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="px-3 py-2 bg-neutral-950 focus:outline-none border border-neutral-700 text-gray-200 rounded-lg focus:ring-1"
          />
          <label htmlFor="email" className="text-gray-200">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="px-3 py-2 bg-neutral-950 border border-neutral-700 focus:outline-none text-gray-200 rounded-lg focus:ring-1"
          />
          <label htmlFor="password" className="text-gray-200">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="px-3 py-2 bg-neutral-950 border border-neutral-700 focus:outline-none text-gray-200 rounded-lg focus:ring-1"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-3 py-2 font-semibold flex justify-center gap-2 text-black mt-3 border border-gray-700 bg-white rounded-lg   ${
              isLoading
                ? "cursor-not-allowed opacity-70"
                : "hover:bg-gray-200 opacity-100 cursor-pointer"
            }`}
          >
            {isLoading ? <LoadingSpinner color="black" size={24} /> : "Sign up"}
          </button>
        </form>
        <p className="text-center text-gray-300">
          Already have an account.{" "}
          <button
            disabled={isLoading}
            onClick={navigateLogin}
            className="cursor-pointer hover:bg-neutral-900 bg-neutral-800 px-2 py-1 font-semibold rounded-md text-neutral-50"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
