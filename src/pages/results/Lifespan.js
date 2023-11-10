import React, { useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import exportToExcel from "./exportToExcel";

import "./lifespanr.css";
import file from "../../icons/file.svg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Lifespan = (resultData) => {

  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="container-header">
          <span>Información</span>
        </div>
        <div className="border-div"></div>
        <div className="control-row-div" style={{ paddingTop: "10px" }}>
          <span>Ensayo</span>
          <input
            type="text"
            value=" Lifespan #0"
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Proyecto</span>
          <input
            type="text"
            value=" xxxxx"
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Aplicación</span>
          <input
            type="text"
            value=" Lifespan"
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Nº de Placas</span>
          <input
            type="text"
            value=" 25"
            className="input-field"
            style={{ width: "104px" }}
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Capturas Totales</span>
          <input
            type="text"
            value=" 30"
            className="input-field"
            style={{ width: "104px" }}
            readOnly
          ></input>
        </div>
        <div className="control-row-div" style={{ paddingBottom: "10px" }}>
          <span>Fecha de Inicio </span>
          <input
            type="text"
            value=" 01/02/2023"
            className="input-field"
            style={{ width: "104px" }}
            readOnly
          ></input>
        </div>
      </div>

    </div>
  );
};

export default Lifespan;
