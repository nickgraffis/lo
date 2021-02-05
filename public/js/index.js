const lo = require('./api/lojax.js')
const joinlo = require('./modal.js').start()
const clap = require('./clap.js')
let userOptionsShowing = false
let optionsShowing = false

document.querySelector('#register').addEventListener("click", (event) => {
  joinlo.showRegistration()
})

document.querySelector('#continue-sign-in').addEventListener("click", async (event) => {
  joinlo.continue()
})

document.onkeydown = checkKey;

function checkKey (e) {
  e = e || window.event

  if (e.keyCode == '13' && !document.querySelector('#modal').classList.contains('hidden')) {
    joinlo.continue()
  }
}
// fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@nicholasgraffis')
// .then((res) => res.json())
// .then(async (data) => {
//   for (let i = 0; i < data.items.length ; i++) {
//     console.log(data)
//     console.log(data.items[i].content.toString())
//     await lo.create('post', {
//       title: data.items[i].title,
//       user_id: 1,
//       post: data.items[i].content.replace(/[\/\(\)\'\"]/g, '\\$&'),
//       updated_at: data.items[i].pubDate,
//       tags: data.items[i].categories
//     })
//   }
// })


if (document.querySelector('#login-icon')) {
  document.querySelector('#login-icon').addEventListener("click", (event) => {
    joinlo.showModal()
  })
}

window.updateProfile = async (id, field, value, callback) => {
  let userData = await lo.update('user', {id, [field]: value})
  let user = JSON.parse(userData)
  if (field == 'password') {

  } else {
    document.querySelector(`#${field}Display`).innerHTML = user[field]
    document.querySelector(`#${field}Input`).value = user[field]
  }
}

document.querySelector('#close-modal').addEventListener("click", (event) => {
  joinlo.hideModal()
})

window.signout = async () => {
  await lo.logout()
  window.location.href = '/'
}

window.newStory = (id) => {
  lo.create('post', {user_id: id, status: 0})
  .then((post) => window.location.href = `/write/${JSON.parse(post).id}`)
}

let clappedPosts = []
let clappedPostsIds = []

window.clapFor = async (event, id) => {
  let newClap
  if (clappedPostsIds.includes(id)) {
    newClap = clappedPosts[clappedPostsIds.indexOf(id)]
  } else {
    newClap = clap.start(id)
    clappedPosts.push(newClap)
    clappedPostsIds.push(id)
  }
  newClap.clap(event)
}

let showingTags = false

window.showTags = ()=> {
  if (showingTags) {
    document.querySelector('#tags').classList.add('hidden')
  } else {
    document.querySelector('#tags').classList.remove('hidden')
  }

  showingTags = !showingTags
}

const showUserOptions = () => {
  if (userOptionsShowing) {
    document.querySelector('#user-card').classList.replace('visible', 'hidden')
    window.removeEventListener('click', clickAway)
  } else {
    document.querySelector('#user-card').classList.replace('hidden', 'visible')
  }
  userOptionsShowing = !userOptionsShowing
}

const showOptions = () => {
  if (optionsShowing) {
    document.querySelector('#options-card').classList.replace('visible', 'hidden')
    window.removeEventListener('click', clickAway)
  } else {
    document.querySelector('#options-card').classList.replace('hidden', 'visible')
  }
  optionsShowing = !optionsShowing
}

const clickAway = (event) => {
  if (userOptionsShowing && !event.target.classList.contains('user-card-bits')) {
    showUserOptions()
  }
}

const clickAwayOptions = (event) => {
  if (optionsShowing && !event.target.classList.contains('options-card-bits')) {
    showOptions()
  }
}

if (document.querySelector('#user-icon')) {
  document.querySelector('#user-icon').addEventListener("click", () => {
    showUserOptions()
    setTimeout(() => {
      window.addEventListener('click', clickAway)
    }, 100)
  })
}

if (document.querySelector('#menu-icon')) {
  document.querySelector('#menu-icon').addEventListener("click", () => {
    showOptions()
    setTimeout(() => {
      window.addEventListener('click', clickAwayOptions)
    }, 100)
  })
}
