import paho.mqtt.client as mqtt
import json
import time
import random

# ==========================================
# MQTT 설정
# ==========================================
BROKER_ADDRESS = "192.168.0.x"  # 백엔드 서버가 실행 중인 PC의 IP 주소를 입력하세요 (localhost 아님)
PORT = 1883
TOPIC = "mobility/hub/car/status"
CLIENT_ID = "rc_car_client_01"

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print(f"Failed to connect, return code {rc}")

def on_disconnect(client, userdata, rc, properties=None):
    print("Disconnected from MQTT Broker")

# 클라이언트 생성
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, CLIENT_ID)
client.on_connect = on_connect
client.on_disconnect = on_disconnect

print(f"Connecting to broker at {BROKER_ADDRESS}...")
try:
    client.connect(BROKER_ADDRESS, PORT)
    client.loop_start()

    # 데이터 전송 루프
    while True:
        # 가상의 센서 데이터 생성 (실제 센서 값으로 대체하세요)
        data = {
            "carNumber": "12가3456",
            "status": "PARKING", # PARKING, DRIVING, STOPPED
            "battery": random.randint(0, 100),
            "lat": 37.5665 + random.uniform(-0.001, 0.001),
            "lng": 126.9780 + random.uniform(-0.001, 0.001),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }

        payload = json.dumps(data, ensure_ascii=False)
        
        # 메시지 발행
        client.publish(TOPIC, payload)
        print(f"Published: {payload}")
        
        time.sleep(2) # 2초마다 전송

except KeyboardInterrupt:
    print("Stopping...")
    client.loop_stop()
    client.disconnect()
except Exception as e:
    print(f"Error: {e}")
