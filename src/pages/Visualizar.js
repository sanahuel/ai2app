import React from "react";
import { Link } from "react-router-dom";

import "./Panel.css";
import "./Visualizar.css";

const Visualizar = () => {
  return (
    <div className="nuevo-ensayo">
      <div className="panel-row-div">
        <Link
          to={"/visualizar/lifespan-r"}
          style={{ textDecoration: "none", flex: 0.9, marginRight: "20px" }}
          className={"link"}
        >
          <div className="visualizar-container-div">
            <div className="container-header" style={{ display: "flex" }}>
              <span>Lifespan #0</span>
            </div>
            <div className="border-div"></div>
            <div className="control-row-div">
              <span style={{ color: "rgb(112, 112, 112)" }}>Proyecto</span>
            </div>
            <div className="control-row-div">
              <span style={{ color: "rgb(112, 112, 112)" }}>Aplicación</span>
            </div>
          </div>
        </Link>

        <Link
          to={"/visualizar/healthspan-r"}
          style={{ textDecoration: "none", flex: 1, marginRight: "20px" }}
          className={"link"}
        >
          <div className="visualizar-container-div">
            <div className="container-header">
              <span>Healthspan #0</span>
            </div>
            <div className="border-div"></div>
            <div className="control-row-div">
              <span style={{ color: "rgb(112, 112, 112)" }}>Proyecto</span>
            </div>
            <div className="control-row-div">
              <span style={{ color: "rgb(112, 112, 112)" }}>Aplicación</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="panel-row-div" style={{ cursor: "pointer" }}>
        <Link
          to={"/visualizar/healthspan-r"}
          style={{ textDecoration: "none", flex: 0.9, marginRight: "20px" }}
          className={"link"}
        >
          <div className="visualizar-container-div">
            <div className="container-header">
              <span>Healthspan #1</span>
            </div>
            <div className="border-div"></div>
            <div className="control-row-div">
              <span style={{ color: "rgb(112, 112, 112)" }}>Proyecto</span>
            </div>
            <div className="control-row-div">
              <span style={{ color: "rgb(112, 112, 112)" }}>Aplicación</span>
            </div>
          </div>
        </Link>
        <div style={{ flex: 1, marginRight: "20px" }}></div>
      </div>
    </div>
  );
};

export default Visualizar;
