import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Facility from "./pages/Facility";
import Logo from "./assets/merawoods.png";

const App = () => {
  return (
    <div className="app">
      <div className="logo">
        <img src={Logo} alt="merawoods-logo" />
      </div>

      <div className="page">
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/facility/:facility" element={<Facility />}></Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
