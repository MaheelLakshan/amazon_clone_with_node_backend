const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('../middlewares/auth');

//Sign up route
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

//user login route
authRouter.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'user is not registered' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Password is not correct' });
    }

    const token = jwt.sign({ id: user._id }, 'tokenPassword');

    res.json({ token, ...user._doc });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// validate the token
authRouter.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified = jwt.verify(token, 'tokenPassword');
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

//get user data
authRouter.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...User._doc, token: req.token });
});

// authRouter.get('/user', (req, res) => {
//   res.send('sometihing');
// });

module.exports = authRouter;
