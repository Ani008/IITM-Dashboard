import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Library,
  FileSignature,
  Mail,
  Users,
  BarChart3,
  NotepadTextDashedIcon,
  Upload,
} from "lucide-react";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuGroups = [
    {
      title: "MAIN MODULES",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
        { name: "Standards", icon: FileText, path: "/standards" },
        { name: "Periodicals", icon: Newspaper, path: "/periodicals" },
        { name: "Automotive Abstracts", icon: Library, path: "/abstracts" },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-white ">

      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-300">
        <img src={logo} alt="ARAI Logo" className="h-9" />
      </div>

      {/* Menu + Watermark Container */}
      <div className="flex flex-col justify-between flex-1">

        {/* Menu */}
        <nav className="py-4">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-5">

              <h3 className="px-6 mb-1 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                {group.title}
              </h3>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-6 py-2 text-[14px] font-medium transition-all relative group
                        ${
                          isActive
                            ? "text-indigo-700 bg-indigo-50"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                      )}

                      <item.icon
                        className={`mr-3 h-4 w-4 ${
                          isActive
                            ? "text-indigo-500"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />

                      {item.name}
                    </button>
                  );
                })}
              </div>

            </div>
          ))}
        </nav>

        {/* Watermark */}
        <div className="px-6 pb-4 text-center border-t border-gray-300 pt-3">
          <p className="text-[11px] text-gray-400 tracking-wide">
            Powered by
          </p>
          <p className="text-[12px] font-semibold text-gray-500">
            Calyonix Infotech
          </p>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;