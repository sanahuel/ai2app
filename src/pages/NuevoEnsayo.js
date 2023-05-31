import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { IdleTimer } from "../components/idleTimer";
import "./NuevoEnsayo.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import rrulePlugin from "@fullcalendar/rrule";

import jwt_decode from "jwt-decode";
import add from "../icons/add.svg";
import pen from "../icons/pen.svg";
import crear from "../icons/save_alt.svg";
import del from "../icons/clear.svg";
import calendar from "../icons/refresh.svg";
import loading from "../icons/clock_loading.svg";

const NuevoEnsayo = ({ semaphore, updateSemaphore }) => {
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
  const holguraNegativaRef = useRef(null);
  const holguraPositivaRef = useRef(null);

  let dispositivos = ["1", "2", "3"];
  let num_cond = 1;
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const [condiciones, setCondiciones] = useState([]);

  const [events, setEvents] = useState([]);

  let [capturas, setCapturas] = useState([]);

  let [ids, setIds] = useState(0);

  let [selectedOption, setSelectedOption] = useState("0");

  let [databaseEvents, setDatabaseEvents] = useState([]);

  let [oldEvents, setOldEvents] = useState([]);

  //let [semaphore, setSemaphore] = useState(false);

  let [repeat, setRepeat] = useState(null);

  let changes = {};

  useEffect(() => {
    setDatabaseEvents({
      1: [
        [new Date(2023, 4, 17, 7, 0, 0), 15 * 60000, 15 * 60000],
        [new Date(2023, 4, 17, 8, 0, 0), 15 * 60000, 15 * 60000],
        [new Date(2023, 4, 17, 9, 0, 0), 15 * 60000, 15 * 60000],
        [new Date(2023, 4, 17, 10, 0, 0), 15 * 60000, 15 * 60000],
        [new Date(2023, 4, 17, 11, 0, 0), 15 * 60000, 15 * 60000],
      ],
      2: [
        [new Date(2023, 4, 17, 11, 5, 0), 15 * 60000, 15 * 60000],
        [new Date(2023, 4, 17, 12, 55, 0), 15 * 60000, 5 * 60000],
        [new Date(2023, 4, 18, 11, 5, 0), 15 * 60000, 15 * 60000],
        [new Date(2023, 4, 18, 12, 55, 0), 15 * 60000, 5 * 60000],
        [new Date(2023, 4, 19, 11, 5, 0), 5 * 60000, 5 * 60000],
        [new Date(2023, 4, 19, 12, 55, 0), 5 * 60000, 5 * 60000],
      ],
      3: [
        [new Date(2023, 4, 17, 10, 0, 0), 0 * 6000, 5 * 60000],
        [new Date(2023, 4, 17, 11, 0, 0), 0 * 6000, 5 * 60000],
      ],
    });
  }, []);

  useEffect(() => {
    let formatCapturas = (data) => {
      return data.map((captura) => {
        return {
          title: captura.nombreExperimento,
          start: captura.fechayHora,
          allDay: false,
          color: "#ddd",
        };
      });
    };
    let formatOldEvents = (data) => {
      return data.map((captura) => {
        return [
          captura.fechayHora,
          captura.holguraPositiva,
          captura.holguraNegativa,
        ];
      });
    };

    let checkResponse = (data) => {
      if (data.capturas != null) {
        updateSemaphore(true);
        console.log("semaforo ok...");
      }
      if (data.status == "repeat") {
        setRepeat(true);
      }
    };
    async function fetchData() {
      fetch("http://127.0.0.1:8000/new/")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          //updateNum(data.num);
          checkResponse(data);
          setCapturas(formatCapturas(data.capturas));
        });
      //.then((data) => setCapturas(formatCapturas(data.capturas)))
      //.then((data) => console.log(data));

      //setDatabaseEvents(formatOldEvents(data.capturas));    //////// ACTIVAR
    }

    fetchData();
  }, []);

  // Cada X segundos fetch esperando semáforo
  useEffect(() => {
    let intervalId;

    if (repeat) {
      // Start the interval when repeat is true
      intervalId = setInterval(() => {
        // Perform the fetch request here
        fetch("http://127.0.0.1:8000/new/")
          .then((response) => response.json())
          .then((data) => {
            // Process the fetched data
            if (data.capturas != null) {
              updateSemaphore(true);
              setRepeat(false);
            }
          })
          .catch((error) => {
            // Handle any errors
            console.error(error);
          });
      }, 1000 * 60 * 0.25);
    }

    return () => {
      // Clean up the interval when the component unmounts or repeat is set to false
      clearInterval(intervalId);
    };
  }, [repeat]);
  let createEnsayo = async () => {
    // AÑADIR IF PARA COMPROBAR DATOS EXISTENTES
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
    // console.log({
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Token ${localStorage.getItem("authTokens")}`,
    //   },
    //   body: JSON.stringify({
    //     nombreExperimento: nombreRef.current.value,
    //     fechaInicio: inicioRef.current.value + " " + horaRef.current.value,
    //     ventanaEntreCapturas:
    //       parseInt(hfreqRef.current.value) * 60 +
    //       parseInt(minfreqRef.current.value), //min
    //     numeroDeCapturas: numRef.current.value,
    //     aplicacion: aplicacionRef.current.value,
    //     nombreProyecto: proyectoRef.current.value,
    //     nCondiciones: 4, //cambiar!!
    //     Condiciones: condiciones,
    //   }),
    // });

    fetch(`http://127.0.0.1:8000/new/`, {
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
    // navigate("/");                                       volver a activar!!!
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

  let createNewEvents = (date) => {
    const datetimeArray = [];
    for (let i = 0; i < parseInt(numRef.current.value); i++) {
      datetimeArray.push([
        new Date(date.getTime()),
        holguraPositivaRef.current.value,
        holguraNegativaRef.current.value,
      ]);
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
    let oldEvents = databaseEvents[selectedOption];

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
      let newEvents = createNewEvents(inicio);
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

  // newCheckEvents -> calcula primer comienzo posible en el dispositivo ajustando holguras si es necesario y posible
  // +Info -> Calendario.md
  let newCheckEvents = (inicio, dispositivo) => {
    // oldEvents = [[fechayHora, holguraPositiva, holguraNegativa], [fechayHora, holguraPositiva, holguraNegativa], ...]

    let oldEvents = databaseEvents[dispositivo].map((event) => event.slice());
    let newEvents = createNewEvents(inicio);
    inicio = newEvents[0][0];

    // por ahora duración = 30 min    BBDD????
    let duracion = 60;
    let conf = false;
    let n = parseInt(numRef.current.value); //nuevos
    let m = oldEvents.length; //antiguos

    do {
      let i = 0;
      let j = 0;
      let c = 0;
      conf = false;
      let newEvents = createNewEvents(inicio);
      inicio = newEvents[0][0];
      let conflicto = 0;
      changes = {};

      //bucle
      while (i < n && j < m) {
        let next = false;
        let comienzo = Math.max(
          newEvents[i][0].getTime(),
          oldEvents[j][0].getTime()
        );
        let fin = Math.min(
          newEvents[i][0].getTime() + duracion * 60000,
          oldEvents[j][0].getTime() + duracion * 60000
        );

        if (comienzo < fin) {
          // si hay solape
          if (newEvents[i][0].getTime() >= oldEvents[j][0].getTime()) {
            ////////////////////////////////     1º antiguo ensayo
            if (
              fin - comienzo <=
              holguraPositivaRef.current.value * 60000 + oldEvents[j][2]
            ) {
              // se puede resolver ajustando holguras
              if (
                (fin - comienzo) / 2 < oldEvents[j][2] &&
                (fin - comienzo) / 2 < holguraPositivaRef.current.value * 60000
              ) {
                // se puede ajustar ambas por igual
                newEvents[i][0] = new Date(
                  newEvents[i][0].getTime() + (fin - comienzo) / 2
                );
                changes[j] = [
                  new Date(oldEvents[j][0].getTime() - (fin - comienzo) / 2),
                  oldEvents[j][1],
                  oldEvents[j][2] - (fin - comienzo) / 2,
                ];

                // comprobar que al mover no hay solape con otros ensayos antiguos
                let repeat = true;
                let k = j;
                let l = i;

                // comprobar nuevo con nuevo+1
                if (i < numRef.current.value - 1) {
                  do {
                    c =
                      newEvents[l][0].getTime() +
                      duracion * 60000 -
                      newEvents[l + 1][0].getTime();

                    if (c > 0) {
                      repeat = true;
                      if (c <= holguraPositivaRef.current.value * 60000) {
                        newEvents[l + 1][0] = new Date(
                          newEvents[l + 1][0].getTime() + c
                        );
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                        next = true;
                      }
                      l++;
                    } else {
                      repeat = false;
                    }
                  } while (repeat == true && l < numRef.current.value - 1);
                }

                // comprobar antiguo con antiguo-1
                repeat = true;
                if (oldEvents.length > 1 && j > 0) {
                  do {
                    // comprobar antiguo con antiguo-1
                    if (k in changes) {
                      c =
                        oldEvents[k - 1][0].getTime() +
                        duracion * 60000 -
                        changes[k][0].getTime();
                    } else {
                      c =
                        oldEvents[k - 1][0].getTime() +
                        duracion * 60000 -
                        new Date(
                          oldEvents[j][0].getTime() - (fin - comienzo) / 2
                        ).getTime(); //final del k-1 con comienzo del k al moverlo
                    }
                    if (c > 0) {
                      repeat = true;

                      if (c <= oldEvents[k - 1][2]) {
                        changes[k - 1] = [
                          new Date(oldEvents[k - 1][0].getTime() - c),
                          oldEvents[k - 1][1],
                          oldEvents[k - 1][2] - c,
                        ];
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                        next = true;
                      }
                      k--;
                    } else {
                      repeat = false;
                    }
                  } while (repeat == true && k > 0);
                }
              } else if (
                !((fin - comienzo) / 2 < oldEvents[j][2]) ||
                !(
                  (fin - comienzo) / 2 <
                  holguraPositivaRef.current.value * 60000
                ) ||
                next
              ) {
                conf = false;
                // no se ajustan por igual
                if (
                  (fin - comienzo) / 2 >=
                  holguraPositivaRef.current.value * 60000
                ) {
                  // se tiene que mover más la antigua
                  newEvents[i][0] = new Date(
                    newEvents[i][0].getTime() +
                      holguraPositivaRef.current.value * 60000
                  );
                  changes[j] = [
                    new Date(
                      oldEvents[j][0].getTime() -
                        (fin -
                          comienzo -
                          holguraPositivaRef.current.value * 60000)
                    ),
                    oldEvents[j][1],
                    oldEvents[j][2] -
                      (fin -
                        comienzo -
                        holguraPositivaRef.current.value * 60000),
                  ];

                  // comprobar que al mover no hay solape con otros ensayos antiguos
                  let repeat = true;
                  let k = j;
                  let l = i;

                  // comprobar nuevo con nuevo+1
                  if (i < numRef.current.value - 1) {
                    do {
                      c =
                        newEvents[l][0].getTime() +
                        duracion * 60000 -
                        newEvents[l + 1][0].getTime();

                      if (c > 0) {
                        repeat = true;
                        if (c <= holguraPositivaRef.current.value * 60000) {
                          newEvents[l + 1][0] = new Date(
                            newEvents[l + 1][0].getTime() + c
                          );
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                          next = true;
                        }
                        l++;
                      } else {
                        repeat = false;
                      }
                    } while (repeat == true && l < numRef.current.value - 1);
                  }

                  // comprobar antiguo con antiguo-1
                  repeat = true;
                  if (oldEvents.length > 1 && j > 0) {
                    do {
                      if (k in changes) {
                        c =
                          oldEvents[k - 1][0].getTime() +
                          duracion * 60000 -
                          changes[k][0].getTime();
                      } else {
                        c =
                          oldEvents[k - 1][0].getTime() +
                          duracion * 60000 -
                          new Date(
                            oldEvents[j][0].getTime() -
                              (fin -
                                comienzo -
                                holguraPositivaRef.current.value * 60000)
                          ).getTime(); //final del k-1 con comienzo del k al moverlo
                      }
                      if (c > 0) {
                        repeat = true;

                        if (c <= oldEvents[k - 1][2]) {
                          changes[k - 1] = [
                            new Date(oldEvents[k - 1][0].getTime() - c),
                            oldEvents[k - 1][1],
                            oldEvents[k - 1][2] - c,
                          ];
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                        k--;
                      } else {
                        repeat = false;
                      }
                    } while (repeat == true && k > 0);
                  }
                } else {
                  // se tiene que mover más la nueva

                  changes[j] = [
                    new Date(oldEvents[j][0].getTime() - oldEvents[j][2]),
                    oldEvents[j][1],
                    0,
                  ];
                  newEvents[i][0] = new Date(
                    newEvents[i][0].getTime() +
                      (fin - comienzo) -
                      oldEvents[j][2]
                  );

                  // comprobar que al mover no hay solape con otros ensayos antiguos
                  let repeat = true;
                  let k = j;
                  let l = i;

                  // comprobar nuevo con nuevo+1
                  if (i < numRef.current.value - 1) {
                    do {
                      c =
                        newEvents[l][0].getTime() +
                        duracion * 60000 -
                        newEvents[l + 1][0].getTime();

                      if (c > 0) {
                        repeat = true;
                        if (c <= holguraPositivaRef.current.value * 60000) {
                          newEvents[l + 1][0] = new Date(
                            newEvents[l + 1][0].getTime() + c
                          );
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                          next = true;
                        }
                        l++;
                      } else {
                        repeat = false;
                      }
                    } while (repeat == true && l < numRef.current.value - 1);
                  }

                  // comprobar antiguo con antiguo-1
                  repeat = true;
                  if (oldEvents.length > 1 && j > 0) {
                    do {
                      // comprobar antiguo con antiguo-1
                      if (k in changes) {
                        c =
                          oldEvents[k - 1][0].getTime() +
                          duracion * 60000 -
                          changes[k][0].getTime();
                      } else {
                        c =
                          oldEvents[k - 1][0].getTime() +
                          duracion * 60000 -
                          new Date(
                            oldEvents[j][0].getTime() - oldEvents[j][2]
                          ).getTime(); //final del k-1 con comienzo del k al moverlo
                      }
                      if (c > 0) {
                        repeat = true;

                        if (c <= oldEvents[k - 1][2]) {
                          changes[k - 1] = [
                            new Date(oldEvents[k - 1][0].getTime() - c),
                            oldEvents[k - 1][1],
                            oldEvents[k - 1][2] - c,
                          ];
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                        k--;
                      } else {
                        repeat = false;
                      }
                    } while (repeat == true && k > 0);
                  }
                }
              }
            } else {
              // no se puede resolver ajustando holguras
              conflicto = Math.max(fin - comienzo, conflicto);
              conf = true;
            }
          } else {
            ////////////////////////////////////////////////////     1° nuevo ensayo
            if (
              fin - comienzo <=
              holguraNegativaRef.current.value * 60000 + oldEvents[j][1]
            ) {
              // se puede resolver ajustando holguras
              if (
                (fin - comienzo) / 2 < oldEvents[j][1] &&
                (fin - comienzo) / 2 < holguraNegativaRef.current.value * 60000
              ) {
                // se puede ajustar ambas por igual

                newEvents[i][0] = new Date(
                  newEvents[i][0].getTime() - (fin - comienzo) / 2
                );
                changes[j] = [
                  new Date(oldEvents[j][0].getTime() + (fin - comienzo) / 2),
                  oldEvents[j][1] - (fin - comienzo) / 2,
                  oldEvents[j][2],
                ];

                // comprobar que al mover no hay solape con otros ensayos antiguos
                let repeat = true;
                let k = j;
                let l = i;

                // Hacia adelante
                if (l < numRef.current.value - 1) {
                  // 1º antiguo con nuevo+1
                  c =
                    changes[j][0].getTime() +
                    duracion * 60000 -
                    newEvents[l + 1][0].getTime();
                  if (c > 0) {
                    repeat = true;
                    if (c <= holguraPositivaRef.current.value * 60000) {
                      newEvents[l + 1][0] = new Date(
                        newEvents[l + 1][0].getTime() + c
                      );
                    } else {
                      repeat = false;
                      conf = true;
                      conflicto = Math.max(c, conflicto);
                      next = true;
                    }
                    l++;
                  } else {
                    repeat = false;
                  }
                  // 2º comprobar nuevo con nuevo+1
                  while (repeat == true && l < numRef.current.value - 1) {
                    c =
                      newEvents[l][0].getTime() +
                      duracion * 60000 -
                      newEvents[l + 1][0].getTime();

                    if (c > 0) {
                      repeat = true;
                      if (c <= holguraPositivaRef.current.value * 60000) {
                        newEvents[l + 1][0] = new Date(
                          newEvents[l + 1][0].getTime() + c
                        );
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                        next = true;
                      }
                      l++;
                    } else {
                      repeat = false;
                    }
                  }
                }
                if (k < oldEvents.length - 1) {
                  // Antiguo con antiguo+1
                  do {
                    c =
                      changes[k][0].getTime() +
                      duracion * 60000 -
                      oldEvents[k + 1][0].getTime();
                    if (c > 0) {
                      if (c <= oldEvents[k + 1][1]) {
                        changes[k + 1] = [
                          new Date(oldEvents[k + 1][0].getTime() + c),
                          oldEvents[k + 1][1] + c,
                          oldEvents[k + 1][2],
                        ];
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                        next = true;
                      }
                    } else {
                      repeat = false;
                    }
                    k++;
                  } while (repeat == true && k < oldEvents.length - 1);
                }

                repeat = true;
                l = i;
                k = j;
                // Hacia atrás
                if (k > 0) {
                  // 1º nueva con antiguo-1
                  c =
                    oldEvents[k - 1][0].getTime() +
                    duracion * 60000 -
                    newEvents[i][0].getTime();
                  if (c > 0) {
                    repeat = true;

                    if (c <= oldEvents[k - 1][2]) {
                      changes[k - 1] = [
                        new Date(oldEvents[k - 1][0].getTime() - c),
                        oldEvents[k - 1][1],
                        oldEvents[k - 1][2] - c,
                      ];
                    } else {
                      repeat = false;
                      conf = true;
                      conflicto = Math.max(c, conflicto);
                      next = true;
                    }
                    k--;
                  } else {
                    repeat = false;
                  }
                  // 2º comprobar antiguo con antiguo-1
                  while (repeat == true && k > 0) {
                    // comprobar antiguo con antiguo-1
                    if (k in changes) {
                      c =
                        oldEvents[k - 1][0].getTime() +
                        duracion * 60000 -
                        changes[k][0].getTime();
                    } else {
                      c =
                        oldEvents[k - 1][0].getTime() +
                        duracion * 60000 -
                        new Date(
                          oldEvents[j][0].getTime() - (fin - comienzo) / 2
                        ).getTime(); //final del k-1 con comienzo del k al moverlo
                    }
                    if (c > 0) {
                      repeat = true;

                      if (c <= oldEvents[k - 1][2]) {
                        changes[k - 1] = [
                          new Date(oldEvents[k - 1][0].getTime() - c),
                          oldEvents[k - 1][1],
                          oldEvents[k - 1][2] - c,
                        ];
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                        next = true;
                      }
                      k--;
                    } else {
                      repeat = false;
                    }
                  }
                }
                if (l > 0) {
                  // Nuevo con nuevo-1
                  do {
                    c =
                      newEvents[l - 1][0].getTime() +
                      duracion * 60000 -
                      newEvents[l][0].getTime();
                    if (c > 0) {
                      if (c <= newEvents[l - 1][2] * 60000) {
                        newEvents[l - 1][0] = new Date(
                          newEvents[l - 1][0].getTime() - c
                        );
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                        next = true;
                      }
                    } else {
                      repeat = false;
                    }
                    l--;
                  } while (repeat == true && l > 0);
                }
              } else if (
                !((fin - comienzo) / 2 < oldEvents[j][1]) ||
                !(
                  (fin - comienzo) / 2 <
                  holguraNegativaRef.current.value * 60000
                ) ||
                next
              ) {
                conf = false;
                if (
                  (fin - comienzo) / 2 >=
                  holguraNegativaRef.current.value * 60000
                ) {
                  // se tiene que mover más la antigua
                  newEvents[i][0] = new Date(
                    newEvents[i][0].getTime() -
                      holguraNegativaRef.current.value * 60000
                  );
                  changes[j] = [
                    new Date(
                      oldEvents[j][0].getTime() +
                        (fin -
                          comienzo -
                          holguraNegativaRef.current.value * 60000)
                    ),
                    oldEvents[j][1] -
                      (fin -
                        comienzo -
                        holguraNegativaRef.current.value * 60000),
                    oldEvents[j][2],
                  ];

                  // comprobar que al mover no hay solape con otros ensayos antiguos
                  let repeat = true;
                  let k = j;
                  let l = i;

                  // Hacia adelante
                  if (l < numRef.current.value - 1) {
                    // 1º antiguo con nuevo+1
                    c =
                      changes[j][0].getTime() +
                      duracion * 60000 -
                      newEvents[l + 1][0].getTime();
                    if (c > 0) {
                      repeat = true;
                      if (c <= holguraPositivaRef.current.value * 60000) {
                        newEvents[l + 1][0] = new Date(
                          newEvents[l + 1][0].getTime() + c
                        );
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                      }
                      l++;
                    } else {
                      repeat = false;
                    }
                    // 2º comprobar nuevo con nuevo+1
                    while (repeat == true && l < numRef.current.value - 1) {
                      c =
                        newEvents[l][0].getTime() +
                        duracion * 60000 -
                        newEvents[l + 1][0].getTime();

                      if (c > 0) {
                        repeat = true;
                        if (c <= holguraPositivaRef.current.value * 60000) {
                          newEvents[l + 1][0] = new Date(
                            newEvents[l + 1][0].getTime() + c
                          );
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                        l++;
                      } else {
                        repeat = false;
                      }
                    }
                  }
                  if (k < oldEvents.length - 1) {
                    // Antiguo con antiguo+1
                    do {
                      c =
                        changes[k][0].getTime() +
                        duracion * 60000 -
                        oldEvents[k + 1][0].getTime();
                      if (c > 0) {
                        if (c <= oldEvents[k + 1][1]) {
                          changes[k + 1] = [
                            new Date(oldEvents[k + 1][0].getTime() + c),
                            oldEvents[k + 1][1] + c,
                            oldEvents[k + 1][2],
                          ];
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                      } else {
                        repeat = false;
                      }
                      k++;
                    } while (repeat == true && k < oldEvents.length - 1);
                  }

                  repeat = true;
                  l = i;
                  k = j;
                  // Hacia atrás
                  if (k > 0) {
                    // 1º nueva con antiguo-1
                    c =
                      oldEvents[k - 1][0].getTime() +
                      duracion * 60000 -
                      newEvents[i][0].getTime();
                    if (c > 0) {
                      repeat = true;

                      if (c <= oldEvents[k - 1][2]) {
                        changes[k - 1] = [
                          new Date(oldEvents[k - 1][0].getTime() - c),
                          oldEvents[k - 1][1],
                          oldEvents[k - 1][2] - c,
                        ];
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                      }
                      k--;
                    } else {
                      repeat = false;
                    }
                    // 2º comprobar antiguo con antiguo-1
                    while (repeat == true && k > 0) {
                      // comprobar antiguo con antiguo-1
                      if (k in changes) {
                        c =
                          oldEvents[k - 1][0].getTime() +
                          duracion * 60000 -
                          changes[k][0].getTime();
                      } else {
                        c =
                          oldEvents[k - 1][0].getTime() +
                          duracion * 60000 -
                          new Date(
                            oldEvents[j][0].getTime() - (fin - comienzo) / 2
                          ).getTime(); //final del k-1 con comienzo del k al moverlo
                      }
                      if (c > 0) {
                        repeat = true;

                        if (c <= oldEvents[k - 1][2]) {
                          changes[k - 1] = [
                            new Date(oldEvents[k - 1][0].getTime() - c),
                            oldEvents[k - 1][1],
                            oldEvents[k - 1][2] - c,
                          ];
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                        k--;
                      } else {
                        repeat = false;
                      }
                    }
                  }
                  if (l > 0) {
                    // Nuevo con nuevo-1
                    do {
                      c =
                        newEvents[l - 1][0].getTime() +
                        duracion * 60000 -
                        newEvents[l][0].getTime();
                      if (c > 0) {
                        if (c <= newEvents[l - 1][2] * 60000) {
                          newEvents[l - 1][0] = new Date(
                            newEvents[l - 1][0].getTime() - c
                          );
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                      } else {
                        repeat = false;
                      }
                      l--;
                    } while (repeat == true && l > 0);
                  }
                } else {
                  // se tiene que mover más la nueva //////////////////////////////////////////////////////////////////////////////////////////////
                  changes[j] = [
                    new Date(oldEvents[j][0].getTime() + oldEvents[j][1]),
                    0,
                    oldEvents[j][2],
                  ];
                  newEvents[i][0] = new Date(
                    newEvents[i][0].getTime() -
                      (fin - comienzo - oldEvents[j][1])
                  );

                  // comprobar que al mover no hay solape con otros ensayos antiguos
                  let repeat = true;
                  let k = j;
                  let l = i;

                  // Hacia adelante
                  if (l < numRef.current.value - 1) {
                    // 1º antiguo con nuevo+1
                    c =
                      changes[j][0].getTime() +
                      duracion * 60000 -
                      newEvents[l + 1][0].getTime();
                    if (c > 0) {
                      repeat = true;
                      if (c <= holguraPositivaRef.current.value * 60000) {
                        newEvents[l + 1][0] = new Date(
                          newEvents[l + 1][0].getTime() + c
                        );
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                      }
                      l++;
                    } else {
                      repeat = false;
                    }
                    // 2º comprobar nuevo con nuevo+1
                    while (repeat == true && l < numRef.current.value - 1) {
                      c =
                        newEvents[l][0].getTime() +
                        duracion * 60000 -
                        newEvents[l + 1][0].getTime();

                      if (c > 0) {
                        repeat = true;
                        if (c <= holguraPositivaRef.current.value * 60000) {
                          newEvents[l + 1][0] = new Date(
                            newEvents[l + 1][0].getTime() + c
                          );
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                        l++;
                      } else {
                        repeat = false;
                      }
                    }
                  }
                  if (k < oldEvents.length - 1) {
                    // Antiguo con antiguo+1
                    do {
                      c =
                        changes[k][0].getTime() +
                        duracion * 60000 -
                        oldEvents[k + 1][0].getTime();
                      if (c > 0) {
                        if (c <= oldEvents[k + 1][1]) {
                          changes[k + 1] = [
                            new Date(oldEvents[k + 1][0].getTime() + c),
                            oldEvents[k + 1][1] + c,
                            oldEvents[k + 1][2],
                          ];
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                      } else {
                        repeat = false;
                      }
                      k++;
                    } while (repeat == true && k < oldEvents.length - 1);
                  }

                  repeat = true;
                  l = i;
                  k = j;
                  // Hacia atrás
                  if (k > 0) {
                    // 1º nueva con antiguo-1
                    c =
                      oldEvents[k - 1][0].getTime() +
                      duracion * 60000 -
                      newEvents[i][0].getTime();
                    if (c > 0) {
                      repeat = true;

                      if (c <= oldEvents[k - 1][2]) {
                        changes[k - 1] = [
                          new Date(oldEvents[k - 1][0].getTime() - c),
                          oldEvents[k - 1][1],
                          oldEvents[k - 1][2] - c,
                        ];
                      } else {
                        repeat = false;
                        conf = true;
                        conflicto = Math.max(c, conflicto);
                      }
                      k--;
                    } else {
                      repeat = false;
                    }
                    // 2º comprobar antiguo con antiguo-1
                    while (repeat == true && k > 0) {
                      // comprobar antiguo con antiguo-1
                      if (k in changes) {
                        c =
                          oldEvents[k - 1][0].getTime() +
                          duracion * 60000 -
                          changes[k][0].getTime();
                      } else {
                        c =
                          oldEvents[k - 1][0].getTime() +
                          duracion * 60000 -
                          new Date(
                            oldEvents[j][0].getTime() - (fin - comienzo) / 2
                          ).getTime(); //final del k-1 con comienzo del k al moverlo
                      }
                      if (c > 0) {
                        repeat = true;

                        if (c <= oldEvents[k - 1][2]) {
                          changes[k - 1] = [
                            new Date(oldEvents[k - 1][0].getTime() - c),
                            oldEvents[k - 1][1],
                            oldEvents[k - 1][2] - c,
                          ];
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                        k--;
                      } else {
                        repeat = false;
                      }
                    }
                  }
                  if (l > 0) {
                    // Nuevo con nuevo-1
                    do {
                      c =
                        newEvents[l - 1][0].getTime() +
                        duracion * 60000 -
                        newEvents[l][0].getTime();
                      if (c > 0) {
                        if (c <= newEvents[l - 1][2] * 60000) {
                          newEvents[l - 1][0] = new Date(
                            newEvents[l - 1][0].getTime() - c
                          );
                        } else {
                          repeat = false;
                          conf = true;
                          conflicto = Math.max(c, conflicto);
                        }
                      } else {
                        repeat = false;
                      }
                      l--;
                    } while (repeat == true && l > 0);
                  }
                }
              }
            } else {
              // no se puede resolver ajustando holguras
              conflicto = Math.max(fin - comienzo, conflicto);
              conf = true;
            }
          }
        }
        // avance
        if (newEvents[i][0].getTime() < oldEvents[j][0].getTime()) {
          i++;
        } else {
          j++;
        }
      }

      if (conf) {
        inicio = new Date(inicio.getTime() + conflicto);
      } else {
        return inicio, newEvents;
      }
    } while (conf == true);

    //newEvents = createNewEvents(inicio);
    return inicio, newEvents;
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
        let events_disp = {};
        let changes_disp = {};
        for (let disp = 1; disp <= dispositivos.length; disp++) {
          let inicio,
            newEvents = newCheckEvents(
              new Date(inicioRef.current.value + " " + horaRef.current.value),
              disp
            );
          inicios[disp] = newEvents[0][0];
          events_disp[disp] = newEvents;
          changes_disp[disp] = changes;
        }
        const earliestDateTime = Object.entries(inicios).reduce(
          (a, [k, v]) => (v < a[1] ? [k, v] : a),
          [null, new Date()]
        );
        setSelectedOption(earliestDateTime[0]);

        let temp_ids = ids;
        const formatedEvents = events_disp[earliestDateTime[0]].map(
          (subarray) => {
            temp_ids++;
            return {
              title: "",
              start: subarray[0].toISOString(),
              id: temp_ids,
            };
          }
        );
        temp_ids++;
        setIds(temp_ids);
        setEvents(formatedEvents);

        const formatedData = databaseEvents[earliestDateTime[0]].map(
          (subarray) => {
            return {
              title: "",
              start: subarray[0].toISOString(),
              color: "#ddd",
              editable: false,
            };
          }
        );
        for (
          let key = 0;
          key < Object.keys(changes_disp[earliestDateTime[0]]).length;
          key++
        ) {
          formatedData[Object.keys(changes_disp[earliestDateTime[0]])[key]] = {
            title: "",
            start:
              changes_disp[earliestDateTime[0]][
                Object.keys(changes_disp[earliestDateTime[0]])[key]
              ][0].toISOString(),
            color: "#ddd",
            editable: false,
          };
        }
        setCapturas(formatedData);
      } else {
        // calcular para el dispositivo seleccionado
        let inicio,
          newEvents = newCheckEvents(
            new Date(inicioRef.current.value + " " + horaRef.current.value),
            selectedOption
          );

        let temp_ids = ids;
        const formatedEvents = newEvents.map((subarray) => {
          temp_ids++;
          return {
            title: "",
            start: subarray[0].toISOString(),
            id: temp_ids,
          };
        });
        temp_ids++;
        setIds(temp_ids);
        setEvents(formatedEvents);
        if (Object.keys(changes).length > 0) {
          console.log("changes", changes);
        }

        const formatedData = databaseEvents[selectedOption].map((subarray) => {
          return {
            title: "",
            start: subarray[0].toISOString(),
            color: "#ddd",
            editable: false,
          };
        });
        for (let key = 0; key < Object.keys(changes).length; key++) {
          formatedData[Object.keys(changes)[key]] = {
            title: "",
            start: changes[Object.keys(changes)[key]][0].toISOString(),
            color: "#ddd",
            editable: false,
          };
        }
        setCapturas(formatedData);
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
      for (let i = 0; i < events.length; i++) {
        old.push(events[i].start);
      }
    }
    return old;
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
      {semaphore && <IdleTimer semaphore={semaphore} />}
      {semaphore && (
        <>
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
                  ref={proyectoRef}
                  placeholder=""
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              <div className="input-div">
                <span>Aplicación</span>
                <select
                  name="select"
                  ref={aplicacionRef}
                  className="input-field"
                  defaultValue="DEFAULT"
                >
                  <option value="DEFAULT" disabled>
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
            <div className="container-content">
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
                />
              </div>
              <div className="input-div">
                <span>Hora de Inicio </span>
                <input className="input-field" type="time" ref={horaRef} />
              </div>
              <div className="input-div">
                <span>Holgura</span>
                <span
                  style={{
                    width: "13px",
                    position: "relative",
                    left: "-13px",
                    color: "#555",
                  }}
                >
                  -
                </span>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  max="59"
                  defaultValue="0"
                  ref={holguraNegativaRef}
                  style={{ position: "relative", left: "-13px", width: "42px" }}
                />
                <span
                  id="min-span"
                  style={{
                    position: "relative",
                    left: "-5px",
                    width: "2px",
                  }}
                >
                  min.
                </span>
                <span
                  style={{
                    width: "63px",
                    paddingLeft: "34px",
                    color: "#555",
                  }}
                >
                  +
                </span>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  max="59"
                  defaultValue="0"
                  ref={holguraPositivaRef}
                  style={{ position: "relative", left: "-13px", width: "42px" }}
                />
                <span
                  id="min-span"
                  style={{ position: "relative", left: "-5px" }}
                >
                  min.
                </span>
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
                  right:
                    "dayGridMonth,timeGridWeek,timeGridDay prev,next today",
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
                //events={capturas}
                eventClick={(eventClickInfo) => {
                  deleteCalendarEvent(eventClickInfo.event.id);
                }}
                dateClick={(dateClickInfo) => {
                  if (dateClickInfo.date.getTime() >= new Date().getTime()) {
                    createCalendarEvent(dateClickInfo.date);
                  }
                }}
                eventDrop={(eventDropInfo) => {
                  if (
                    eventDropInfo.event.start.getTime() >= new Date().getTime()
                  ) {
                    dragCalendarEvent(eventDropInfo.event);
                  } else {
                    let old = events.filter(
                      (e) => e.id == eventDropInfo.event.id
                    );
                    setEvents(
                      events.filter((e) => e.id != eventDropInfo.event.id)
                    );
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
              <img
                src={add}
                alt=""
                style={{ position: "relative", top: "1px" }}
              />
            </button>
            <span className="hidden-span" id="crear-span">
              Crear Ensayo
            </span>
          </div>
        </>
      )}
      {!semaphore && (
        <div className="loading-div">
          <img src={loading} alt="" className="loading-img" />
          <br />
          <span style={{ fontWeight: "bold", color: "#444" }}>
            Otro usuario está programando un ensayo
          </span>
        </div>
      )}
    </div>
  );
};

export default NuevoEnsayo;
