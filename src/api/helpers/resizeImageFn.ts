import sharp from 'sharp';
import { promises as fs } from 'fs';
import { getGeneratedImagePath } from './getGeneratedImagePath';
import { ASSETS_PATH } from '../../Constants';

type parameters = {
  imagePath: string;
  width: number | '';
  height: number | '';
};

export const resizeImageFn = async ({
  imagePath,
  width: widthQuery = 0,
  height: heightQuery = 0,
}: parameters): Promise<void> => {
  if (!imagePath.includes('default')) {
    throw new Error('Image path must be in the default folder');
  }

  // get the image size
  const image = sharp(imagePath);
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
  const buff = await sharp(imagePath).resize(width, height).toBuffer();
  // extract the file name from the image path considering the different folders structure
  let fileName: string;
  if (imagePath.split('/').length > 1) {
    fileName = imagePath.split('/').pop() as string;
  } else {
    fileName = imagePath.split('\\').pop() as string;
  }

  // save the image
  const generatedImagePath = getGeneratedImagePath({
    width: widthQuery,
    height: heightQuery,
    // get the file name from the image path
    fileName,
  });
  // if the generated directory doesn't exist, create it 👇
  await fs.mkdir(ASSETS_PATH + '/generated/', {
    recursive: true,
  });
  // then save the image
  await fs.writeFile(generatedImagePath, buff);
};
