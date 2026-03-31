import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./App.css";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Property from "./pages/Property.tsx";
import Favourites from "./pages/Property.tsx";

import { BrowserRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/property/:id" element={<Property />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
    </BrowserRouter>
    <App />
  </StrictMode>,
);
