import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {
  res.type('text/html');
  const name = req.query.name;
  if (!name) {
    res.status(400)
    res.send("Hallo unbekannte Person")
    return
  }

  res.send(`Hallo ${name}!`);
});

export default router;
