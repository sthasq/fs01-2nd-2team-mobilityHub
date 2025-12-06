import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ChevronLeft, Plus } from "lucide-react";

export default function VehicleSelection({ userId, onBack, onVehicleSelect }) {
  const [vehicles, setVehicles] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [newPlateNumber, setNewPlateNumber] = useState("");
  const [newModel, setNewModel] = useState("");

  useEffect(() => {
    loadVehicles();
  }, [userId]);

  const loadVehicles = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const userVehicles = users[userId]?.vehicles || [];
    setVehicles(userVehicles);
  };

  const handleAddVehicle = () => {
    if (!newPlateNumber.trim() || !newModel.trim()) {
      alert("차량번호와 모델을 모두 입력해주세요.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    const newVehicle = {
      id: Date.now().toString(),
      plateNumber: newPlateNumber,
      model: newModel,
    };

    if (!users[userId].vehicles) {
      users[userId].vehicles = [];
    }

    users[userId].vehicles.push(newVehicle);
    localStorage.setItem("users", JSON.stringify(users));

    setVehicles([...vehicles, newVehicle]); // 화면에도 즉시 반영
    setNewPlateNumber("");
    setNewModel("");
    setShowAddDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="size-5" />
        </Button>

        <div>
          <div className="text-sm text-gray-500">로그인 사용자</div>
          <div>{userId}</div>
        </div>
      </div>

      {/* 차량 목록 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-700">등록된 차량</h2>

          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="size-4 mr-1" />
            신규 차량 등록
          </Button>
        </div>

        {/* 차량 없음 */}
        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              등록된 차량이 없습니다.
              <br />
              신규 차량을 등록해주세요.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div>{vehicle.plateNumber}</div>
                    <div className="text-sm text-gray-500">{vehicle.model}</div>
                  </div>

                  <Button onClick={() => onVehicleSelect(vehicle.plateNumber)}>선택</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 차량 추가 다이얼로그 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>신규 차량 등록</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="plateNumber">차량번호</Label>
              <Input
                id="plateNumber"
                value={newPlateNumber}
                onChange={(e) => setNewPlateNumber(e.target.value)}
                placeholder="예: 12가3456"
              />
            </div>

            <div>
              <Label htmlFor="model">차량 모델</Label>
              <Input
                id="model"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                placeholder="예: 현대 아반떼"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>
                취소
              </Button>

              <Button className="flex-1" onClick={handleAddVehicle}>
                등록
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
