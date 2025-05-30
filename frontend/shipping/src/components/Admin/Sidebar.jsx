import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkStyle =
    'block px-4 py-2 rounded hover:bg-blue-100 text-blue-700 font-medium transition';

  return (
    <aside className="fixed top-16 left-0 h-full w-64 bg-zinc-100 shadow-md pt-6">
      <nav className="space-y-2 px-4">
        <NavLink to="/admin/dashboard" className={linkStyle}>Dashboard</NavLink>
        <NavLink to="/admin/customers" className={linkStyle}>Customers</NavLink>
        <NavLink to="/admin/agents" className={linkStyle}>Agents</NavLink>
        <NavLink to="/admin/shipments" className={linkStyle}>Shipments</NavLink>
        <NavLink to="/admin/pricing" className={linkStyle}>Pricing</NavLink>
        <NavLink to="/admin/finance" className={linkStyle}>Finance</NavLink>
        <NavLink to="/admin/messages" className={linkStyle}>Messages</NavLink>
      </nav>
    </aside>
  )
};

export default Sidebar;
