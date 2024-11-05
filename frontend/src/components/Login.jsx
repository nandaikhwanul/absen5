import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset, getMe } from "../features/authSlice"; // Import getMe

const Login = () => {
    const [nip, setNip] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isSuccess) {
            dispatch(getMe()); // Trigger getMe after successful login
        }
        if (user || isSuccess) {
            navigate("/dashboard");
        }
        return () => {
            dispatch(reset()); // Reset state on component unmount
        };
    }, [user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ nip, password })); // Pass nip instead of email
    };

    return (
        <section className="flex justify-center items-center h-screen overflow-hidden">
            <div className="bg-gray-100 flex justify-center items-center h-screen w-full">
                <div className="w-1/2 h-screen hidden lg:block">
                    <img
                        src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
                        alt="Placeholder"
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
                    <h1 className="text-2xl font-semibold mb-4">Login</h1>
                    <form onSubmit={Auth}>
                        {isError && (
                            <p className="text-center text-red-500 mb-4">{message}</p>
                        )}
                        <div className="mb-4">
                            <label htmlFor="nip" className="block text-gray-600">NIP</label>
                            <input
                                type="text"
                                id="nip"
                                name="nip"
                                value={nip}
                                onChange={(e) => setNip(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                placeholder="Input Your NIP"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-600">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                placeholder="Input Your Password"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
                            disabled={isLoading}>
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
