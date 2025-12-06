import { useState } from "react";

import LoginPage from "./components/LoginPage.jsx";
import MainMenu from "./components/MainMenu.jsx";
import VehicleSelection from "./components/VehicleSelection.jsx";
import ServiceProgress from "./components/ServiceProgress.jsx";
import UsageHistory from "./components/UsageHistory.jsx";
import ProfileEdit from "./components/ProfileEdit.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [userId, setUserId] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  // 로그인 성공 처리
  const handleLogin = (id) => {
    setUserId(id);
    setCurrentPage("menu");
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setUserId("");
    setSelectedVehicle("");
    setCurrentPage("login");
  };

  // 메뉴에서 서비스 선택 누르면 차량 선택 페이지로 이동
  const handleNavigateToService = () => {
    setCurrentPage("vehicleSelection");
  };

  // 차량 선택 완료 → 서비스 진행 페이지 이동
  const handleVehicleSelect = (plateNumber) => {
    setSelectedVehicle(plateNumber);
    setCurrentPage("service");
  };

  // 뒤로가기 동작
  const handleBackToMenu = () => {
    setSelectedVehicle("");
    setCurrentPage("menu");
  };

  const handleBackToVehicleSelection = () => {
    setSelectedVehicle("");
    setCurrentPage("vehicleSelection");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 로그인 페이지 */}
      {currentPage === "login" && <LoginPage onLogin={handleLogin} />}

      {/* 메인 메뉴 */}
      {currentPage === "menu" && (
        <MainMenu
          userId={userId}
          onNavigate={(page) => {
            if (page === "service") {
              handleNavigateToService();
            } else {
              setCurrentPage(page);
            }
          }}
          onLogout={handleLogout}
        />
      )}

      {/* 차량 선택 */}
      {currentPage === "vehicleSelection" && (
        <VehicleSelection
          userId={userId}
          onBack={handleBackToMenu}
          onVehicleSelect={handleVehicleSelect}
        />
      )}

      {/* 서비스 진행 페이지 */}
      {currentPage === "service" && (
        <ServiceProgress
          userId={userId}
          selectedVehicle={selectedVehicle}
          onBack={handleBackToVehicleSelection}
        />
      )}

      {/* 이용 내역 */}
      {currentPage === "history" && <UsageHistory userId={userId} onBack={handleBackToMenu} />}

      {/* My 정보 수정 */}
      {currentPage === "profile" && <ProfileEdit userId={userId} onBack={handleBackToMenu} />}
    </div>
  );
}
