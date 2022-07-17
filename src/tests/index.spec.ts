/* disable-eslint */
import supertest from "supertest";
import app from "../index";
import { getGeneratedImagePath } from "../api/helpers/getGeneratedImagePath";
import fs, { promises as fsPromises } from "fs";

const request = supertest(app);
const generatedImages: string[] = [];

describe("Testing the app functionality", () => {
  afterAll(async () => {
    // delete all generated images
    await Promise.all(
      generatedImages.map(async (image) => {
        await fsPromises.unlink(image);
      })
    );
  });

  // got error when using the done function, it says that it is recommended to not use it
  it("should start the app with no parameters", async () => {
    const response = await request.get("/api/images");
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      `Invalid filename please provide a filename like: ?filename=FILE_NAME. you can find a list of files in the assets/default folder`
    );
  });

  it("should ask the user to enter the width and height if only filename was added", async () => {
    const response = await request.get("/api/images?filename=img-1");
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      `Please provide a width and/or height by adding &width= and/or &height=`
    );
  });

  it("should ask for width and height is they were provided with 0", async () => {
    const response = await request.get(
      "/api/images?filename=img-1&width=0&height=0"
    );
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      `Please provide a width and/or height by adding &width= and/or &height=`
    );
  });

  it("should give not found if a non existing filename was provided", async () => {
    const response = await request.get(
      "/api/images?filename=non-existing&width=100&height=100"
    );
    expect(response.status).toBe(404);
    expect(response.text).toBe(`file not found!`);
  });

  it("should resize the image", async () => {
    const response = await request.get(
      "/api/images?filename=img-1&width=100&height=100"
    );
    expect(response.status).toBe(201);
    const generatedFilePath = getGeneratedImagePath(100, 100, "img-1.jpg");
    generatedImages.push(generatedFilePath);
    // check if the generated file exists
    expect(fs.existsSync(generatedFilePath)).toBe(true);
  });

  it("should resize the image even if one diemension was provided", async () => {
    const response = await request.get("/api/images?filename=img-1&width=100");
    expect(response.status).toBe(201);
    const generatedFilePath = getGeneratedImagePath(100, 0, "img-1.jpg");
    generatedImages.push(generatedFilePath);
    // check if the generated file exists
    expect(fs.existsSync(generatedFilePath)).toBe(true);
  });
});
