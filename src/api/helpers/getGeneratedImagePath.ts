import path from 'path';
import { ASSETS_PATH } from '../../Constants';

export function getGeneratedImagePath(
  width: number | '',
  height: number | '',
  fileName: string
) {
  const generatedFileName = `${fileName.replace('.jpg', '')}${
    width ? '_W' + width.toString() : ''
  }${height ? '_H' + height.toString() : ''}.jpg`;
  const generatedFilePath = path.join(
    ASSETS_PATH,
    'generated',
    generatedFileName
  );
  return generatedFilePath;
}
