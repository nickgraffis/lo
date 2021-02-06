const lo = require('./api/lojax.js')
const { toast } = require('./tailwind-toast/twtoast.js')

class Modal {
  constructor () {
    this.type = 'signin',
    this.stage = 'email',
    this.email,
    this.name,
    this.password
  }

  showRegistration () {
    if (this.type === 'signin') {
      this.type = 'register'
      document.querySelector('#register').innerHTML = 'Been here before? Sign in.'
      document.querySelector('#modal-title').style.transform = 'translateY(-250px)'
      setTimeout(() => {
        document.querySelector('#modal-message').style.transform = 'translateY(-550px)'
      }, 100)
      setTimeout(() => {
        document.querySelector('#modal-message').innerHTML = 'We\'re happy to have you join! Signing up lets you join the conversation with comments, and writing your own articles!'
        document.querySelector('#modal-message').style.transform = ''
      }, 600)
      setTimeout(() => {
        document.querySelector('#modal-title').innerHTML = 'Let\'s get started.'
        document.querySelector('#modal-title').style.transform = ''
      }, 900)
    } else {
      this.type = 'signin'
      document.querySelector('#register').innerHTML = 'Register here.'
      document.querySelector('#modal-title').style.transform = 'translateY(-250px)'
      setTimeout(() => {
        document.querySelector('#modal-message').style.transform = 'translateY(-550px)'
      }, 100)
      setTimeout(() => {
        document.querySelector('#modal-message').innerHTML = `Sign in to get more personalized stories, save bookmarks, leave comments, and write
        awesome articles!`
        document.querySelector('#modal-message').style.transform = ''
      }, 600)
      setTimeout(() => {
        document.querySelector('#modal-title').innerHTML = 'Welcome Back.'
        document.querySelector('#modal-title').style.transform = ''
      }, 900)
    }
  }

  showError (message) {
    toast().danger('', message).with({ shape: 'pill', icon: '🤦' }).show()
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  validatePassword(password) {
    if (password.length > 7) {
      return true
    } else {
      return false
    }
  }

  continueForm () {
    const form = document.querySelector('#modal-form')
    if (this.stage === 'email') {
      document.querySelector('#continue-sign-in').innerHTML = 'Continue'
      form.style.transform = 'translateX(-750px)'
      setTimeout(() => {
        form.innerHTML = `
          <label for="email" class="text-center">Your Email</label>
          <input value="${this.email}" id="email" type="email" name="email" class="mt-10 w-full focus:outline-none border p-4 rounded-sm border-gray-800 text-center">
        `
        form.style.transform = ''
        document.getElementById(this.stage).focus()
      }, 300)
    } else if (this.stage === 'password') {
      document.querySelector('#continue-sign-in').innerHTML = this.type === 'signin' ? 'Sign In' : 'Continue'
      form.style.transform = 'translateX(-750px)'
      setTimeout(() => {
        form.innerHTML = `
          <label for="password" class="text-center">Your Password</label>
          <input id="password" type="password" name="password" class="mt-10 w-full focus:outline-none border p-4 rounded-sm border-gray-800 text-center">
        `
        form.style.transform = ''
        document.getElementById(this.stage).focus()
      }, 300)
    } else {
      document.querySelector('#continue-sign-in').innerHTML = 'Register'
      form.style.transform = 'translateX(-750px)'
      setTimeout(() => {
        form.innerHTML = `
          <label for="name" class="text-center">Your Name</label>
          <input id="name" type="text" name="name" class="mt-10 w-full focus:outline-none border p-4 rounded-sm border-gray-800 text-center">
        `
        form.style.transform = ''
        document.getElementById(this.stage).focus()
      }, 300)
    }
  }

  showModal () {
    const modal = document.querySelector('#modal')
    const body = document.querySelector('#modal-body')
    body.classList.add('scale-50')
    modal.classList.remove('hidden')
    setTimeout(() => {
      modal.classList.remove('opacity-0')
      body.classList.remove('scale-50')
      document.getElementById(this.stage).focus()
    }, 10)
  }

  hideModal () {
    const modal = document.querySelector('#modal')
    const body = document.querySelector('#modal-body')
    body.classList.add('scale-50')
    setTimeout(() => {
      modal.classList.add('hidden')
      modal.classList.add('opacity-0')
      body.classList.remove('scale-50')
    }, 100)
  }

  async continue () {
    if (this.type === 'register') {
      if (this.stage === 'email') {
        this.email =  document.querySelector('#email').value
        if (!this.validateEmail(this.email)) {
          this.showError('This doesn\'t look like an email!')
          return false
        }
        let emailValidated = await lo.read('user', { email: this.email })
        if (emailValidated != 'null') {
          this.showError('This email address is already in use!')
          return false
        }
      } else if (this.stage === 'password') {
        this.password =  document.querySelector('#password').value
        if (!this.validatePassword(this.password)) {
          this.showError('Your password must be 8 charecters long!')
          return false
        }
      } else {
        this.name =  document.querySelector('#name').value
        let register = await lo.create('user', {
          email: this.email,
          password: this.password,
          name: this.name
        })
        if (!register) {
          this.showError(register)
          return false
        } else {
          window.location.href = '/'
        }
      }
      this.stage = this.stage === 'email' ? 'password' : 'name'
      this.continueForm()
    } else if (this.type === 'signin') {
      if (this.stage === 'email') {
        let emailValidated =  await lo.read('user', { email: document.querySelector('#email').value })
        if (emailValidated == 'null') {
          this.showError('Couldn\'t find email')
          return false
        }
      } else {
        this.password = document.querySelector('#password').value
        let login = await lo.login(this.email, this.password)
        console.log(login)
        if (login == '{"message":"Incorrect email or password, please try again"}') {
          this.stage = 'email'
          this.continueForm()
          this.showError('Incorrect email or password!')
          return false
        } else {
          window.location.href = '/'
        }
      }
      this.email = document.querySelector('#email').value
      this.stage = 'password'
      this.continueForm()
    }
  }
}

module.exports = {
  start: () => {
    return new Modal()
  }
}
