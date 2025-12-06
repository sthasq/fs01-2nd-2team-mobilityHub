import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Car, History, User } from "lucide-react";

export default function MainMenu({ userId, onNavigate, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">로그인 사용자</div>
          <div>{userId}</div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          로그아웃
        </Button>
      </div>

      {/* 메뉴 */}
      <div className="p-4 space-y-3">
        <h2 className="text-gray-700 mb-4">서비스 선택</h2>

        {/* 주차장 서비스 이용 */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate("service")}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Car className="size-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div>주차장 서비스 이용</div>
              <div className="text-sm text-gray-500">차량 등록 및 서비스 이용</div>
            </div>
          </CardContent>
        </Card>

        {/* 이용 내역 */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate("history")}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <History className="size-6 text-green-600" />
            </div>
            <div className="flex-1">
              <div>주차장 이용 내역</div>
              <div className="text-sm text-gray-500">이용 내역 및 결제 정보</div>
            </div>
          </CardContent>
        </Card>

        {/* My정보 수정 */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate("profile")}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="size-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div>My정보 수정</div>
              <div className="text-sm text-gray-500">개인정보 관리</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
