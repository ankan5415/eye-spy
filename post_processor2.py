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
        image_length = post_data['image_length']
        
        num_rows = 5
        num_cols = 5

        # Calculate the width and height of each grid cell
        cell_width = image_width / num_cols
        cell_height = image_length / num_rows

        # Initialize a list to store instructions
        instructions = []
        for bbox, label in zip(bounding_boxes, labels):
            # Calculate the center of the bounding box
            bbox_center_x = (bbox[1] + bbox[3]) / 2
            bbox_center_y = (bbox[0] + bbox[2]) / 2

            # Calculate the row and column indices of the grid cell
            col_index = int(bbox_center_x // cell_width)
            row_index = int(bbox_center_y // cell_height)

            # Determine the grid cell and add instructions
            col_position = ""
            if col_index == 0:
                col_position = "very left"
            elif col_index == 1:
                col_position = "slightly left"
            elif col_index == 2:
                col_position = "center"
            elif col_index == 3:
                col_position = "slightly right"
            elif col_index == 4:
                col_position = "very right"
            else:
                col_position = "somewhere in between"

            row_position = ""
            if row_index == 0:
                row_position = "very top"
            elif row_index == 1:
                row_position = "slightly top"
            elif row_index == 2:
                row_position = "center"
            elif row_index == 3:
                row_position = "slightly bottom"
            elif row_index == num_rows - 1:
                row_position = "very bottom"
            else:
                row_position = "somewhere in between"

            grid_cell = f"Row {row_index}, Column {col_index} ({row_position}, {col_position})"
            instructions.append(f"{label} is in {grid_cell}")
        
        
        
        self.send_response(200)
        # self.send_header('Content-Type', 'application/json')
        # self.end_headers()
        #self.wfile.write(json.dumps(data).encode())
        
        
        
        
        
        
if __name__ == "__main__":
    httpd = HTTPServer(('localhost', 5000), SimpleHTTPRequestHandler)
    httpd.serve_forever()

