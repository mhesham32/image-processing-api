# Image Processing Api

udacity project for node.js with typescript

prerequisites:

- node.js
- yarn (for installing dependencies)

# Install dependencies

you can install dependencies with yarn:
`yarn`

# how to run the app

you can run the app with `yarn start`
if you want to run on dev mode: `yarn dev`

# how to test the app

you can test the app with `yarn test`

# linting the code

you can lint the code with `yarn lint` this will also format the code with prettier

# using the app in the browser

you can run the app in the browser with `yarn start` then open the browser and go to http://localhost:3000/api/images

after that you can add parameters to the url to process the images with the following parameters:

- filename: the name of the image file(must be one of the images in the assets/default folder).

- width(number): the width of the image (optional).

- height(number): the height of the image (optional).

you should add atleast one diemension to the url. and for the missing diemension the image will be resized to the default size.
