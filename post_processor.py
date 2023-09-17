def grid(obj, cocolabels):
    bounding_boxes = obj['instances'].pred_boxes
    labels = obj['instances'].pred_classes
    
    
    image_width, image_length = obj['instances'].image_size
    
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
        if row_index == 0:
            col_position = "very left"
        elif row_index == 1:
            col_position = "slightly left"
        elif row_index == 2:
            col_position = "center"
        elif row_index == 3:
            col_position = "slightly right"
        elif row_index == 4:
            col_position = "very right"
        else:
            col_position = "somewhere in between"

        row_position = ""
        if col_index == 0:
            row_position = "very top"
        elif col_index == 1:
            row_position = "slightly top"
        elif col_index == 2:
            row_position = "center"
        elif col_index == 3:
            row_position = "slightly bottom"
        elif col_index == num_rows - 1:
            row_position = "very bottom"
        else:
            row_position = "somewhere in between"

        grid_cell = f"({row_position}, {col_position})"
        instructions.append(f"{cocolabels[label]} is in {grid_cell}")
    return instructions