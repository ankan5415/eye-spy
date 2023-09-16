from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor


model = model_zoo.get_model("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
predictor = DefaultPredictor(model)

# im = cv2.imread("input.jpg")  # Load your input image
# outputs = predictor(im)


