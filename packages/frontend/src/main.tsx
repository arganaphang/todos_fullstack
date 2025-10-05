import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import Health from "./Health";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="w-full min-h-screen grid place-content-center">
      <h1>Hello World {import.meta.env.VITE_BASE_URL}</h1>
      <Health />
    </main>
  </StrictMode>
);
