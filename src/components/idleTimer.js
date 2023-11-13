import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IpContext from "../context/IpContext";

const blacklist = ["/new"];

export const IdleTimer = ({ semaphore }) => {
  const ipData = useContext(IpContext);

  let [prev, setPrev] = useState(null);
  let [dialog, setDialog] = useState(false);
  const navigate = useNavigate();

  const sendRequest = () => {
    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    if (router.pathname === "/new") {
      fetch(`http://${window.location.hostname}:8000/new/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
        body: "update",
      });
    }
  };
  const releaseLock = () => {
    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    if (semaphore) {
      fetch(`http://${window.location.hostname}:8000/new/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          release: "release",
        }),
      });
    }
  };

  const router = useLocation();

  let timeout = null;
  let timeoutDialog = null;
  let lastActivityTime = new Date().getTime();

  // Si hay inactividad volver a home
  const trigger = () => {
    navigate("/");
    releaseLock();
  };

  const restartAutoReset = () => {
    setDialog(false);
    if (timeout) {
      clearTimeout(timeout);
    }
    if (timeoutDialog) {
      clearTimeout(timeoutDialog);
    }
    timeout = setTimeout(() => {
      trigger();
    }, 1000 * 60 * 2); // Segundos para Timeout
    timeoutDialog = setTimeout(() => {
      setDialog(true);
    }, 1000 * 60 * 1);

    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - lastActivityTime;
    if (elapsedTime > 1000 * 60 * 1) {
      //sendRequest();
      lastActivityTime = currentTime;
    }
  };

  const onMouseMove = () => {
    restartAutoReset();
  };

  useEffect(() => {
    // solo si está en blacklist
    let preventReset = true;
    for (const path of blacklist) {
      if (path === router.pathname) {
        preventReset = false;
      }
    }

    if (preventReset && prev === "/new") {
      releaseLock();
      setPrev(router.pathname);
      return;
    }

    if (preventReset && prev !== "/new") {
      setPrev(router.pathname);
      return;
    }
    setPrev(router.pathname);
    // initiate timeout
    restartAutoReset();

    // listen for mouse events
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onMouseMove);
    window.addEventListener("click", onMouseMove);

    // cleanup
    return () => {
      if (timeout) {
        clearTimeout(timeout);
        clearTimeout(timeoutDialog);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onMouseMove);
        window.removeEventListener("click", onMouseMove);
      }
    };
  }, [router.pathname]);
  // window.addEventListener("beforeunload", releaseLock);

  return (
    <>
      {dialog && (
        <div className="outter-div">
          <div className="dialog-div">
            <div>
              <span>
                En 1 minuto expirará la sesión para crear ensayos por
                inactividad
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
