import React from "react";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Panel.css";
import "./Control.css";
import del from "../icons/clear.svg";
import Dialog from "../components/dialog";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import HealthspanControl from "./control/HealthspanControl";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import expand from "../icons/expand.svg";
import pen from "../icons/pen.svg";

const Control = () => {
  let navigate = useNavigate();
  const { disp, id } = useParams();
  let { authTokens } = useContext(AuthContext);

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
  const [results, setResults] = useState(false);
  let [dragEvent, setDragEvent] = useState({});
  let [ids, setIds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [temperatura, setTemperatura] = useState({});
  const [humedad, setHumedad] = useState({});

  useEffect(() => {
    async function fetchData() {
      fetch(`http://${disp}:8000/control/` + id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setEnsayo(data);
          setResults(data.show);
          setEvents(data.capturas);
          setTemperatura({
            min: data.temperaturaMin,
            max: data.temperaturaMax,
          });
          setHumedad({
            min: data.humedadMin,
            max: data.humedadMax,
          });
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

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    index: "",
  });

  // FORMAT DATES

  function formatDateWithTimezone(date) {
    const timezoneOffsetMinutes = date.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(
      Math.floor(timezoneOffsetMinutes / 60)
    );
    const timezoneOffsetSign = timezoneOffsetMinutes < 0 ? "+" : "-";

    const pad = (number) => (number < 10 ? "0" : "") + number;

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return `${formattedDate}`;
  }

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
        deleteEnsayo();
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
    } else if (put[0] == "New") {
      if (choose) {
        setDialog("", false, "");
        putNewCalendarEvent();
      } else {
        setDialog("", false, "");
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
    setIsLoading(true);
    fetch(`http://${disp}:8000/control/` + id, {
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

  let cancelDragCalendarEvent = () => {
    let old = events.filter((e) => e.id == dragEvent.id);
    setEvents(events.filter((e) => e.id != dragEvent.id));
    setEvents([...events, ...old]);
  };

  // PUT FETCHS
  const putEnsayo = async () => {
    fetch(`http://${disp}:8000/control/` + id, {
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
      .then((data) => window.location.reload())
      .catch((error) => console.log(error));
  };

  let dragCalendarEvent = () => {
    console.log(dragEvent);
    let temporalEvents = events.filter((e) => e.id != dragEvent.id);
    setEvents([...temporalEvents, dragEvent]);

    fetch(`http://${disp}:8000/control/` + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "Tareas_Drag",
        from: formatDateWithTimezone(dragEvent.from),
        to: formatDateWithTimezone(dragEvent.to),
      }),
    })
      .then((response) => response.json())
      .then((data) => window.location.reload())
      .catch((error) => console.log(error));
  };

  // NEW EVENT

  let checkCalendarEvents = (inicio) => {
    // capturas de otros ensayos
    // filtras si allDay===True porque esas son las canceladas
    let capturasEvents = events
      .map((captura) => {
        if (!captura.allDay) {
          return [new Date(captura.start), 5, 5];
        }
        return null; // or []
      })
      .filter(Boolean); // This will remove any null or empty array entries
    let calendarEvents = [];
    Object.values(events).forEach((event) => {
      if (!event.allDay) {
        calendarEvents.push([new Date(event.start), 5, 5]);
      }
    });

    let oldEvents = [...capturasEvents, ...calendarEvents];

    // por ahora duración = 30 min
    let duracion = 60;
    let conf = false;

    let n = 1; //nuevos
    let m = oldEvents.length; //antiguos

    do {
      let i = 0;
      let j = 0;
      conf = false;
      let conflicto = 0;

      //bucle
      while (j < m) {
        let comienzo = Math.max(inicio.getTime(), oldEvents[j][0].getTime());
        let fin = Math.min(
          inicio.getTime() + duracion * 60000,
          oldEvents[j][0].getTime() + duracion * 60000
        );
        if (comienzo < fin) {
          conf = true;
          if (fin - comienzo > conflicto) {
            conflicto = fin - comienzo;
          }
          conflicto = Math.max(fin - comienzo, conflicto);
        }
        j++;
      }

      if (conf) {
        inicio = new Date(inicio.getTime() + conflicto);
      }
    } while (conf === true);

    return inicio;
  };

  let putNewCalendarEvent = () => {
    const decodedToken = jwt_decode(authTokens.access);
    async function fetchEvent(time) {
      fetch(`http://${disp}:8000/control/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "Tareas_New",
          time: formatDateWithTimezone(time),
          duracion: ensayo.duracion,
          userId: decodedToken.user_id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.reload();
        });
    }

    const j = new Date(dragEvent["time"].getTime());
    let i = checkCalendarEvents(dragEvent["time"]);
    if (i.getTime() === j.getTime()) {
      fetchEvent(j);
    }
  };

  // TEMPERATURA + HUMEDAD

  async function fetchTemperatura() {
    if (temperatura.min < temperatura.max) {
      fetch(`http://${disp}:8000/control/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "Temperatura",
          temperatura: `${temperatura.min}-${temperatura.max}`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.reload();
        });
    } else {
      alert("Temperatura mínima superior a temperatura máxima");
    }
  }

  async function fetchHumedad() {
    if (humedad.min < humedad.max) {
      fetch(`http://${disp}:8000/control/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "Humedad",
          humedad: `${humedad.min}-${humedad.max}`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.reload();
        });
    } else {
      alert("Humedad mínima superior a humedad máxima");
    }
  }
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

      {/* RESULTADOS */}
      {results && ensayo.aplicacion == "healthspan" && (
        <HealthspanControl resultData={ensayo.resultados} />
      )}
      {/* {results && ensayo.aplicacion=='lifespan' && <LifespanControl />} */}

      {/* CONDICIONES */}

      <div className="container-div" style={{ minHeight: "100px" }}>
        <div className="container-header">
          <span>Condiciones</span>
        </div>
        <div className="border-div" style={{ marginBottom: "5px" }}></div>
        {ensayo.condiciones.map((condicion, index) => (
          <div key={index} className="condicion-row-div">
            <span
              style={{
                fontStyle: "italic",
                color: condicion[1] === false ? "#777" : "black",
              }}
            >
              Condición {condicion[0]}
            </span>
            {condicion[1] && (
              <button
                onClick={() =>
                  handleDelete(
                    condicion[0],
                    "Eliminar una condición no es reversible",
                    "Condiciones"
                  )
                }
              >
                <img src={del} alt="" />
              </button>
            )}
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
              key={index}
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
                <span
                  style={{
                    fontStyle: "italic",
                    color: placa[1] === true ? "#777" : "black",
                  }}
                >
                  Placa {index + 1} - {placa[2]}
                </span>
                {placa[1] != true && (
                  <button
                    onClick={() =>
                      handleDelete(
                        placa[0],
                        "Eliminar una placa no es reversible",
                        "Placas"
                      )
                    }
                  >
                    <img src={del} alt="" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Parámetros de Captura</span>
        </div>
        <div className="border-div"></div>
        <div className="input-div">
          <span>Rango de Temperatura</span>
          <input
            className="input-field"
            type="number"
            step="0.01"
            min="0"
            value={temperatura.min}
            onChange={(e) => {
              setTemperatura({
                min: e.currentTarget.value,
                max: temperatura.max,
              });
            }}
            style={{ position: "relative", width: "60px" }}
          />
          <span
            id="min-span"
            style={{
              position: "relative",
              left: "10px",
              width: "2px",
            }}
          >
            min
          </span>
          <span
            style={{
              width: "63px",
              paddingLeft: "34px",
              color: "#555",
            }}
          ></span>
          <input
            className="input-field"
            type="number"
            step="0.01"
            min="0"
            value={temperatura.max}
            onChange={(e) => {
              setTemperatura({
                min: temperatura.min,
                max: e.currentTarget.value,
              });
            }}
            style={{
              position: "relative",
              left: "-13px",
              width: "60px",
            }}
          />
          <span
            id="min-span"
            style={{
              position: "relative",
              left: "-5px",
              width: "30px",
            }}
          >
            max
          </span>
          <button
            className="button-editar"
            onClick={() => {
              fetchTemperatura();
            }}
          >
            <img src={pen} alt="edit" />
          </button>

          {/* <button className="button-editar" onClick={() => console.log("...")}>
            <img src={pen} alt="edit" />
          </button> */}
        </div>
        <div className="input-div">
          <span>Rango de Humedad</span>
          <input
            className="input-field"
            type="number"
            step="0.01"
            min="0"
            value={humedad.min}
            onChange={(e) => {
              setHumedad({
                min: e.currentTarget.value,
                max: humedad.max,
              });
            }}
            style={{ position: "relative", width: "60px" }}
          />
          <span
            id="min-span"
            style={{
              position: "relative",
              left: "10px",
              width: "2px",
            }}
          >
            min
          </span>
          <span
            style={{
              width: "63px",
              paddingLeft: "34px",
              color: "#555",
            }}
          ></span>
          <input
            className="input-field"
            type="number"
            min="0"
            step="0.01"
            value={humedad.max}
            onChange={(e) => {
              setHumedad({
                min: humedad.min,
                max: e.currentTarget.value,
              });
            }}
            style={{
              position: "relative",
              left: "-13px",
              width: "60px",
            }}
          />
          <span
            id="min-span"
            style={{ position: "relative", left: "-5px", width: "30px" }}
          >
            max
          </span>
          <button
            className="button-editar"
            onClick={() => {
              fetchHumedad();
            }}
          >
            <img src={pen} alt="edit" />
          </button>
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
            eventDurationEditable={false}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={true}
            allDaySlot={false}
            firstDay={1}
            locale={esLocale}
            events={events}
            dateClick={(dateClickInfo) => {
              if (dateClickInfo.date.getTime() >= new Date().getTime()) {
                setPut(["New"]);
                setDialog({
                  message: "Vas a crear una nueva captura",
                  isLoading: true,
                  index: 0,
                });
                setDragEvent({
                  time: dateClickInfo.date,
                });
              }
            }}
            eventClick={(eventClickInfo) => {
              if (eventClickInfo.event.startEditable != false) {
                handleDelete(
                  formatDateWithTimezone(eventClickInfo.event.start),
                  "Eliminar una captura no es reversible",
                  "Tareas_Cancel"
                );
              }
            }}
            eventDrop={(eventDropInfo) => {
              console.log("iiosai");
              console.log(eventDropInfo);
              if (eventDropInfo.event.start.getTime() >= new Date().getTime()) {
                setDragEvent({
                  title: eventDropInfo.event.title,
                  from: new Date(
                    events.filter(
                      (e) => e.id == eventDropInfo.event.id
                    )[0].start
                  ),
                  to: eventDropInfo.event.start,
                  id: eventDropInfo.event.id,
                  color: ensayo.color,
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
            eventOverlap={(stillEvent, movingEvent) => {
              return stillEvent.allDay; //return true -> se permite el drop
            }} // permitir "solape" si ese dia hay una captura allDay True (captura cancelada)
            //sin esta función no se permitiría el drag en días con una función cancelada
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

      {/* SPINNER */}
      {isLoading && (
        <div className="outter-spinner-div">
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Control;
