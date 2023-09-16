import bentoml
from bentoml.io import Image
from bentoml.io import PandasDataFrame
import torch
from torchvision.models.detection import MaskRCNN_ResNet50_FPN_V2_Weights, maskrcnn_resnet50_fpn_v2

class MaskRCNNRunnable(bentoml.Runnable):
    SUPPORTED_RESOURCES = ("nvidia.com/gpu", "cpu")
    SUPPORTS_CPU_MULTI_THREADING = True

    def __init__(self):

        self.model = maskrcnn_resnet50_fpn_v2(weights=MaskRCNN_ResNet50_FPN_V2_Weights.DEFAULT)
        self.model.eval()

        if torch.cuda.is_available():
            self.model.cuda()
        else:
            self.model.cpu()

    @bentoml.Runnable.method(batchable=False)
    def inference(self, input_img):
        # Return predictions only
        
        return self.model(input_img)


mask_rcnn_runner = bentoml.Runner(MaskRCNNRunnable, max_batch_size=30)

svc = bentoml.Service("mask_rcnn_demo", runners=[mask_rcnn_runner])


@svc.api(input=Image(), output=PandasDataFrame())
async def invocation(input_img):
    batch_ret = await mask_rcnn_runner.inference.async_run([input_img])
    return batch_ret[0]