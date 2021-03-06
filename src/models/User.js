const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next){
  const user = this;
  if (!user.isModified('password')) {
    next();
  }

  bcrypt.genSalt(10,(error,salt) => {
    if (error) {
      next(error);
    }
    
    bcrypt.hash(user.password,salt,(error,hash) => {
      if (error) {
        next(error);
      }
      user.password = hash;
      next();
    })
  });
  
});

userSchema.methods.comparePassword = function(candidatePassword){
  const user = this;
  return new Promise((resolve,reject)=> {
    bcrypt.compare(candidatePassword,this.password,(error,same) => {
      if (error) {
        return reject(error);
      }
      if (!same) {
        return reject(false);
      }
      return resolve(true);
    });
  })
}
mongoose.model('User',userSchema);