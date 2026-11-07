import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LessonsPage from "./LessonsPage";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
import "./styles.css";

const isLessonsPage = window.location.pathname === "/aulas";
document.title = isLessonsPage ? "Freinet — Gerenciamento de aulas" : "Freinet — Visão do professor";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isLessonsPage ? <LessonsPage /> : <App />}
  </React.StrictMode>
);
