const express = require('express');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'yahoo',
  host: 'mail.yahoo.com',
  port: 465,
  secure: false,
  auth: {
    user: 'bradybridges@yahoo.com',
    pass: 'gooser1235',
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pi Proximity API';
app.use(express.json());
app.use(cors());

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
      
app.get('/', (req, res) => {
  res.send('Welcome to Pi Proximity API!');
});

app.get('/api/v1/logs', (req, res) => {
  database('log').orderBy('created_at')
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json({ err }));
});

app.post('/api/v1/logs/new', (req, res) => {
  if(!req.body['time']) {
    return res.status(422).send('Missing time property. { time: \'12:00pm\' }');
  }
  database('log').insert({ time: req.body.time }, 'id')
    .then((id) => res.status(201).json({ id }))
    .catch((err) => res.status(500).json({ err }));
});

app.delete('/api/v1/logs/:id', (req, res) => {
  const id = req.params.id;
  database('log')
    .where({ id })
    .select()
    .then((data) => {
      if(!data.length) {
        return res.status(205).send({ error: 'No data to delete' });
      }
      database('log')
        .where({ id })
        .del()
        .then(() => res.status(202).json({ message: 'Successful deleted log', id }));
    })
    .catch((err) => res.status(500).json({ err }));
});