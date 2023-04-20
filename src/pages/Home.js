import React from "react";

import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import "./Home.css";

const Home = () => {
  return (
    <div className="nuevo-ensayo">
      <div className="dispositivos-row">
        <div className="dispositivo-container">
          <div className="container-header">
            <span>Dispositivo 1</span>
          </div>
          <div
            className="border-div"
            style={{ width: "150px", marginBottom: "7px" }}
          ></div>
          <div className="info-div">
            <span>Ensayos</span>
            <input
              className="input-field"
              placeholder="4"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
          <div className="info-div">
            <span>Pallets disponibles</span>
            <input
              className="input-field"
              placeholder="12"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
          <div className="info-div">
            <span>Pallets ocupados</span>
            <input
              className="input-field"
              placeholder="48"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
        </div>
        <div className="dispositivo-container">
          <div className="container-header">
            <span>Dispositivo 2</span>
          </div>
          <div
            className="border-div"
            style={{ width: "150px", marginBottom: "7px" }}
          ></div>
          <div className="info-div">
            <span>Ensayos</span>
            <input
              className="input-field"
              placeholder="1"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
          <div className="info-div">
            <span>Pallets disponibles</span>
            <input
              className="input-field"
              placeholder="42"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
          <div className="info-div">
            <span>Pallets ocupados</span>
            <input
              className="input-field"
              placeholder="18"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
        </div>
        <div className="dispositivo-container">
          <div className="container-header">
            <span>Dispositivo 3</span>
          </div>
          <div
            className="border-div"
            style={{ width: "150px", marginBottom: "7px" }}
          ></div>
          <div className="info-div">
            <span>Ensayos</span>
            <input
              className="input-field"
              placeholder="6"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
          <div className="info-div">
            <span>Pallets disponibles</span>
            <input
              className="input-field"
              placeholder="10"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
          <div className="info-div">
            <span>Pallets ocupados</span>
            <input
              className="input-field"
              placeholder="50"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
        </div>
        <div className="dispositivo-container">
          <div className="container-header">
            <span>Dispositivo 4</span>
          </div>
          <div
            className="border-div"
            style={{ width: "150px", marginBottom: "7px" }}
          ></div>
          <div className="info-div">
            <span>Ensayos</span>
            <input
              className="input-field"
              placeholder="8"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
          <div className="info-div">
            <span>Pallets disponibles</span>
            <input
              className="input-field"
              placeholder="22"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
          <div className="info-div">
            <span>Pallets ocupados</span>
            <input
              className="input-field"
              placeholder="78"
              readOnly
              style={{ width: "55px" }}
            ></input>
          </div>
        </div>
      </div>

      <div
        className="container-div"
        style={{ minHeight: "100px", marginLeft: "10px", marginRight: "10px" }}
      >
        <div className="container-header">
          <span>Calendario</span>
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
            events={{}}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
