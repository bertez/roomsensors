#!/usr/bin/env python

import os
import numpy as np
import signal
import sys
import datetime
from time import sleep
from sense_hat import SenseHat
from redis import Redis, RedisError


t = False
h = False
p = False

redis = Redis(host='redis', db=0, socket_connect_timeout=2, socket_timeout=2)

# Helpers


def get_cpu_temp():
    res = os.popen("/opt/vc/bin/vcgencmd measure_temp").readline()
    t = float(res.replace("temp=", "").replace("'C\n", ""))
    return t


def smooth(temp):
    if not hasattr(smooth, 'last'):
        smooth.last = [temp] * 5

    smooth.last.insert(0, temp)
    smooth.last = smooth.last[:5]

    return np.mean(smooth.last)


# Main app

def init():
    global sense
    sense = SenseHat()
    sense.low_light = True


def loopScreen():
    global t, h, p

    cT = [227, 76, 65]
    cH = [89, 183, 194]
    cP = [127, 153, 116]

    max_dec = 1

    if t and h and p:
        sense.show_message('{0}C'.format(round(t, max_dec)), text_colour=cT)
        sense.show_message('{0}%rH'.format(round(h, max_dec)), text_colour=cH)
        sense.show_message('{0}mbar'.format(round(p, max_dec)), text_colour=cP)


def loop():
    global t, h, p

    t1 = sense.get_temperature_from_humidity()
    t2 = sense.get_temperature_from_pressure()
    t_read = (t1 + t2) / 2
    t_cpu = get_cpu_temp()

    h = sense.get_humidity()
    p = sense.get_pressure()

    t_corr = t_read - ((t_cpu - t_read) / 1.5)
    t = smooth(t_corr)

    log = [datetime.datetime.now(), t, h, p]

    try:
        redis.lpush('series', ','.join(str(l) for l in log))
        redis.ltrim('series', 0, 525600 - 1)  # a year in minutes
    except RedisError:
        print('Redis not available')

    # loopScreen()
    print(log)

    sleep(60 * 5)


def destroy():
    sense.clear()
    sys.exit(0)

signal.signal(signal.SIGTERM, destroy)

if __name__ == '__main__':
    try:
        init()
        while True:
            loop()
    except KeyboardInterrupt:
        destroy()
