import smbus
import time

class PCA9685:
    # 레지스터 주소
    MODE1 = 0x00
    PRESCALE = 0xFE
    LED0_ON_L = 0x06
    LED0_ON_H = 0x07
    LED0_OFF_L = 0x08
    LED0_OFF_H = 0x09
    
    # 서보 펄스 값 상수
    MIN_PULSE = 150      # 0도 (1ms)
    CENTER_PULSE = 375   # 90도 (1.5ms)
    MAX_PULSE = 600      # 180도 (2ms)
    
    def __init__(self, bus=1, address=0x40):
        self.bus = smbus.SMBus(bus)
        self.address = address
        self.init()
    
    def init(self):
        """PCA9685 초기화"""
        # MODE1 초기화 (SLEEP 비트 설정)
        self.bus.write_byte_data(self.address, self.MODE1, 0x10)
        time.sleep(0.01)
        
        # 주파수 설정 (50Hz for servo)
        self.set_frequency(50)
        
        # MODE1 재설정 (SLEEP 비트 해제)
        self.bus.write_byte_data(self.address, self.MODE1, 0x00)
        time.sleep(0.1)
    
    def set_frequency(self, freq):
        """주파수 설정"""
        prescale_value = int(25000000 / (4096 * freq) - 1)
        print(f"Prescale 값: {prescale_value}")
        self.bus.write_byte_data(self.address, self.PRESCALE, prescale_value)
    
    def set_pwm(self, channel, pulse):
        """채널에 PWM 설정"""
        on_time = 0
        off_time = pulse
        
        on_l = self.LED0_ON_L + 4 * channel
        on_h = self.LED0_ON_H + 4 * channel
        off_l = self.LED0_OFF_L + 4 * channel
        off_h = self.LED0_OFF_H + 4 * channel
        
        self.bus.write_byte_data(self.address, on_l, on_time & 0xFF)
        self.bus.write_byte_data(self.address, on_h, (on_time >> 8) & 0xFF)
        self.bus.write_byte_data(self.address, off_l, off_time & 0xFF)
        self.bus.write_byte_data(self.address, off_h, (off_time >> 8) & 0xFF)
        
        print(f"채널 {channel}: PWM 값 {pulse} 설정 완료")
    
    def lift_up(self, channel=0, speed=0.05):
        
        self.set_pwm(channel, self.MIN_PULSE)
        time.sleep(1)
        
        # 점진적 이동 (0도 → 180도)
        step = 10
        for pulse in range(self.MIN_PULSE, self.MAX_PULSE + 1, step):
            self.set_pwm(channel, pulse)
            print("리프트 상승중.....")
            time.sleep(speed)
        
        # 최종 위치 (180도)
        self.set_pwm(channel, self.MAX_PULSE)
        print("리프트 최대높이 도달")
    
    def lift_down(self, channel=0, speed=0.05):
        step = 10
        for pulse in range(self.MAX_PULSE, self.MIN_PULSE - 1, -step):
            self.set_pwm(channel, pulse)
            print("리프트 하강중.....")
            time.sleep(speed)
        
        # 최종 위치 (0도)
        self.set_pwm(channel, self.MIN_PULSE)
        print("리프트 하강완료")
    
