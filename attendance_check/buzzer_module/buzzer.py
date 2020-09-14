import RPi.GPIO as GPIO
import time

class BUZZER:
    buzzer_pin = 32

    def __init__(self):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.buzzer_pin, GPIO.OUT)
        self.p = GPIO.PWM(self.buzzer_pin, 100)

    def success(self):
        self.p.ChangeFrequency(500)
        self.p.start(90)
        time.sleep(0.1)

        self.p.ChangeFrequency(300)
        time.sleep(0.1)
        self.p.stop()

    def fail(self):
        self.p.ChangeFrequency(700)
        self.p.start(90)
        time.sleep(0.2)
        self.p.stop()
        self.p.ChangeFrequency(700)
        time.sleep(0.05)
        self.p.start(90)
        time.sleep(0.2)
        self.p.stop()
