const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../user')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected')

  const user = []
  user.push(new User({
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  }))
  user.push(new User({
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }))

  user.forEach((newUser) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return console.log(err)
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return console.log(err)
        newUser.password = hash
        newUser.save((err) => {
          if (err) console.log(err)
        })
      })
    })
  })

  console.log('done')
})