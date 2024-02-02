import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Para comprobar las IPs cada vez que se cambia de página

const IpContext = createContext();

export default IpContext;

export const IpProvider = ({ children }) => {
  const [ipData, setIpData] = useState({});
  const location = useLocation();

  useEffect(() => {
    const reloadLocations = ["/", "/new", "/control", "/visualize", "/config"];
    if (reloadLocations.includes(location.pathname)) {
      function checkIPs(dispositivos) {
        // Fetch on timeout
        function fetchWithTimeout(url, timeout) {
          return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
              controller.abort();
              reject(new Error("Timeout"));
            }, timeout);

            fetch(url, { signal: controller.signal })
              .then((response) => {
                clearTimeout(timeoutId);
                resolve(response);
              })
              .catch((error) => {
                clearTimeout(timeoutId);
                reject(error);
              });
          });
        }

        // Array para promises
        const fetchPromises = [];

        dispositivos.forEach((dispositivo) => {
          const startTime = Date.now();
          const url = `http://${dispositivo.IP}:8000/check`;
          const promise = fetchWithTimeout(url, 700) // 700 ms de timeout, OJO si la red es mala...
            .then((response) => {
              const elapsedTime = Date.now() - startTime;
              console.log(`Time for IP ${dispositivo.IP}: ${elapsedTime}ms`);
              if (response.ok) {
                return dispositivo;
              } else {
                throw new Error(
                  `Endpoint not reachable for IP: ${dispositivo.IP}`
                );
              }
            })
            .catch((error) => {
              // console.error(`Error checking IP ${ipAddress}:`, error);
              return null;
            });

          fetchPromises.push(promise);
        });

        Promise.all(fetchPromises)
          .then((results) => {
            // Filtrar null
            const reachableIPs = results.filter((ip) => ip !== null);
            setIpData(reachableIPs);
            console.log("IPS DISPONIBLES :", reachableIPs);
          })
          .catch((error) => {
            // console.error('Error checking IPs:', error);
          });
      }

      async function fetchData() {
        fetch(`http://${window.location.hostname}:8000/config/disp`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            // setIpData(data["dispositivos"]);
            checkIPs(data["dispositivos"]);
          });
      }

      fetchData();
    }
  }, [location]); // si no se usara location solo se comprueban IPs al abrir por primera vez o al refrescar navegador

  return <IpContext.Provider value={ipData}>{children}</IpContext.Provider>;
};
