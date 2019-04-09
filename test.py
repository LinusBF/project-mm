import time
import cv2
import face_detect

cam = cv2.VideoCapture(0)

while True:
    ret, frame = cam.read()

    if not ret:
        break

    face_detected = face_detect.face_in_frame(frame)
    if(face_detected): print("Face in frame!")

    time.sleep(1)

cam.release()

cv2.destroyAllWindows()
