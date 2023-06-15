import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import settings from "../icons/settings.svg";
import "./navbar.css";

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <Link
          to={"/config"}
          style={{ textDecoration: "none" }}
          className={"link"}
        >
          <div className="navbar-elements">
            <img src={settings} alt="" style={{ cursor: "pointer" }} />
          </div>
        </Link>
      </div>
    </>
  );
};

export default Navbar;
