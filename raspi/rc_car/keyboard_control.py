# -*- coding: utf-8 -*-
"""
SSH 원격 접속 키보드 제어 RC카
발표 데모용 - 안정적이고 직관적인 제어
"""

import RPi.GPIO as GPIO
from time import sleep
import sys
import tty
import termios

# 모터 상태
STOP = 0
FORWARD = 1
BACKWARD = 2

# 모터 채널
CH1 = 0  # 오른쪽 바퀴
CH2 = 1  # 왼쪽 바퀴

HIGH = 1
LOW = 0

# =========================
# 모터 핀 정의
# =========================
ENA = 12  # 오른쪽 PWM
ENB = 13  # 왼쪽 PWM

IN1 = 25  # 오른쪽 방향1
IN2 = 8   # 오른쪽 방향2
IN3 = 24  # 왼쪽 방향1
IN4 = 23  # 왼쪽 방향2

# =========================
# 속도 설정 (안정적인 값으로 설정)
# =========================
SPEED_FORWARD = 65    # 전진 속도
SPEED_TURN = 60       # 회전 속도
SPEED_SLOW = 40       # 저속 이동

# 전역 PWM 객체 (초기화 전에는 None)
pwmA = None
pwmB = None


def setPinConfig(EN, INA, INB):
    """모터 핀 초기화 및 PWM 설정"""
    GPIO.setup(EN, GPIO.OUT)
    GPIO.setup(INA, GPIO.OUT)
    GPIO.setup(INB, GPIO.OUT)
    
    pwm = GPIO.PWM(EN, 100)
    pwm.start(0)
    return pwm


def setMotorControl(pwm, INA, INB, speed, stat):
    """개별 모터 제어"""
    speed = max(0, min(100, speed))  # 0-100 범위 제한
    pwm.ChangeDutyCycle(speed)
    
    if stat == FORWARD:
        GPIO.output(INA, HIGH)
        GPIO.output(INB, LOW)
    elif stat == BACKWARD:
        GPIO.output(INA, LOW)
        GPIO.output(INB, HIGH)
    elif stat == STOP:
        GPIO.output(INA, LOW)
        GPIO.output(INB, LOW)


def setMotor(ch, speed, stat):
    """채널별 모터 제어"""
    global pwmA, pwmB
    if pwmA is None or pwmB is None:
        # 모터가 초기화되지 않았으면 무시
        return
    if ch == CH1:
        setMotorControl(pwmA, IN1, IN2, speed, stat)
    else:
        setMotorControl(pwmB, IN3, IN4, speed, stat)


# =========================
# 주요 동작 함수
# =========================

def stop():
    """정지"""
    global pwmA, pwmB
    if pwmA is None or pwmB is None:
        # 모터가 초기화되지 않았으면 무시
        return
    setMotor(CH1, 0, STOP)
    setMotor(CH2, 0, STOP)
    print("🛑 정지")


def forward(speed=SPEED_FORWARD):
    """전진"""
    setMotor(CH1, speed, FORWARD)
    setMotor(CH2, speed + 3, FORWARD)  # 좌우 모터 편차 보정
    print("⬆️  전진")


def backward(speed=SPEED_FORWARD):
    """후진"""
    setMotor(CH1, speed, BACKWARD)
    setMotor(CH2, speed + 3, BACKWARD)
    print("⬇️  후진")


def turn_left(speed=SPEED_TURN):
    """좌회전 (제자리)"""
    setMotor(CH1, speed, FORWARD)
    setMotor(CH2, speed, BACKWARD)
    print("⬅️  좌회전")


def turn_right(speed=SPEED_TURN):
    """우회전 (제자리)"""
    setMotor(CH1, speed, BACKWARD)
    setMotor(CH2, speed, FORWARD)
    print("➡️  우회전")


def forward_left(speed=SPEED_FORWARD):
    """전진하면서 좌회전"""
    setMotor(CH1, speed, FORWARD)
    setMotor(CH2, speed * 0.3, FORWARD)
    print("↖️  전진+좌회전")


def forward_right(speed=SPEED_FORWARD):
    """전진하면서 우회전"""
    setMotor(CH1, speed * 0.3, FORWARD)
    setMotor(CH2, speed, FORWARD)
    print("↗️  전진+우회전")


def get_key():
    """키 입력 받기 (non-blocking)"""
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    try:
        tty.setraw(sys.stdin.fileno())
        ch = sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    return ch


def print_help():
    """조작 방법 출력"""
    print("\n" + "="*50)
    print("🚗 RC카 키보드 제어 모드")
    print("="*50)
    print("방향키 (또는 WASD):")
    print("  ↑ / W : 전진")
    print("  ↓ / S : 후진")
    print("  ← / A : 좌회전 (제자리)")
    print("  → / D : 우회전 (제자리)")
    print("")
    print("조합키:")
    print("  Q : 전진+좌회전")
    print("  E : 전진+우회전")
    print("")
    print("기타:")
    print("  SPACE : 정지")
    print("  X     : 종료")
    print("  H     : 도움말")
    print("="*50 + "\n")


# =========================
# 메인 제어 루프
# =========================

if __name__ == "__main__":
    global pwmA, pwmB
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    
    # 모터 초기화
    pwmA = setPinConfig(ENA, IN1, IN2)
    pwmB = setPinConfig(ENB, IN3, IN4)
    
    print_help()
    
    try:
        while True:
            key = get_key()
            
            # 방향키는 3바이트로 들어옴
            if key == '\x1b':  # ESC 시퀀스 시작
                key = get_key()
                if key == '[':
                    key = get_key()
                    if key == 'A':    # 위 화살표
                        forward()
                    elif key == 'B':  # 아래 화살표
                        backward()
                    elif key == 'C':  # 오른쪽 화살표
                        turn_right()
                    elif key == 'D':  # 왼쪽 화살표
                        turn_left()
            
            # 일반 키 입력
            elif key.lower() == 'w':
                forward()
            elif key.lower() == 's':
                backward()
            elif key.lower() == 'a':
                turn_left()
            elif key.lower() == 'd':
                turn_right()
            elif key.lower() == 'q':
                forward_left()
            elif key.lower() == 'e':
                forward_right()
            elif key == ' ':
                stop()
            elif key.lower() == 'x':
                print("\n👋 종료합니다")
                break
            elif key.lower() == 'h':
                print_help()
            
            sleep(0.05)  # 키 입력 간격
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Ctrl+C 감지 - 종료")
    
    finally:
        stop()
        sleep(0.2)
        GPIO.cleanup()
        print("✅ GPIO 정리 완료\n")
