import React from "react";

import axiosInstance from "../axiosConfig/axiosInstance.js";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axiosInstance.post("/api/login", {
        email: email,
        password: password,
      });

      navigate("/");
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
      e.target.email.value = "";
      e.target.password.value = "";
    }
  };

  // navigate to sign up page
  const navigateSignup = () => {
    navigate("/signup");
  };
  return (
    <div>
      <div className="max-w-2xl p-3 mx-auto">
        <h1 className="text-2xl text-center py-2 font-bold text-white">
          Login
        </h1>

        {/* Toast message box */}
        <Toaster position="top-right" />
        <form onSubmit={handleLogin} className="flex flex-col gap-3 p-3">
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
            className={`px-3 py-2 font-semibold text-black mt-3 border border-gray-700 bg-white rounded-lg flex justify-center gap-2 transition ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "cursor-pointer opacity-100 hover:bg-gray-200"
            }`}
          >
            {isLoading ? <LoadingSpinner color="black" size={24} /> : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-300">
          Don't have an account.{" "}
          <button
            onClick={navigateSignup}
            disabled={isLoading}
            className={
              "cursor-pointer text-neutral-50 hover:bg-neutral-900 font-semibold bg-neutral-800 px-2 py-1 rounded-md"
            }
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
