import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Sample from "./Sample";
import Salle from "./Salle";
import Capteur from "./Capteur";
import Navbar from "./Navbar";
import Map from "./Map";
import Offres from "./Offres";
import NotFound from "./NotFound";

export default function Router() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/sample" element={<Sample />} />
          <Route path="/salle" element={<Salle />} />
          <Route path="/capteur" element={<Capteur />} />
          <Route path="/map" element={<Map />} />
          <Route path="/offres" element={<Offres />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
