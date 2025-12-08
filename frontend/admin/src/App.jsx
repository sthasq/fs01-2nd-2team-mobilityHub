import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SideMenu from "./components/menu/SideMenu";
import Header from "./components/menu/Header";
import { Route, Routes } from "react-router-dom";
import MainSection from "./components/pages/MainSection";

function App() {
  return (
    <>
      <div className="container">
        <SideMenu />
        <div className="layout-main">
          <Header />
          <main className="layout-content">
            <Routes>
              <Route path="/" element={<MainSection />} />
            </Routes>
            <Routes>
              <Route path="/main" element={<MainSection />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
