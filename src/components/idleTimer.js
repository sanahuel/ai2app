import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const blacklist = ["/nuevo"];

export const IdleTimer = ({ semaphore }) => {
  let [prev, setPrev] = useState(null);
  let [dialog, setDialog] = useState(false);
  const navigate = useNavigate();

  const sendRequest = () => {
    if (router.pathname === "/nuevo") {
      fetch("http://127.0.0.1:8000/new/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: "update",
      });
      console.log("sending.........");
    }
  };
  const releaseLock = () => {
    if (semaphore) {
      fetch("http://127.0.0.1:8000/new/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          release: "release",
          //code: num,
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
    console.log("act...");
    if (timeout) {
      clearTimeout(timeout);
    }
    if (timeoutDialog) {
      clearTimeout(timeoutDialog);
    }
    timeout = setTimeout(() => {
      trigger();
    }, 1000 * 60 * 0.25); // Segundos para Timeout
    timeoutDialog = setTimeout(() => {
      setDialog(true);
    }, 1000 * 60 * 0.1);

    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - lastActivityTime;
    if (elapsedTime > 1000 * 60 * 0.1) {
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

    if (preventReset && prev === "/nuevo") {
      releaseLock();
      setPrev(router.pathname);
      return;
    }

    if (preventReset && prev !== "/nuevo") {
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
