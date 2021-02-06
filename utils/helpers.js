module.exports = {
  simple: (string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const date = new Date(string)
    const ellapsed = (Date.now() / 1000) - (date.getTime() / 1000)
    if (ellapsed < 604800) {
      if (ellapsed < 3600) {
        return Math.floor(ellapsed / 60) + ' minutes ago'
      } else if (ellapsed < 86400) {
        return Math.floor(ellapsed / 3600) + ' hours ago'
      } else if (ellapsed < 60) {
        return 'a few seconds ago'
      } else {
        return days[date.getDay()]
      }
    } else if (ellapsed < 3154000) {
      return months[date.getMonth()] + ' ' + date.getDate()
    } else {
      return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear().toString().substring(2)
    }
  },
  readTime: (post) => {
    const string = post.split('')
    const length = string.length
    const words = length / 6.7
    const min = words / 200
    return Math.ceil(min) + ' min read'
  },
  greeting: () => {
    const date = new Date(Date.now())
    if (date.getHours() < 12 && date.getHours() > 3) {
      return 'Good morning'
    } else if (date.getHours() > 3 && date.getHours() < 16) {
      return 'Good afternoon'
    } else if (date.getHours() > 15 && date.getHours() < 24) {
      return 'Good evening'
    } else {
      return 'Don\'t stay up too late'
    }
  },
  section: function (name, options) {
    if (!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);
    return null;
  },
  capitolize: (string) => {
    return string[0].toUpperCase() + string.substring(1)
  },
  escape: (string) => {
    let returnChar = []
    for (let i = 0; i < string.length; i++) {
      if (string[i] + string[i + 1] === '{{') {
        returnChar.push('@#$%|')
      } else {
        returnChar.push(string[i])
      }
    }
    return returnChar.join('')
  },
  foreach: function(arr,options) {
    if(options.inverse && !arr.length) return options.inverse(this);

    return arr.map(function(item,index) {
        item.$index = index;
        item.$first = index === 0;
        item.$last  = index === arr.length-1;
        return options.fn(item);
    }).join('');
  },
  pickHeroImage: () => {
    let options = ['selfie', 'ideas', 'macine', 'robolove']
    return options[Math.floor(Math.random() * Math.floor(3))]
  },
  userURI: (user) => {
    return user.replace(/\s/g, '').toLowerCase()
  }
};
