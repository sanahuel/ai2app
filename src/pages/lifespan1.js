import React from "react";
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
  const events = [
    {
      title: "Lifespan #1",
      start: "2023-03-13T09:30:00+01:00",
      allDay: false, // will make the time show
    },
    {
      title: "Lifespan #1",
      start: "2023-03-14T09:30:00+01:00",
      allDay: false, // will make the time show
    },
    {
      title: "Lifespan #1",
      start: "2023-03-15T09:30:00+01:00",
      allDay: false, // will make the time show
    },
    {
      title: "Lifespan #1",
      start: "2023-03-16T09:30:00+01:00",
      allDay: false, // will make the time show
    },
    {
      title: "Lifespan #1",
      start: "2023-03-17T09:30:00+01:00",
      allDay: false, // will make the time show
    },
    {
      title: "Lifespan #1",
      start: "2023-03-18T09:30:00+01:00",
      allDay: false, // will make the time show
    },
    {
      title: "Lifespan #1",
      start: "2023-03-19T09:30:00+01:00",
      allDay: false, // will make the time show
    },
    {
      title: "Lifespan #1",
      start: "2023-03-20T09:30:00+01:00",
      allDay: false, // will make the time show
    },
  ];

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
    console.log(dialog);
  };

  const areUSureDelete = (choose) => {
    if (choose) {
      setDialog("", false, "");
      console.log("...");
    } else {
      setDialog("", false, "");
    }
  };

  return (
    <div className="nuevo-ensayo">
      {/* INFO */}
      <div className="container-div">
        <div className="container-header">
          <span>Informaci??n</span>
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
          <span>Aplicaci??n</span>
          <input
            type="text"
            value=" Lifespan"
            className="input-field"
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>N?? de Placas</span>
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
            value=" 30"
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
              "descripcion de la condici??n {condicion}"
            </span>
            <button
              onClick={() =>
                handleDelete(index, "Eliminar una condici??n no es reversible")
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
            editable={false}
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
