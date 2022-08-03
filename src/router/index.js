import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import AuthLayout from "../layout/AuthLayout";

// import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
// import ForgotPassword from "../pages/Auth/ForgotPassword";
// import ResetPassword from "../pages/Auth/ResetPassword";

// import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";

import CreateEvent from "../pages/Events/CreateEvent";
import ListEvent from "../pages/Events/ListEvent";
import { APP_PATH } from "../api/endpoints";
import Error404 from "../pages/404";
import ViewEvent from "../pages/Events/ViewEvent";

function NavigationRoutes() {
  return (
    <>
      <Routes>
        <Route
          path={APP_PATH.login}
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        <Route path={APP_PATH.eventsHome}>
          <Route
            path={APP_PATH.eventsHome}
            index
            element={
              <AdminLayout>
                <ListEvent />
              </AdminLayout>
            }
          />
          <Route
            path={APP_PATH.createEvent}
            element={
              <AdminLayout>
                <CreateEvent />
              </AdminLayout>
            }
          />
          <Route
            path={APP_PATH.allEvents}
            element={
              <AdminLayout>
                <ListEvent />
              </AdminLayout>
            }
          />
          <Route
            path='/events/view'
            element={
              <AdminLayout>
                <ViewEvent />
              </AdminLayout>
            }
          />
        </Route>
        <Route
          path={APP_PATH.home}
          element={
            <AdminLayout>
              <Home />
            </AdminLayout>
          }
        />
        <Route path={APP_PATH.catchAll} element={<Error404 />} />
      </Routes>
    </>
  );
}

export default NavigationRoutes;
