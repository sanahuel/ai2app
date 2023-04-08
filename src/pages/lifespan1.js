import React, { useEffect } from "react";
import { useState } from "react";
import "./Panel.css";
import "./lifespan1.css";
import del from "../icons/clear.svg";
import Dialog from "../components/dialog";

import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const Lifespan1 = () => {
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

  let [events, setEvents] = useState([]);
  let [dragEvent, setDragEvent] = useState({});
  const [put, setPut] = useState([]);
  let [ids, setIds] = useState(0);

  useEffect(() => {
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
    setEvents([...temporalEvents]);
  }, []);

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    index: "",
  });

  const handleDelete = (index, message) => {
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
        // putEnsayo();
      } else {
        setDialog("", false, "");
      }
    }
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
            value=" Lifespan #1"
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
            value=" Lifespan"
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
        <div className="control-row-div" style={{ paddingBottom: "10px" }}>
          <span>Capturas Programadas</span>
          <input
            type="text"
            value=" 21"
            className="input-field"
            style={{ width: "104px" }}
            readonly
          ></input>
        </div>
      </div>

      {/* CONDICIONES */}

      <div className="container-div" style={{ minHeight: "100px" }}>
        <div className="container-header">
          <span>Condiciones</span>
        </div>
        <div className="border-div" style={{ marginBottom: "5px" }}></div>
        {condiciones.map((condicion, index) => (
          <div key={index} className="condicion-row-div">
            <span>{condicion}</span>
            <span className="descripcion-condicion">
              "descripcion de la condición {condicion}"
            </span>
            <button
              onClick={() =>
                handleDelete(index, "Eliminar una condición no es reversible")
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
        {placas.map((placa, index) => (
          <div className="placa-row">
            <div className="placa" style={{ left: "20%" }}>
              <span>{placa[0]}</span>
              <button
                onClick={() =>
                  handleDelete(index, "Eliminar una placa no es reversible")
                }
              >
                <img src={del} alt="" />
              </button>
            </div>
            <div className="placa" style={{ left: "65%" }}>
              <span>{placa[1]}</span>
              <button
                onClick={() =>
                  handleDelete(index, "Eliminar una placa no es reversible")
                }
              >
                <img src={del} alt="" />
              </button>
            </div>
          </div>
        ))}
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
