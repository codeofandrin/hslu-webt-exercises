import express from 'express';
const router = express.Router();

const attractionList = [
  { id: 1000, name: 'Freiburger Münster', },
  { id: 1001, name: 'Kunsthaus Zürich', },
  { id: 1002, name: 'Schloss Rapperswil', }
];

const attractions = {
  1000: {
    id: 1000,
    name: 'Freiburger Münster',
    text: 'Jeden Besucher Freiburgs zieht es sofort zum Münster, sobald er über den Dächern der Altstadt die durchbrochene Pyramide des schlanken Turms erblickt',
    imageUrl: 'img/freiburg.jpg'
  },
  1001: {
    id: 1001,
    name: 'Kunsthaus Zürich',
    text: 'Stetig wechselnde Ausstellungen mit hochqualitativen Meisterwerken aus aller Welt. Jedes Jahr mit vielen Grossereignissen wie die aufregende und kontroverse Cindy Sherman-Ausstellung',
    imageUrl: 'img/zuerich.jpg'
  },
  1002: {
    id: 1002,
    name: 'Schloss Rapperswil',
    text: 'Es ist ein besonderer Ort, an dem man die hektische Welt ausserhalb der dicken Schlossmauern schnell vergisst. Konzerte geniessen, frischer Kaffeeduft, ...',
    imageUrl: 'img/rapperswil.jpg'
  }
};

router.get("/", (req, res) => {
  res.type("application/json")
  res.send(JSON.stringify(attractionList))
})

router.get("/:id", (req, res) => {
  res.type("application/json")

  const id = req.params.id

  let error = null;
  if (isNaN(id)) {
    error = { error: ":id must be a number" }
  } else if (!(id >= 1000 && id <= 1002)) {
    error = { error: ":id must be a between 1000 and 1002" }
  }

  if (error) {
    res.status(404);
    res.send(error);
    return;
  }

  res.send(JSON.stringify(attractions[id]))
})

export default router;