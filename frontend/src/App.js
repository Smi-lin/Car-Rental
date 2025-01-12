import "./config/connection"
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css"
import Home from "./pages/Home";
import Layout from "./Layout";
import Fleet from "./components/Fleet";
import AboutUs from "./components/AboutUs";
import Faq from "./components/Faq";
import CarOwnerDashboardPage from "./pages/CarOwner/CarOwnerDashboardPage";
import CarOwnerSignUp from "./components/CarOwner/CarOwnerSignup";
import CarOwnerCreateVehicle from "./components/CarOwner/CarOwnerCreateVehicle";
import CarOwnerNotifications from "./components/CarOwner/CarOwnerNotifications";
import RenteeDashboard from "./components/Rentee/RenteeDashboardHero";
import SignUp from "./components/Rentee/SignUp";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <SignUp />
            </Layout>
          }
        />
        <Route
          path="/carownerSignup"
          element={
            <Layout>
              <CarOwnerSignUp/>
            </Layout>
          }
        />

        <Route
          path="/fleet"
          element={
            <Layout>
              <Fleet />
            </Layout>
          }
        />
        <Route
          path="/aboutus"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout>
              <Faq />
            </Layout>
          }
        />
        <Route
          path="/carowner-dashboard"
          element={
              <CarOwnerDashboardPage />
          }
        />
        <Route
          path="/createVehicles"
          element={
              <CarOwnerCreateVehicle />
          }
        />
        <Route
          path="/notification"
          element={
              <CarOwnerNotifications />
          }
        />
        <Route
          path="/rentee-dashboard"
          element={
              <RenteeDashboard />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
