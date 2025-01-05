import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Simple test endpoint
app.get('/test', (req, res) => {
  res.send('Hello again from Earthquake Data Case Study!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
