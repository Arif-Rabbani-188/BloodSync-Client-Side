import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ScrollToTop from "../../Hooks/ScrollToTop";

const Root = () => {
  return (
    <div>
      <ScrollToTop></ScrollToTop>
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  );
};

export default Root;
