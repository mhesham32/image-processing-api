import express from 'express';
import router from './api';

const app = express();
const port = 3000;

app.use('/api', router);
app.listen(port, () =>
  console.log(`Image Resize app listening on port ${port}!`)
);

export default app;
