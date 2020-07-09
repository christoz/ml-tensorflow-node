import Router from 'koa-router';
import classification from './classification';

const router = Router();

router.use('/api/classification', classification.routes(), classification.allowedMethods());

export default router;
