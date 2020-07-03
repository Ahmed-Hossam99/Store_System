const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
var cors = require('cors')
const keys = require('./config/keys')
const bodyParser = require('body-parser')
const userRouter = require('./routes/user')
const companyRouter = require('./routes/company/company')
// const adminRouter = require('./routes/admin')
const adminSalesRouter = require('./routes/admin/sales')
const adminStoreRouter = require('./routes/admin/store')
const adminProfitRouter = require('./routes/admin/profit')
const adminPurshaseRouter = require('./routes/admin/purshase')
const shopRouter = require('./routes/shop/shop')
const vendorRouter = require('./routes/Vendor/vendor')
const fs = require('fs');
autoIncrement = require('mongoose-auto-increment');



const app = express();

//   middlewares
// ========================
// morgan middleware
app.use(morgan('dev'))

// bodyParser Mideddleware
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));


app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// make the file publically accessable 
app.use('/uploads', express.static('uploads'));

app.use('/img', express.static(path.join(__dirname, 'imgs', 'mycode.png')))
app.use('/img', express.static('img'));


// ===========================
(function () {
  var childProcess = require("child_process");
  var oldSpawn = childProcess.spawn;
  function mySpawn() {
    console.log('spawn called');
    console.log(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
  }
  childProcess.spawn = mySpawn;
})();


// Enable All CORS Requests 
app.use(cors())

// routes
app.use('/users', userRouter)
app.use('/company', companyRouter)
app.use('/admin', adminSalesRouter)
app.use('/admin', adminStoreRouter)
app.use('/admin', adminPurshaseRouter)
app.use('/admin', adminProfitRouter)
app.use('/shop', shopRouter)

app.use('/vendor', vendorRouter)


// Mongoose Connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`app run on port${port}`)
})

