const express = require('express');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    // port: 3306,
    user: 'laurikyttala',
    password: '',
    database: 'smart-brain'
  }
});

// console.log(db.select('*').from('users').then(data => {
//   console.log(data);
// }));



const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      password: 'secret',
      email: 'john@email.com',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      password: 'secret1',
      email: 'sally@email.com',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@email.com'
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
  res.json('signin');
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db('users').returning('*').insert({
    name: name, email: email, joined: new Date()
  })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id }).then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('not found');
    }
  })
    .catch(err => res.status(400).json('error geting user'));
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
