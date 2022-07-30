import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";

import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";

import CreateEvent from "../pages/Events/CreateEvent";
import ListEvent from "../pages/Events/ListEvent";

function NavigationRoutes() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/events">
          <Route
            path="/events"
            index
            element={
              <AdminLayout>
                <ListEvent />
              </AdminLayout>
            }
          />
          <Route
            path="/events/new"
            element={
              <AdminLayout>
                <CreateEvent />
              </AdminLayout>
            }
          />
        </Route>
        <Route
          path="/"
          element={
            <AdminLayout>
              <Home />
            </AdminLayout>
          }
        />
      </Routes>
    </>
  );
}

export default NavigationRoutes;
