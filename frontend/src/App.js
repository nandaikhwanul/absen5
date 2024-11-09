import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Register from "./components/Register";
import AddUserManually from "./pages/AddUserManually"; // Correct import path
import List from "./pages/List";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/Dosen" element={<AddUser />} />
          <Route path="/users/DosenManually" element={<AddUserManually />} /> 
          <Route path="/users/list" element={<List />} /> 
          <Route path="/users/edit/:id" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
