import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Sample from "./Sample";
import Salle from "./Salle";
import Navbar from "./Navbar";
import Map from "./Map";
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
          <Route path="/map" element={<Map />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
