import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NuevoEnsayo from "./pages/NuevoEnsayo";
import Login from "./pages/Login";
import Sidebar from "./components/sidebar";
import Panel from "./pages/Panel";
import Visualizar from "./pages/Visualizar";
import Nav from "./components/navbar";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
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
              <Route path="/nuevo" element={<NuevoEnsayo />} />
              <Route path="/visualizar" element={<Visualizar />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
