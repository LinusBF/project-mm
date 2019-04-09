import sys
from os import path
import time
import cv2
import numpy as np

def face_in_frame():
    file_dir = path.dirname(path.abspath(__file__))
    face_cascade = cv2.CascadeClassifier(file_dir + '/face_data.xml')
    faces = []
    cam = cv2.VideoCapture(0)
    
    ret, img = cam.read()
    cam.release()
    if not ret:
        return "ERROR!!!"

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    if(len(faces) < 1):
        return False

    for (x,y,w,h) in faces:
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)

    cv2.imwrite(file_dir + '/last_face.png', img)
    return True

