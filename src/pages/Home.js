import { React, useContext, useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import "./Home.css";
import error from "../icons/error.svg";
import IpContext from "../context/IpContext";

const Home = () => {
  const ipData = useContext(IpContext);
  const [info, setInfo] = useState([]);
  const [ipError, setIpError] = useState(false);
  const [selectedDispositivos, setSelectedDispositivos] = useState([]);
  const [events, setEvents] = useState([]);
  const TIMEOUT = 800;

  useEffect(() => {
    const fetchData = async () => {
      const promises = ipData.map(async (data) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 200); // Timeout si la IP no responde (ms)
          const response = await fetch(`http://${data.IP}:8000/dispositivo/`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId); // Clear the timeout since the fetch was successful
          const response_data = await response.json();

          return [
            data.Nombre,
            data.IP,
            response_data.pallets_disponibles,
            response_data.pallets_ocupados,
            response_data.nExp,
            data.nDis,
          ];
        } catch (error) {
          console.error("Error fetching data:", error);
          return null;
        }
      });

      try {
        const fetchedInfo = await Promise.all(promises);
        const filteredInfo = fetchedInfo.filter(Boolean); // Filter out null values
        // Primer dispositivo que no falla su fetch:
        let nonNullDisp = 0;
        for (let i = 0; i < fetchedInfo.length; i++) {
          if (fetchedInfo[i] !== null) {
            nonNullDisp = fetchedInfo[i];
          }
        }
        fetchTareas(nonNullDisp[5]);
        setSelectedDispositivos(nonNullDisp[0]);
        setInfo(filteredInfo);
      } catch (error) {
        console.error("Error fetching multiple IPs:", error);
      }
    };

    if (ipData.length > 0) {
      fetchData();
    }

    const timer = setTimeout(() => {
      if (ipData.length === 0) {
        setIpError(true);
      }
    }, TIMEOUT);

    return () => clearTimeout(timer);
  }, [ipData]);

  async function fetchTareas(nDis) {
    const disp = ipData.find(function (item) {
      return item.nDis === nDis;
    });

    fetch(`http://${disp.IP}:8000/dispositivo/tareas`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response_data) => {
        let temp_id = 0;
        const formatedEvents = response_data["tareas"].map((subarray) => {
          temp_id++;
          const startDate = new Date(subarray[0]);
          return {
            title: subarray[2],
            start: subarray[0],
            end: new Date(startDate.getTime() + subarray[3] * 60000),
            color: subarray[1],
            id: temp_id,
          };
        });
        setEvents(formatedEvents);
      });
  }

  return (
    <div className="nuevo-ensayo">
      {/* DISPOSITIVOS */}
      <div className="dispositivos-row">
        {info.map((dispositivo, index) => {
          return (
            <div
              className="dispositivo-container"
              key={index}
              onClick={() => {
                fetchTareas(dispositivo[5]);
                const disp = ipData.find(function (item) {
                  return item.nDis === dispositivo[5];
                });
                setSelectedDispositivos(disp.Nombre);
              }}
              onDoubleClick={() => {
                window.open(`http://${dispositivo[1]}:3001/`, "_blank");
              }}
            >
              <div className="container-header">
                <span>{dispositivo[0]}</span>
              </div>
              <div
                className="border-div"
                style={{ width: "150px", marginBottom: "7px" }}
              ></div>
              <div className="info-div">
                <span>Experimentos</span>
                <input
                  className="input-field"
                  placeholder={dispositivo[4]}
                  readOnly
                  style={{ width: "55px" }}
                ></input>
              </div>
              <div className="info-div">
                <span>Racks Disponibles</span>
                <input
                  className="input-field"
                  placeholder={dispositivo[2]}
                  readOnly
                  style={{ width: "55px" }}
                ></input>
              </div>
              <div className="info-div">
                <span>Racks Ocupados</span>
                <input
                  className="input-field"
                  placeholder={dispositivo[3]}
                  readOnly
                  style={{ width: "55px" }}
                ></input>
              </div>
            </div>
          );
        })}
        {/* AVISO SI NO HAY DISPOSITIVOS */}
        <div
          className="ip-error-div"
          style={{ visibility: ipError ? "visible" : "hidden" }}
        >
          <div className="ip-error-img-div">
            <img
              src={error}
              alt=""
              style={{
                filter: "invert(50%)",
                width: "50px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="ip-error-span-div">
              <span>No se han encontrado dispositivos</span>
            </div>
            <div className="ip-error-span-div">
              <span>
                Por favor compruebe su conexión y las IPs configuradas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CALENDARIO */}
      <div
        className="container-div"
        style={{ marginLeft: "10px", marginRight: "10px" }}
      >
        <div className="container-header">
          <span>Calendario {selectedDispositivos}</span>
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
            // minHeight="1900px !important"
            editable={false}
            eventOverlap={false}
            eventDurationEditable={false}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={true}
            allDaySlot={false}
            firstDay={1}
            locale={esLocale}
            events={events}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
