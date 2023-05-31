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
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const router = useLocation();
  let [prev, setPrev] = useState(null);
  //let [num, setNum] = useState(0);
  let [semaphore, setSemaphore] = useState(false);

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
      setSemaphore(false);
    }
    console.log("RELEASE...");
  };

  useEffect(() => {
    if (prev == "/nuevo") {
      releaseLock();
    }
    setPrev(router.pathname);
  }, [router.pathname]);

  const updateSemaphore = (data) => {
    setSemaphore(data);
  };

  window.addEventListener("beforeunload", releaseLock);

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
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
