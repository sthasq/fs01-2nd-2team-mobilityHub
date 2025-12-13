import paho.mqtt.client as client 
import RPi.GPIO as gpio 
from threading import Thread 
# from sensor import DHTSensor
# from led import LED 
from mycamera import MyCamera
import paho.mqtt.publish as publisher
# from rgb_led import RGB


class MqttWorker:
    # 생성자에서 mqtt통신할 수 있는 객체생성, 필요한 다양한 객체생성, 콜백함수등록
    def __init__(self):
        self.client = client.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        #self.led_pins = [13, 23]
        # self.led = LED(13)
        
        # self.rgb_pins = [20, 21, 16]
        # self.rgb_pins = [RGB(pin) for pin in self.rgb_pins]
       # self.leds = [LED(pin) for pin in self.led_pins]
        # self.dht11 = DHTSensor(self.client)
        
        # self.dht11.start()   # 스레드 실행
        self.camera = MyCamera() 
        # 스트리밍의 상태를 제어하기 위해서 변수 
        self.is_streaming = False 
        
        
    # broker 연결 후 실행될 콜백 - rc가 0이면 성공접속, 1이면 실패
    # def on_connect(self, client, userdata, flags, rc):
    def on_connect(self, client,userdata, flags,rc):
        print("connect...:::"+str(rc))
        if rc==0:    # 연결성공 -> 구독신청
            client.subscribe("parking/#")    # 구독신청 - 우리집 장비의 데이터만 받기 위해서, 라즈베리파이와 사용자의 요청을 구분하기 위해서
        else:
            print("연결실패")
            
            
    # 메시지가 수신되면 자동으로 호출되는 메소드
    def on_message(self, client, userdata, message):
        myval = message.payload.decode("utf-8")

        if message.topic == "parking/web/carwash/cam" and myval == "start":
            print(message.topic, myval)
            if not self.is_streaming:
                self.is_streaming = True
                Thread(target=self.send_camera_frame, daemon=True).start()

        elif message.topic == "parking/web/carwash/cam" and myval == "stop":
            print(message.topic, myval)
            self.is_streaming = False
            
            
            
    # 프레임을 지속적으로 publish하는 코드를 스레드로 실행
    def send_camera_frame(self):
        while self.is_streaming:
            try:
                frame = self.camera.getStreaming()
                publisher.single("parking/web/carwash/cam", frame, hostname="192.168.14.38")
                
                
            except Exception as e:
                #print("영상 전송 중 에러: ", e)
                self.is_streaming = False 
                break

            
    # mqtt서버연결을 하는 메소드 - 사용자정의
    def mymqtt_connect(self):
        try:
            print("브로커 연결 시작하기")
            self.client.connect("192.168.14.38", 1883, 60)
            
            # 내부적으로 paho-mqtt는 이벤트기반
            # mqtt통신을 유지하기 위해서 지속적으로 broker와 연결을 테스트(ping교환), 수신메시지를 읽기,
            # 연결이 끊어지면 재연결...................
            # 이 모든 작업이 처리되면 별도의 실행흐름로 쓰레드에서 이런 일들이 지속되도록 loop_forever를 
            # 쓰레드로 작업할 수 있도록 지정
            # loop_forever가 계속 통신을 유지해야 메시지가 도착하면 콜백으로 등록한 on_message가 호출
            # 지속적으로 통신을 유지하는 처리를 해야 하므로 쓰레드로 작업
            mymqtt_obj = Thread(target=self.client.loop_forever)
            mymqtt_obj.start()
        except KeyboardInterrupt:
            pass 
        finally:
            print("종료")