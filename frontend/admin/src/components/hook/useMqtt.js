const TOPIC_NAME = "parking/web/*"; // 토픽명

import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const useMqtt = (brokerUrl) => {
  const [connectStatus, setConnectStatus] = useState("connecting");
  const [client, setClient] = useState(null);
  const [imageSrc, setImageState] = useState("");

  useEffect(() => {
    // 2. 브로커와 연결생성
    const mqttClient = mqtt.connect(brokerUrl, {
      clientId: `react_client_${Math.random().toString(16).substring(2, 8)}`, // 고유아이디
      //clientId: "test",
      keepalive: 60,
      protocolId: "MQTT",
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    });

    // 1. 연결이 완료되면 실행할 콜백함수
    //    브로커에 구독신청
    mqttClient.on("connect", () => {
      console.log("연결성공............");
      setConnectStatus("connected");
      // 토픽의 구독신청
      // subscribe함수는 토픽과 구독신청 결과 확인하는 용도로 함수정의
      mqttClient.subscribe(TOPIC_NAME, (err) => {
        if (!err) {
          console.log(`구독신청 ${TOPIC_NAME}`);
        } else {
          console.error("구독신청오류", err);
        }
      });
    });

    return <div>useMqtt</div>;
  });
};

export default useMqtt;
