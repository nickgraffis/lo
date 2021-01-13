const Post = require('./Post');
const User = require('./User');
const Remark = require('./Remark');
const Tag = require('./Tag');

User.hasMany(Post, {
  onDelete: 'CASCADE'
});

User.hasMany(Remark, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Post.hasMany(Remark, {
  foreignKey: 'post_id'
});

Post.belongsTo(User);

Remark.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Remark.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

Tag.belongsToMany(Post, {
  through: 'Tag_Post'
});

Post.belongsToMany(Tag, {
  through: 'Tag_Post'
});

module.exports = { User, Post, Remark, Tag };
