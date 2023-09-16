import requests
import numpy as np
import cv2
from http.server import HTTPServer, BaseHTTPRequestHandler
import json


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        # Your logic for handling the image and predicting.
        # For now, it just sends back a mock bounding box and label.
        # You'd typically integrate with BentoML or another ML library here.
        # Mock data
        
        
        bounding_boxes = post_data['Boxes']
        labels = post_data['Classes']
        
        
        image_width = post_data['image_width']
        center = (bounding_boxes[1] + bounding_boxes[3]) / 2
        threshold = image_width / 2
        
        instructions = []
        
        if center < threshold:
            instructions.append(f'{labels} is on your left')
        elif center > threshold:
            instructions.append(f'{labels} is on your right')
        else:
            instructions.append(f'{labels} is in the center')
        
        
        
        self.send_response(200)
        # self.send_header('Content-Type', 'application/json')
        # self.end_headers()
        #self.wfile.write(json.dumps(data).encode())
        
        
        
        
        
        
if __name__ == "__main__":
    httpd = HTTPServer(('localhost', 5000), SimpleHTTPRequestHandler)
    httpd.serve_forever()

