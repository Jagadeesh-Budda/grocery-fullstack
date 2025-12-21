const r = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

r.post('/register', async (req,res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const u = await User.create({ username, password: hash });
    res.status(201).json({ id: u.id, username: u.username });
  } catch (e) {
    res.status(400).json({ error: 'username_taken' });
  }
});

r.post('/login', async (req,res) => {
  const { username, password } = req.body;
  const u = await User.findOne({ where: { username } });
  if(!u) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = await bcrypt.compare(password, u.password);
  if(!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = jwt.sign({ sub: u.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = r;
