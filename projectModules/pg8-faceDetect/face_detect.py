import sys
import time
import cv2
import numpy as np
import cv2


face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

def face_in_frame():
    cam = cv2.VideoCapture(0)
    ret, img = cam.read()
    cam.release()

    if not ret:
        break

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if len(faces) < 1: return False

    for (x,y,w,h) in faces:
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)

    cv2.imwrite('last_face.png', img)
    return True


if face_in_frame():
    print("True")
else:
    print("False")

sys.stdout.flush()
