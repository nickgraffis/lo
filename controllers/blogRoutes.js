const router = require('express').Router();
const { Post, User, Remark, Tag } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { status: 1 },
      include: [
        {
          model: User,
          attributes: ['name', 'id', 'email', 'avatar']
        }
      ],
      order: [
         // Will escape title and validate DESC against a list of valid direction parameters
         ['created_at', 'DESC'],
       ]
    });

    const tagData = await Tag.findAll({ limit: 10 });

    const tags = tagData.map((tag) => tag.get({ plain: true }))

    const posts = postData.map((post) => post.get({ plain: true }));

    let userData
    let user
    if (req.session.user_id) {
      userData = await User.findOne({ where: { id:  req.session.user_id} })
      user = userData.get({ plain: true })
    }

    res.render('blog', {
      posts,
      tags,
      user,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findOne({ where: { id: req.params.id } });
    const userData = await postData.getUser();
    const remarkData = await postData.getRemarks();
    const post = postData.get({ plain: true });
    const user = userData.get({ plain: true });
    const tagsData = await postData.getTags();
    const tags = tagsData.map((tag) => tag.get({ plain: true }));
    const remarks = remarkData.map((remark) => remark.get({ plain: true }));
    console.log(post)
    let editorPost = JSON.stringify(post)
    res.render('post', {
      post,
      editorPost,
      user,
      tags,
      remarks,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.session.user_id }
    }, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }, { model: Remark }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      user,
      logged_in: true
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/write/:id', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.session.user_id }
    }, {
      attributes: { exclude: ['password'] },
    });
    const postData = await Post.findOne({ where: { id: req.params.id } });
    let post = postData.get({ plain: true });
    const user = userData.get({ plain: true });
    if (post.user_id != user.id) {
      console.log('This is not your article')
      res.status(500).json(err);
    }
    console.log(post)
    let editorPost = JSON.stringify(post)
    res.render('write', {
      user,
      editorPost,
      post,
      logged_in: true
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/writer/:id', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.params.id }
    }, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }, { model: Remark }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      user,
      logged_in: true
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
