import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NuevoEnsayo from "./pages/NuevoEnsayo";
import Login from "./pages/Login";
import Sidebar from "./components/sidebar";
import Panel from "./pages/Panel";
import Lifespan from "./pages/lifespan1";
import LifespanR from "./pages/lifespanr";
import Visualizar from "./pages/Visualizar";
import Results from "./pages/Results";
import Nav from "./components/navbar";
import Config from "./pages/Config";
import NewDevice from "./pages/config/NewDevice";
import NewPlanner from "./pages/config/NewPlanner";
import NewPlate from "./pages/config/NewPlate";

import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const router = useLocation();
  let [prev, setPrev] = useState(null);
  let [semaphore, setSemaphore] = useState(false);

  const releaseLock = () => {
    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    if (semaphore === true) {
      console.log("releasing..... semaphore", semaphore);
      fetch("http://127.0.0.1:8000/new/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access}`,
        },
        body: JSON.stringify({
          release: "release",
        }),
      });

      setSemaphore(false);
    }
    setSemaphore(false);
  };

  // liberar semáforo si sale de la página
  useEffect(() => {
    if (prev == "/nuevo" && semaphore === true) {
      releaseLock();
    }
    setPrev(router.pathname);
  }, [router.pathname]);

  //liberar semáforo si cierra o refresca la página
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (semaphore === true) {
        releaseLock();
      }
    };

    if (semaphore === true) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [semaphore]);

  const updateSemaphore = (data) => {
    setSemaphore(data);
  };

  return (
    <>
      <AuthProvider>
        <Sidebar />
        <Nav />
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/control" element={<Panel />} />
              <Route path="/control/lifespan-1" element={<Lifespan />} />
              <Route path="/visualizar/lifespan-r" element={<LifespanR />} />
              <Route
                path="/nuevo"
                element={
                  <NuevoEnsayo
                    semaphore={semaphore}
                    updateSemaphore={updateSemaphore}
                  />
                }
              />
              <Route path="/visualizar" element={<Visualizar />} />
              <Route path="/visualizar/:id" element={<Results />} />

              <Route path="config/" element={<Config />} />
              <Route path="config/device/new" element={<NewDevice />} />
              <Route path="config/device/:id" />
              <Route path="config/planner/new" element={<NewPlanner />} />
              <Route path="config/planner/:id" />
              <Route path="config/plates/new" element={<NewPlate />} />
              <Route path="config/plates/:id" />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
