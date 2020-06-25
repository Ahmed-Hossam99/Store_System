const bcrypt = require('bcrypt')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const cloud = require('../services/cloudinary')
const userModel = require('../models/user')
const shopModel = require('../models/dealings/shop')


signToken = user => {
  return jwt.sign({
    user_id: user.id,
    user_email: user.email,
    expiresIn: "1d",
  }, keys.jwtSecret);
}
exports.signUp = async (req, res, next) => {
  try {
    // check if user is exist
    const user = await userModel.findOne({ email: req.body.email })
    if (user) {
      return res.status(403).json({ // 403 meaning forbidden req because user exist
        message: 'email already exist !!'
      })
    }
    let typeUser = req.body.type


    const shop = await shopModel.findOne({ shopName: req.body.shop })
    if (!shop) {
      return res.status(403).json({ // 403 meaning forbidden req because user exist
        message: ' Shop Not exist !!'
      })
    }



    let result
    if (req.file) {
      console.log('one file')
      result = await cloud.uploads(req.file.path)
      console.log(result)
      fs.unlinkSync(req.file.path)
    }
    console.log(req.body.shop)
    newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profile: result === undefined ? 'http://res.cloudinary.com/hossam99/image/upload/v1590712258/zcv2aan8gufzbrfjfwc6.webp' : result.url,
      type: req.body.type,
      shop: typeUser === 'admin' ? null : shop._id

    })
    console.log('here!!')
    const userData = await newUser.save();
    const token = signToken(userData);
    res.status(201).json({
      userData,
      token,
    })

  } catch (error) {
    console.log(error)

    res.json({ error })
  }
}

//  signIn function
exports.signIn = async (req, res, next) => {
  // validation done from passport file 
  const token = signToken(req.user)
  res.status(200).json({ token })
}

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await userModel.findById(userId)

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: ' Not authorized! ' });
    }
    if (!user) {
      return res.status(403).json({
        message: 'user not exist !!'
      })
    } else {
      if (req.body.name) {
        user.name = req.body.name
      }

      if (req.body.password) {
        user.password = req.body.password
      }
      if (req.file) {
        let result
        console.log('one file')
        result = await cloud.uploads(req.file.path)
        console.log(result)
        user.profile = result.url
        fs.unlinkSync(req.file.path)
      }

      await user.save()
      res.status(200).json({
        user,
        message: "updated user done !!"
      })
    }
  } catch (error) {
    res.json.error
  }
}



// secret function
exports.secret = async (req, res, next) => {
  res.json({
    msg: "Welcome from Auth",
    user: req.user
  })
}





