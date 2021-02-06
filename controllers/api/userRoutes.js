const router = require('express').Router();
const { User } = require('../../models');

router.get('/:id', async (req, res) => {
  try {
    let userData
    if (isNaN(req.params.id)) {
      userData = await User.findOne({ where: { email: req.params.id } })
    } else {
      userData = await User.findOne({ where: { id: req.params.id } })
    }

    res.json(userData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: 'https://neptuneblog-amazon-sdk-us-west.s3-us-west-1.amazonaws.com/moonbank-mascot2.png'
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    let userData = await User.findOne({ where: { id: req.params.id } })
    console.log(userData)
    userData = await userData.update({
      name: req.body.name || userData.dataValues.name,
      email: req.body.email || userData.dataValues.email,
      password: req.body.password || userData.dataValues.password,
      avatar: req.body.avatar || userData.dataValues.avatar
    });
    console.log(userData)
    res.json(userData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});


router.post('/login', async (req, res) => {
  try {
    console.log('login start')
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      console.log('cant find user')
      res
        .status(400)
        .json({ message: 'We couldn\'t find an account with that email' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      console.log('cant validate password')
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.log('login error')
    console.log(err)
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(200).end();
    });
  } else {
    res.status(400).end();
  }
});

module.exports = router;
