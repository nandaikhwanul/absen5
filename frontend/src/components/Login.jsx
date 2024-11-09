import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset, getMe } from "../features/authSlice"; 
import logo from "../assets/logo.png";
import vector from "../assets/vector3.png";

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css'; // import AOS styles

const Login = () => {
    const [nip, setNip] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            duration: 1000, // Animation duration in ms
            easing: 'ease-in-out', // Easing function
            once: true, // Apply animation only once
        });

        if (isSuccess) {
            dispatch(getMe()); 
        }
        if (user || isSuccess) {
            navigate("/dashboard");
        }
        return () => {
            dispatch(reset()); 
        };
    }, [user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ nip, password }));
    };

    return (
        <section className="flex justify-center items-center h-screen overflow-hidden font-sans">
            <div className="bg-gray-100 flex justify-center items-center h-screen w-full">
                <div className="w-1/2 h-screen hidden lg:block bg-yellow-500 drop-shadow-lg">
                    <img src={logo} alt="Logo" className="object-cover drop-shadow-xl w-72 h-72 absolute -top-24" data-aos="fade-down" // Added AOS fade-down animation
                    />
                    <img src={vector} alt="Vector" className="object-cover w-[500px] h-[500px] drop-shadow-2xl relative left-20 top-44 animate-float" data-aos="fade-up" // Added AOS fade-up animation
                    />
                </div>
                <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
                    <h1 className="text-2xl font-semibold mb-4" data-aos="fade-up">Login</h1>
                    <form onSubmit={Auth}> {isError && ( <p className="text-center text-red-500 mb-4">{message}</p>
                        )}
                        <div className="mb-4">
                            <label htmlFor="nip" className="block text-gray-600" data-aos="fade-up">NIP</label>
                            <input type="text" id="nip" name="nip" value={nip} onChange={(e) => setNip(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" placeholder="NIP" autoComplete="off" required data-aos="fade-up"/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-600" data-aos="fade-up">Password</label>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" placeholder="Password" autoComplete="off" required data-aos="fade-up"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full" disabled={isLoading}data-aos="fade-up"> {isLoading ? "Loading..." : "Login"}
                        </button>
                    </form>
                    <div className="mt-6 text-blue-500 text-center">
                        <a href="/register" className="hover:underline" data-aos="fade-up" >Sign up Here</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
