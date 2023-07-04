import { createContext, useState, useEffect } from "react";

const IpContext = createContext();

export default IpContext;

export const IpProvider = ({ children }) => {
  const [ipData, setIpData] = useState({});

  useEffect(() => {
    async function fetchData() {
      fetch(`http://127.0.0.1:8000/config/disp`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setIpData(data["dispositivos"]);
        });
    }
    fetchData();
  }, []);

  return <IpContext.Provider value={ipData}>{children}</IpContext.Provider>;
};
