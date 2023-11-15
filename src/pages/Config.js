import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "../components/dialog";

import "./Config.css";
import del from "../icons/clear.svg";
import pen from "../icons/pen.svg";

const Config = () => {
  let [disp, setDisp] = useState([]);
  let [planif, setPlanif] = useState([]);
  let [placas, setPlacas] = useState([]);
  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    index: "",
  });



  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDisp() {
      fetch(`http://${window.location.hostname}:8000/config/disp`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setDisp(data["dispositivos"]);
        });
    }
    async function fetchPlanif() {
      fetch(`http://${window.location.hostname}:8000/config/planif`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setPlanif(data["planificador"]);
        });
    }
    async function fetchPlacas() {
      fetch(`http://${window.location.hostname}:8000/config/placas`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setPlacas(data["placas"]);
        });
    }

    fetchDisp();
    fetchPlanif();
    fetchPlacas();
  }, []);

  const deleteDisp = (id) => {
    async function fetchDelete() {
      fetch(`http://${window.location.hostname}:8000/config/disp/` + id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          window.location.reload();
        });
    }
    console.log(`http://${window.location.hostname}:8000/config/disp/` + id);
    fetchDelete();
  };
  const deletePlanif = (id) => {
    async function fetchDelete() {
      fetch(`http://${window.location.hostname}:8000/config/planif/` + id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          window.location.reload();
        });
    }
    console.log(`http://${window.location.hostname}:8000/config/planif/` + id);
    fetchDelete();
  };

  const deletePlate = (id) => {
    async function fetchDelete() {
      fetch(`http://${window.location.hostname}:8000/config/placas/` + id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          window.location.reload();
        });
    }
    fetchDelete();
  };

  // DIALOG
  const areUSureDelete = (choose) => {
    if (dialog.table == "Dispositivo") {
      if (choose) {
        setDialog("", false, "");
        deleteDisp(dialog.index);
      } else {
        setDialog("", false, "");
      }
    } else if (dialog.table == "Planificador") {
      if (choose) {
        setDialog("", false, "");
        deletePlanif(dialog.index);
      } else {
        setDialog("", false, "");
      }
    } else if (dialog.table == "Condiciones"){
      if (choose){
        setDialog("", false, "");
        deletePlate(dialog.index);
      } else {
        setDialog("", false, "");
      }
    }
  };


  return (
    <div className="nuevo-ensayo">
      {/* DISPOSITIVOS */}
      <div className="container-div">
        <div className="container-header">
          <span>Configuración de Dispositivos</span>
        </div>
        <div className="border-div" style={{ width: "250px" }}></div>
        <div className="container-content">
          {disp.map((dispositivo, index) => (
            <div className="input-div" key={index}>
              <div className="dispositivo-div">
                <span>Dispositivo {dispositivo.nDisp}</span>
                <span className="ip-span">IP {dispositivo.IP}</span>
                <button
                  className="button-editar-dispositivo"
                  onClick={() =>
                    navigate(`/config/device/${dispositivo.nDisp}`)
                  }
                >
                  <img src={pen} alt="edit" />
                </button>
                <button
                  className="button-eliminar-dispositivo"
                  onClick={() => setDialog({
                    table: "Dispositivo",
                    message: "Eliminar un dispositivo no es reversible",
                    isLoading: true,
                    index: index,
                  })}
                >
                  <img src={del} alt="delete" />
                </button>
              </div>
            </div>
          ))}

          <Link to={"/config/device/new"}>
            <button className="nueva-button">
              <span style={{ color: "#666" }}>+</span>
            </button>
          </Link>
        </div>
      </div>

      {/* PLANIFICADOR */}
      <div className="container-div">
        <div className="container-header">
          <span>Configuración del Planificador</span>
        </div>
        <div className="border-div" style={{ width: "250px" }}></div>
        <div className="container-content">
          {planif.map((planificador, index) => (
            <div className="input-div" key={index}>
              <div className="dispositivo-div">
                <span>{planificador.nombre}</span>
                <button
                  className="button-editar-dispositivo"
                  onClick={() => navigate(`/config/planner/${planificador.id}`)}
                >
                  <img src={pen} alt="edit" />
                </button>
                <button
                  className="button-eliminar-dispositivo"
                  onClick={() => setDialog({
                    table: "Planificador",
                    message: "Eliminar una configuración no es reversible",
                    isLoading: true,
                    index: planificador.id,
                  })}
                >
                  <img src={del} alt="delete" />
                </button>
              </div>
            </div>
          ))}

          <Link to={"/config/planner/new"}>
            <button className="nueva-button">
              <span style={{ color: "#666" }}>+</span>
            </button>
          </Link>
        </div>
      </div>

      {/* CONDICIONES POR PLACA */}
      <div className="container-div">
        <div className="container-header">
          <span>Configuración de Distribución de Condiciones por Placa</span>
        </div>
        <div className="border-div" style={{ width: "420px" }}></div>
        <div className="container-content">
          {placas.map((placa, index) => (
            <div className="input-div" key={index}>
              <div className="dispositivo-div">
                <span>{placa.nombre}</span>
                <button
                  className="button-editar-dispositivo"
                  onClick={() => navigate(`/config/plates/${placa.id}`)}
                >
                  <img src={pen} alt="edit" />
                </button>
                <button
                  className="button-eliminar-dispositivo"
                  onClick={() => setDialog({
                    table: "Condiciones",
                    message: "Eliminar una configuración no es reversible",
                    isLoading: true,
                    index: placa.id,
                  })}
                >
                  <img src={del} alt="delete" />
                </button>
              </div>
            </div>
          ))}

          <Link to={"/config/plates/new"}>
            <button className="nueva-button">
              <span style={{ color: "#666" }}>+</span>
            </button>
          </Link>
        </div>
      </div>

      {/* DIALOG */}
      {dialog.isLoading && (
        <Dialog onDialog={areUSureDelete} message={dialog.message} />
      )}

    </div>
  );
};

export default Config;
