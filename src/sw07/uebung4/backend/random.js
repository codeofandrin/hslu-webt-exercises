import express from 'express';
const router = express.Router();

router.all('/', function (req, res) {
  res.type('application/json');

  let random = Math.random() * 100;
  let color = "red"
  if (random < 50) {
    color = "green"
  }

  res.send(JSON.stringify({ number: random, color }))
});

export default router;