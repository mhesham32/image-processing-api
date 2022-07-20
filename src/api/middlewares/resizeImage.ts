import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { ASSETS_PATH } from '../../Constants';
import { getGeneratedImagePath } from '../helpers/getGeneratedImagePath';
import { resizeImageFn } from '../helpers/resizeImageFn';

export async function resizeImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fileName = (req.query.filename as string) + '.jpg';
  const filePath = path.join(ASSETS_PATH, 'default', fileName);
  let widthQuery: number | '' = '';
  let heightQuery: number | '' = '';
  if (typeof req.query.width === 'string') {
    widthQuery = parseInt(req.query.width);
  }
  if (typeof req.query.height === 'string') {
    heightQuery = parseInt(req.query.height);
  }

  // if now width and height are provided, tell the user to provide one
  if (!widthQuery && !heightQuery) {
    return res
      .status(400)
      .send(
        'Please provide a width and/or height by adding &width= and/or &height='
      );
  }

  const generatedFilePath = getGeneratedImagePath({
    width: widthQuery,
    height: heightQuery,
    fileName,
  });

  // if generated file exists, use it
  if (fs.existsSync(generatedFilePath)) {
    console.log('using generated file');
    return next();
  }

  // check if file exists
  if (fs.existsSync(filePath)) {
    try {
      await resizeImageFn({
        imagePath: filePath,
        width: widthQuery,
        height: heightQuery,
      });
      next();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(404).send('No file Found!');
  }
}
