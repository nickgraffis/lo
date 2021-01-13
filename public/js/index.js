const lo = require('./api/lojax.js')
const joinlo = require('./modal.js').start()
const clap = require('./clap.js')
let userOptionsShowing = false

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

document.querySelector('#close-modal').addEventListener("click", (event) => {
  joinlo.hideModal()
})

window.signout = async () => {
  await lo.logout()
  window.location.href = '/'
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

const showUserOptions = () => {
  if (userOptionsShowing) {
    document.querySelector('#user-card').classList.replace('visible', 'hidden')
    window.removeEventListener('click', clickAway)
  } else {
    document.querySelector('#user-card').classList.replace('hidden', 'visible')
  }
  userOptionsShowing = !userOptionsShowing
}

const clickAway = (event) => {
  if (userOptionsShowing && !event.target.classList.contains('user-card-bits')) {
    showUserOptions()
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
