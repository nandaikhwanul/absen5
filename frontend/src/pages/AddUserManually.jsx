import React, { useEffect } from "react";
import Layout from "./Layout";
import FormAddDosenManually from "../components/FormAddDosenManually"; // Correct import path
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const AddUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
        if (user && user.role !== "admin") {
            navigate("/dashboard");
        }
    }, [isError, user, navigate]);

    return (
        <Layout>
            <FormAddDosenManually />
        </Layout>
    );
};

export default AddUser;
