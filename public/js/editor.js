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
const SimpleImage = require('@editorjs/simple-image');
const lo = require('./api/lojax.js')

window.publish = async () => {
  lo.update('post', {id: postData.id, status: 1})
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
        class: SimpleImage,
        inlineToolbar: ['link'],
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
