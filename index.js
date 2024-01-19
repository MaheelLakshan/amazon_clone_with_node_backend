const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.js');

const PORT = 8080;
const app = express();
const DB = 'mongodb+srv://maheellakshan:maheellakshan@cluster0.etwxzch.mongodb.net/?retryWrites=true&w=majority';

app.use(express.json());
app.use(authRouter);

// app.get('/hello', (request, response) => {
//   response.send('hello');
// });

mongoose
  .connect(DB)
  .then(() => {
    console.log('Connected Successfully');
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Connected at port ${PORT}`);
});
