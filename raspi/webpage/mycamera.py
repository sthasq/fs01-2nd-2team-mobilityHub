import threading 
import time 
from picamera2 import Picamera2
import io
import base64 # 바이너리데이터를 텍스트문자열로 바꿔주는 역할
              # 이진데이터를 웹에서 깨지지 않고 볼 수 있도록 포장 - 바이너리데이터는 웹에서 이미지로
              #                                              볼 수 없다.

class MyCamera:
    frame = None 
    thread = None 
    # 외부에서 frame을 요청하기 위해서 호출되는 메소드
    # => 스레드로 스트리밍되는 frame을 외부로 보내는 역할
    def getStreaming(self):
        # 호출될때마다 쓰레드객체를 생성하지 않고 처음에 한 번만 쓰레드를 만들기 위한 작업
        if MyCamera.thread is None:
            MyCamera.thread = threading.Thread(target=self.streaming)
            MyCamera.thread.start() 
            
            #frame에 이미지가 저장되지 않으면 다음으로 넘어갈 수 없도록 작업() 
            #스레드를 start하면 바로 실행이 되는데 사진이 안 찍힌 상태에서 (카메라 초기화 작업) 리턴되는 것을
            #막기 위해서 작업
            
            while MyCamera.frame is None:
                time.sleep(0.01) # 프레임이 None상태면 넘어가지 못하도록 딜레이 
                
        return MyCamera.frame
    
    # 스레드에서 실행될 메소드
    # static 메소드개념 매개변수로 클래스자신의 정보를 받는다. cls로 받는다.
    @classmethod 
    def streaming(cls):
        #print("start....")
        # 1. 카메라셋팅하고 촬영 
        device = Picamera2() 
        
        # 빠르게 연속으로 이미지를 만들어내야 하기 때문에 카메라를 매번 초기화시키지 않고
        # 이미 워밍업이 되어 있는 상태에서 작업을 하기 위해 create_video_configuration으로 작업
        # 센서를 켜놓고 카메라로 촬영하기 위해서 필요한 값들을 유지시켜놓고 작업하기 위해
        config = device.create_video_configuration(main={"format":"RGB888", "size":(320, 240)})
        
        device.configure(config)
        
        device.start()
        
        # 상하좌우를 반전시킬 수 있도록 작업 - start 이후설정
        device.hflip = True 
        device.vflip = True 
        
        time.sleep(1)
        
        # 메모리에 임시공간을 만들고 프레임을 저장하고 작업 초당 20장씩 쓰고 읽고를 SD카드에서 작업하면 느리다.
        stream = io.BytesIO()
        # 2. 지속적으로 카메라로 촬영된 사진을 변환하기 
        #    카메라 촬영하는 장면을 한 프레임씩 캡쳐해서 jpeg로 압축하고 메모리공간의 임시저장소에 저장
        #    1초에 20프레임을 만들어낼 수 있도록 작업 
        try:
            while True:    
                # 사진을 찍어서 임시공간에 저장
                device.capture_file(stream, format="jpeg")
                # 메모리에 만들어 놓은 임시공간이 스트림에서 데이터 읽어서 frame에 저장
                # 스트림의 끝에 포커스가 맞춰져 있기 때문에 그 위치 부터 데이터를 읽으면 저장된
                # 데이터가 없으므로 포커스를 맨 앞으로 이동시켜서 데이터를 읽어야 한다.
                stream.seek(0)
                raw_data = stream.read()
                # 이미지를 변환 - 바이너리데이터를 네트워크로 전송하기 위해서 Base64인코딩한다. 
                base64_bytes = base64.b64encode(raw_data)
                cls.frame = base64_bytes.decode("utf-8")
                
                # 스트림초기화(다음촬영을 위해서- 스트림의 모든 데이터 지우기)
                stream.seek(0)
                stream.truncate()
                time.sleep(0.05)
        except Exception as e:
            #print(f"카메라 스트리밍오류..{e}")
            device.stop()