import express from 'express';
import { checkFile, resizeImage } from '../middlewares';
import { promises as fs } from 'fs';
import path from 'path';
import { ASSETS_PATH } from '../../Constants';

// create the images routes
const imagesRouter = express.Router();

imagesRouter.get('/', checkFile, resizeImage, async (req, res) => {
  let widthQuery: number | '' = '';
  let heightQuery: number | '' = '';
  if (typeof req.query.width === 'string') {
    widthQuery = parseInt(req.query.width);
  }
  if (typeof req.query.height === 'string') {
    heightQuery = parseInt(req.query.height);
  }

  const generatedFileName = `${req.query.filename as string}${
    widthQuery ? '_W' + widthQuery.toString() : ''
  }${heightQuery ? '_H' + heightQuery.toString() : ''}.jpg`;

  const generatedImagePath = path.join(
    ASSETS_PATH,
    'generated',
    generatedFileName
  );
  const generatedImage = await fs.readFile(generatedImagePath);
  res.setHeader('Content-Type', 'image/jpeg');
  res.status(201).send(generatedImage);
});

export default imagesRouter;
