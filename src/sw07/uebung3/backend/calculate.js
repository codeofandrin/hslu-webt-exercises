import express from 'express';
const router = express.Router();

function calculateResistance(r1, r2, wiring) {
  let result
  if (wiring.toLowerCase() === "parallel") {
    result = r1 * r2 / (r1 + r2)
  }
  else if (wiring.toLowerCase() === "serial") {
    result = r1 + r2
  }
  else {
    return alert("'wiring' must be one of ['parallel', 'serial']")
  }

  return result
}

router.all('/', function (req, res) {
  res.type('application/json');

  let error = null;
  const r1 = req.query.r1;
  const r2 = req.query.r2;
  const wiring = req.query.wiring;

  if (!wiring) {
    error = "Parameter 'wiring' must be set"
  } else if (wiring !== "serial" && wiring !== "parallel") {
    error = "Invalid value for paraemter 'wiring'. Must be one of ['serial', 'parallel']"
  }

  if (!r2) {
    error = "Parameter 'r2' must be set"
  } else if (isNaN(Number(r2)) || Number(r2) < 0) {
    error = "Invalid value for paraemter 'r2'"
  }

  if (!r1) {
    error = "Parameter 'r1' must be set"
  } else if (isNaN(Number(r1)) || Number(r1) < 0) {
    error = "Invalid value for paraemter 'r1'"
  }

  if (error) {
    res.status(400);
    res.send(error);
    return;
  }

  let resistance = calculateResistance(Number(r1), Number(r2), wiring);
  let response = { resistance: resistance };

  res.send(JSON.stringify(response));
});

export default router;