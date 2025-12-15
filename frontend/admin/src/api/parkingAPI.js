import axios from "axios";
import request from "./requests";
import backendServer from "./backendServer";

// 주차 현황 조회
export const getParkingList = async () => {
  try {
    const response = await backendServer.get(request.parkingList);
    return response.data;
  } catch (error) {
    console.error("주차 현황 조회 오류:", error);
    return [];
  }
};

// 주차 상태 업데이트
export const updateParkingStatus = async (sectorId, state) => {
  try {
    const response = await backendServer.post(request.parkStatusUpdateList, {
      sectorId,
      state,
    });
    return response.data;
  } catch (error) {
    console.error("주차 상태 업데이트 오류:", error);
    return null;
  }
};
