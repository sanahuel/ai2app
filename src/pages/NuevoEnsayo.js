import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { IdleTimer } from "../components/idleTimer";
import "./NuevoEnsayo.css";
import IpContext from "../context/IpContext";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import rrulePlugin from "@fullcalendar/rrule";

import { BlockPicker } from "react-color";

import jwt_decode from "jwt-decode";
import add from "../icons/add.svg";
import del from "../icons/clear.svg";
import calendar from "../icons/refresh.svg";
import loading from "../icons/clock_loading.svg";
import expand from "../icons/expand.svg";

const NuevoEnsayo = ({ semaphore, updateSemaphore }) => {
  let { authTokens } = useContext(AuthContext);
  let navigate = useNavigate();

  const ipData = useContext(IpContext);

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
  const freqCapturaRef = useRef(null);
  const imgsPorCapturaRef = useRef(null);
  const tipoImgRef = useRef(null);
  const resHeightRef = useRef(null);
  const resWidthRef = useRef(null);
  const placasPorCondicionRef = useRef(null);
  const gusanosPorCondicionRef = useRef(null);

  let dispositivos = ["1", "2", "3"]; // borrar...

  const [fetchedData, setFetchedData] = useState({});
  const [capturas, setCapturas] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [configCondicion, setConfigCondicion] = useState({value: "DEFAULT"});
  const [events, setEvents] = useState([]);
  let [ids, setIds] = useState(0);
  let [selectedOption, setSelectedOption] = useState(ipData[0].nDisp);
  let [rawEvents, setRawEvents] = useState([]);
  let [repeat, setRepeat] = useState(null);
  let [expandDiv, setExpandDiv] = useState("none");
  let [selectedColor, setSelectedColor] = useState("#69b1fa");
  let [colorPicker, setColorPicker] = useState("none");
  const [configEnsayo, setConfigEnsayo] = useState([]);
  const [configCondiciones, setConfigCondiciones] = useState([]);
  const [changesBBDD, setChangesBBDD] = useState({});
  const [isLoading, setIsLoading] = useState(false)

  let changes = {};

  // Color picker
  let colorRef = useRef();

  useEffect(() => {
    async function fetchConfig() {
      fetch(`http://${window.location.hostname}:8000/config/planif`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setConfigEnsayo(data["planificador"]);
        });
    }

    async function fetchCondiciones() {
      fetch(`http://${window.location.hostname}:8000/config/placas`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setConfigCondiciones(data["placas"]);
        });
    }

    fetchConfig();
    fetchCondiciones();
  }, []);

  useEffect(() => {
    let handler = (e) => {
      if (!colorRef.current.contains(e.target)) {
        setColorPicker("none");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

      let formatCapturas = (data) => {
      return data.map((captura) => {
        return {
          title: captura[1],
          start: captura[0],
          allDay: false,
          color: "#ddd",
          editable: false,
          id: captura[2]
        };
      });
    };

  useEffect(() => {
    let checkResponse = (data) => {
      if (data.capturas != null) {
        updateSemaphore(true);
      }
      if (data.status === "repeat") {
        setRepeat(true);
      }
    };
    async function fetchData(ipData) {
      fetch(`http://${ipData.IP}:8000/new/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          checkResponse(data);
          const copy = fetchedData;
          copy[ipData.nDisp] = data;
          console.log('COPY', copy)
          setFetchedData(copy);

          const captCopy = capturas;
          captCopy[ipData.nDisp] = formatCapturas(data.capturas);
          console.log('CAPTCOPY', captCopy)
          setCapturas(captCopy[ipData.nDisp]);
        });
    }

    for (let i = 0; i < ipData.length; i++) {
      fetchData(ipData[i]);
    }
  }, []);

  // Cada X segundos fetch esperando semáforo
  useEffect(() => {
    let intervalId;
    if (repeat) {
      // Start the interval when repeat is true
      intervalId = setInterval(() => {
        // Perform the fetch request here
        fetch(`http://${window.location.hostname}:8000/new/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        })
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

  // Format Dates
  function formatDateWithTimezone(date) {
    const timezoneOffsetMinutes = date.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffsetMinutes / 60));
    const timezoneOffsetSign = timezoneOffsetMinutes < 0 ? '+' : '-';
  
    const pad = (number) => (number < 10 ? '0' : '') + number;
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  
    return `${formattedDate}`;
  }

  let orderPallets = (espacioNecesario) => {
    let order = [];
    let count = 0;

    const almacenes = Object.values(fetchedData[selectedOption].almacenes);

    for (let i = 0; i < almacenes.length; i++) {
      const almacen = almacenes[i];
      const almacenIndex = i + 1;

      for (let j = 0; j < almacen.length; j++) {
        let espacio = almacen[j];
        if (espacio === 0) {
          let pallete = (j % 9) + 1;
          let cassette = Math.ceil((j + 1) / 9);
          order.push(`A${almacenIndex}-C${cassette}-P${pallete}`);
          count++;
          if (count >= Math.ceil(espacioNecesario)) {
            break;
          }
        }
      }

      if (count >= Math.ceil(espacioNecesario)) {
        break;
      }
    }

    return order;
  };

  // ESCRIBIR BBDD
  let createEnsayo = () => {
    if (
      nombreRef.current.value !== "" &&
      // inicioRef.current.value !== "" &&
      numRef.current.value !== "" &&
      hfreqRef.current.value !== "" &&
      minfreqRef.current.value !== "" &&
      imgsPorCapturaRef.current.value !== "" &&
      freqCapturaRef.current.value !== "" &&
      resHeightRef.current.value !== "" &&
      resWidthRef.current.value !== ""
    ) {
      if (Object.keys(events).length > 0) {
        let espacioLibre = 0;
        Object.values(fetchedData[selectedOption].almacenes).forEach(
          (almacen) => {
            almacen.forEach((espacio) => {
              if (espacio === 0) {
                espacioLibre++;
              }
            });
          }
        );


        let espacioNecesario = Array(
          condiciones.length / Object.keys(configCondicion.condiciones).length
        ).fill(0);

        // N CONDICIONES
        let nCondiciones = 0;
        condiciones.forEach((cond) => {
          if (cond.name !== "") {
            nCondiciones++;
          }
        });

        // ESPACIO
        condiciones.forEach((cond, index) => {
          if (cond.name !== "") {
            const espacio =
              placasPorCondicionRef.current.value /
              Object.values(configCondicion.condiciones)[
                index -
                  Object.keys(configCondicion.condiciones).length *
                    Math.trunc(
                      index / Object.keys(configCondicion.condiciones).length
                    )
              ].length;
            if (
              espacio >
              espacioNecesario[
                Math.trunc(
                  index / Object.keys(configCondicion.condiciones).length
                )
              ]
            ) {
              espacioNecesario[
                Math.trunc(
                  index / Object.keys(configCondicion.condiciones).length
                )
              ] = Math.ceil(espacio);
            }
          }
        });


        const espacioNecesarioValue = espacioNecesario.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        
        if (espacioLibre >= espacioNecesarioValue) {
          // PALLETS
          let pallets = orderPallets(espacioNecesarioValue);
          //PLACAS
          let placas = {};
          for (let i = 0; i < condiciones.length; i++) {
            let placasCond = [];
            if (condiciones[i].name !== "") {
              for (let j = 0; j < placasPorCondicionRef.current.value; j++) {
                let p = Math.trunc(
                  j /
                    Object.values(configCondicion.condiciones)[
                      i -
                        Object.keys(configCondicion.condiciones).length *
                          Math.trunc(
                            i / Object.keys(configCondicion.condiciones).length
                          )
                    ].length
                );
                let element =
                  j %
                  Object.values(configCondicion.condiciones)[
                    i -
                      Object.keys(configCondicion.condiciones).length *
                        Math.trunc(
                          i / Object.keys(configCondicion.condiciones).length
                        )
                  ].length;
                placasCond.push({
                  pallet: p + Math.trunc(i/Object.keys(configCondicion.condiciones).length)*Math.trunc(espacioNecesarioValue*(Object.keys(configCondicion.condiciones).length/condiciones.length)),
                  posicion: Object.values(configCondicion.condiciones)[
                    i -
                      Object.keys(configCondicion.condiciones).length *
                        Math.trunc(
                          i / Object.keys(configCondicion.condiciones).length
                        )
                  ][element],
                });
              }
              placas = { ...placas, [condiciones[i].name]: placasCond };
            }
          }

          // TAREAS
          const fetchEvents = [];
          rawEvents.forEach((event) => {
            fetchEvents.push({
              event: formatDateWithTimezone(event[0]),
              holguraPositiva: event[1] * 60000,
              holguraNegativa: event[2] * 60000,
            });
          });
          const earliestDate = fetchEvents.reduce(
            (earliest, current) => (current.event < earliest.event ? current : earliest),
            fetchEvents[0]
          );
          


          // FETCH
          const disp = ipData.find((obj) => obj.nDisp === selectedOption);
          const decodedToken = jwt_decode(authTokens.access);
          setIsLoading(true)

          fetch(`http://${disp.IP}:8000/new/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              datos: {
                nombreExperimento: nombreRef.current.value,
                nombreProyecto: proyectoRef.current.value,
                aplicacion: aplicacionRef.current.value,
                color: selectedColor,
                userId: decodedToken.user_id,
                gusanosPorCondicion: gusanosPorCondicionRef.current.value,
              },
              condiciones: {
                nCondiciones: nCondiciones,
                condiciones: condiciones,
                placas: placas,
                tipoPlaca: `${configCondicion.filas}x${configCondicion.columnas}`,
              },
              captura: {
                fechaInicio: earliestDate.event,
                ventanaEntreCapturas:
                  parseInt(hfreqRef.current.value) * 60 +
                  parseInt(minfreqRef.current.value),
                numeroDeCapturas: numRef.current.value,
                pallets: pallets,
                placasPorCondicion: placasPorCondicionRef.current.value,
                tareas: fetchEvents,
              },
              parametros: {
                tipoImg: tipoImgRef.current.value,
                resolucion:
                  resWidthRef.current.value + "x" + resHeightRef.current.value,
                frecuencia: freqCapturaRef.current.value,
                nImgs: imgsPorCapturaRef.current.value,
              },
              changes: changesBBDD,
            }),
          })
            .then((response) => {
              response.json();
            })
            .then((data) => {
              navigate("/");
            })
            .catch((error) => {
              setIsLoading(false)
              alert("Error: " + error.message);
            });
        } else {
          alert("No hay espacio suficiente en el dispositivo");
        }
      } else {
        alert("Debe haber capturas programadas");
      }
    } else {
      alert("Todos los campos deben estar completos");
    }
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
    let capturasEvents = capturas.map((captura) => {
      return [new Date(captura.start), 5, 5];
    });
    let calendarEvents = [];
    Object.values(events).forEach((event) => {
      calendarEvents.push([new Date(event.start), 5, 5]);
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

  // newCheckEvents -> calcula primer comienzo posible en el dispositivo ajustando holguras si es necesario y posible
  // +Info -> Calendario.md
  let newCheckEvents = (inicio, dispositivo) => {
    // oldEvents = [[fechayHora, holguraPositiva, holguraNegativa, idTareas], [fechayHora, holguraPositiva, holguraNegativa, idTareas], ...]
    console.log('. . .', dispositivo)
    console.log('QQQQ', fetchedData[dispositivo])

    let oldEvents = fetchedData[dispositivo].capturas.map((captura) => {
      return [new Date(captura[0]), captura[3], captura[4], captura[2]];
    });

    // let oldEvents = databaseEvents[dispositivo].map((event) => event.slice());
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
                  oldEvents[j][3]
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
                  } while (repeat === true && l < numRef.current.value - 1);
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
                          oldEvents[k - 1][3]
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
                  } while (repeat === true && k > 0);
                }
              } else if (
                !((fin - comienzo) / 2 < oldEvents[j][2]) ||
                !(
                  (fin - comienzo) / 2 <
                  holguraPositivaRef.current.value * 60000
                ) ||
                next
              ) {
                // conf = false;
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
                    oldEvents[j][3]
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
                    } while (repeat === true && l < numRef.current.value - 1);
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
                            oldEvents[k - 1][3]
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
                    } while (repeat === true && k > 0);
                  }
                } else {
                  // se tiene que mover más la nueva
                  changes[j] = [
                    new Date(oldEvents[j][0].getTime() - oldEvents[j][2]),
                    oldEvents[j][1],
                    0,
                    oldEvents[j][3]
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
                    } while (repeat === true && l < numRef.current.value - 1);
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
                            oldEvents[k - 1][3]
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
                    } while (repeat === true && k > 0);
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
                  oldEvents[j][3]
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
                  while (repeat === true && l < numRef.current.value - 1) {
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
                          oldEvents[k + 1][3]
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
                  } while (repeat === true && k < oldEvents.length - 1);
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
                        oldEvents[k - 1][3]
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
                  while (repeat === true && k > 0) {
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
                          oldEvents[k - 1][3]
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
                  } while (repeat === true && l > 0);
                }
              } else if (
                !((fin - comienzo) / 2 < oldEvents[j][1]) ||
                !(
                  (fin - comienzo) / 2 <
                  holguraNegativaRef.current.value * 60000
                ) ||
                next
              ) {
                // no se pueden ajustar por igual
                // conf = false;
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
                    oldEvents[j][3]
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
                    while (repeat === true && l < numRef.current.value - 1) {
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
                            oldEvents[k + 1][3]
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
                    } while (repeat === true && k < oldEvents.length - 1);
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
                          oldEvents[k - 1][3]
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
                    while (repeat === true && k > 0) {
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
                            oldEvents[k - 1][3]
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
                    } while (repeat === true && l > 0);
                  }
                } else {
                  // se tiene que mover más la nueva //////////////////////////////////////////////////////////////////////////////////////////////
                  changes[j] = [
                    new Date(oldEvents[j][0].getTime() + oldEvents[j][1]),
                    0,
                    oldEvents[j][2],
                    oldEvents[j][3]
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
                    while (repeat === true && l < numRef.current.value - 1) {
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
                            oldEvents[k + 1][3]
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
                    } while (repeat === true && k < oldEvents.length - 1);
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
                          oldEvents[k - 1][3]
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
                    while (repeat === true && k > 0) {
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
                            oldEvents[k - 1][3]
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
                    } while (repeat === true && l > 0);
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
        return inicio, newEvents; // sin este return falla.....
      }
    } while (conf === true);

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
      //reset capturas por si se han desplazado y se quiere volver a planificar
      console.log('FETCHEDDATA', fetchedData[1].capturas)
      let captCopy = []
      for (let i = 0; i < ipData.length; i++) {
        captCopy.push(formatCapturas(fetchedData[i + 1].capturas));
      }
      console.log('CAPTCOPY', captCopy)
      setCapturas(...captCopy);
      setChangesBBDD({})
  
      if (selectedOption === "0") {
        // comparar para cada dispositivo
        let inicios = {};
        let events_disp = {};
        let changes_disp = {};
        for (let disp = 1; disp <= dispositivos.length; disp++) { // está mal por usar dispositivos, hay que cambiarlo a ipData...
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
        setRawEvents(events_disp[earliestDateTime[0]]);
        setChangesBBDD(changes_disp[earliestDateTime[0]]);

        let formatedData = [];
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
            color: selectedColor,
          };
        });
        temp_ids++;
        setIds(temp_ids);
        setEvents(formatedEvents);
        setRawEvents(newEvents);
        // Changes
        console.log('CHANGES', changes)
        const formatedChanges = Object.keys(changes).map((key) => {
          return [
            key,
            formatDateWithTimezone(changes[key][0]),
            changes[key][1],
            changes[key][2],
            changes[key][3]
          ];
        });
        console.log('FORMATED', formatedChanges)
        setChangesBBDD(formatedChanges);

        // update calendar capturas
        //let copyCapt = capturas
        Object.keys(changes).map((key) => {
          console.log('-- ', captCopy[0][key])
          captCopy[0][key].start = changes[key][0]
        })
        console.log('COPY 2', captCopy)
        setCapturas(captCopy[0])

      }
    }
  };

  // FullCalendar

  let createCalendarEvent = (ini) => {
    const j = new Date(ini.getTime());
    let i = checkCalendarEvents(ini);
    if (i.getTime() === j.getTime()) {
      setEvents([
        ...events,
        {
          title: "",
          start: j,
          id: ids,
          color: selectedColor,
        },
      ]);
      setIds(ids + 1);
      setRawEvents([
        ...rawEvents,
        [
          i,
          holguraPositivaRef.current.value,
          holguraNegativaRef.current.value
        ]
      ])
    }
  };

  let deleteCalendarEvent = (event) => {
    setEvents(events.filter((e) => e.id != event.id));
    setRawEvents(rawEvents.filter((e) => e[0].toISOString() != event.start.toISOString()))
  };

  let dragCalendarEvent = (event) => {
    // events contiene los datos que se ven en el calendario
    // rawEvents contiene los datos (tiene las holguras de cada tarea) que se utilizan para escribir en la BBDD
    let temporalEvents = events.filter((e) => e.id != event.event.id);
    setEvents([
      ...temporalEvents,
      {
        title: "",
        start: event.event.start.toISOString(),
        id: parseInt(event.event.id),
        color: selectedColor,
      },
    ]);

    let temporalRawEvents = rawEvents.filter((e) => e[0].toISOString() != event.oldEvent.start.toISOString());
    let oldRawEvent = rawEvents.filter((e) => e[0].toISOString() === event.oldEvent.start.toISOString());
    setRawEvents([
      ...temporalRawEvents,
      [
        event.event.start,
        oldRawEvent[0][1],
        oldRawEvent[0][2],
      ],
    ]);

  };

  let changeExpand = () => {
    if (expandDiv === "none") {
      setExpandDiv("block");
    } else {
      setExpandDiv("none");
    }
  };

  let changeConfigEnsayo = (config) => {
    aplicacionRef.current.value = JSON.parse(config).aplicacion;
    setSelectedColor(JSON.parse(config).color);
    holguraPositivaRef.current.value = JSON.parse(config).holguraPositiva;
    holguraNegativaRef.current.value = JSON.parse(config).holguraNegativa;
    numRef.current.value = JSON.parse(config).capturasTotales;
    hfreqRef.current.value = JSON.parse(config).hFreq;
    minfreqRef.current.value = JSON.parse(config).minFreq;
    tipoImgRef.current.value = JSON.parse(config).tipoImg;
    freqCapturaRef.current.value = JSON.parse(config).freqCaptura;
    imgsPorCapturaRef.current.value = JSON.parse(config).imgsPorCaptura;
    resHeightRef.current.value = JSON.parse(config).resHeight;
    resWidthRef.current.value = JSON.parse(config).resWidth;
    setConfigCondicion(JSON.parse(config).configCondicion);
    placasPorCondicionRef.current.value = JSON.parse(config).placasPorCond;
    setCondiciones(JSON.parse(config).condiciones);
    gusanosPorCondicionRef.current.value = JSON.parse(config).gusanosPorCond
  };

  let changeConfigCondicion = (config) => {
    setConfigCondicion(JSON.parse(config));
    const numCond = JSON.parse(config).numCondiciones;
    const newCondiciones = [];
    for (let i = 0; i < numCond; i++) {
      newCondiciones.push({
        name: "",
      });
    }
    setCondiciones(newCondiciones);
  };

  let createCondicion = () => {
    const addedCond = [];
    for (let i = 0; i < configCondicion.numCondiciones; i++) {
      addedCond.push({
        name: "",
      });
    }
    setCondiciones([...condiciones, ...addedCond]);
  };

  let changeNombreCondicion = (e, index) => {
    const copy = [...condiciones];
    copy[index].name = e;
    setCondiciones(copy);
  };

  let deleteCondicion = (index) => {
    const copy = [...condiciones];
    copy.splice(index, configCondicion.numCondiciones);
    setCondiciones(copy);
  };

  return (
    <div className="nuevo-ensayo">
      {/* TIMER INACTIVIDAD */}
      {semaphore && <IdleTimer semaphore={semaphore} />}

      {/* SI ESTÁ DENTRO */}
      {semaphore===true && (
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
                <span>Configuración</span>
                <select
                  name="select"
                  className="input-field"
                  defaultValue="DEFAULT"
                  style={{ width: "115px" }}
                  onChange={(e) => changeConfigEnsayo(e.target.value)}
                >
                  <option value="DEFAULT" disabled>
                    {" "}
                  </option>
                  {configEnsayo.map((config) => (
                    <option value={JSON.stringify(config)}>
                      {config.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-div">
                <span>Dispositivo</span>
                <select
                  name="select"
                  className="input-field"
                  value={selectedOption}
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                  }}
                  style={{ width: "115px" }}
                >
                  {ipData.length > 1 && <option value="0">Cualquiera</option>}
                  {ipData.map((ip) => (
                    <option value={ip.ip} key={ip.ip}>
                      Dispositivo {ip.nDisp}
                    </option>
                  ))}
                </select>
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
                <span>Color</span>
                <span
                  className="color-span"
                  style={{
                    backgroundColor: selectedColor,
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    marginLeft: "2px",
                  }}
                  onClick={() => setColorPicker("inline")}
                />
              </div>
              <div
                style={{
                  display: colorPicker,
                  position: "absolute",
                  zIndex: 9999,
                  left: "143px",
                }}
                ref={colorRef}
              >
                <BlockPicker
                  color={selectedColor}
                  onChange={(color, e) => setSelectedColor(color.hex)}
                  triangle="hide"
                  colors={[
                    "#0646b4",
                    "#0077b6",
                    "#00b4d8",
                    "#6dc4e3",
                    "#90e0ef",
                    "#249D57",
                    "#38C172",
                    "#3ad47a",
                    "#74D99F",
                    "#B9F6CA",
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="container-div">
            <div className="container-header">
              <span>Condiciones del Ensayo</span>
            </div>
            <div className="border-div"></div>
            <div className="container-content">
              <div className="input-div">
                <span>Configuración</span>
                <select
                  name="select"
                  className="input-field"
                  style={{ width: "145px" }}
                  value={JSON.stringify(configCondicion)}
                  onChange={(e) => {changeConfigCondicion(e.target.value)}}
                >
                  <option value={JSON.stringify({value: "DEFAULT"})} disabled>
                    {" "}
                  </option>
                  {configCondiciones.map((config, index) => (
                    <option value={JSON.stringify(config)} key={index}>
                      {config.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="input-div"
                style={{ marginLeft: "40px", paddingTop: "1px" }}
              >
                <span>Placas por condición</span>
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
                  ref={placasPorCondicionRef}
                ></input>
              </div>
              <div
                className="input-div"
                style={{ marginLeft: "40px", paddingTop: "1px" }}
              >
                <span>Gusanos por condición</span>
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
                  ref={gusanosPorCondicionRef}
                ></input>
              </div>
              {condiciones.map((condicion, index) => (
                <div key={index}>
                  <div className="condicion-div">
                    <div
                      className="input-div"
                      style={{ marginLeft: "40px", paddingTop: "1px" }}
                    >
                      <span
                        style={{
                          color: condicion.name === "" ? "gray" : "black",
                        }}
                      >
                        Nombre condición {index + 1}
                      </span>
                      <input
                        className="input-field"
                        placeholder=""
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        style={{ width: "104px" }}
                        value={condicion.name}
                        onChange={(e) =>
                          changeNombreCondicion(e.target.value, index)
                        }
                      />
                      {index % configCondicion.numCondiciones === 0 &&
                        index !== 0 && (
                          <button
                            className="button-eliminar-fila"
                            onClick={() => deleteCondicion(index)}
                          >
                            <img src={del} alt="" />
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              <button className="nueva-button" onClick={createCondicion}>
                <span style={{ color: "#666" }}>+</span>
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
                  ref={hfreqRef}
                  style={{ width: "42px" }}
                />
                <span id="h-span">h.</span>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  max="59"
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

          <div className="container-div">
            <div className="container-header">
              <span>Parámetros de Captura</span>
            </div>
            <div className="border-div"></div>
            <div className="container-content">
              <div style={{ display: expandDiv }}>
                <div className="input-div">
                  <span>Tipo de Imagen </span>
                  <select
                    name="select"
                    className="input-field"
                    ref={tipoImgRef}
                  >
                    <option value="rgb">RGB</option>
                    <option value="bw">BW</option>
                  </select>
                </div>
                <div className="input-div">
                  <span>Resolución</span>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    defaultValue="1942"
                    style={{ width: "62px" }}
                    ref={resWidthRef}
                  />
                  <span id="pix-span">x</span>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    defaultValue="1942"
                    style={{ left: "29px", width: "62px" }}
                    ref={resHeightRef}
                  />
                </div>
                <div className="input-div">
                  <span>Frecuencia de Captura</span>
                  <input
                    className="input-field"
                    placeholder=""
                    type="number"
                    min="1"
                    ref={freqCapturaRef}
                    style={{ width: "138.4px" }}
                  />
                  <span
                    style={{
                      fontSize: "small",
                      color: "#555",
                      marginLeft: "5px",
                    }}
                  >
                    fps
                  </span>
                </div>
                <div className="input-div">
                  <span>Nº de Imagenes</span>
                  <input
                    className="input-field"
                    placeholder=""
                    type="number"
                    min="1"
                    ref={imgsPorCapturaRef}
                    style={{ width: "138.4px" }}
                  />
                </div>
              </div>
              <button className="nueva-button" onClick={changeExpand}>
                <img
                  src={expand}
                  alt=""
                  style={{
                    filter: "invert(50%)",
                    transform:
                      expandDiv === "block" ? "rotate(180deg)" : "none",
                  }}
                />
              </button>
            </div>
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
                eventClick={(eventClickInfo) => {
                  deleteCalendarEvent(eventClickInfo.event);
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
                    dragCalendarEvent(eventDropInfo);
                  } else {
                    let old = events.filter(
                      (e) => e.id === eventDropInfo.event.id
                    );
                    setEvents(
                      events.filter((e) => e.id !== eventDropInfo.event.id)
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
            <button className="crear-button" onClick={() => createEnsayo()}>
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

      {/* SI NO ESTÁ LIBRE EL SEMÁFORO */}
      {repeat && (
        <div className="loading-div">
          <img src={loading} alt="" className="loading-img" />
          <br />
          <span style={{ fontWeight: "bold", color: "#444" }}>
            Otro usuario está programando un ensayo
          </span>
        </div>
      )}

      {/* SPINEER */}
      {isLoading && (
        <div className="outter-spinner-div">
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>

      )}
    </div>
  );
};

export default NuevoEnsayo;
