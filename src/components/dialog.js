import React from "react";
import "./dialog.css";

const Dialog = ({ message, onDialog }) => {
  return (
    <div className="outter-div">
      <div className="dialog-div">
        <span>{message}</span>
        <div>
          <span>¿Estás seguro?</span>
        </div>
        <div>
          <button onClick={() => onDialog(true)}>Sí</button>
          <button onClick={() => onDialog(false)}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
