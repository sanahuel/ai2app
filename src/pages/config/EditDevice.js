import { React, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import add from "../../icons/add.svg";
import "./NewDevice.css";

const EditDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ip, setIp] = useState();
  const [ip2, setIp2] = useState();
  const [dis, setDis] = useState("DEFAULT");
  const [nombre, setNombre] = useState();

  useEffect(() => {
    async function fetchData() {
      fetch(`http://${window.location.hostname}:8000/config/disp/` + id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            setIp(data.IP);
            setIp2(data.IP2);
            setDis(data.Dis);
            setNombre(data.Nombre);
          }
        });
    }
    fetchData();
  }, []);

  const updateDevice = () => {
    if (ip === "") {
      alert("El dispositivo debe tener IP");
      return;
    }

    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
    async function fetchUpdate() {
      fetch(`http://${window.location.hostname}:8000/config/disp/` + id, {
        method: "PUT",
        body: JSON.stringify({
          IP: ip,
          IP2: ip2,
          Dis: dis,
          Nombre: nombre,
          nDis: parseFloat(id),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message == 1) {
            navigate("/config");
          } else if (data.error === "nDis") {
            alert("Número de dispositivo ya asignado");
          } else {
            alert("Error communicating with server");
          }
        });
    }
    fetchUpdate();
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
              defaultValue={nombre}
              style={{ width: "138.4px" }}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="input-div">
            <span>IP Principal</span>
            <input
              className="input-field"
              min="0"
              defaultValue={ip}
              style={{ width: "138.4px" }}
              onInput={(e) => setIp(e.target.value)}
            />
          </div>
          <div className="input-div">
            <span>IP Secundaria</span>
            <input
              className="input-field"
              min="0"
              defaultValue={ip2}
              style={{ width: "138.4px" }}
              onInput={(e) => setIp2(e.target.value)}
            />
          </div>
          <div className="input-div">
            <span>Tipo de Dispositivo</span>
            <select
              name="select"
              className="input-field"
              value={dis}
              onChange={(e) => setDis(e.target.value)}
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
      <button className="crear-dispositivo" onClick={() => updateDevice()}>
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default EditDevice;
