import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Admin/Navbar";
import Sidebar from "../components/Admin/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="pt-16 pl-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
