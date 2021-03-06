const EditorJS = require('@editorjs/editorjs');
const List = require('@editorjs/list');
const LinkTool = require('@editorjs/link');
const Image = require('@editorjs/image');
const Embed = require('@editorjs/embed');
const Table = require('@editorjs/table');
const Delimiter = require('@editorjs/delimiter');
const Quote = require('@editorjs/quote');
const Checklist = require('@editorjs/checklist');
const Header = require('@editorjs/header');
const Marker = require('@editorjs/marker');
const CodeTool = require('@editorjs/code');
const Warning = require('@editorjs/warning');
const InlineCode = require('@editorjs/inline-code');
const lo = require('./api/lojax.js')
const __ = require('../../utils/helpers.js')

window.publish = () => {
  lo.update('post', {id: postData.id, status: 1})
  .then(document.querySelector('.pub').outerHTML = '<div onclick="unpublish()" class="pub mx-4 text-white p-2 bg-cyan-600 rounded-sm cursor-pointer">Unpublish</div>')
}
window.unpublish = () => {
  lo.update('post', {id: postData.id, status: 0})
  .then(document.querySelector('.pub').outerHTML = '<div onclick="publish()" class="pub mx-4 text-white p-2 bg-cyan-600 rounded-sm cursor-pointer">Publish</div>')
}

window.deletePost = () => {
  lo.delete('post', {id: postData.id})
  .then(window.location.href = '/stories')
}

window.addEventListener("keydown", async (event) => {
  if (event.key == 'Enter'
  && document.activeElement === document.querySelector('#addTag')
  && document.querySelector('#addTag').value) {
    let tagsData = await lo.read('post', {id: post_id})
    let tags = JSON.parse(tagsData)
    if (tags.tags.length > 5) {
      console.log('too many tags')
      return
    }
    lo.create('tag', {tag: document.querySelector('#addTag').value, post_id, user_id})
    .then((response) => {
      let res = JSON.parse(response)
      let tag = document.createElement('DIV')
      console.log(res)
      tag.classList = 'rounded-sm bg-gray-100 text-sm text-gray-500 p-2 m-1 cursor-pointer'
      tag.innerHTML = `${res.tag[0].toUpperCase() + res.tag.substring(1)}`
      document.querySelector('#tagswrapper').prepend(tag)
      document.querySelector('#addTag').value = ''
    })
  } else if (event.key == 'Enter'
    && document.activeElement === document.querySelector('#remarkInput')
    && document.querySelector('#remarkInput').value.length > 0) {
      addRemark()
    }
})

window.addRemark = () => {
  if (document.querySelector('#remarkInput').value.length > 0) {
    lo.create('remark', {user_id, post_id, comment: document.querySelector('#remarkInput').value})
    .then((response) => {
      let res = JSON.parse(response)
      let remarks = document.querySelector('#remarks')
      let remark = document.createElement('DIV')
      remark.classList = 'p-4'
      remark.innerHTML = `<div class="flex items-center">
              <img src="${res.user.avatar}" class="rounded-full h-6 w-6 object-cover mr-2" />
              <span class="text-sm text-gray-800 font-medium mx-2">${res.user.name}</span>
              <span class="text-xs text-gray-600 mx-2">${__.simple(res.createdAt)}</span>
            </div>
            <p class="italic text-sm text-gray-600 pt-2">${res.comment}</p>`
      remarks.prepend(remark)
      document.querySelector('#remarkInput').value = ''
    })
  }
}

class MyHeader extends Header {
    /**
     * Return Tool's view
     * @returns {HTMLHeadingElement}
     * @public
     */
    render() {
        const extrawrapper = document.createElement('div');
        extrawrapper.classList.add('content');
        extrawrapper.appendChild(this._element);

        return extrawrapper;
    }
}

var editor = new EditorJS({
    /**
     * Wrapper of Editor
     */
    holder: 'editorjs',
    placeholder: 'Let`s write an awesome story!',
    readOnly: postReadOnly,
    /**
     * Tools list
     */
    tools: {
      /**
       * Each Tool is a Plugin. Pass them via 'class' option with necessary settings {@link docs/tools.md}
       */
      header: {
        class: MyHeader,
        inlineToolbar: ['link'],
        config: {
          placeholder: 'Header'
        },
        shortcut: 'CMD+SHIFT+H'
      },
      /**
       * Or pass class directly without any configuration
       */
      image: {
        class: Image,
        config: {
          endpoints: {
            byFile: `https://neptuneblog.herokuapp.com/imageupload`, // Your backend file uploader endpoint
            byUrl: 'http://localhost:3030/fetchUrl', // Your endpoint that provides uploading by Url
          }
        }
      },
      list: {
        class: List,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+L'
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        },
        shortcut: 'CMD+SHIFT+O'
      },
      warning: Warning,
      marker: {
        class:  Marker,
        shortcut: 'CMD+SHIFT+M'
      },
      code: {
        class:  CodeTool,
        shortcut: 'CMD+SHIFT+C'
      },
      delimiter: Delimiter,
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+C'
      },
      linkTool: LinkTool,
      embed: Embed,
      table: {
        class: Table,
        inlineToolbar: true,
        shortcut: 'CMD+ALT+T'
      },
    },
    data: {
      blocks: postData.post ? JSON.parse(postData.post).blocks : ''
    },
    onReady: function(){
      console.log('Ready');
    },
    onChange: function() {
      editor.save().then((outputData) => {
        console.log('Article data: ', outputData)
        lo.update('post', {
          id: postData.id,
          post: JSON.stringify(outputData),
          title: outputData.blocks[0].data.text,
          tagline: outputData.blocks.length > 0 ? outputData.blocks[1].data.text : ''
        })
      }).catch((error) => {
        console.log('Saving failed: ', error)
      });
    }
  });
