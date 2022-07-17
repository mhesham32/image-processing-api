import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { ASSETS_PATH } from '../../Constants';
import { getGeneratedImagePath } from '../helpers/getGeneratedImagePath';

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

  const generatedFilePath = getGeneratedImagePath(
    widthQuery,
    heightQuery,
    fileName
  );

  // if generated file exists, use it
  if (fs.existsSync(generatedFilePath)) {
    console.log('using generated file');
    return next();
  }

  // check if file exists
  if (fs.existsSync(filePath)) {
    console.log('resizing image');
    // get the image size
    const image = sharp(filePath);
    let width: number;
    let height: number;
    const metadata = await image.metadata();
    width = metadata.width as number;
    height = metadata.height as number;
    // check the width and height from the request
    if (widthQuery) {
      width = widthQuery;
    }
    if (heightQuery) {
      height = heightQuery;
    }
    // resize image
    const buff = await sharp(filePath).resize(width, height).toBuffer();

    // save the image
    fs.writeFile(generatedFilePath, buff, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error while saving the image');
      }
      next();
    });
  } else {
    res.status(404).send('No file Found!');
  }
}
