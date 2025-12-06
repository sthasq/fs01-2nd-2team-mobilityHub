import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronLeft } from "lucide-react";

export default function ProfileEdit({ userId, onBack }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadUserInfo();
  }, [userId]);

  const loadUserInfo = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const user = users[userId];
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  };

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const user = users[userId];

    if (!user) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    // 비밀번호 변경 처리
    if (newPassword || confirmPassword) {
      if (user.password !== password) {
        alert("현재 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("새 비밀번호가 서로 일치하지 않습니다.");
        return;
      }
      if (newPassword.length < 4) {
        alert("비밀번호는 4자 이상이어야 합니다.");
        return;
      }
      user.password = newPassword;
    }

    // 개인정보 업데이트
    user.name = name;
    user.phone = phone;

    users[userId] = user;
    localStorage.setItem("users", JSON.stringify(users));

    alert("정보가 수정되었습니다.");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
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

      {/* 본문 */}
      <div className="p-4">
        <h2 className="text-gray-700 mb-4">My정보 수정</h2>

        {/* 개인정보 */}
        <Card>
          <CardHeader>
            <CardTitle>개인정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호를 입력하세요"
              />
            </div>
          </CardContent>
        </Card>

        {/* 비밀번호 변경 */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">현재 비밀번호</Label>
              <Input
                id="currentPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="현재 비밀번호"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 확인"
              />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full mt-4" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
}
