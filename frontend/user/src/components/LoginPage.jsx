import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-center mb-6">{isSignup ? "회원가입" : "로그인"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isSignup && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  전화번호
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="전화번호를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-gray-700 py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
          >
            {isSignup ? "가입하기" : "로그인"}
          </button>

          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="w-full bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition font-medium"
          >
            {isSignup ? "로그인으로 돌아가기" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
