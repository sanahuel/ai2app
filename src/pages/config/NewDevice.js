import React from "react";
import add from "../../icons/add.svg";
import "./NewDevice.css";

const NewDevice = () => {
  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="container-header">
          <span>Configuración de Dispositivos</span>
        </div>
        <div className="border-div" style={{ width: "250px" }}></div>
        <div className="container-content">
          <div className="input-div">
            <span>Nº Dispositivo</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue=""
              style={{ width: "97.6px" }}
            />
          </div>
          <div className="input-div">
            <span>IP Dispositivo</span>
            <input
              className="input-field"
              min="0"
              defaultValue=""
              style={{ width: "138.4px" }}
            />
          </div>
          <div className="input-div">
            <span>Tipo de Dispositivo</span>
            <select
              name="select"
              className="input-field"
              defaultValue="DEFAULT"
            >
              <option value="DEFAULT" disabled>
                {" "}
              </option>
              <option value="1">MiniTower</option>
              <option value="2">Tower</option>
              <option value="3">Multiview</option>
            </select>
          </div>
        </div>
      </div>
      <button className="crear-dispositivo">
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default NewDevice;
