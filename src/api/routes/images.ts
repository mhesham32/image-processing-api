import express from 'express';
import { checkFile, resizeImage } from '../middlewares';
import { promises as fs } from 'fs';
import { getGeneratedImagePath } from '../helpers/getGeneratedImagePath';

// create the images routes
const imagesRouter = express.Router();

imagesRouter.get(
  '/',
  checkFile,
  resizeImage,
  async (req: express.Request, res: express.Response): Promise<void> => {
    let widthQuery: number | '' = '';
    let heightQuery: number | '' = '';
    if (typeof req.query.width === 'string') {
      widthQuery = parseInt(req.query.width);
    }
    if (typeof req.query.height === 'string') {
      heightQuery = parseInt(req.query.height);
    }

    const generatedImagePath = getGeneratedImagePath({
      width: widthQuery,
      height: heightQuery,
      fileName: req.query.filename as string,
    });

    const generatedImage = await fs.readFile(generatedImagePath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.status(201).send(generatedImage);
  }
);

export default imagesRouter;
