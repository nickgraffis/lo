const router = require('express').Router();
const { Post, User, Remark } = require('../../models');

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

    const remarkData = await Remark.create(req.body, {
      include: [
        { model: User}
      ]
    });
    let remark = remarkData.get({plain: true})
    let user = await remarkData.getUser()
    remark.user = user.get({plain: true})
    res.json(remark);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const remarkData = await Remark.findOne({
      where: { id: req.params.id }
    }, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Post }
      ],
      attributes: ['id', 'remark']
    });

    if (!remarkData) {
      res.status(400).json({ message: 'Could not find that remark!' });
      return;
    }

    res.json(remarkData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const remarkData = await Remark.findOne({
      where: { id: req.params.id }
    }, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Post }
      ],
      attributes: ['id', 'remark'],
    });

    if (!remarkData) {
      res.status(400).json({ message: 'Could not find that remark!' });
      return;
    }

    remarkData = await remarkData.update(req.body);

    res.json(remarkData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const remarkData = await Remark.destroy({
      where: { id: req.params.id },
    });

    if (!remarkData) {
      res.status(404).json({ message: 'Could not find that remark!' });
      return;
    }

    res.status(200).json(remarkData);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

module.exports = router;
