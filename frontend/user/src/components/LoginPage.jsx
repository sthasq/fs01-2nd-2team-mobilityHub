import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import "../styles/LoginPage.css";

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId.trim()) return;

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (isSignup) {
      // 회원가입
      users[userId] = { password, name, phone, vehicles: [], history: [] };
      localStorage.setItem("users", JSON.stringify(users));
      alert("회원가입이 완료되었습니다!");
      setIsSignup(false);
    } else {
      // 로그인
      if (users[userId] && users[userId].password === password) {
        onLogin(userId);
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  return (
    <div className="sign-button">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{isSignup ? "회원가입" : "로그인"}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="userId">아이디</Label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {isSignup && (
              <>
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
              </>
            )}

            <Button type="submit" className="w-full">
              {isSignup ? "가입하기" : "로그인"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "로그인으로 돌아가기" : "회원가입"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
