import React from "react";
import Navbar from "./navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex flex-col">
        <Navbar/>
        <main className="flex-1 ">
            <Outlet/>
        </main>
        <Footer/>
    </div>
  );
};

export default PublicLayout;
