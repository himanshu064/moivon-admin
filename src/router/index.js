import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import AdminLayout from "../layout/AdminLayout";
import AuthLayout from "../layout/AuthLayout";

// import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
// import ForgotPassword from "../pages/Auth/ForgotPassword";
// import ResetPassword from "../pages/Auth/ResetPassword";

import Dashboard from "../pages/Dashboard";

import CreateEvent from "../pages/Events/CreateEvent";
import ListEvent from "../pages/Events/ListEvent";
import { APP_PATH } from "../api/endpoints";
import Error404 from "../pages/404";
import ViewEvent from "../pages/Events/ViewEvent";
import CreateSlider from "../pages/HeroSlider/CreateSlider";
import SliderList from "../pages/HeroSlider/SliderList";
import UpcomingEvents from "../pages/Events/UpcomingEvents";
import PopularEvents from "../pages/Events/PopularEvents";

function NavigationRoutes() {
  return (
    <>
      <Routes>
        <Route
          path={APP_PATH.login}
          element={
            <PublicRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PublicRoute>
          }
        />

        <Route path={APP_PATH.eventsHome}>
          <Route
            path={APP_PATH.eventsHome}
            index
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ListEvent />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path={APP_PATH.createEvent}
            element={
              <PrivateRoute>
                <AdminLayout>
                  <CreateEvent />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path={APP_PATH.allEvents}
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ListEvent />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path={APP_PATH.singleEvent}
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ViewEvent />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path={APP_PATH.popularEvents}
            element={
              <PrivateRoute>
                <AdminLayout>
                  <PopularEvents />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path={APP_PATH.upcomingEvents}
            element={
              <PrivateRoute>
                <AdminLayout>
                  <UpcomingEvents />
                </AdminLayout>
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path={APP_PATH.home}
          element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/slider/create"
          element={
            <AdminLayout>
              <CreateSlider />
            </AdminLayout>
          }
        />
        <Route
          path="/slider/list"
          element={
            <AdminLayout>
              <SliderList />
            </AdminLayout>
          }
        />
        <Route path={APP_PATH.catchAll} element={<Error404 />} />
      </Routes>
    </>
  );
}

export default NavigationRoutes;
