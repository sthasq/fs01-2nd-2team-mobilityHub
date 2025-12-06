import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { MainSection } from "./components/MainSection";
import { ParkingSection } from "./components/ParkingSection";
import { ProfileSection } from "./components/ProfileSection";
import EntranceExitSection from "./components/EntranceExitSection";
import { CarWashSection } from "./components/CarWashSection";
import { MaintenanceSection } from "./components/MaintenanceSection";
import AdminSection from "./components/AdminSection";
import { StatisticsSection } from "./components/StatisticsSection";

export default function App() {
  // 현재 표시할 섹션
  // 사이드 메뉴 페이지 선택 전 main 페이지를 기본으로 설정
  const [activeSection, setActiveSection] = useState("main");

  // 섹션(사이드 메뉴 페이지) 선택에 따라 렌더링
  const renderSection = () => {
    switch (activeSection) {
      case "main":
        return <MainSection />;
      case "entrance":
        return <EntranceExitSection />;
      case "carwash":
        return <CarWashSection />;
      case "maintenance":
        return <MaintenanceSection />;
      case "parking":
        return <ParkingSection />;
      case "profile":
        return <ProfileSection />;
      case "statistics":
        return <StatisticsSection />;
      case "admin":
        return <AdminSection />;
      default:
        return <MainSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection} // 현재 활성 섹션
        onSectionChange={setActiveSection} // 섹션 변경 함수
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onNavigate={setActiveSection} // 헤더에서 섹션 이동
          activeSection={activeSection}
        />
        <main className="flex-1 overflow-y-auto">
          {renderSection()} {/* 선택된 섹션 표시 */}
        </main>
      </div>
    </div>
  );
}
