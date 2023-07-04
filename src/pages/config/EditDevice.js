import { React, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import add from "../../icons/add.svg";
import "./NewDevice.css";

const EditDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [num, setNum] = useState();
  const [ip, setIp] = useState();
  const [dis, setDis] = useState("DEFAULT");

  useEffect(() => {
    async function fetchData() {
      fetch("http://127.0.0.1:8000/config/disp/" + id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            setNum(data.nDisp);
            setIp(data.IP);
            setDis(data.Dis);
          }
        });
    }
    fetchData();
  }, []);

  const updateDevice = () => {
    if (num === "") {
      alert("El dispositivo debe tener número");
      return;
    }
    if (ip === "") {
      alert("El dispositivo debe tener IP");
      return;
    }

    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
    async function fetchUpdate() {
      fetch("http://127.0.0.1:8000/config/disp/" + id, {
        method: "PUT",
        body: JSON.stringify({
          nDisp: num,
          IP: ip,
          Dis: dis,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message == 1) {
            navigate("/config");
          } else if (data.error === "nDisp") {
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
            <span>Nº Dispositivo</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue={num}
              style={{ width: "97.6px" }}
              onChange={(e) => setNum(e.target.value)}
            />
          </div>
          <div className="input-div">
            <span>IP Dispositivo</span>
            <input
              className="input-field"
              min="0"
              defaultValue={ip}
              style={{ width: "138.4px" }}
              onChange={(e) => setIp(e.target.value)}
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
              <option value="MiniTower">MiniTower</option>
              <option value="Tower">Tower</option>
              <option value="Multiview">Multiview</option>
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
