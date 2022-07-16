import { Router } from 'express';
import imagesRouter from './routes/images';

const router = Router();

router.use('/images', imagesRouter);

export default router;
