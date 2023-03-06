import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import panel from "../icons/display.svg";
import visual from "../icons/chart.svg";
import nuevo from "../icons/biotech.png";
import logout from "../icons/logout.svg";
// import ai2 from "../icons/Logo_ai2.png";
import "./sidebar.css";
const Sidebar = () => {
  let { logoutCall } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <ul className="sidebar-buttons">
        <NavLink
          to={"/visualizar"}
          style={{ textDecoration: "none" }}
          className={"link"}
        >
          <li className="sidebar-button">
            <img src={visual} alt="" />
            <span>Resultados</span>
          </li>
        </NavLink>
        <NavLink
          to={"/nuevo"}
          style={{ textDecoration: "none" }}
          className={"link"}
        >
          <li className="sidebar-button">
            <img src={nuevo} alt="" />
            <span>Nuevo Ensayo</span>
          </li>
        </NavLink>
        <NavLink
          to={"/control"}
          style={{ textDecoration: "none" }}
          className={"link"}
        >
          <li className="sidebar-button">
            <img src={panel} alt="" />
            <span>Panel de Control</span>
          </li>
        </NavLink>
      </ul>
      <div className="div-border"></div>
      <div className="sidebar-out" onClick={logoutCall}>
        <img src={logout} alt="" />
        <span>Log Out</span>
      </div>

      {/* <img
        src={ai2}
        alt=""
        style={{
          width: "100px",
          position: "relative",
          top: "-450px",
          left: "35px",
        }}
      /> */}
    </div>
  );
};

export default Sidebar;
