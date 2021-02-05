const moment = require('moment');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express();
const PORT = process.env.PORT || 3030;
const hbs = exphbs.create({ helpers });
const aws = require('aws-sdk');
aws.config.region = 'us-west-1';
const S3_BUCKET = process.env.S3_BUCKET;
const multer = require('multer');
const storage = multer.diskStorage({
  destination: './public/img',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

const upload = multer({ storage: storage })
const sess = {
  secret: 'ivory-smelt',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
sequelize.sync({ force: false }).then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Now listening on PORT: ${PORT}`)
  });
});

// app.post('/imageupload/', upload.single('image'), async (req, res) => {
//   try {
//     console.log(req.file);
//     let url = __dirname + '/img/' + req.params.file
//     let response = {
//         "success" : 1,
//         "file": {
//             "url" : 'https://neptuneblog.herokuapp.com/img/' + req.file.filename,
//         }
//     }
//     res.json(response);
//   } catch (err) {
//     console.log(err)
//     res.status(400).json(err);
//   }
// });

app.post('/imageupload', upload.single('image'), async (req, res) => {
  try {
    const s3 = new aws.S3();
    const fileName = req.file.filename;
    const fileType = req.file.mimetype;
    const fileContent = fs.readFileSync(req.file.path);
    const s3Params = {
      Bucket: S3_BUCKET,
      Body: fileContent,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.upload(s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      let response = {
          "success" : 1,
          "file": {
              "url" : returnData.url,
          }
      }
      res.json(response);
      res.end();
    });
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

app.post('/upload/avatar', upload.single('image'), async (req, res) => {
  try {
    const s3 = new aws.S3();
    const fileName = req.file.filename;
    const fileType = req.file.mimetype;
    const fileContent = fs.readFileSync(req.file.path);
    const s3Params = {
      Bucket: S3_BUCKET,
      Body: fileContent,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.upload(s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      let response = {
          "success" : 1,
          "file": {
              "url" : returnData.url,
          }
      }
      res.json(response);
      res.end();
    });
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});
