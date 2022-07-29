import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";

function NavigationRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default NavigationRoutes;
