import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- Importando BrowserRouter
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter> {/* <-- Agora o Router envolve o App */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
