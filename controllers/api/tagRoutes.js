const router = require('express').Router();
const { Post, User, Tag } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.body.user_id },
    });

    if (!userData) {
      res.json({ message: 'Could not find that user!' });
    }

    const postData = await Post.findOne({
      where: { id: req.body.post_id },
    });

    if (!postData) {
      res.json({ message: 'Could not find that post!' });
    }

    const tagData = await Tag.create({
      tag: req.body.tag
    }, {
      attributes: ['id', 'tag']
    });

    postData.addTag(tagData)

    res.json(tagData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findOne({
      where: { id: req.params.id }
    }, {
      attributes: ['id', 'tag']
    });

    if (!tagData) {
      res.status(400).json({ message: 'Could not find that tag!' });
      return;
    }

    res.json(tagData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findOne({
      where: { id: req.params.id }
    }, {
      attributes: ['id', 'tag'],
    });

    if (!tagData) {
      res.status(400).json({ message: 'Could not find that tag!' });
      return;
    }

    tagData = await tagData.update(req.body);

    res.json(tagData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (!tagData) {
      res.status(404).json({ message: 'Could not find that tag!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

module.exports = router;
