
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  profile: {
    type: String,
    default: 'http://res.cloudinary.com/hossam99/image/upload/v1590711432/ayt1a5vvmcscteltalbr.webp'
  },
  type: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shops',

  },
});


// this function fired automatically when user signup pefore user's save to encrypt password
userSchema.pre('save', async function (next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.password, salt);
    // Re-assign hashed version over original, plain text password
    this.password = passwordHash;
    console.log(passwordHash)
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Users', userSchema, 'Users');