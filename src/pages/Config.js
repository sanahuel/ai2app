import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";

import "./Config.css";
import del from "../icons/clear.svg";
import pen from "../icons/pen.svg";

const Config = () => {
  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="container-header">
          <span>Configuración de Dispositivos</span>
        </div>
        <div className="border-div" style={{ width: "250px" }}></div>
        <div className="container-content">
          <div className="input-div">
            <div className="dispositivo-div">
              <span>Dispositivo 1</span>
              <span className="ip-span">IP 111.1.1.1</span>
              <button className="button-eliminar-dispositivo">
                <img src={pen} alt="edit" />
              </button>
              <button className="button-editar-dispositivo">
                <img src={del} alt="delete" />
              </button>
            </div>
          </div>

          <div className="input-div">
            <div className="dispositivo-div">
              <span>Dispositivo 2</span>
              <span className="ip-span">IP 111.1.1.1</span>
              <button className="button-eliminar-dispositivo">
                <img src={pen} alt="edit" />
              </button>
              <button className="button-editar-dispositivo">
                <img src={del} alt="delete" />
              </button>
            </div>
          </div>

          <Link to={"/config/device/new"}>
            <button className="nueva-button">
              <span style={{ color: "#666" }}>+</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Configuración del Planificador</span>
        </div>
        <div className="border-div" style={{ width: "250px" }}></div>
        <div className="container-content">
          <div className="input-div">
            <div className="dispositivo-div">
              <span>Lifespan 21 días #1</span>
              <button className="button-eliminar-dispositivo">
                <img src={pen} alt="edit" />
              </button>
              <button className="button-editar-dispositivo">
                <img src={del} alt="delete" />
              </button>
            </div>
          </div>
          <div className="input-div">
            <div className="dispositivo-div">
              <span>Healthspan placas 35mm</span>
              <button className="button-eliminar-dispositivo">
                <img src={pen} alt="edit" />
              </button>
              <button className="button-editar-dispositivo">
                <img src={del} alt="delete" />
              </button>
            </div>
          </div>
          <div className="input-div">
            <div className="dispositivo-div">
              <span>Lifespan 21 días #2</span>
              <button className="button-eliminar-dispositivo">
                <img src={pen} alt="edit" />
              </button>
              <button className="button-editar-dispositivo">
                <img src={del} alt="delete" />
              </button>
            </div>
          </div>
          <Link to={"/config/planner/new"}>
            <button className="nueva-button">
              <span style={{ color: "#666" }}>+</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Configuración de Distribución de Condiciones por Placa</span>
        </div>
        <div className="border-div" style={{ width: "420px" }}></div>
        <div className="container-content">
          <div className="input-div">
            <div className="dispositivo-div">
              <span>Multipocillo 12 placas</span>
              <button className="button-eliminar-dispositivo">
                <img src={pen} alt="edit" />
              </button>
              <button className="button-editar-dispositivo">
                <img src={del} alt="delete" />
              </button>
            </div>
          </div>

          <div className="input-div">
            <div className="dispositivo-div">
              <span>Placas 35mm</span>
              <button className="button-eliminar-dispositivo">
                <img src={pen} alt="edit" />
              </button>
              <button className="button-editar-dispositivo">
                <img src={del} alt="delete" />
              </button>
            </div>
          </div>

          <div className="input-div">
            <div className="dispositivo-div">
              <span>Multipocillo 24 placas</span>
              <button className="button-eliminar-dispositivo">
                <img src={pen} alt="edit" />
              </button>
              <button className="button-editar-dispositivo">
                <img src={del} alt="delete" />
              </button>
            </div>
          </div>

          <Link to={"/config/plates/new"}>
            <button className="nueva-button">
              <span style={{ color: "#666" }}>+</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Config;
