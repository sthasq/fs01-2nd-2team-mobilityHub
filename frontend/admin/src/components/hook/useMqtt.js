import { useCallback, useEffect, useState } from "react";

// MQTT 라이브러리
import mqtt from "mqtt";

// MQTT 브로커 주소 : 모든 페이지에서 동일하게 사용
const BROKER_URL = "ws://192.168.14.69:9001";

// MQTT 훅
const useMqtt = () => {
  const [connectStatus, setConnectStatus] = useState("connecting"); // 연결상태
  const [client, setClient] = useState(null); // MQTT 클라이언트

  // 실시간 CCTV 스트리밍 이미지
  const [imageSrc, setImageState] = useState("");

  // 캡처된 정지 이미지
  const [capturedImage, setCapturedImage] = useState("");

  // YOLO 번호판 박스 좌표
  const [yoloBox] = useState(null);

  // 리프트 각도
  const [angleValue, setAngleValue] = useState(null);

  // MQTT 연결 및 이벤트 처리
  useEffect(() => {
    // 브로커 연결
    const mqttClient = mqtt.connect(BROKER_URL, {
      clientId: `react_client_${Math.random().toString(16).substring(2, 8)}`,
      keepalive: 60,
      protocolId: "MQTT",
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    });

    // 연결 성공
    mqttClient.on("connect", () => {
      setConnectStatus("connected");
    });

    // 메시지 수신
    mqttClient.on("message", (topic, message) => {
      const payload = message.toString();

      // 실시간 CCTV
      if (
        topic === "parking/web/carwash/cam/frame" ||
        topic === "parking/web/repair/cam/frame" ||
        topic === "parking/web/entrance/cam/frame" ||
        topic === "parking/web/parking/cam/frame"
      ) {
        setImageState(`data:image/jpeg;base64,${payload}`);
        return;
      }

      // 캡처 이미지
      if (topic === "parking/web/entrance/capture") {
        setCapturedImage(`data:image/jpeg;base64,${payload}`);
        return;
      }

      // 센서 데이터
      if (topic === "parking/web/repair/lift/angle") {
        try {
          const data = JSON.parse(payload);
          setAngleValue(data.angle);
        } catch (e) {
          console.error("센서 JSON 파싱 오류", e);
        }
      }
    });

    // 에러 처리
    mqttClient.on("error", (err) => {
      mqttClient.end();
    });

    setClient(mqttClient);

    // 페이지 이탈 시 모든 카메라 정리
    return () => {
      if (mqttClient) {
        mqttClient.publish("parking/web/carwash/cam/control", "stop");
        mqttClient.publish("parking/web/repair/cam/control", "stop");
        mqttClient.publish("parking/web/entrance/cam/control", "stop");
        mqttClient.publish("parking/web/parking/cam/control", "stop");

        mqttClient.end();
        setConnectStatus("connecting");
      }
    };
  }, []);

  // publish 함수
  const publish = useCallback(
    (topic, message) => {
      if (client) {
        client.publish(topic, message);
      } else {
        console.error("Mqtt전송실패");
      }
    },
    [client]
  );

  return {
    connectStatus, // 연결상태
    imageSrc, // 실시간 CCTV
    capturedImage, // 캡처 이미지
    yoloBox, // YOLO 번호판 박스
    angleValue, // 리프트 각도
    publish, // publish 함수
  };
};

export default useMqtt;
