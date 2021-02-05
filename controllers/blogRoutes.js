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
        },
        {
          model: Tag
        }
      ],

      order: [
         // Will escape title and validate DESC against a list of valid direction parameters
         ['created_at', 'DESC'],
       ]
    });

    const tagData = await Tag.findAll({ });

    const tags = tagData.map((tag) => tag.get({ plain: true }))

    let posts = postData.map((post) => post.get({ plain: true }));

    posts.forEach((post) => {
      try {
        let $post = JSON.parse(post.post)
        if ($post.blocks) {
          $post.blocks.map((block) => {
            if (block.type === 'image') {
              post.img = block.data
            }
          })
        }
      } catch (err) {
      }
    })

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
    const remarkData = await postData.getRemarks({ include: [{model: User}],       order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['updated_at', 'DESC']
          ]});
    const post = postData.get({ plain: true });
    if (!post.status) {
      res.redirect('/')
      return
    }
    const user = userData.get({ plain: true });
    const tagsData = await postData.getTags();
    const tags = tagsData.map((tag) => tag.get({ plain: true }));
    const remarks = remarkData.map((remark) => remark.get({ plain: true }));
    let editorPost = JSON.stringify(post)
    console.log(remarks)
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

router.get('/stories', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.session.user_id }
    }, {
      attributes: { exclude: ['password'] }
    });

    const user = userData.get({ plain: true });

    const posts = await userData.getPosts({
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['updated_at', 'DESC']
      ]
    })

    let published = []
    let drafts = []
    posts.forEach((post) => {
      if (post.dataValues.status) {
        published.push(post)
      } else {
        drafts.push(post)
      }
    })

    res.render('stories', {
      user,
      drafts,
      published,
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
    const tagData = await postData.getTags()
    const tags = tagData.map(t => t.get({ plain: true }))
    res.render('write', {
      user,
      editorPost,
      post,
      tags,
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
