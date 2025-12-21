const r = require('express').Router();
const { Grocery } = require('../models');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

function auth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({error:'missing_authorization'});
  const token = h.split(' ')[1];
  try{
    jwt.verify(token, JWT_SECRET);
    next();
  }catch(e){ return res.status(401).json({error:'invalid_token'}); }
}

r.use(auth);

r.get('/', async (req,res)=> res.json( await Grocery.findAll() ));
r.get('/:id', async (req,res)=>{ const g=await Grocery.findByPk(req.params.id); if(!g) return res.sendStatus(404); res.json(g); });
r.post('/', async (req,res)=> res.status(201).json( await Grocery.create(req.body) ));
r.put('/:id', async (req,res)=>{ const g = await Grocery.findByPk(req.params.id); if(!g) return res.sendStatus(404); await g.update(req.body); res.json(g); });
r.delete('/:id', async (req,res)=>{ const g=await Grocery.findByPk(req.params.id); if(!g) return res.sendStatus(404); await g.destroy(); res.sendStatus(204); });

module.exports = r;
