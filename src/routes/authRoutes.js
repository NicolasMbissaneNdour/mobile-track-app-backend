const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req,res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id },'MY_SECRET_KEY');
    res.send({token});
  } catch (error) {
    return res.status(403).send({
      code: 403,
      message: error.message
    });    
  }
  
});


router.post('/signin', async (req,res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).send({ code: -1, message: "Email and password don't match" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ code: -1,message: "Email and password don't match!" });
    }
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id },'MY_SECRET_KEY');
    return res.status(200).send({ token });
    
  } catch (error) {
    return res.status(404).send({ code: -1, message: "Email and password don't match!" });
  }
  
})

module.exports = router;