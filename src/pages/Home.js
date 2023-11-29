import { React, useContext, useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import "./Home.css";
import IpContext from "../context/IpContext";

const Home = () => {
  const ipData = useContext(IpContext);
  const [info, setInfo] = useState([]);
  const [selectedDispositivos, setSelectedDispositivos] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const promises = ipData.map(async (data) => {
        try {
          const response = await fetch(`http://${data.IP}:8000/dispositivo/`);
          const response_data = await response.json();
          
          return [
            data.nDisp,
            data.IP,
            response_data.pallets_disponibles,
            response_data.pallets_ocupados,
            response_data.nExp,
          ];
        } catch (error) {
          console.error("Error fetching data:", error);
          return null;
        }
      });
  
      try {
        const fetchedInfo = await Promise.all(promises);
        const filteredInfo = fetchedInfo.filter(Boolean); // Filter out null values
  
        setInfo(filteredInfo);
  
        if (filteredInfo.length === 1) {
          const copy = Array(ipData.length).fill(0);
          copy[0] = 1;
          setSelectedDispositivos(copy);
          fetchTareas(0);
        } else {
          setSelectedDispositivos(Array(ipData.length).fill(0));
        }
      } catch (error) {
        console.error("Error fetching multiple IPs:", error);
      }
    };
  
    if (ipData.length > 0) {
      fetchData();
    }

    const copy = Array(ipData.length).fill(0);
    copy[0] = 1;
    fetchTareas(0);
    setSelectedDispositivos(copy);

  }, [ipData]);

  async function fetchTareas(id) {
    fetch(`http://${ipData[id].IP}:8000/dispositivo/tareas`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response_data) => {
        let temp_id = 0;
        const formatedEvents = response_data["tareas"].map((subarray) => {
          temp_id++;
          const startDate = new Date(subarray[0])
          return {
            title: subarray[2],
            start: subarray[0],
            end: new Date(startDate.getTime() + subarray[3]*60000),
            color: subarray[1],
            id: temp_id,
          };
        });
        console.log(formatedEvents)
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
                fetchTareas(index);
                const copy = Array(ipData.length).fill(0);
                copy[index] = 1;
                setSelectedDispositivos(copy);
              }}
              onDoubleClick={() => {
                window.open(`http://${dispositivo[1]}:3001/`, "_blank");
              }}
            >
              <div className="container-header">
                <span>Dispositivo {dispositivo[0]}</span>
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
      </div>

      {/* CALENDARIO */}
      <div
        className="container-div"
        style={{ marginLeft: "10px", marginRight: "10px" }}
      >
        <div className="container-header">
          <span>
            Calendario{" "}
            {Math.max(...selectedDispositivos) > 0 &&
              `Dispositivo ${ipData[selectedDispositivos.indexOf(1)].nDisp}`}
          </span>
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
