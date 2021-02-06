const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: true,
    content: [
      './view/layouts/main.handlebars',
      './view/partials/author.handlebars',
      './view/partials/clapbar.handlebars',
      './view/partials/footer.handlebars',
      './view/partials/hero.handlebars',
      './view/partials/logo.handlebars',
      './view/partials/modal.handlebars',
      './view/partials/nav.handlebars',
      './view/partials/optionscard.handlebars',
      './view/partials/postcard.handlebars',
      './view/partials/remarks.handlebars',
      './view/partials/sidebar.handlebars',
      './view/partials/usercard.handlebars',
      './view/about.handlebars',
      './view/blog.handlebars',
      './view/post.handlebars',
      './view/profile.handlebars',
      './view/public-profile.handlebars',
      './view/stories.handlebars',
      './view/write.handlebars',
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
