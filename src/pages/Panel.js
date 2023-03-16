import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";

import "./Panel.css";

const Panel = () => {
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
      const response = await fetch("/control/");
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
          to={"/control/lifespan-1"}
          style={{ textDecoration: "none", flex: 0.9, marginRight: "20px" }}
          className={"link"}
        >
          <div className="control-container-div">
            <div className="container-header" style={{ display: "flex" }}>
              <span>Lifespan #1</span>
            </div>
            <div className="border-div"></div>
            <div className="control-row-div">
              <span style={{ color: "rgb(112, 112, 112)" }}>Proyecto</span>
            </div>
            <div className="control-row-div">
              <span style={{ color: "rgb(112, 112, 112)" }}>Dispositivo</span>
            </div>
            <div className="skill-box">
              <div className="skill-bar">
                <span className="skill-per a"></span>
              </div>
            </div>
          </div>
        </Link>

        <div className="control-container-div" style={{ flex: 1 }}>
          <div className="container-header">
            <span>Healthspan #2</span>
          </div>
          <div className="border-div"></div>
          <div className="control-row-div">
            <span style={{ color: "rgb(112, 112, 112)" }}>Proyecto</span>
          </div>
          <div className="control-row-div">
            <span style={{ color: "rgb(112, 112, 112)" }}>Dispositivo</span>
          </div>
          <div className="skill-box">
            <div className="skill-bar">
              <span className="skill-per b"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-row-div">
        <div
          className="control-container-div"
          style={{ flex: 0.9, marginRight: "20px" }}
        >
          <div className="container-header">
            <span>Lifespan #2</span>
          </div>
          <div className="border-div"></div>
          <div className="control-row-div">
            <span style={{ color: "rgb(112, 112, 112)" }}>Proyecto</span>
          </div>
          <div className="control-row-div">
            <span style={{ color: "rgb(112, 112, 112)" }}>Dispositivo</span>
          </div>
          <div className="skill-box">
            <div className="skill-bar">
              <span className="skill-per c"></span>
            </div>
          </div>
        </div>
        <div className="control-container-div" style={{ flex: 1 }}>
          <div className="container-header">
            <span>Lifespan #3</span>
          </div>
          <div className="border-div"></div>
          <div className="control-row-div">
            <span style={{ color: "rgb(112, 112, 112)" }}>Proyecto</span>
          </div>
          <div className="control-row-div">
            <span style={{ color: "rgb(112, 112, 112)" }}>Dispositivo</span>
          </div>
          <div className="skill-box">
            <div className="skill-bar">
              <span className="skill-per d"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-row-div">
        <div
          className="control-container-div"
          style={{ flex: 0.475, marginRight: "20px" }}
        >
          <div className="container-header">
            <span>Healthspan #3</span>
          </div>
          <div className="border-div"></div>
          <div className="control-row-div">
            <span style={{ color: "rgb(112, 112, 112)" }}>Proyecto</span>
          </div>
          <div className="control-row-div">
            <span style={{ color: "rgb(112, 112, 112)" }}>Dispositivo</span>
          </div>
          <div className="skill-box">
            <div className="skill-bar">
              <span className="skill-per d"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
