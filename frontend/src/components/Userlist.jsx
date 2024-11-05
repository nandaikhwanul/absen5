import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice"; // Import action getMe
import axios from "axios";
import { Link } from "react-router-dom";

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get user from Redux

  useEffect(() => {
    dispatch(getMe()); // Get the logged-in user's information
    getUsers(); // Fetch users on initial load
  }, [dispatch]);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
      console.log("Fetched users:", response.data); // Log the data
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      getUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="w-full flex justify-start items-start h-screen relative top-10 left-20">
      <div className="w-full relative shadow-md sm:rounded-lg">
        <div className="p-4">
          <Link to="/users/add" className="button is-primary mb-2">Add New</Link>
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input type="text" id="table-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">#</th>
              <th scope="col" className="px-4 py-3">Nama</th>
              <th scope="col" className="px-4 py-3">NIP</th>
              <th scope="col" className="px-4 py-3">Role</th>
              <th scope="col" className="px-4 py-3">Last Login</th>
              <th scope="col" className="px-4 py-3">Last Logout</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.uuid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-4 py-4">{index + 1}</td>
                <td className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-normal break-words max-w-xs">
                  {user.name}
                </td>
                <td className="px-4 py-4">{user.nip}</td>
                <td className="px-4 py-4">{user.role}</td>
                <td className="px-4 py-4">{user.loginTime ? new Date(user.loginTime).toLocaleString() : "N/A"}</td> {/* Format loginTime */}
                <td className="px-4 py-4">{user.logoutTime ? new Date(user.logoutTime).toLocaleString() : "N/A"}</td> {/* Format logoutTime */}
                <td className="px-4 py-4 text-right">
                  <Link to={`/users/edit/${user.uuid}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2">Edit</Link>
                  <button onClick={() => deleteUser(user.uuid)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Userlist;
