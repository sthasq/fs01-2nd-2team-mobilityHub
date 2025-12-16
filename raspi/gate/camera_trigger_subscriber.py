# -*- coding: utf-8 -*-
"""
Entrance Camera Worker
- 스트리밍 유지
- MQTT comeIn 수신 시 현재 프레임 캡처
- 이미지 파일 저장
- 캡처 이미지(base64) MQTT 전송
- 이미지 메타(JSON) MQTT 전송 (DB 저장용)
- approve 수신 시 서보 제어 (자리만 마련)
"""

import threading
import time
import io
import os
import json
import base64
from datetime import datetime


import paho.mqtt.client as mqtt
import paho.mqtt.publish as publisher
from picamera2 import Picamera2

# =========================
# MQTT 설정
# =========================
BROKER_IP = "192.168.14.56"
BROKER_PORT = 1883

TOPIC_BASE = "parking/web/entrance"
TOPIC_CAM_STREAM = f"{TOPIC_BASE}/cam"
TOPIC_CAPTURE_TRIGGER = TOPIC_BASE
TOPIC_CAPTURE_IMAGE = f"{TOPIC_BASE}/capture"
TOPIC_IMAGE_META = f"{TOPIC_BASE}/image"
TOPIC_APPROVE = f"{TOPIC_BASE}/approve"

# =========================
# 저장 설정
# =========================
SAVE_DIR = "./images"
os.makedirs(SAVE_DIR, exist_ok=True)

CAMERA_ID = "CAM_ENT"


# =========================
# Camera 클래스
# =========================
class MyCamera:
    def __init__(self):
        self.camera = Picamera2()
        self.frame = None
        self.running = True
        self._init_camera()

        self.thread = threading.Thread(
            target=self._streaming_loop, daemon=True
        )
        self.thread.start()

    def _init_camera(self):
        config = self.camera.create_video_configuration(
            main={"format": "RGB888", "size": (320, 240)}
        )
        self.camera.configure(config)
        self.camera.start()
        self.camera.hflip = True
        self.camera.vflip = True
        print("📷 카메라 초기화 완료 (스트리밍 유지)")

    def _streaming_loop(self):
        stream = io.BytesIO()
        while self.running:
            try:
                self.camera.capture_file(stream, format="jpeg")
                stream.seek(0)
                self.frame = stream.read()
                stream.seek(0)
                stream.truncate()
                time.sleep(0.05)
            except Exception as e:
                print("❌ 스트리밍 오류:", e)
                self.running = False

    def get_frame(self):
        return self.frame


# =========================
# MQTT Worker
# =========================
class EntranceCameraWorker:
    def __init__(self):
        self.client = mqtt.Client("entrance_camera_worker")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        self.camera = MyCamera()
        self.last_capture_time = 0

    # MQTT 연결
    def on_connect(self, client, userdata, flags, rc):
        print("🔌 MQTT 연결:", rc)
        client.subscribe(f"{TOPIC_BASE}/#")

    # MQTT 수신
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = msg.payload.decode("utf-8").strip()

        # 📸 입구 캡처 트리거
        if topic == TOPIC_CAPTURE_TRIGGER and payload == "comeIn":
            print("📸 캡처 트리거 수신")
            self.capture_image()

        # 🔓 승인 (서보 자리만)
        elif topic == TOPIC_APPROVE and payload == "open":
            print("🔓 승인 수신 → 서보 OPEN (추후 구현)")

    # =========================
    # 캡처 처리
    # =========================
    def capture_image(self):
        now = time.time()
        if now - self.last_capture_time < 1:
            print("⚠️ 연속 캡처 방지")
            return
        self.last_capture_time = now

        frame = self.camera.get_frame()
        if frame is None:
            print("⚠️ 프레임 없음 → 캡처 실패")
            return

        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{CAMERA_ID}_{ts}.jpg"
        path = os.path.join(SAVE_DIR, filename)

        # 1️⃣ 파일 저장
        with open(path, "wb") as f:
            f.write(frame)
        print("💾 이미지 저장:", path)

        # 2️⃣ 캡처 이미지(base64) 전송 (프론트용)
        encoded = base64.b64encode(frame).decode()
        self.client.publish(TOPIC_CAPTURE_IMAGE, encoded)
        print("📤 캡처 이미지 MQTT 전송")

        # 3️⃣ 이미지 메타(JSON) 전송 (DB 저장용) ✅ 핵심
        meta = {
            "cameraId": CAMERA_ID,
            "imagePath": path,
            "ocrNumber": None
        }
        self.client.publish(
            TOPIC_IMAGE_META,
            json.dumps(meta, ensure_ascii=False)
        )
        print("📤 이미지 메타 MQTT 전송:", meta)

    # =========================
    # 스트리밍 MQTT 송신
    # =========================
    def publish_stream(self):
        while True:
            frame = self.camera.get_frame()
            if frame:
                encoded = base64.b64encode(frame).decode()
                publisher.single(
                    TOPIC_CAM_STREAM,
                    encoded,
                    hostname=BROKER_IP
                )
            time.sleep(0.05)

    def start(self):
        self.client.connect(BROKER_IP, BROKER_PORT, 60)

        # 스트리밍 송신 스레드 시작
        threading.Thread(
            target=self.publish_stream, daemon=True
        ).start()

        print("🟢 Entrance Camera Worker 실행 중")
        self.client.loop_forever()


# =========================
# Main
# =========================
if __name__ == "__main__":
    try:
        worker = EntranceCameraWorker()
        worker.start()
    except KeyboardInterrupt:
        print("\n🛑 종료")
