import React from "react";
import settings from "../icons/settings.svg";
import "./navbar.css";

const navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-elements">
        <img src={settings} alt="" />
      </div>
    </div>
  );
};

export default navbar;
