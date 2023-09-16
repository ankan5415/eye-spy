import bentoml
from bentoml.io import Image
from bentoml.io import JSON
import numpy as np
from detectron2.utils.logger import setup_logger
setup_logger()
from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from argparse import Namespace

class MaskRCNNRunnable(bentoml.Runnable):
    SUPPORTED_RESOURCES = ("cpu")
    SUPPORTS_CPU_MULTI_THREADING = True

    def __init__(self):

        cfg = get_cfg()
        cfg.MODEL.DEVICE = 'cpu'

        # add project-specific config (e.g., TensorMask) here if you're not running a model in detectron2's core library
        cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
        cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5  # set threshold for this model
        # Find a model from detectron2's model zoo. You can use the https://dl.fbaipublicfiles... url as well
        cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
        self.predictor = DefaultPredictor(cfg)

    @bentoml.Runnable.method(batchable=False)
    def inference(self, input_img):
        # Return predictions only
        print("===INPUT IMAGE===")
        print(input_img)
        print("===INPUT TYPE===")
        print(type(input_img))
        if isinstance(input_img, np.ndarray):
            print("===SHAPE===")
            print(input_img.shape)
        return {'instances': Namespace(pred_classes=0, pred_boxes=0)}


mask_rcnn_runner = bentoml.Runner(MaskRCNNRunnable, max_batch_size=30)

svc = bentoml.Service("mask_rcnn_demo", runners=[mask_rcnn_runner])

@svc.api(input=Image(), output=JSON())
async def invocation(input_img):
    batch_ret = await mask_rcnn_runner.inference.async_run([input_img])
    return {"Boxes": batch_ret['instances'].pred_classes, "Classes": batch_ret['instances'].pred_boxes}