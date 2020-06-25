const vendorModel = require('../../models/dealings/vendor')
const shopModel = require('../../models/dealings/shop')
const invoiceVendorModel = require('../../models/invoices/vendor_invoice')
const invoiceShopModel = require('../../models/invoices/shop_invoice')
const accountModel = require('../../models/finance/account')
const myDeptModel = require('../../models/finance/my_dept')
const productModel = require('../../models/products/product')
const colorModel = require('../../models/products/color')
const sizeModel = require('../../models/products/size')
const categoryModel = require('../../models/products/category')
var QRCode = require('qrcode')
var Barc = require('barcode-generator')
  , barc = new Barc()
  , fs = require('fs');



qrCoder = product => {
  QRCode.toDataURL(product, {
    errorCorrectionLevel: "medium",
    type: '######'
  }
    , function (err, url) {
      console.log(url)
    })
}

// add new Shop 
exports.addShop = async (req, res, next) => {
  try {
    const shop = await shopModel.findOne({ shopName: req.body.shopName })
    console.log(shop)
    console.log(req.body.shopName)
    if (shop) {
      return res.status(403).json({ message: 'Shop exists !!' })
    }
    const newShop = new shopModel({
      shopName: req.body.shopName,
      phoneNumber: req.body.phoneNumber
    })
    await newShop.save();
    res.status(201).json({ newShop })


  } catch (error) {
    console.log(error)
    res.json({ error })

  }
}


exports.addProduct = async (req, res, next) => {
  try {

    const color = await colorModel.findOne({ name: req.body.color })
    let newColor
    if (!color) {
      newColor = new colorModel({
        name: req.body.color
      })
      await newColor.save();
      console.log(newColor)
    }
    const size = await sizeModel.findOne({ size: req.body.size })
    let newSize
    if (!size) {
      newSize = new sizeModel({
        size: req.body.size
      })
      await newSize.save();
      console.log(newSize)
    }
    const category = await categoryModel.findOne({ name: req.body.category })
    let newCategory
    if (!category) {
      newCategory = new categoryModel({
        name: req.body.category
      })
      await newCategory.save();
      console.log(newCategory)
    }
    // ============================================
    const newProduct = new productModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      avaliableQuantity: req.body.avaliableQuantity,
      purchase_price: req.body.purchase_price,
      sales_price: req.body.sales_price,
      size: size === undefined ? newSize.id : size._id,
      color: color === undefined ? newColor.id : color._id,
      category: category === undefined ? newCategory.id : category._id
    })
    await newProduct.save();
    //create a 300x200 px image with the barcode 1234
    let buf = barc.code128(newProduct.id, 300, 200);
    fs.mkdirSync('uploads', buf, function () {
      console.log('wrote it');
    });
    res.status(201).json({ newProduct, puf })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }

}



exports.getAllProducts = async (req, res, next) => {
  try {
    console.log(1)
    const products = await productModel.find()
    if (!products) {
      res.status(400).json({
        message: ' products not found!!'
      })
    }
    if (products.length <= 0) {
      res.status(200).json({ message: 'not product added!!' })
    }
    res.status(200).json({ products })


  } catch (error) {
    console.log(error)
    res.json({ error })

  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: ' only admin !! ' })
    }
    const prodId = req.params.prodId
    const products = await productModel.deleteOne({ _id: prodId });
    if (!products) {
      res.status(400).json({
        message: ' products not found!!'
      })
    }
    res.status(200).json({ message: 'product deleted!!' })


  } catch (error) {
    console.log(error)
    res.json({ error })

  }
}

exports.getProductByCategory = async (req, res, next) => {
  try {
    const queryCategory = req.query.type
    const categoryName = await categoryModel.findOne({ name: queryCategory })
    if (categoryName) {
      console.log(categoryName.id)
      const products = await productModel.find({ category: categoryName.id })
      if (!products) {
        return res.status(400).json({ message: 'not product found!!' })
      }
      if (products.length <= 0) {
        return res.status(200).json({ message: 'No product for this category!!' })
      }
      return res.status(200).json({ products })
    }
    else {
      res.status(404).json({ message: " category not found!" })
    }

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}


exports.getProductByName = async (req, res, next) => {
  try {
    const queryName = req.query.name
    const products = await productModel.find({ name: queryName })
    if (!products) {
      res.status(400).json({ message: 'not product found!!' })
    }
    if (products.length <= 0) {
      res.status(200).json({ message: 'No product for this name!!' })
    }
    res.status(200).json({ products })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}


exports.getProductById = async (req, res, next) => {
  try {
    const prodId = req.params.prodId
    const products = await productModel.find({ _id: prodId })
    if (!products) {
      res.status(400).json({ message: 'not product found!!' })
    }
    if (products.length <= 0) {
      res.status(200).json({ message: 'No product for this Id!!' })
    }
    res.status(200).json({ products })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.updateProduct = async (req, res, next) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: ' only admin !! ' })
    }
    const prodId = req.params.prodId
    const product = await productModel.findById({ _id: prodId })
    if (!product) {
      res.status(422).json({ message: ' product not found!!' })
    }
    if (req.body.name) {
      product.name = req.body.name
    }
    if (req.body.description) {
      product.description = req.body.description
    }
    if (req.body.price) {
      product.price = req.body.price
    }
    if (req.body.avaliableQuantity) {
      product.avaliableQuantity = req.body.avaliableQuantity
    }
    if (req.body.color) {
      const color = await colorModel.findOne({ name: req.body.color })
      let newColor
      if (!color) {
        newColor = new colorModel({
          name: req.body.color
        })
      }
      product.color = color === undefined ? newColor.id : color._id
    }
    if (req.body.size) {
      const size = await colorModel.findOne({ size: req.body.size })
      let newSize
      if (!size) {
        newSize = new sizeModel({
          size: req.body.size
        })
      }
      product.size = size === undefined ? newSize.id : size._id
    }
    if (req.body.category) {
      const category = await categoryModel.findOne({ name: req.body.category })
      let newCategory
      if (!category) {
        newCategory = new categoryModel({
          name: req.body.category
        })
      }
      product.category = category === undefined ? newCategory.id : category._id
    }
    await product.save();
    res.status(201).json({ product, message: 'Product Updated!!' })

  } catch (error) {
    console.log(error)
    res.json({ error })

  }
}