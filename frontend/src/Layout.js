import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";


const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: "85vh" }}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
