import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddDosenManually = () => {
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState(""); // Email is now optional
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    setMsg(""); // Reset message before submission

    // Validate inputs
    if (!nip || !password || !confPassword || !role) {
      setMsg("All fields are required!");
      return;
    }

    if (password !== confPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", {
        nip,
        email, // Email can now be empty
        password,
        confirmPassword: confPassword,
        role,
      });
      navigate("/users");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-top relative lg:left-32 sm:left-52  min-h-screen bg-white dark:bg-gray-900 w-full">
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div className="mt-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Form Section */}
            <form className="p-6 grid grid-cols" onSubmit={saveUser}>
              <h1 className="font-bold text-2xl text-center">ADD User & Role</h1>

              <div className="flex flex-col mt-2">
                <label htmlFor="nip" className="hidden">NIP</label>
                <input type="text" name="nip" id="nip" placeholder="NIP" className="mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none lg:w-[800px] w-[400px] sm:w-[600px]" value={nip} onChange={(e) => setNip(e.target.value)}
                />
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="email" className="hidden">Email</label>
                <input type="email" name="email" id="email" placeholder="Email (Optional)" className="mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="password" className="hidden">Password</label>
                <input type="password" name="password" id="password" placeholder="Password" className="mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="confPassword" className="hidden">Confirm Password</label>
                <input type="password" name="confPassword" id="confPassword" placeholder="Confirm Password" className="mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" value={confPassword} onChange={(e) => setConfPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="role" className="hidden">Role</label>
                <select name="role" id="role" className="mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" value={role} onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>Select Role</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {msg && <p className="mt-2 text-red-600">{msg}</p>}

              <button type="submit" className="mt-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 focus:outline-none"
              >
                Add User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddDosenManually;
