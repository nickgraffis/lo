const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: [
      './views/layouts/main.handlebars',
      './views/partials/author.handlebars',
      './views/partials/clapbar.handlebars',
      './views/partials/footer.handlebars',
      './views/partials/hero.handlebars',
      './views/partials/logo.handlebars',
      './views/partials/modal.handlebars',
      './views/partials/nav.handlebars',
      './views/partials/optionscard.handlebars',
      './views/partials/postcard.handlebars',
      './views/partials/remarks.handlebars',
      './views/partials/sidebar.handlebars',
      './views/partials/usercard.handlebars',
      './views/about.handlebars',
      './views/blog.handlebars',
      './views/post.handlebars',
      './views/profile.handlebars',
      './views/public-profile.handlebars',
      './views/stories.handlebars',
      './views/write.handlebars',
      './public/js/tailwind-toast/classes/Toast.js',
      './public/js/tailwind-toast/templates/toast.toast',
      './public/js/clap.js',
      './public/js/editor.js',
      './public/js/index.js',
      './public/js/modal.js',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    colors
  },
  variants: {
    extend: {
      translate: ['group-hover'],
      visibility: ['group-hover', 'hover', 'focus'],
    },
  },
  plugins: [],
}
