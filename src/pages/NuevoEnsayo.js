import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import AuthContext from "../context/AuthContext";
import "./NuevoEnsayo.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import rrulePlugin from "@fullcalendar/rrule";

import crear from "../icons/save_alt.svg";
import del from "../icons/clear.svg";
import calendar from "../icons/refresh.svg";
import add from "../icons/add.svg";
import pen from "../icons/pen.svg";

const NuevoEnsayo = () => {
  let navigate = useNavigate();

  const nombreRef = useRef(null);
  const inicioRef = useRef(null);
  const horaRef = useRef(null);
  const numRef = useRef(null);
  const hfreqRef = useRef(null);
  const minfreqRef = useRef(null);
  const fechaManualRef = useRef(null);
  const horaManualRef = useRef(null);
  const hholgRef = useRef(null);
  const minholgRef = useRef(null);

  let ensayos_tabla = [];
  let dispositivos = ["1", "2", "3"];
  let i = 0;
  let j = 0;
  let num_cond = 1;

  // let events = [
  //   {
  //     title: "",
  //     rrule: {
  //       // freq: "minutely",
  //       // count: numRef.current.value,
  //       // interval: hfreqRef.current.value * 60 + minfreqRef.current.value,
  //       // dtstart: inicioRef + "T" + horaRef + ":00",
  //       freq: "minutely",
  //       count: 100,
  //       interval: 24 * 60,
  //       dtstart: "2023-02-02T09:30:00+01:00",
  //     },
  //   },
  // ];

  const [horaInic, setHoraInic] = useState([]);

  const [horaFin, setHoraFin] = useState([]);

  const [condiciones, setCondiciones] = useState([]);

  let [ensayos, setEnsayos] = useState([]);

  const [horas, setHoras] = useState([]);

  let [tabla, setTabla] = useState([]);

  let [freqVisibility, setFreqVisibility] = useState("hidden");

  let [freqH, setFreqH] = useState([]);

  let [freqM, setFreqM] = useState([]);

  let [initVisibility, setInitVisibility] = useState("hidden");

  let [events, setEvents] = useState([]);

  let [auto, setAuto] = useState(true);

  let [capturas, setCapturas] = useState([]);

  let [ids, setIds] = useState(0);

  let [selectedOption, setSelectedOption] = useState("0");

  // useEffect(() => {
  //   if (inicioRef.current.value) {
  //     getEnsayos();
  //     sortTabla();
  //   }
  // }, [horaInic, horaFin]);

  useEffect(() => {
    setCapturas([
      {
        title: "",
        color: "#ddd",
        editable: false,
        rrule: {
          freq: "minutely",
          count: 14,
          interval: 24 * 60,
          dtstart: new Date().toISOString(),
        },
      },
    ]);
  }, []);

  const swap = (start, end, l, arr) =>
    [].concat(
      arr.slice(0, start),
      arr.slice(end, end + 1),
      arr.slice(start + 1, end),
      arr.slice(start, start + 1),
      arr.slice(end + 1, l)
    );

  // let getEnsayos = async () => {
  //   let response = await fetch("/ensayos");
  //   let data = await response.json();
  //   if (response.status === 200) {
  //     setEnsayos(data);
  //   } else if (response.statusText === "Unauthorized") {
  //     // logoutCall();
  //   }
  // };

  // let sortTabla = () => {
  //   if (!(ensayos_tabla.lenght === 0)) {
  //     for (i = 0; i < ensayos_tabla.length; i++) {
  //       for (j = 0; j < ensayos_tabla.length - 1; j++) {
  //         let h1 = ensayos_tabla[j].hora.split(":");
  //         let h2 = ensayos_tabla[j + 1].hora.split(":");
  //         if (
  //           Number(h1[0]) > Number(h2[0]) ||
  //           (Number(h1[0]) == Number(h2[0]) && Number(h1[1]) > Number(h2[1]))
  //         ) {
  //           ensayos_tabla = swap(j, j + 1, ensayos_tabla.lenght, ensayos_tabla);
  //         }
  //       }
  //     }
  //   }
  // };

  let createEnsayo = async () => {
    fetch(`/send/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombreRef.current.value,
        inicio: inicioRef.current.value,
        horas: horas.join(" "),
      }),
    });
    navigate("/");
  };

  let createCondicion = () => {
    setCondiciones([...condiciones, num_cond++]);
  };

  let deleteCondicion = (index) => {
    let condCopy = [...condiciones];
    condCopy.splice(index, 1);
    setCondiciones(condCopy);
  };

  let createEvents = (inicio) => {
    const temporalEvents = [];
    let temporalIds = ids;
    for (let i = 0; i < parseInt(numRef.current.value); i++) {
      temporalEvents.push({
        title: "",
        start: new Date(
          inicio.getTime() +
            i *
              (parseInt(hfreqRef.current.value) * 60 +
                parseInt(minfreqRef.current.value)) *
              60000
        ),
        id: temporalIds,
      });
      temporalIds++;
    }
    setIds(temporalIds);
    setEvents([...temporalEvents]);
  };

  let createDatetimeArray = (date) => {
    const datetimeArray = [];
    for (let i = 0; i < parseInt(numRef.current.value); i++) {
      datetimeArray.push(new Date(date.getTime()));
      date.setTime(
        date.getTime() +
          (parseInt(hfreqRef.current.value) * 60 +
            parseInt(minfreqRef.current.value)) *
            60000
      );
    }
    return datetimeArray;
  };
  let checkCalendarEvents = (inicio) => {
    // capturas de otros ensayos
    let temporal = eventsFromRrule("events");
    let oldEvents = temporal.concat(eventsFromRrule("capturas"));

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
        let comienzo = Math.max(inicio.getTime(), oldEvents[j].getTime());
        let fin = Math.min(
          inicio.getTime() + duracion * 60000,
          oldEvents[j].getTime() + duracion * 60000
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
    } while (conf == true);

    return inicio;
  };
  let checkEvents = (inicio, dispositivo) => {
    //añadir oldEvents->dispositivo!!!!!!!!!!!!!!!!!!!!!!!!!!
    // capturas de otros ensayos
    let oldEvents = eventsFromRrule("capturas");

    // por ahora duración = 30 min
    let duracion = 60;
    let conf = false;

    let n = parseInt(numRef.current.value); //nuevos
    let m = oldEvents.length; //antiguos

    do {
      let i = 0;
      let j = 0;
      conf = false;
      let newEvents = createDatetimeArray(inicio);
      inicio = newEvents[0];
      let conflicto = 0;

      //bucle
      while (i < n && j < m) {
        let comienzo = Math.max(newEvents[i].getTime(), oldEvents[j].getTime());
        let fin = Math.min(
          newEvents[i].getTime() + duracion * 60000,
          oldEvents[j].getTime() + duracion * 60000
        );
        if (comienzo < fin) {
          conf = true;
          if (fin - comienzo > conflicto) {
            conflicto = fin - comienzo;
          }
          conflicto = Math.max(fin - comienzo, conflicto);
        }
        if (newEvents[i] < oldEvents[j]) {
          i++;
        } else {
          j++;
        }
      }

      if (conf) {
        inicio = new Date(inicio.getTime() + conflicto);
      }
    } while (conf == true);

    return inicio;
  };

  let updateCalendar = () => {
    if (
      // solo si todos los campos tienen valores
      hfreqRef.current.value &&
      numRef.current.value &&
      minfreqRef.current.value &&
      horaRef.current.value &&
      inicioRef.current.value
    ) {
      if (selectedOption == "0") {
        // comparar para cada dispositivo
        let inicios = {};
        for (let i = 0; i < dispositivos.length; i++) {
          let inicio = checkCalendarEvents(
            new Date(inicioRef.current.value + " " + horaRef.current.value)
          );
          inicios[dispositivos[i]] = inicio;
        }
        const earliestDateTime = Object.entries(inicios).reduce(
          (a, [k, v]) => (v < a[1] ? [k, v] : a),
          [null, new Date()]
        );
        setSelectedOption(earliestDateTime[0]);
        createEvents(earliestDateTime[1]);
      } else {
        // calcular para el dispositivo seleccionado
        let inicio = checkEvents(
          new Date(inicioRef.current.value + " " + horaRef.current.value)
        );
        createEvents(inicio);
      }
    }
  };

  let eventsFromRrule = (array) => {
    let old = [];
    if (array == "capturas") {
      for (let i = 0; i < capturas.length; i++) {
        if ("rrule" in capturas[i]) {
          for (let j = 0; j < capturas[i].rrule.count; j++) {
            old.push(
              new Date(
                new Date(capturas[i].rrule.dtstart).getTime() +
                  j * capturas[i].rrule.interval * 60000
              )
            );
          }
        } else {
          old.push(capturas[i].start);
        }
      }
    } else {
      for (i = 0; i < events.length; i++) {
        old.push(events[i].start);
      }
    }
    return old;
  };

  let checkManualEvents = () => {
    let inicioManual = new Date(
      fechaManualRef.current.value + " " + horaManualRef.current.value
    );

    // por ahora duración = 30 min
    let duracion = 60;
    let conf = false;
    let conflicto = 0;

    let oldEvents = eventsFromRrule();

    do {
      conf = false;
      for (let j = 0; j < oldEvents.length; j++) {
        let comienzo = Math.max(inicioManual.getTime(), oldEvents[j].getTime());
        let fin = Math.min(
          inicioManual.getTime() + duracion * 60000,
          oldEvents[j].getTime() + duracion * 60000
        );
        if (comienzo < fin) {
          conf = true;
          conflicto = Math.max(fin - comienzo, conflicto);
        } else if (comienzo == fin) {
          conf = true;
          conflicto = duracion * 60000;
        }
      }

      if (conf) {
        inicioManual = new Date(inicioManual.getTime() + conflicto);
      }
    } while (conf == true);
    return inicioManual;
  };

  let addManualTime = () => {
    if (horaManualRef.current.value && fechaManualRef.current.value) {
      let inicio = checkManualEvents();
      setEvents([
        {
          title: "",
          start: inicio,
        },
        ...events,
      ]);
    }
  };

  let createCalendarEvent = (ini) => {
    const j = new Date(ini.getTime());
    let i = checkCalendarEvents(ini);
    if (i.getTime() == j.getTime()) {
      setEvents([
        ...events,
        {
          title: "",
          start: j,
          id: ids,
        },
      ]);
      setIds(ids + 1);
    }
  };

  let deleteCalendarEvent = (id) => {
    setEvents(events.filter((e) => e.id != id));
  };

  let dragCalendarEvent = (event) => {
    let temporalEvents = events.filter((e) => e.id != event.id);
    setEvents([
      ...temporalEvents,
      {
        title: "",
        start: event.start,
        id: event.id,
      },
    ]);
  };

  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="container-header">
          <span>Datos del Ensayo</span>
        </div>
        <div className="border-div"></div>
        <div className="container-content">
          <div className="input-div">
            <span>Nombre del ensayo </span>
            <input
              className="input-field"
              ref={nombreRef}
              placeholder=""
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          <div className="input-div">
            <span>Nombre del proyecto </span>
            <input
              className="input-field"
              placeholder=""
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          <div className="input-div">
            <span>Aplicación</span>
            <select name="select" className="input-field">
              <option disabled selected value>
                {" "}
              </option>
              <option value="lifespan">Lifespan</option>
              <option value="healthspan">Healthspan</option>
            </select>
          </div>
          <div className="input-div">
            <span>Dispositivo</span>
            <select
              name="select"
              className="input-field"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="0">Cualquiera</option>
              <option value="1">Dispositivo 1</option>
              <option value="2">Dispositivo 2</option>
              <option value="3">Dispositivo 3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Condiciones del Ensayo</span>
        </div>
        <div className="border-div"></div>
        <div className="container-content" style={{ minHeight: "30px" }}>
          {condiciones.map((condicion, index) => (
            <div key={condicion}>
              <div className="condicion-div">
                <div className="input-div">
                  <span>Nombre de la condición</span>
                  <input
                    className="input-field"
                    placeholder=""
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    className="button-eliminar-fila"
                    onClick={() => deleteCondicion(index)}
                  >
                    <img src={del} alt="" />
                  </button>
                </div>
                <div
                  className="input-div"
                  style={{ marginLeft: "40px", paddingTop: "1px" }}
                >
                  <span>Nº de placas</span>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    placeholder=""
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    style={{ width: "104px" }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="nueva-button" onClick={createCondicion}>
            +
          </button>
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Captura de Imagen</span>
        </div>
        <div className="border-div"></div>
        <div className="container-content">
          <div className="input-div">
            <span>Fecha de Inicio </span>
            <input
              className="input-field"
              ref={inicioRef}
              placeholder="Fecha de Inicio"
              type="date"
              onChange={(e) => setHoraInic(e.target.value)}
            />
          </div>
          <div className="input-div">
            <span>Hora de Inicio </span>
            <input
              className="input-field"
              type="time"
              ref={horaRef}
              onChange={(e) => setInitVisibility("visible")}
            />
          </div>
          <div className="input-div">
            <span>Nº de Capturas</span>
            <input
              className="input-field"
              placeholder=""
              type="number"
              min="1"
              ref={numRef}
              style={{ width: "138.4px" }}
            />
          </div>
          <div className="input-div">
            <span>Holgura Máxima</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue="0"
              ref={hholgRef}
              style={{ width: "42px" }}
            />
            <span id="h-span">h.</span>
            <input
              className="input-field"
              type="number"
              min="0"
              max="59"
              defaultValue="0"
              ref={minholgRef}
              style={{ left: "289px", width: "42px" }}
            />
            <span id="min-span">min.</span>
          </div>
          <div className="input-div">
            <span>Frecuencia entre Capturas</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue="1"
              ref={hfreqRef}
              style={{ width: "42px" }}
            />
            <span id="h-span">h.</span>
            <input
              className="input-field"
              type="number"
              min="0"
              max="59"
              defaultValue="0"
              ref={minfreqRef}
              style={{ left: "289px", width: "42px" }}
            />
            <span id="min-span">min.</span>
          </div>
        </div>
        <button
          className="nueva-button"
          onClick={updateCalendar}
          style={{ left: "10px", marginBottom: "3px" }}
        >
          <img src={calendar} alt="" style={{ filter: "invert(50%)" }} />
        </button>
      </div>

      <div className="container-div" style={{ minHeight: "100px" }}>
        <div className="container-header">
          <span>Calendario Propuesto</span>
        </div>

        <div className="border-div"></div>
        <div className="Calendar">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              rrulePlugin,
            ]}
            headerToolbar={{
              left: "title",
              center: "",
              right: "dayGridMonth,timeGridWeek,timeGridDay prev,next today",
            }}
            initialView="timeGridWeek"
            eventMinHeight="5"
            height="auto"
            // minHeight="1900px !important"
            editable={true}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={true}
            allDaySlot={false}
            firstDay={1}
            locale={esLocale}
            events={events.concat(capturas)}
            eventClick={(eventClickInfo) => {
              deleteCalendarEvent(eventClickInfo.event.id);
            }}
            dateClick={(dateClickInfo) => {
              if (dateClickInfo.date.getTime() >= new Date().getTime()) {
                createCalendarEvent(dateClickInfo.date);
              }
            }}
            eventDrop={(eventDropInfo) => {
              if (eventDropInfo.event.start.getTime() >= new Date().getTime()) {
                dragCalendarEvent(eventDropInfo.event);
              } else {
                let old = events.filter((e) => e.id == eventDropInfo.event.id);
                setEvents(events.filter((e) => e.id != eventDropInfo.event.id));
                setEvents([...events, ...old]);
              }
            }}
            eventOverlap={false}
            eventDurationEditable={false}
          />
        </div>
      </div>
      <div className="crear-div">
        <button className="crear-button" onClick={createEnsayo}>
          <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
        </button>
        <span className="hidden-span" id="crear-span">
          Crear Ensayo
        </span>
      </div>
    </div>
  );
};

export default NuevoEnsayo;
