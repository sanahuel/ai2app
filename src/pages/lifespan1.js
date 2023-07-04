import React from "react";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Panel.css";
import "./lifespan1.css";
import del from "../icons/clear.svg";
import Dialog from "../components/dialog";
import file from "../icons/file.svg";
import { useParams } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const Lifespan1 = () => {
  let navigate = useNavigate();
  const { disp, id } = useParams();

  const [ensayo, setEnsayo] = useState({
    nombre: "",
    proyecto: "",
    aplicacion: "  ",
    ncapturas: "",
    condiciones: [],
    placas: [],
  });
  const [put, setPut] = useState([]);
  let [events, setEvents] = useState([]);
  let [dragEvent, setDragEvent] = useState({});
  let [ids, setIds] = useState(0);

  useEffect(() => {
    async function fetchData() {
      fetch(`http://${disp}:8000/control/` + id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setEnsayo(data);
          setEvents(data.capturas);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // PARA CREAR EVENTOS - TEMPORAL - BORRAR
    const temporalEvents = [];
    let temporalIds = ids;
    for (let i = 0; i < 14; i++) {
      temporalEvents.push({
        title: "Lifespan #1",
        start: new Date(new Date().getTime() + i * (24 * 60) * 60000),
        id: temporalIds,
      });
      temporalIds++;
    }
    setIds(temporalIds);
    // setEvents([...temporalEvents]);
  }, []);

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
      const response = await fetch("/control/18");
      const data = await response.json();
      console.log(data);
      //setEnsayos(formatData(data.capturas));
    }
    fetchData();
    // console.log(capturas);
  }, []);

  const condiciones = ["A", "B", "C"];
  const placas = [
    ["Placa 1", "Placa 2"],
    ["Placa 3", "Placa 4"],
    ["Placa 5", "Placa 6"],
    ["Placa 7", "Placa 8"],
    ["Placa 9", "Placa 10"],
    ["Placa 11", "Placa 12"],
    ["Placa 13", "Placa 14"],
  ];

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    index: "",
  });

  // const [events, setEvents] = useState([])

  const handleDelete = (index, message, table) => {
    setPut([table, index]);
    setDialog({
      message: message,
      isLoading: true,
      index: index,
    });
  };

  const areUSureDelete = (choose) => {
    if (put[0] == "Ensayo") {
      if (choose) {
        setDialog("", false, "");
        // deleteEnsayo();
      } else {
        setDialog("", false, "");
      }
    } else if (put[0] == "Drag") {
      if (choose) {
        setDialog("", false, "");
        dragCalendarEvent();
      } else {
        setDialog("", false, "");
        cancelDragCalendarEvent();
      }
    } else {
      if (choose) {
        setDialog("", false, "");
        putEnsayo();
      } else {
        setDialog("", false, "");
      }
    }
  };

  const deleteEnsayo = async () => {
    fetch("/control/1", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: " ",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status != "error") {
          navigate("/control");
        } else {
          alert("Error al eliminar ensayo");
        }
      })
      .catch((error) => console.log(error));
  };

  let dragCalendarEvent = () => {
    let temporalEvents = events.filter((e) => e.id != dragEvent.id);
    setEvents([...temporalEvents, dragEvent]);
  };

  let cancelDragCalendarEvent = () => {
    let old = events.filter((e) => e.id == dragEvent.id);
    setEvents(events.filter((e) => e.id != dragEvent.id));
    setEvents([...events, ...old]);
  };

  const putEnsayo = async () => {
    fetch("/control/18", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: put[0],
        id: put[1],
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <div className="nuevo-ensayo">
      {/* INFO */}
      <div className="container-div">
        <div className="container-header">
          <span>Información</span>
        </div>
        <div className="border-div"></div>
        <div className="control-row-div" style={{ paddingTop: "10px" }}>
          <span>Ensayo</span>
          <input
            type="text"
            value={ensayo.nombre || ""}
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Proyecto</span>
          <input
            type="text"
            value={ensayo.proyecto || ""}
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Aplicación</span>
          <input
            type="text"
            value={
              ensayo.aplicacion[0].toUpperCase() +
                ensayo.aplicacion.slice(1).toLowerCase() || ""
            }
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Nº de Placas</span>
          <input
            type="text"
            value={ensayo.nplacas || ""}
            className="input-field"
            style={{ width: "104px" }}
            readOnly
          ></input>
        </div>
        <div className="control-row-div" style={{ paddingBottom: "10px" }}>
          <span>Capturas Programadas</span>
          <input
            type="text"
            value={ensayo.ncapturas || ""}
            className="input-field"
            style={{ width: "104px" }}
            readOnly
          ></input>
        </div>
      </div>

      {/* CONDICIONES */}

      <div className="container-div" style={{ minHeight: "100px" }}>
        <div className="container-header">
          <span>Condiciones</span>
        </div>
        <div className="border-div" style={{ marginBottom: "5px" }}></div>
        {ensayo.condiciones.map((condicion, index) => (
          <div key={index} className="condicion-row-div">
            <span style={{ fontStyle: "italic" }}>Condición {condicion}</span>
            <button
              onClick={() =>
                handleDelete(
                  index,
                  "Eliminar una condición no es reversible",
                  "Condiciones"
                )
              }
            >
              <img src={del} alt="" />
            </button>
          </div>
        ))}
      </div>

      {/* PLACAS */}

      <div className="container-div" style={{ minHeight: "100px" }}>
        <div className="container-header">
          <span>Placas</span>
        </div>
        <div className="border-div"></div>
        <div style={{ marginTop: "8px" }}>
          {ensayo.placas.map((placa, index) => (
            <div
              style={{
                display: "inline-block",
                width: "48.6%",
                marginRight: "1.2%",
                marginBottom: "1.2%",
              }}
            >
              <div
                className="placa"
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontStyle: "italic" }}>Placa {placa}</span>
                <button
                  onClick={() =>
                    handleDelete(
                      index,
                      "Eliminar una placa no es reversible",
                      "Placas"
                    )
                  }
                >
                  <img src={del} alt="" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CALENDARIO */}

      <div className="container-div" style={{ minHeight: "100px" }}>
        <div className="container-header">
          <span>Capturas</span>
        </div>
        <div className="border-div"></div>
        <div className="Calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "title",
              center: "",
              right: "dayGridMonth,timeGridWeek,timeGridDay prev,next today",
            }}
            initialView="timeGridWeek"
            eventMinHeight="5"
            height="auto"
            minHeight="1900px !important"
            editable={true}
            eventOverlap={false}
            eventDurationEditable={false}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={true}
            allDaySlot={false}
            firstDay={1}
            locale={esLocale}
            events={events}
            eventClick={() => {
              setDialog({
                message: "Eliminar una captura no es reversible",
                isLoading: true,
                index: 0,
              });
            }}
            eventDrop={(eventDropInfo) => {
              if (eventDropInfo.event.start.getTime() >= new Date().getTime()) {
                setDragEvent({
                  title: eventDropInfo.event.title,
                  start: eventDropInfo.event.start,
                  id: eventDropInfo.event.id,
                });
                setPut(["Drag"]);
                setDialog({
                  message: "Vas a cambiar la hora de captura",
                  isLoading: true,
                  index: 0,
                });
              } else {
                let old = events.filter((e) => e.id == eventDropInfo.event.id);
                setEvents(events.filter((e) => e.id != eventDropInfo.event.id));
                setEvents([...events, ...old]);
              }
            }}
          />
        </div>
      </div>

      <button
        className="delete-button"
        onClick={() =>
          handleDelete(0, "Eliminar el experimento no es reversible", "Ensayo")
        }
      >
        Delete
      </button>

      {/* DIALOG */}

      {dialog.isLoading && (
        <Dialog onDialog={areUSureDelete} message={dialog.message} />
      )}
    </div>
  );
};

export default Lifespan1;
