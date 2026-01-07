import RPi.GPIO as gpio
import time

class Parking_LED:
    def __init__(self, myval):
        value = myval.split(":")
        
        if value[1] == 5 or value[1] == 21:
            self.led_pin = 6
        elif value[1] == 7 or value[1] == 22:
            self.led_pin =23
        elif value[1] == 9 or value[1] == 23:
            self.led_pin = 27
            
        gpio.setmode(gpio.BCM)
        gpio.setup(self.led_pin, gpio.OUT)
        
    def led_on(self):
        gpio.output(self.led_pin, gpio.HIGH)
        
    def led_off(self):
        gpio.output(self.led_pin, gpio.LOW)
        