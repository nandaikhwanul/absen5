import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoPricetag, IoHome, IoLogOut, IoMenu } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State untuk mengatur visibilitas sidebar
  const [isScrolled, setIsScrolled] = useState(false); // State untuk mengatur kondisi scroll
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  // Mengatur event listener untuk scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Ubah state berdasarkan posisi scroll
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav>
      {/* Hamburger Icon for Mobile View */}
      {!isOpen && (
        <div
          className={`fixed left-0 top-0 w-full h-12 p-2 z-30 md:hidden transition duration-300 ${
            isScrolled ? "backdrop-sepia-0 bg-white/30 backdrop-blur-md shadow-md" : "bg-transparent"
          }`}
        >
          <button onClick={toggleSidebar} className="text-3xl ml-4">
            <IoMenu />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <header
        className={`fixed top-0 left-0 w-60 bg-white p-6 shadow-md h-full z-20 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex space-x-6 mb-6">
          <h1>Dashboard</h1>
          {/* Close button for mobile view */}
          <button onClick={toggleSidebar} className="ml-auto text-xl md:hidden">
            ✕
          </button>
        </div>
        <ul className="flex flex-col space-y-6 mt-14 border-t py-6">
          {/* Display "Data" link for all users */}

          {/* Display "Profile & Barcode" link only for "dosen" role */}
          {user && user.role === "admin" && (
            <div>
              <ul className="menu-list">
                <li>
                  <NavLink to={"/dashboard"}>Dashboard</NavLink>
                  <NavLink to={"/users"}>Add Users</NavLink>
                </li>
              </ul>
            </div>
          )}
          {user && user.role === "dosen" && (
            <div>
              <ul className="menu-list">
              </ul>
            </div>
          )}
          <li 
            className="cursor-pointer hover:bg-slate-100 p-2 text-center transition duration-500"
            onClick={logout}
          >
            Logout
          </li>
        </ul>
      </header>

      {/* Overlay for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden transition-opacity duration-300 ease-out"
          onClick={toggleSidebar}
        ></div>
      )}
    </nav>
  );
};

export default Sidebar;
