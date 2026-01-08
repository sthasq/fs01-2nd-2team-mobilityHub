import time
import busio
import digitalio
import board
import smbus
import RPi.GPIO as GPIO
from threading import Lock

import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn


# 조이스틱을 이용해 서보모터 각도 제어
class JoystickServoController:
    # 초기화
    def __init__(self):
        self.LED_UP = 23 # 조이스틱 상승 LED
        self.LED_DOWN = 21 # 조이스틱 하강 LED
        
        self.running = False          # run() 중복 실행 방지
        self.i2c_lock = Lock()        # I2C 스레드 보호용 락
        
        self.angle_callback = None # 각도 변경 시
        self.last_published_angle = None # 마지막으로 발행한 각도

        # GPIO 설정
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.LED_UP, GPIO.OUT)
        GPIO.setup(self.LED_DOWN, GPIO.OUT)
        GPIO.output(self.LED_UP, False)
        GPIO.output(self.LED_DOWN, False)

        # MCP3008 (SPI) 설정
        spi = busio.SPI(
            clock=board.SCK,
            MISO=board.MISO,
            MOSI=board.MOSI
        )
        # Chip Select 핀
        cs = digitalio.DigitalInOut(board.D8)
        self.mcp = MCP.MCP3008(spi, cs)

        # 조이스틱 Y축 (P1)
        self.joy_y = AnalogIn(self.mcp, MCP.P1)

        # PCA9685 설정 
        self.PCA9685_ADDR = 0x40
        self.MODE1 = 0x00
        self.PRESCALE = 0xFE
        self.LED0_ON_L = 0x06

        self.SERVO_MIN = 150   # 약 0도
        self.SERVO_MAX = 600   # 약 180도

        self.bus = None       # I2C 버스 (run에서 초기화)

        # 서보 초기 각도
        self.angle = 90

    # PCA9685 초기화
    def setup_servo(self):
        self.bus = smbus.SMBus(1)
        self.set_pwm_freq(50)
        self.move_servo(self.angle)

    # PCA9685 주파수 설정
    def set_pwm_freq(self, freq):
        prescale = int(25000000 / (4096 * freq) - 1)

        # 모드 변경 및 프리스케일 설정
        with self.i2c_lock:
            self.bus.write_byte_data(self.PCA9685_ADDR, self.MODE1, 0x10)
            self.bus.write_byte_data(self.PCA9685_ADDR, self.PRESCALE, prescale)
            self.bus.write_byte_data(self.PCA9685_ADDR, self.MODE1, 0x00)

        time.sleep(0.05)

    # 특정 채널에 PWM 신호 설정
    def set_pwm(self, channel, off):
        base = self.LED0_ON_L + 4 * channel

        # PWM 설정
        with self.i2c_lock:
            self.bus.write_byte_data(self.PCA9685_ADDR, base, 0)
            self.bus.write_byte_data(self.PCA9685_ADDR, base + 1, 0)
            self.bus.write_byte_data(self.PCA9685_ADDR, base + 2, off & 0xFF)
            self.bus.write_byte_data(self.PCA9685_ADDR, base + 3, (off >> 8) & 0x0F)

    # 각도를 PWM 값으로 변환
    def angle_to_pwm(self, angle):
        return int(
            self.SERVO_MIN +
            (angle / 180.0) * (self.SERVO_MAX - self.SERVO_MIN)
        )

    # 서보모터를 특정 각도로 이동
    def move_servo(self, angle):
        pwm = self.angle_to_pwm(angle)
        self.set_pwm(0, pwm)
        
    # 각도 변경 감지를 위한 콜백 등록
    def set_angle_callback(self, callback):
        self.angle_callback = callback

    # 조이스틱 처리 
    def update_angle(self, value):
        new_angle = self.angle

        # 조이스틱 값에 따라 각도 변경
        if value > 45000:
            new_angle += 5
            GPIO.output(self.LED_UP, True)
            GPIO.output(self.LED_DOWN, False)

        # 조이스틱 아래로
        elif value < 20000:
            new_angle -= 5
            GPIO.output(self.LED_UP, False)
            GPIO.output(self.LED_DOWN, True)

        # 조이스틱 중앙
        else:
            GPIO.output(self.LED_UP, False)
            GPIO.output(self.LED_DOWN, False)

        # 각도 제한
        new_angle = max(0, min(180, new_angle))

        # 실제로 값이 바뀌었을 때만 반영
        if new_angle != self.angle:
            self.angle = new_angle

            if self.angle_callback:
                self.angle_callback(self.angle)
                
    # 정지
    def stop(self):
        self.running = False
        GPIO.output(self.LED_UP, False)
        GPIO.output(self.LED_DOWN, False)
        GPIO.cleanup()

    # 메인 실행 루프
    def run(self):
        if self.running:
            return  # 중복 실행 방지

        print("조이스틱 > 서보모터 제어 시작")
        self.running = True
        self.setup_servo()

        try:
            while self.running:
                value = self.joy_y.value
                self.update_angle(value)
                self.move_servo(self.angle)

                ##print(f"조이스틱 Y: {value}, 서보 각도: {self.angle}")
                time.sleep(0.05)

        except Exception as e:
            print("서보 제어 오류:", e)

        finally:
            self.stop()