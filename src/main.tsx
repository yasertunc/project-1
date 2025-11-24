import React from "react";
import ReactDOM from "react-dom/client";
import AppPhoneMock from "./components/AppPhoneMock";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <AppPhoneMock
        initialPage="map"
        showAIAssistant={true}
        showMessageInput={true}
      />
    </div>
  </React.StrictMode>
);
