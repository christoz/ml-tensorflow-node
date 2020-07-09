import Router from 'koa-router';

import classification from './classification';
import downloadModel from './download';
import uploadFile from '../../middleware/uploadFile';
import extractData from './extractData';

const router = Router();

router.get('/classify', classification);
router.get('/download', downloadModel);
router.post('/upload', uploadFile, extractData);

export default router;
