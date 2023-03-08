import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./NuevoEnsayo.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import rrulePlugin from "@fullcalendar/rrule";

import jwt_decode from "jwt-decode";

import crear from "../icons/save_alt.svg";
import del from "../icons/clear.svg";
import calendar from "../icons/refresh.svg";

const NuevoEnsayo = () => {
  let { logoutCall } = useContext(AuthContext);
  let navigate = useNavigate();

  const nombreRef = useRef(null);
  const inicioRef = useRef(null);
  const horaRef = useRef(null);
  const numRef = useRef(null);
  const hfreqRef = useRef(null);
  const minfreqRef = useRef(null);
  const proyectoRef = useRef(null);
  const aplicacionRef = useRef(null);

  let ensayos_tabla = [];
  let i = 0;
  let j = 0;
  let num_cond = 1;
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

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

  const [condiciones, setCondiciones] = useState([]);

  const [ensayos, setEnsayos] = useState([]);

  const [horas, setHoras] = useState([]);

  const [events, setEvents] = useState([]);

  const [capturas, setCapturas] = useState([]);

  useEffect(() => {
    ensayos.map((arr) => {
      arr.horas.split(" ").forEach((h) => {
        ensayos_tabla.push({ hora: h, nombre: arr.nombre });
      });
    });
  }, [ensayos]);

  // let getEnsayos = async () => {
  //   let response = await fetch("/ensayos");
  //   let data = await response.json();
  //   if (response.status === 200) {
  //     setEnsayos(data);
  //   } else if (response.statusText === "Unauthorized") {
  //     // logoutCall();
  //   }
  // };

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
      const response = await fetch("/new/");
      const data = await response.json();
      setCapturas(formatData(data.capturas));
    }

    fetchData();
    // console.log(capturas);
  }, []);

  const swap = (start, end, l, arr) =>
    [].concat(
      arr.slice(0, start),
      arr.slice(end, end + 1),
      arr.slice(start + 1, end),
      arr.slice(start, start + 1),
      arr.slice(end + 1, l)
    );

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
    const condiciones = {
      A: [
        [1, "multipocillo"],
        [1, "50mm"],
      ],
      B: [
        [2, "50mm"],
        [2, "multipocillo"],
      ],
    };

    console.log("crear.......");
    console.log({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authTokens")}`,
      },
      body: JSON.stringify({
        nombreExperimento: nombreRef.current.value,
        fechaInicio: inicioRef.current.value + " " + horaRef.current.value,
        ventanaEntreCapturas:
          parseInt(hfreqRef.current.value) * 60 +
          parseInt(minfreqRef.current.value), //min
        numeroDeCapturas: numRef.current.value,
        aplicacion: aplicacionRef.current.value,
        nombreProyecto: proyectoRef.current.value,
        nCondiciones: 4, //cambiar!!
        Condiciones: condiciones,
      }),
    });

    fetch(`/new/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idUsuarios: user.user_id,
        nombreExperimento: nombreRef.current.value,
        fechaInicio: inicioRef.current.value + " " + horaRef.current.value,
        ventanaEntreCapturas:
          parseInt(hfreqRef.current.value) * 60 +
          parseInt(minfreqRef.current.value), //min
        numeroDeCapturas: numRef.current.value,
        aplicacion: aplicacionRef.current.value,
        nombreProyecto: proyectoRef.current.value,
        nCondiciones: 4, //cambiar!!
        Condiciones: condiciones,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
    // navigate("/");
  };

  let createCondicion = () => {
    setCondiciones([...condiciones, num_cond++]);
  };

  let deleteCondicion = (index) => {
    let condCopy = [...condiciones];
    condCopy.splice(index, 1);
    setCondiciones(condCopy);
  };

  let createEvents = () => {
    // comprobar != none para todos y después usar setEvents
    if (
      hfreqRef.current.value &&
      numRef.current.value &&
      minfreqRef.current.value &&
      horaRef.current.value &&
      inicioRef.current.value
    ) {
      setEvents([
        {
          title: "",
          rrule: {
            freq: "minutely",
            count: parseInt(numRef.current.value),
            interval:
              parseInt(hfreqRef.current.value) * 60 +
              parseInt(minfreqRef.current.value),
            dtstart:
              inicioRef.current.value + "T" + horaRef.current.value + ":00", //"2023-02-02T09:30:00+01:00",
          },
        },
        ...capturas,
      ]);
    }
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
              ref={proyectoRef}
              placeholder=""
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </div>

          <div className="input-div">
            <span>Aplicación</span>
            <select name="select" ref={aplicacionRef} className="input-field">
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
            <input className="input-field" type="time" ref={horaRef} />
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
            // minHeight="1900px !important"
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
