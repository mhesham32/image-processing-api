import { resizeImageFn } from '../api/helpers/resizeImageFn';
import { ASSETS_PATH } from '../Constants';
import { getGeneratedImagePath } from '../api/helpers/getGeneratedImagePath';
import { promises as fs } from 'fs';
import path from 'path';

describe('resizeImageFn', () => {
  afterAll(async () => {
    // delete the generated image
    const generatedImagePath = getGeneratedImagePath({
      width: 100,
      height: 100,
      fileName: 'img-1.jpg',
    });
    await fs.unlink(generatedImagePath);
  });

  it('should throw an error', () => {
    const imagePath = path.join(ASSETS_PATH, 'default', 'test.jpg');
    const width = 100;
    const height = 100;
    expect(
      resizeImageFn({
        imagePath,
        width,
        height,
      })
    ).toThrowError();
  });

  it('should resize an existing Image', async () => {
    const imagePath = path.join(ASSETS_PATH, 'default', 'img-1.jpg');
    const width = 100;
    const height = 100;
    await resizeImageFn({
      imagePath,
      width,
      height,
    });
    const generatedImagePath = getGeneratedImagePath({
      width,
      height,
      fileName: 'img-1.jpg',
    });
    const generatedImage = await fs.readFile(generatedImagePath);
    expect(generatedImage).toBeDefined();
  });
});
