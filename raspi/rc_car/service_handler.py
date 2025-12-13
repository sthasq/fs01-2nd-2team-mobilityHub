# -*- coding: utf-8 -*-
"""
RC카 서비스 요청 MQTT 핸들러
백엔드 서버에서 발행한 rccar/{carId}/command 메시지를 구독하고 경로 정보를 처리
"""

import paho.mqtt.client as mqtt
import json
import time

# ==========================================
# MQTT 설정
# ==========================================
BROKER_ADDRESS = "192.168.35.183"  # application.yaml의 MQTT 브로커 주소
PORT = 1883
SUBSCRIBE_TOPIC = "rccar/+/command"  # 모든 carId의 command 구독
CLIENT_ID = "rc_car_service_handler"

# 전역 변수로 현재 경로 저장
current_route = []
current_work_type = ""
current_car_id = ""


def on_connect(client, userdata, flags, rc, properties=None):
    """브로커 연결 성공 시 구독 신청"""
    if rc == 0:
        print(f"✅ MQTT 브로커 연결 성공: {BROKER_ADDRESS}")
        client.subscribe(SUBSCRIBE_TOPIC)
        print(f"📡 구독 토픽: {SUBSCRIBE_TOPIC}")
    else:
        print(f"❌ 연결 실패, return code: {rc}")


def on_disconnect(client, userdata, rc, properties=None):
    """브로커 연결 끊김"""
    print("🔌 MQTT 브로커 연결 종료")


def on_message(client, userdata, message):
    """
    rccar/{carId}/command 메시지 수신 시 처리
    페이로드 예시: {"route":[1,2,10,15,17,18,19,20],"workType":"carwash"}
    """
    global current_route, current_work_type, current_car_id

    try:
        topic = message.topic
        payload_str = message.payload.decode("utf-8")
        
        print(f"\n📥 [MQTT 수신] Topic: {topic}")
        print(f"   Payload: {payload_str}")

        # carId 추출 (rccar/{carId}/command)
        parts = topic.split("/")
        if len(parts) >= 3 and parts[0] == "rccar" and parts[2] == "command":
            current_car_id = parts[1]
        else:
            print("⚠️  올바르지 않은 토픽 형식")
            return

        # JSON 파싱
        data = json.loads(payload_str)
        current_route = data.get("route", [])
        current_work_type = data.get("workType", "")

        print(f"🚗 Car ID: {current_car_id}")
        print(f"🗺️  경로 (노드 ID): {current_route}")
        print(f"🛠️  작업 타입: {current_work_type}")

        # 실제 라인트레이싱 모듈과 통합 시 아래 함수 호출
        # start_line_following(current_route, current_work_type)
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON 파싱 오류: {e}")
    except Exception as e:
        print(f"❌ 메시지 처리 오류: {e}")


def start_line_following(route, work_type):
    """
    라인트레이싱 모듈 시작 (tracertest.py와 통합)
    route: 노드 ID 리스트
    work_type: 서비스 타입 문자열
    """
    print(f"\n🚀 라인트레이싱 시작: {work_type}")
    print(f"   목표 경로: {route}")
    
    # TODO: tracertest.py의 line_follow_with_nodes() 함수와 통합
    # - route를 TEST_ROUTE로 전달
    # - 각 노드 도착마다 rccar/{carId}/position 발행
    # - 서비스 완료 시 rccar/{carId}/service 발행
    pass


def publish_position(client, car_id, node_id, node_name):
    """
    RC카 위치 이벤트 발행
    Topic: rccar/{carId}/position
    Payload: {"nodeId":1,"nodeName":"입구","timestamp":"2025-12-14 10:30:00"}
    """
    topic = f"rccar/{car_id}/position"
    payload = {
        "nodeId": node_id,
        "nodeName": node_name,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    json_payload = json.dumps(payload, ensure_ascii=False)
    client.publish(topic, json_payload)
    print(f"📤 [위치 발행] {topic} | {json_payload}")


def publish_service_complete(client, car_id, stage, status="done"):
    """
    서비스 완료 이벤트 발행
    Topic: rccar/{carId}/service
    Payload: {"stage":"carwash","status":"done"}
    """
    topic = f"rccar/{car_id}/service"
    payload = {"stage": stage, "status": status}
    json_payload = json.dumps(payload, ensure_ascii=False)
    client.publish(topic, json_payload)
    print(f"📤 [서비스 완료] {topic} | {json_payload}")


# ==========================================
# 메인 실행
# ==========================================
if __name__ == "__main__":
    print("=" * 60)
    print("🚗 RC카 서비스 요청 핸들러 시작")
    print("=" * 60)

    # MQTT 클라이언트 생성
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, CLIENT_ID)
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_message = on_message

    try:
        # 브로커 연결
        print(f"🔌 브로커 연결 시도: {BROKER_ADDRESS}:{PORT}")
        client.connect(BROKER_ADDRESS, PORT, keepalive=60)
        
        # 메시지 루프 시작 (블로킹)
        print("📡 메시지 수신 대기 중... (Ctrl+C로 종료)\n")
        client.loop_forever()

    except KeyboardInterrupt:
        print("\n⏹️  사용자 중단")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
    finally:
        client.disconnect()
        print("👋 종료 완료")
