const express = require('express');
const User = require('../models/user');

const authRouter = express.Router();
const bcryptjs = require('bcryptjs');

authRouter.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(400).json({ msg: 'User with same email address is existed' });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      name,
      email,
      password: hashedPassword,
    });

    user = await user.save();

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// authRouter.get('/user', (req, res) => {
//   res.send('sometihing');
// });

module.exports = authRouter;
