import { useEffect, useState } from "react";
import axios from "axios";
import "../style/RegisteredCarSection.css";

const PAGE_SIZE = 8;

export default function RegisteredCarSection({ onApproved }) {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchRegisteredCars();
  }, []);

  const fetchRegisteredCars = async () => {
    try {
      const res = await axios.get("http://localhost:9000/entry/registered-cars");
      setCars(res.data);
    } catch (e) {
      console.error("등록 차량 조회 실패", e);
      alert("등록 차량 조회 실패");
    }
  };

  const approveEntry = async (userCarId) => {
    try {
      setLoadingId(userCarId);

      await axios.post(`http://localhost:9000/entrance/approve/registered/${userCarId}`);

      alert("입차 승인 완료 (차단기 OPEN)");

      //  부모에게 알려서 입차 기록 다시 불러오게
      onApproved?.();
    } catch (e) {
      console.error("입차 승인 실패", e);
      alert("입차 승인 실패");
    } finally {
      setLoadingId(null);
    }
  };

  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageCars = cars.slice(start, end);
  const totalPages = Math.ceil(cars.length / PAGE_SIZE);

  return (
    <div className="registered-section">
      <h3>등록 차량 리스트</h3>

      <table className="registered-table">
        <thead>
          <tr>
            <th>사용자</th>
            <th>차량 번호</th>
            <th>입차</th>
          </tr>
        </thead>
        <tbody>
          {pageCars.map((car) => (
            <tr key={car.userCarId}>
              <td>{car.userName}</td>
              <td>{car.carNumber}</td>
              <td>
                <button
                  className="approve-btn"
                  disabled={loadingId === car.userCarId}
                  onClick={() => approveEntry(car.userCarId)}
                >
                  {loadingId === car.userCarId ? "처리중..." : "입차 승인"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          ◀
        </button>

        <span>
          {page + 1} / {totalPages}
        </span>

        <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>
          ▶
        </button>
      </div>
    </div>
  );
}
