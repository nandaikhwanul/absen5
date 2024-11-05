import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoPricetag, IoHome, IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <nav>
      <header>
        <div className="top-0 w-60 bg-white p-6 shadow-md h-full fixed z-20">
          <div className="flex space-x-6 mb-6">
            <h1>Dashboard</h1>
          </div>
          <ul className="flex flex-col space-y-6 mt-14 border-t py-6">
            {/* Display "Data" link for all users */}
            

            {/* Display "Profile & Barcode" link only for "dosen" role */}
            {user && user.role === "admin" && (
          <div>
            <ul className="menu-list">
              <li>
              <NavLink to={"/dashboard"}> Dashboard</NavLink>
                <NavLink to={"/users"}>Add Users</NavLink>
              </li>
            </ul>
          </div>
        )}
        {user && user.role === "dosen" && (
          <div>
          </div>
        )}
            <li 
              className="cursor-pointer hover:bg-slate-100 p-2 text-center transition duration-500"
              onClick={logout} // Corrected function name
            >
              Logout
            </li>
          </ul>
        </div>
      </header>
    </nav>
  );
};

export default Sidebar;
