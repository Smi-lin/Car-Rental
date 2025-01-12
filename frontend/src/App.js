import "./config/connection";
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";
import SignUp from "./components/SignUp";
import Fleet from "./components/Fleet";
import AboutUs from "./components/AboutUs";
import Faq from "./components/Faq";
import CarOwnerDashboardPage from "./pages/CarOwner/CarOwnerDashboardPage";
import CarOwnerSignUp from "./components/CarOwner/CarOwnerSignup";



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
          path="/dashboard"
          element={
              <CarOwnerDashboardPage />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
