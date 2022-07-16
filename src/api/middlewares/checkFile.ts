import express from 'express';
import fs from 'fs';
import path from 'path';
import { ASSETS_PATH } from '../../Constants';

export function checkFile(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (typeof req.query.filename === 'string') {
    // all files on the defualt folder has the extension .jpg
    const fileName = req.query.filename + '.jpg';
    const filePath = path.join(ASSETS_PATH, 'default', fileName);

    // check if file exists
    if (fs.existsSync(filePath)) {
      next();
    } else {
      res.status(404).send('file not found!');
    }
  } else {
    // if no filename is provided, tell the user to provide one
    res
      .status(400)
      .send(
        `Invalid filename please provide a filename like: ?filename=FILE_NAME. you can find a list of files in the assets/default folder`
      );
  }
}
