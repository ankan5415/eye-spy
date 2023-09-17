import bentoml
from bentoml.io import Text
from detectron2.utils.logger import setup_logger
setup_logger()
from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from argparse import Namespace
import base64
from imageio import imread
import io
from post_processor import grid
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog

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
        self.cfg = cfg


    @bentoml.Runnable.method(batchable=False)
    def inference(self, input_img):
        b64str = input_img[0][23:]
        img = base64.b64decode(b64str)
        img = imread(io.BytesIO(img))
        v = Visualizer(img[:,:,::-1], MetadataCatalog.get(self.cfg.DATASETS.TRAIN[0]), scale=1.2)
        
        return ". ".join(grid(self.predictor(img), v.metadata.get("thing_classes", None)))


mask_rcnn_runner = bentoml.Runner(MaskRCNNRunnable, max_batch_size=30)

svc = bentoml.Service("mask_rcnn_demo", runners=[mask_rcnn_runner])

@svc.api(input=Text(), output=Text())
async def invocation(input_img):
    strobj = await mask_rcnn_runner.inference.async_run([input_img])
    return strobj