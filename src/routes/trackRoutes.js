require('../models/Track');
const mongoose = require('mongoose');
const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);

router.get('/tracks',async (req,res) => {
  const tracks = await Track.find({ userId: req.user._id });
  res.send({tracks});
});

router.post('/tracks', async (req,res) => {
  const { name, locations } = req.body;
  if (!name || !locations) {
    return res.status(422).send({ code: -1, message: 'You must provide name and locations!' });
  }
  const track = new Track({ userId: req.user._id ,name, locations });

  try {
    await track.save();
    const tracks = await Track.find({userId: req.user._id});
    return res.status(201).send({ tracks });
  } catch (error) {
    return res.status(400).send(error);
  }
})

module.exports = router;