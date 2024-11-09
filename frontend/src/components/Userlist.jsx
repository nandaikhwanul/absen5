import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx"; // Import xlsx library

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
    getUsers();
  }, [dispatch]);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const results = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.nip.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      (user.email && user.email.toLowerCase().includes(searchTerm)) // Adding email search
    );
    setFilteredUsers(results);
  };

  // Function to handle Excel file upload
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Assuming the first sheet contains the user data
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      // You can send the data to the backend here or process it as needed
      try {
        await axios.post("http://localhost:5000/import-users", { users: data });
        getUsers(); // Refresh user list after import
      } catch (error) {
        console.error("Error importing users:", error);
      }
    };
  };

  return (
    <div className=" w-[400px] sm:w-[600px] lg:w-[1024px] flex justify-start items-start h-screen relative top-10 sm:left-32 lg:left-32">
      <div className="w-full relative sm:rounded-lg">
        <div className="p-4">
          <div className="flex justify-start gap-3 mb-4">
            <Link to="/users/Dosen" className="button is-primary mb-2">Add Dosens</Link>
            <Link to="/users/DosenManually" className="button bg-blue-500 text-white hover:bg-blue-700 hover:text-white">Add Dosen Manually</Link>
            <Link to="/users/list" className="button bg-blue-500 text-white hover:bg-blue-700 hover:text-white">List Dosen</Link>
          </div>
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for users"
              onChange={handleSearch}
            />
          </div>
        </div>
        <div class="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table id="studentTable" class="min-w-full bg-white border border-gray-200">
                    <thead class="">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                <tr key={user.uuid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-normal break-words max-w-xs">
                    {user.name}
                  </td>
                  <td className="px-4 py-4">{user.nip}</td>
                  <td className="px-4 py-4">{user.role}</td>
                  <td className="px-4 py-4">{user.email}</td> {/* Displaying email */}
                  <td className="px-4 py-4">{user.loginTime ? new Date(user.loginTime).toLocaleString() : "N/A"}</td>
                  <td className="px-4 py-4">{user.logoutTime ? new Date(user.logoutTime).toLocaleString() : "N/A"}</td>
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
    </div>
  );
};

export default Userlist;
