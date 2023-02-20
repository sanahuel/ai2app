import React, { useState, useEffect, useRef } from "react";
import settings from "../icons/settings.svg";
import "./navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <>
      <div className="navbar">
        <div className="navbar-elements" ref={menuRef}>
          <img
            src={settings}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              setOpen(!open);
            }}
          />
          <div
            className={`settings-dropdown ${open ? "active" : "inactive"}`}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
