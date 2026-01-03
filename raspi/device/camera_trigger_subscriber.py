# # camera_trigger_subscriber.py
# --------------------------------------------------
# Entrance Worker
# - CCTV 스트리밍
# - 입구 차량 감지 (MQTT ARRIVE)
# - 이미지 캡처 + 메타 전송 (nodeId 포함)
# - 입차 승인 시 게이트 제어
# --------------------------------------------------

import paho.mqtt.client as mqtt
import paho.mqtt.publish as publisher
from threading import Thread
import time
import os
import json
import base64
from datetime import datetime

from mycamera import MyCamera
from gate_servo import GateServo


class EntranceWorker:

    def __init__(self):
        # ================= MQTT =================
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        self.BROKER_IP = "192.168.14.83"

        # ================= DEVICE =================
        self.camera = MyCamera()
        self.servo = GateServo(pin=18)

        # ================= STATE =================
        self.is_streaming = False
        self.last_capture_time = 0
        self.current_node_id = 1  # 기본 입구 노드

        # ================= SAVE =================
        self.SAVE_DIR = "images"
        os.makedirs(self.SAVE_DIR, exist_ok=True)

    # =================================================
    # MQTT CONNECT
    # =================================================
    def on_connect(self, client, userdata, flags, rc):
        print("[ENT] MQTT CONNECT:", rc)
        if rc == 0:
            client.subscribe("parking/web/entrance/#")
            print("[ENT] SUBSCRIBE parking/web/entrance/#")

    # =================================================
    # MQTT MESSAGE
    # =================================================
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = msg.payload.decode()

        # -------------------------------------------------
        # CCTV 스트리밍 제어
        # topic: parking/web/entrance/cam
        # payload: start | stop
        # -------------------------------------------------
        if topic == "parking/web/entrance/cam":
            if payload == "start" and not self.is_streaming:
                print("[ENT] CCTV STREAM START")
                self.is_streaming = True
                Thread(target=self.send_camera_frame, daemon=True).start()

            elif payload == "stop":
                print("[ENT] CCTV STREAM STOP")
                self.is_streaming = False

        # -------------------------------------------------
        # 차량 도착 (ARRIVE)
        # topic: parking/web/entrance
        # payload:
        #   { "event":"ARRIVE", "nodeId":1, "cameraId":"CAM_ENT" }
        # -------------------------------------------------
        elif topic == "parking/web/entrance":
            self.handle_arrive(payload)

        # -------------------------------------------------
        # 입차 승인 → 게이트 OPEN
        # topic: parking/web/entrance/approve
        # payload: { "action":"open" } | "open"
        # -------------------------------------------------
        elif topic == "parking/web/entrance/approve":
            self.handle_approve(payload)

    # =================================================
    # ARRIVE 처리
    # =================================================
    def handle_arrive(self, payload):
        try:
            data = json.loads(payload)

            if data.get("event") != "ARRIVE":
                return

            self.current_node_id = int(data.get("nodeId", 1))
            print(f"[ENT] ARRIVE DETECTED nodeId={self.current_node_id}")

            self.capture_image(self.current_node_id)

        except Exception:
            # 기존 comeIn 문자열 호환
            if payload == "comeIn":
                print("[ENT] ARRIVE (legacy comeIn)")
                self.current_node_id = 1
                self.capture_image(self.current_node_id)

    # =================================================
    # CCTV 프레임 송신
    # =================================================
    def send_camera_frame(self):
        while self.is_streaming:
            frame = self.camera.getStreaming()
            if frame:
                publisher.single(
                    topic="parking/web/entrance/cam",
                    payload=frame,
                    hostname=self.BROKER_IP
                )
            time.sleep(0.05)

    # =================================================
    # 이미지 캡처 + 메타 전송
    # =================================================
    def capture_image(self, node_id: int):
        now = time.time()
        if now - self.last_capture_time < 1:
            return
        self.last_capture_time = now

        frame = self.camera.getStreaming()
        if not frame:
            return

        # base64 → jpg 저장
        img_bytes = base64.b64decode(frame)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        img_path = f"{self.SAVE_DIR}/CAM_ENT_{ts}.jpg"

        with open(img_path, "wb") as f:
            f.write(img_bytes)

        # 캡처 이미지 송신 (프론트 표시용)
        publisher.single(
            topic="parking/web/entrance/capture",
            payload=frame,
            hostname=self.BROKER_IP
        )

        # 메타 정보 (Spring → image + work_info 생성용)
        meta = {
            "event": "CAPTURED",
            "cameraId": "CAM_ENT",
            "nodeId": node_id,
            "imagePath": img_path,
            "ocrNumber": None
        }

        publisher.single(
            topic="parking/web/entrance/image",
            payload=json.dumps(meta),
            hostname=self.BROKER_IP
        )

        print(f"[ENT] CAPTURE DONE nodeId={node_id} path={img_path}")

    # =================================================
    # 승인 처리
    # =================================================
    def handle_approve(self, payload):
        try:
            data = json.loads(payload)
            if data.get("action") == "open":
                print("[ENT] APPROVE → GATE OPEN")
                Thread(target=self.open_and_close_gate, daemon=True).start()
        except Exception:
            if payload == "open":
                print("[ENT] APPROVE (legacy) → GATE OPEN")
                Thread(target=self.open_and_close_gate, daemon=True).start()

    # =================================================
    # 게이트 제어
    # =================================================
    def open_and_close_gate(self):
        self.servo.open()
        time.sleep(7)
        self.servo.close()

    # =================================================
    # START
    # =================================================
    def start(self):
        print("[ENT] EntranceWorker START")
        self.client.connect(self.BROKER_IP, 1883, 60)
        Thread(target=self.client.loop_forever, daemon=True).start()
