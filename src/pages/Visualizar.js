import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Panel.css";
import "./Visualizar.css";

const Visualizar = () => {
  const [ensayos, setEnsayos] = useState([]);

  useEffect(() => {
    let formatData = (data) => {
      return data.map((str) => {
        return {
          title: " ",
          start: str,
          allDay: false,
          color: "#ddd",
        };
      });
    };
    async function fetchData() {
      const response = await fetch("/results/");
      const data = await response.json();
      console.log(data);
      //setEnsayos(formatData(data.capturas));
    }
    fetchData();
    // console.log(capturas);
  }, []);

  return (
    <div className="nuevo-ensayo">
      <div className="panel-row-div">
        <Link
          to={"/visualizar/lifespan-r"} // '/visualizar/' + id  !!!
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
