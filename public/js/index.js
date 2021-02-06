const lo = require('./api/lojax.js')
const joinlo = require('./modal.js').start()
const clap = require('./clap.js')
const __ = require('./dumas.js')
let userOptionsShowing = false
let optionsShowing = false

document.querySelector('#register').addEventListener("click", (event) => {
  joinlo.showRegistration()
})

document.querySelector('#continue-sign-in').addEventListener("click", async (event) => {
  joinlo.continue()
})

window.closeSummary = ()=> {
  document.querySelector('#summary-modal').remove()
}

window.summerize = async (id) => {
  let postData = await lo.read('post', { id })
  let post = JSON.parse(postData)
  let postObj = JSON.parse(post.post)
  let blocks = postObj.blocks
  let text = []
  blocks.forEach((block) => {
    let keys = Object.keys(block.data)
    if (keys.includes("text")) {
      text.push(block.data.text)
    }
  })
  let summary = __.dumas(text.join(''), 5)
  console.log(summary)
  let modal = document.createElement('DIV')
  modal.classList = 'opacity-100 transition-opacity bg-white w-full flex items-center justify-center bg-opacity-90 fixed inset-0 overflow-y-auto z-10'
  modal.id = "summary-modal"
  modal.innerHTML = `
  <div id="summary-modal-body" class="overflow-hidden transform duration-150 w-4/6 md:w-4/6 lg:w-3/6 flex flex-col items-center justify-center bg-white rounded-sm text-left shadow-xl transform transition-all">
    <div class="self-end">
      <svg onclick="closeSummary()" class="h-8 w-8 text-gray-300 hover:text-gray-400 m-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <div class="center p-12 flex flex-col items-center justify-center">
      <p id="modal-title" style="font-family: 'Work Sans', sans-serif; color: white; mix-blend-mode: difference;" class="transform duration-300 z-40 text-center text-gray-700 text-3xl">
        ${summary}
      </p>
    </div>
  </div>
      `
  document.body.append(modal)
}

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

window.updateUserAvatar = (avatar, id) => {
  lo.update('user', {id, avatar})
  .then((response) => {
    let res = JSON.parse(response)
    document.querySelector('#userAvatar').src = res.avatar
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
