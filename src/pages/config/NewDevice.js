import { React, useRef } from "react";
import { useNavigate } from "react-router-dom";
import add from "../../icons/add.svg";
import "./NewDevice.css";

const NewDevice = () => {
  const ip = useRef();
  const ip2 = useRef();
  const dis = useRef();
  const nombre = useRef();

  let navigate = useNavigate();

  const postDevice = () => {
    if (ip.current.value === "") {
      alert("El dispositivo debe tener IP");
      return;
    }

    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
    async function fetchData() {
      fetch(`http://${window.location.hostname}:8000/config/disp`, {
        method: "POST",
        body: JSON.stringify({
          IP: ip.current.value,
          IP2: ip2.current.value,
          Dis: dis.current.value,
          Nombre: nombre.current.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message == 1) {
            navigate("/config");
          } else if (data.error === "nDisp") {
            alert("Número de dispositivo ya asignado");
          }
        });
    }
    fetchData();
  };

  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="container-header">
          <span>Configuración de Dispositivos</span>
        </div>
        <div className="border-div" style={{ width: "250px" }}></div>
        <div className="container-content">
          <div className="input-div">
            <span>Nombre de Dispositivo</span>
            <input
              className="input-field"
              min="0"
              defaultValue=""
              style={{ width: "138.4px" }}
              ref={nombre}
            />
          </div>
          <div className="input-div">
            <span>IP Principal</span>
            <input
              className="input-field"
              min="0"
              defaultValue=""
              style={{ width: "138.4px" }}
              ref={ip}
            />
          </div>
          <div className="input-div">
            <span>IP Secundaria</span>
            <input
              className="input-field"
              min="0"
              defaultValue=""
              style={{ width: "138.4px" }}
              ref={ip2}
            />
          </div>
          <div className="input-div">
            <span>Tipo de Dispositivo</span>
            <select
              name="select"
              className="input-field"
              defaultValue="DEFAULT"
              ref={dis}
            >
              <option value="DEFAULT" disabled>
                {" "}
              </option>
              <option value="miniTower">miniTower</option>
              {/* <option value="Tower">Tower</option>
              <option value="Multiview">Multiview</option> */}
            </select>
          </div>
        </div>
      </div>
      <button className="crear-dispositivo" onClick={() => postDevice()}>
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default NewDevice;
