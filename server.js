const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@email.com',
      password: 'secret',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@email.com',
      password: 'secret1',
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
  bcrypt.compare("secret", '$2a$10$orAZq29t43vrHNaDl.mve.TH0dp3L0W0IJCtJ7HLPPQ3KPXt0uxeC', function (err, res) {
    console.log('first guess', res)
  });
  bcrypt.compare("secret2", '$2a$10$orAZq29t43vrHNaDl.mve.TH0dp3L0W0IJCtJ7HLPPQ3KPXt0uxeC', function (err, res) {
    console.log('second guess', res)
  });
  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
    res.json('success');
  } else {
    res.status(400).json("error happened");
  }
  res.json('signin');
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  // bcrypt.hash(password, null, null, function (err, hash) {
  //   console.log(hash);
  // });

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('not found')
  }
})

app.post('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('not found')
  }
})


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
