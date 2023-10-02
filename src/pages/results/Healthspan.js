import React, { useState, useRef, useEffect } from "react";
import { Grafica } from "./Grafica";
import { Barras } from "./Barras";

import "./lifespanr.css";
import file from "../../icons/file.svg";

const Healthspan = (resultData) => {

  // OPTIONS
  let CantidadMovOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
      title: {
        display: false,
        text: " ",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Cantidad de Movimiento",
        },
      },
      x: {
        title: {
          display: true,
          text: "Días",
        },
      },
    },
  };

  let Indicador2Options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Indicador 2",
        },
      },
    },
  };

  // FETCH CONDICIONES  --harcoded.....

  const Placa1 = [
    120, 120, 120, 120, 120, 120, 120, 119, 117, 112, 131, 90, 69, 44, 21, 7, 44,
    0, 0, 0, 0,
  ];
  const Placa2 = [
    120, 120, 120, 120, 120, 120, 120, 119, 117, 112, 104, 90, 69, 44, 21, 7, 1,
    0, 0, 0, 0,
  ];
  const Placa3 = [
    120, 120, 120, 120, 120, 120, 120, 119, 117, 112, 104, 90, 69, 44, 21, 7, 1,
    0, 0, 0, 0,
  ];

  const Placa4 = [
    120, 120, 120, 120, 120, 119, 119, 117, 115, 110, 99, 86, 60, 32, 16, 3, 0,
    0, 0, 0, 0,
  ];
  const Placa5 = [
    120, 120, 120, 120, 120, 119, 119, 117, 115, 110, 99, 86, 60, 32, 16, 3, 0,
    0, 11, 0, 0,
  ];
  const Placa6 = [
    120, 120, 120, 120, 120, 119, 119, 117, 115, 110, 99, 86, 60, 32, 16, 3, 0,
    0, 0, 0, 0,
  ];

  const Placa7 = [
    120, 120, 120, 120, 120, 120, 120, 119, 119, 116, 109, 100, 80, 64, 33, 17,
    8, 3, 1, 1, 0,
  ];
  const Placa8 = [
    120, 120, 120, 120, 120, 120, 120, 119, 119, 116, 109, 100, 80, 64, 33, 17,
    8, 3, 1, 12, 0,
  ];
  const Placa9 = [
    120, 120, 120, 120, 120, 120, 120, 119, 119, 116, 109, 100, 111, 64, 33, 17,
    8, 3, 1, 1, 0,
  ];

  const Placa10 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 20, 6, 1,
    0, 0, 0, 0,
  ];
  const Placa11 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 20, 6, 1,
    0, 0, 0, 0,
  ];
  const Placa12 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 25, 6, 1,
    0, 0, 0, 21,
  ];
  const Placa13 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 25, 6, 1,
    0, 0, 0, 21,
  ];
  const Placa14 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 25, 6, 1,
    0, 0, 0, 21,
  ];
  const Placa15 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 25, 6, 1,
    0, 0, 0, 21,
  ];
  const Placa16 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 25, 6, 1,
    0, 0, 0, 21,
  ];

  const A = { 1: Placa1, 2: Placa2, 3: Placa3, 13:Placa13, 14:Placa14, 15:Placa15, 16:Placa16 };
  const B = { 4: Placa4, 5: Placa5, 6: Placa6 };
  const C = { 7: Placa7, 8: Placa8, 9: Placa9 };
  const D = { 10: Placa10, 11: Placa11, 12: Placa12 };

  const condiciones = { 
    CantidadMov: {A: A, B: B, C: C, D: D},
    Indicador2: {
      A: {1: 60, 2: 64, 3: 71, 13: 55, 14: 56, 15: 45, 16: 65, 17: 33, 18: 66, 19: 97, 20: 55, 21: 65, 22: 64},
      B: {4: 34, 5: 31, 6: 28},
      C: {7: 71, 8: 34, 9: 50},
      D: {10: 11, 11: 13, 12: 17},
      E: {13: 21, 14: 44, 15: 16},
      F: {16: 43, 17: 53, 58: 77}
    } 
  };

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
            value=" Healthspan #0"
            className="input-field"
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Proyecto</span>
          <input
            type="text"
            value=" xxxxx"
            className="input-field"
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Aplicación</span>
          <input
            type="text"
            value=" Healthspan"
            className="input-field"
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Nº de Placas</span>
          <input
            type="text"
            value=" 25"
            className="input-field"
            style={{ width: "104px" }}
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Capturas Totales</span>
          <input
            type="text"
            value=" 30"
            className="input-field"
            style={{ width: "104px" }}
            readonly
          ></input>
        </div>
        <div className="control-row-div" style={{ paddingBottom: "10px" }}>
          <span>Fecha de Inicio </span>
          <input
            type="text"
            value=" 01/02/2023"
            className="input-field"
            style={{ width: "104px" }}
            readonly
          ></input>
        </div>
      </div>

      {/* GRAFICAS */}

      <Grafica name={"Cantidad de Movimiento"} options={CantidadMovOptions} condiciones={condiciones.CantidadMov}/>

      <Barras name={"Indicador 2"} options={Indicador2Options} condiciones={condiciones.Indicador2}/>
     
      {/* EXPORT */}
      <div className="crear-div">
        <button className="crear-button">
          <img
            src={file}
            alt=""
            style={{
              position: "relative",
              top: "1px",
            }}
          />
        </button>
        <span className="hidden-span" id="crear-span">
          Descargar .xlsx
        </span>
      </div>
    </div>
  );
};

export default Healthspan;
