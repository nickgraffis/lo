const moment = require('moment');
const crypto = require('crypto');
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

app.post('/imageupload/', upload.single('image'), async (req, res) => {
  try {
    console.log(req.file);
    let url = __dirname + '/img/' + req.params.file
    let response = {
        "success" : 1,
        "file": {
            "url" : 'https://neptuneblog.herokuapp.com/img/' + req.file.filename,
        }
    }
    res.json(response);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});
