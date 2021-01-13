const router = require('express').Router();
const { Post, User, Remark, Tag } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.body.user_id },
    });

    if (!userData) {
      res.json({ message: 'Could not find that user!' });
    }

    let tags = []
    if (req.body.tags) {
      console.log(req.body.tags)
      for (let i = 0; i < req.body.tags.length; i++) {
      console.log(req.body.tags[i])
        let tag = await Tag.findOne({ where: { tag: req.body.tags[i] } })
        console.log(tag)
        if (!tag) {
          tag = await Tag.create({tag: req.body.tags[i]})
        console.log(tag)
        }
        console.log(tag)
        tags.push(tag)
        console.log(tags)
      }
    }

    const postData = await Post.create(req.body, {
      include: [{ model: User, attributes: { exclude: ['password'] } }],
      attributes: ['id', 'title', 'tagline', 'status', 'post'],
    });

    for (let i = 0; i < tags.length; i++) {
      postData.addTag(tags[i])
    }

    res.json(postData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: { id: req.params.id }
    }, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Remark },
        { model: Tag }
      ],
      attributes: ['id', 'title', 'tagline', 'status', 'post'],
    });

    if (!postData) {
      res.status(400).json({ message: 'Could not find that post!' });
      return;
    }

    res.json(postData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    let postData = await Post.findOne({
      where: { id: req.params.id }
    }, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Remark },
        { model: Tag }
      ],
      attributes: ['id', 'title', 'tagline', 'status', 'post'],
    });

    if (!postData) {
      res.status(400).json({ message: 'Could not find that post!' });
      return;
    }

    postData = await postData.update(req.body);

    res.json(postData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: { id: req.params.id },
    });

    if (!postData) {
      res.status(404).json({ message: 'Could not find that post!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

module.exports = router;
