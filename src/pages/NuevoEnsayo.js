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

const NuevoEnsayo = () => {
  // let { logoutCall } = useContext(AuthContext);
  let navigate = useNavigate();

  const nombreRef = useRef(null);
  const inicioRef = useRef(null);
  const horaRef = useRef(null);
  const numRef = useRef(null);
  const hfreqRef = useRef(null);
  const minfreqRef = useRef(null);

  let ensayos_tabla = [];
  let i = 0;
  let j = 0;
  let num_cond = 1;
  let events = [
    {
      title: "",
      rrule: {
        // freq: "minutely",
        // count: numRef.current.value,
        // interval: hfreqRef.current.value * 60 + minfreqRef.current.value,
        // dtstart: inicioRef + "T" + horaRef + ":00",
        freq: "minutely",
        count: 100,
        interval: 5 * 60 + 20,
        dtstart: "2023-02-02",
      },
    },
  ];

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

  useEffect(() => {
    if (inicioRef.current.value) {
      getEnsayos();
      sortTabla();
    }
  }, [horaInic, horaFin]);

  useEffect(() => {
    ensayos.map((arr) => {
      arr.horas.split(" ").forEach((h) => {
        ensayos_tabla.push({ hora: h, nombre: arr.nombre });
      });
    });
  }, [ensayos]);

  const swap = (start, end, l, arr) =>
    [].concat(
      arr.slice(0, start),
      arr.slice(end, end + 1),
      arr.slice(start + 1, end),
      arr.slice(start, start + 1),
      arr.slice(end + 1, l)
    );

  let getEnsayos = async () => {
    let response = await fetch("/ensayos");
    let data = await response.json();
    if (response.status === 200) {
      setEnsayos(data);
    } else if (response.statusText === "Unauthorized") {
      // logoutCall();
    }
  };

  let sortTabla = () => {
    if (!(ensayos_tabla.lenght === 0)) {
      for (i = 0; i < ensayos_tabla.length; i++) {
        for (j = 0; j < ensayos_tabla.length - 1; j++) {
          let h1 = ensayos_tabla[j].hora.split(":");
          let h2 = ensayos_tabla[j + 1].hora.split(":");
          if (
            Number(h1[0]) > Number(h2[0]) ||
            (Number(h1[0]) == Number(h2[0]) && Number(h1[1]) > Number(h2[1]))
          ) {
            ensayos_tabla = swap(j, j + 1, ensayos_tabla.lenght, ensayos_tabla);
          }
        }
      }
    }
  };

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

  let addHora = () => {
    let ok = true;
    for (i = 0; i < ensayos.length; i++) {
      if (ensayos[i].horas.includes(horaRef.current.value)) {
        ok = false;
      }
    }

    if (horas.includes(horaRef.current.value)) {
      ok = false;
    }

    if (ok === true) {
      setHoras([...horas, horaRef.current.value]);
      ensayos_tabla.push({
        hora: horaRef.current.value,
        nombre: "Nuevo Ensayo",
      });
      sortTabla();
    }
  };

  let deleteHora = (index) => {
    const h = [...horas];
    h.splice(index, 1);
    setHoras(h);
  };

  let freqUpdate = (value) => {
    setFreqVisibility("visible");
    if (value.slice(0, 1) == "0") {
      setFreqH(value.slice(1, 2));
    } else {
      setFreqH(value.slice(0, 2));
    }
    if (value.slice(3, 4) == "0") {
      setFreqM(value.slice(4, 5));
    } else {
      setFreqM(value.slice(3, 5));
    }
  };

  let createEvents = () => {
    console.log(
      hfreqRef.current.value,
      minfreqRef.current.value,
      horaRef.current.value,
      inicioRef.current.value
    );
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
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </div>

          <div className="input-div">
            <span>Nombre del proyecto </span>
            <input
              className="input-field"
              placeholder=""
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </div>

          <div className="input-div">
            <span>Aplicación</span>
            <select name="select" className="input-field">
              <option disabled selected value>
                {" "}
              </option>
              <option value="value1">Lifespan</option>
              <option value="value2">Healthspan</option>
            </select>
          </div>

          <div className="input-div">
            <span>Fecha de Inicio </span>
            <input
              className="input-field"
              ref={inicioRef}
              placeholder="Fecha de Inicio"
              type={"date"}
              // onChange={(e) => setHoraInic(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Condiciones del Ensayo</span>
        </div>
        <div className="border-div"></div>
        <div className="container-content" style={{ "min-height": "30px" }}>
          {condiciones.map((condicion, index) => (
            <div key={condicion}>
              <div className="condicion-div">
                <div className="input-div">
                  <span>Nombre de la condición</span>
                  <input
                    className="input-field"
                    placeholder=""
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
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
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
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
            <span>Hora de Inicio </span>
            <input
              className="input-field"
              type="time"
              ref={horaRef}
              onChange={(e) => setInitVisibility("visible")}
            />
            {/* <span id="init-span" style={{ visibility: initVisibility }}>
              Se comenzará a una hora tan cercana como sea posible sin causar
              solapamiento con otros ensayos
            </span> */}
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
          onClick={createEvents}
          style={{ left: "10px", marginBottom: "3px" }}
        >
          <img src={calendar} alt="" style={{ filter: "invert(50%)" }} />
        </button>
      </div>

      <div className="container-div" style={{ "min-height": "100px" }}>
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
            minHeight="1900px !important"
            editable={false}
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
      <div className="crear-div">
        <button className="crear-button" onClick={createEnsayo}>
          <img src={crear} alt="" />
        </button>
        <span className="hidden-span" id="crear-span">
          Crear Ensayo
        </span>
      </div>
    </div>
  );
};

export default NuevoEnsayo;
