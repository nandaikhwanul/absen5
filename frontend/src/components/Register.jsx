import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import vector from "../assets/vector5.png";
import AOS from "aos";
import "aos/dist/aos.css";

const Register = () => {
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with animation duration
  }, []);

  const saveUser = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!nip || !password || !confPassword) {
      setMsg("All fields except email are required!");
      return;
    }

    if (password !== confPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", {
        nip,
        email,
        password,
        confirmPassword: confPassword,
        role: "dosen",
      });
      navigate("/");
    } catch (error) {
      setMsg(error.response?.data?.msg || "An unexpected error occurred.");
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100 overflow-hidden">
      {/* Left: Image */}
      <div
        className="w-1/2 h-screen lg:block bg-teal-500 flex justify-center items-center relative"
        data-aos="fade-right" // AOS animation
      >
        <h1 className="font-extrabold text-white text-5xl text-center relative top-20 drop-shadow-xl animate-pulse">
          REGISTER HERE
        </h1>
        <img
          src={vector}
          alt=""
          className="max-w-full max-h-full animate-float drop-shadow-xl"
          data-aos="zoom-in" // AOS animation
        />
      </div>

      {/* Right: Register Form */}
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2" data-aos="fade-left">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={saveUser}>
          <p className="text-red-500 text-center">{msg}</p>
          <div className="mb-4">
            <label htmlFor="nip" className="text-gray-600">
              NIP
            </label>
            <input
              type="text"
              id="nip"
              name="nip"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter your NIP"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter your email (optional)"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confPassword" className="text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              id="confPassword"
              name="confPassword"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
            Register
          </button>
        </form>
        <div className="mt-6 text-blue-500 text-center">
          <a href="/" className="hover:underline">
            Already have an account? Login Here
          </a>
        </div>
      </div>
    </section>
  );
};

export default Register;
