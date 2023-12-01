import { React, useRef } from "react";
import { useNavigate } from "react-router-dom";
import add from "../../icons/add.svg";
import "./NewDevice.css";

const NewIP = () => {
  const ip = useRef();

  let navigate = useNavigate();

  const postDevice = () => {
    if (ip.current.value === "") {
      alert("Se debe rellenar el campo IP");
      return;
    }

    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
    async function fetchData() {
      fetch(`http://${window.location.hostname}:8000/config/IP`, {
        method: "POST",
        body: JSON.stringify({
          IP: ip.current.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message == 1) {
            navigate("/config");
          } else {
            alert(data.error);
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
            <span>IP Dispositivo</span>
            <input
              className="input-field"
              min="0"
              defaultValue=""
              style={{ width: "138.4px" }}
              ref={ip}
            />
          </div>
        </div>
      </div>
      <button className="crear-dispositivo" onClick={() => postDevice()}>
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default NewIP;
