(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
var location = global.location || {};
/*jslint indent: 2, browser: true, bitwise: true, plusplus: true */
var twemoji = (function (
  /*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
    https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
  */

  // WARNING:   this file is generated automatically via
  //            `node scripts/build.js`
  //            please update its `createTwemoji` function
  //            at the bottom of the same file instead.

) {
  'use strict';

  /*jshint maxparams:4 */

  var
    // the exported module object
    twemoji = {


    /////////////////////////
    //      properties     //
    /////////////////////////

      // default assets url, by default will be Twitter Inc. CDN
      base: 'https://twemoji.maxcdn.com/v/13.0.1/',

      // default assets file extensions, by default '.png'
      ext: '.png',

      // default assets/folder size, by default "72x72"
      // available via Twitter CDN: 72
      size: '72x72',

      // default class name, by default 'emoji'
      className: 'emoji',

      // basic utilities / helpers to convert code points
      // to JavaScript surrogates and vice versa
      convert: {

        /**
         * Given an HEX codepoint, returns UTF16 surrogate pairs.
         *
         * @param   string  generic codepoint, i.e. '1F4A9'
         * @return  string  codepoint transformed into utf16 surrogates pair,
         *          i.e. \uD83D\uDCA9
         *
         * @example
         *  twemoji.convert.fromCodePoint('1f1e8');
         *  // "\ud83c\udde8"
         *
         *  '1f1e8-1f1f3'.split('-').map(twemoji.convert.fromCodePoint).join('')
         *  // "\ud83c\udde8\ud83c\uddf3"
         */
        fromCodePoint: fromCodePoint,

        /**
         * Given UTF16 surrogate pairs, returns the equivalent HEX codepoint.
         *
         * @param   string  generic utf16 surrogates pair, i.e. \uD83D\uDCA9
         * @param   string  optional separator for double code points, default='-'
         * @return  string  utf16 transformed into codepoint, i.e. '1F4A9'
         *
         * @example
         *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
         *  // "1f1e8-1f1f3"
         *
         *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
         *  // "1f1e8~1f1f3"
         */
        toCodePoint: toCodePoint
      },


    /////////////////////////
    //       methods       //
    /////////////////////////

      /**
       * User first: used to remove missing images
       * preserving the original text intent when
       * a fallback for network problems is desired.
       * Automatically added to Image nodes via DOM
       * It could be recycled for string operations via:
       *  $('img.emoji').on('error', twemoji.onerror)
       */
      onerror: function onerror() {
        if (this.parentNode) {
          this.parentNode.replaceChild(createText(this.alt, false), this);
        }
      },

      /**
       * Main method/logic to generate either <img> tags or HTMLImage nodes.
       *  "emojify" a generic text or DOM Element.
       *
       * @overloads
       *
       * String replacement for `innerHTML` or server side operations
       *  twemoji.parse(string);
       *  twemoji.parse(string, Function);
       *  twemoji.parse(string, Object);
       *
       * HTMLElement tree parsing for safer operations over existing DOM
       *  twemoji.parse(HTMLElement);
       *  twemoji.parse(HTMLElement, Function);
       *  twemoji.parse(HTMLElement, Object);
       *
       * @param   string|HTMLElement  the source to parse and enrich with emoji.
       *
       *          string              replace emoji matches with <img> tags.
       *                              Mainly used to inject emoji via `innerHTML`
       *                              It does **not** parse the string or validate it,
       *                              it simply replaces found emoji with a tag.
       *                              NOTE: be sure this won't affect security.
       *
       *          HTMLElement         walk through the DOM tree and find emoji
       *                              that are inside **text node only** (nodeType === 3)
       *                              Mainly used to put emoji in already generated DOM
       *                              without compromising surrounding nodes and
       *                              **avoiding** the usage of `innerHTML`.
       *                              NOTE: Using DOM elements instead of strings should
       *                              improve security without compromising too much
       *                              performance compared with a less safe `innerHTML`.
       *
       * @param   Function|Object  [optional]
       *                              either the callback that will be invoked or an object
       *                              with all properties to use per each found emoji.
       *
       *          Function            if specified, this will be invoked per each emoji
       *                              that has been found through the RegExp except
       *                              those follwed by the invariant \uFE0E ("as text").
       *                              Once invoked, parameters will be:
       *
       *                                iconId:string     the lower case HEX code point
       *                                                  i.e. "1f4a9"
       *
       *                                options:Object    all info for this parsing operation
       *
       *                                variant:char      the optional \uFE0F ("as image")
       *                                                  variant, in case this info
       *                                                  is anyhow meaningful.
       *                                                  By default this is ignored.
       *
       *                              If such callback will return a falsy value instead
       *                              of a valid `src` to use for the image, nothing will
       *                              actually change for that specific emoji.
       *
       *
       *          Object              if specified, an object containing the following properties
       *
       *            callback   Function  the callback to invoke per each found emoji.
       *            base       string    the base url, by default twemoji.base
       *            ext        string    the image extension, by default twemoji.ext
       *            size       string    the assets size, by default twemoji.size
       *
       * @example
       *
       *  twemoji.parse("I \u2764\uFE0F emoji!");
       *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
       *
       *
       *  twemoji.parse("I \u2764\uFE0F emoji!", function(iconId, options) {
       *    return '/assets/' + iconId + '.gif';
       *  });
       *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
       *
       *
       * twemoji.parse("I \u2764\uFE0F emoji!", {
       *   size: 72,
       *   callback: function(iconId, options) {
       *     return '/assets/' + options.size + '/' + iconId + options.ext;
       *   }
       * });
       *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/72x72/2764.png"/> emoji!
       *
       */
      parse: parse,

      /**
       * Given a string, invokes the callback argument
       *  per each emoji found in such string.
       * This is the most raw version used by
       *  the .parse(string) method itself.
       *
       * @param   string    generic string to parse
       * @param   Function  a generic callback that will be
       *                    invoked to replace the content.
       *                    This calback wil receive standard
       *                    String.prototype.replace(str, callback)
       *                    arguments such:
       *  callback(
       *    rawText,  // the emoji match
       *  );
       *
       *                    and others commonly received via replace.
       */
      replace: replace,

      /**
       * Simplify string tests against emoji.
       *
       * @param   string  some text that might contain emoji
       * @return  boolean true if any emoji was found, false otherwise.
       *
       * @example
       *
       *  if (twemoji.test(someContent)) {
       *    console.log("emoji All The Things!");
       *  }
       */
      test: test
    },

    // used to escape HTML special chars in attributes
    escaper = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    },

    // RegExp based on emoji's official Unicode standards
    // http://www.unicode.org/Public/UNIDATA/EmojiSources.txt
    re = /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,

    // avoid runtime RegExp creation for not so smart,
    // not JIT based, and old browsers / engines
    UFE0Fg = /\uFE0F/g,

    // avoid using a string literal like '\u200D' here because minifiers expand it inline
    U200D = String.fromCharCode(0x200D),

    // used to find HTML special chars in attributes
    rescaper = /[&<>'"]/g,

    // nodes with type 1 which should **not** be parsed
    shouldntBeParsed = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,

    // just a private shortcut
    fromCharCode = String.fromCharCode;

  return twemoji;


  /////////////////////////
  //  private functions  //
  //     declaration     //
  /////////////////////////

  /**
   * Shortcut to create text nodes
   * @param   string  text used to create DOM text node
   * @return  Node  a DOM node with that text
   */
  function createText(text, clean) {
    return document.createTextNode(clean ? text.replace(UFE0Fg, '') : text);
  }

  /**
   * Utility function to escape html attribute text
   * @param   string  text use in HTML attribute
   * @return  string  text encoded to use in HTML attribute
   */
  function escapeHTML(s) {
    return s.replace(rescaper, replacer);
  }

  /**
   * Default callback used to generate emoji src
   *  based on Twitter CDN
   * @param   string    the emoji codepoint string
   * @param   string    the default size to use, i.e. "36x36"
   * @return  string    the image source to use
   */
  function defaultImageSrcGenerator(icon, options) {
    return ''.concat(options.base, options.size, '/', icon, options.ext);
  }

  /**
   * Given a generic DOM nodeType 1, walk through all children
   * and store every nodeType 3 (#text) found in the tree.
   * @param   Element a DOM Element with probably some text in it
   * @param   Array the list of previously discovered text nodes
   * @return  Array same list with new discovered nodes, if any
   */
  function grabAllTextNodes(node, allText) {
    var
      childNodes = node.childNodes,
      length = childNodes.length,
      subnode,
      nodeType;
    while (length--) {
      subnode = childNodes[length];
      nodeType = subnode.nodeType;
      // parse emoji only in text nodes
      if (nodeType === 3) {
        // collect them to process emoji later
        allText.push(subnode);
      }
      // ignore all nodes that are not type 1, that are svg, or that
      // should not be parsed as script, style, and others
      else if (nodeType === 1 && !('ownerSVGElement' in subnode) &&
          !shouldntBeParsed.test(subnode.nodeName.toLowerCase())) {
        grabAllTextNodes(subnode, allText);
      }
    }
    return allText;
  }

  /**
   * Used to both remove the possible variant
   *  and to convert utf16 into code points.
   *  If there is a zero-width-joiner (U+200D), leave the variants in.
   * @param   string    the raw text of the emoji match
   * @return  string    the code point
   */
  function grabTheRightIcon(rawText) {
    // if variant is present as \uFE0F
    return toCodePoint(rawText.indexOf(U200D) < 0 ?
      rawText.replace(UFE0Fg, '') :
      rawText
    );
  }

  /**
   * DOM version of the same logic / parser:
   *  emojify all found sub-text nodes placing images node instead.
   * @param   Element   generic DOM node with some text in some child node
   * @param   Object    options  containing info about how to parse
    *
    *            .callback   Function  the callback to invoke per each found emoji.
    *            .base       string    the base url, by default twemoji.base
    *            .ext        string    the image extension, by default twemoji.ext
    *            .size       string    the assets size, by default twemoji.size
    *
   * @return  Element same generic node with emoji in place, if any.
   */
  function parseNode(node, options) {
    var
      allText = grabAllTextNodes(node, []),
      length = allText.length,
      attrib,
      attrname,
      modified,
      fragment,
      subnode,
      text,
      match,
      i,
      index,
      img,
      rawText,
      iconId,
      src;
    while (length--) {
      modified = false;
      fragment = document.createDocumentFragment();
      subnode = allText[length];
      text = subnode.nodeValue;
      i = 0;
      while ((match = re.exec(text))) {
        index = match.index;
        if (index !== i) {
          fragment.appendChild(
            createText(text.slice(i, index), true)
          );
        }
        rawText = match[0];
        iconId = grabTheRightIcon(rawText);
        i = index + rawText.length;
        src = options.callback(iconId, options);
        if (iconId && src) {
          img = new Image();
          img.onerror = options.onerror;
          img.setAttribute('draggable', 'false');
          attrib = options.attributes(rawText, iconId);
          for (attrname in attrib) {
            if (
              attrib.hasOwnProperty(attrname) &&
              // don't allow any handlers to be set + don't allow overrides
              attrname.indexOf('on') !== 0 &&
              !img.hasAttribute(attrname)
            ) {
              img.setAttribute(attrname, attrib[attrname]);
            }
          }
          img.className = options.className;
          img.alt = rawText;
          img.src = src;
          modified = true;
          fragment.appendChild(img);
        }
        if (!img) fragment.appendChild(createText(rawText, false));
        img = null;
      }
      // is there actually anything to replace in here ?
      if (modified) {
        // any text left to be added ?
        if (i < text.length) {
          fragment.appendChild(
            createText(text.slice(i), true)
          );
        }
        // replace the text node only, leave intact
        // anything else surrounding such text
        subnode.parentNode.replaceChild(fragment, subnode);
      }
    }
    return node;
  }

  /**
   * String/HTML version of the same logic / parser:
   *  emojify a generic text placing images tags instead of surrogates pair.
   * @param   string    generic string with possibly some emoji in it
   * @param   Object    options  containing info about how to parse
   *
   *            .callback   Function  the callback to invoke per each found emoji.
   *            .base       string    the base url, by default twemoji.base
   *            .ext        string    the image extension, by default twemoji.ext
   *            .size       string    the assets size, by default twemoji.size
   *
   * @return  the string with <img tags> replacing all found and parsed emoji
   */
  function parseString(str, options) {
    return replace(str, function (rawText) {
      var
        ret = rawText,
        iconId = grabTheRightIcon(rawText),
        src = options.callback(iconId, options),
        attrib,
        attrname;
      if (iconId && src) {
        // recycle the match string replacing the emoji
        // with its image counter part
        ret = '<img '.concat(
          'class="', options.className, '" ',
          'draggable="false" ',
          // needs to preserve user original intent
          // when variants should be copied and pasted too
          'alt="',
          rawText,
          '"',
          ' src="',
          src,
          '"'
        );
        attrib = options.attributes(rawText, iconId);
        for (attrname in attrib) {
          if (
            attrib.hasOwnProperty(attrname) &&
            // don't allow any handlers to be set + don't allow overrides
            attrname.indexOf('on') !== 0 &&
            ret.indexOf(' ' + attrname + '=') === -1
          ) {
            ret = ret.concat(' ', attrname, '="', escapeHTML(attrib[attrname]), '"');
          }
        }
        ret = ret.concat('/>');
      }
      return ret;
    });
  }

  /**
   * Function used to actually replace HTML special chars
   * @param   string  HTML special char
   * @return  string  encoded HTML special char
   */
  function replacer(m) {
    return escaper[m];
  }

  /**
   * Default options.attribute callback
   * @return  null
   */
  function returnNull() {
    return null;
  }

  /**
   * Given a generic value, creates its squared counterpart if it's a number.
   *  As example, number 36 will return '36x36'.
   * @param   any     a generic value.
   * @return  any     a string representing asset size, i.e. "36x36"
   *                  only in case the value was a number.
   *                  Returns initial value otherwise.
   */
  function toSizeSquaredAsset(value) {
    return typeof value === 'number' ?
      value + 'x' + value :
      value;
  }


  /////////////////////////
  //  exported functions //
  //     declaration     //
  /////////////////////////

  function fromCodePoint(codepoint) {
    var code = typeof codepoint === 'string' ?
          parseInt(codepoint, 16) : codepoint;
    if (code < 0x10000) {
      return fromCharCode(code);
    }
    code -= 0x10000;
    return fromCharCode(
      0xD800 + (code >> 10),
      0xDC00 + (code & 0x3FF)
    );
  }

  function parse(what, how) {
    if (!how || typeof how === 'function') {
      how = {callback: how};
    }
    // if first argument is string, inject html <img> tags
    // otherwise use the DOM tree and parse text nodes only
    return (typeof what === 'string' ? parseString : parseNode)(what, {
      callback:   how.callback || defaultImageSrcGenerator,
      attributes: typeof how.attributes === 'function' ? how.attributes : returnNull,
      base:       typeof how.base === 'string' ? how.base : twemoji.base,
      ext:        how.ext || twemoji.ext,
      size:       how.folder || toSizeSquaredAsset(how.size || twemoji.size),
      className:  how.className || twemoji.className,
      onerror:    how.onerror || twemoji.onerror
    });
  }

  function replace(text, callback) {
    return String(text).replace(re, callback);
  }

  function test(text) {
    // IE6 needs a reset before too
    re.lastIndex = 0;
    var result = re.test(text);
    re.lastIndex = 0;
    return result;
  }

  function toCodePoint(unicodeSurrogates, sep) {
    var
      r = [],
      c = 0,
      p = 0,
      i = 0;
    while (i < unicodeSurrogates.length) {
      c = unicodeSurrogates.charCodeAt(i++);
      if (p) {
        r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
        p = 0;
      } else if (0xD800 <= c && c <= 0xDBFF) {
        p = c;
      } else {
        r.push(c.toString(16));
      }
    }
    return r.join(sep || '-');
  }

}());
if (!location.protocol) {
  twemoji.base = twemoji.base.replace(/^http:/, "");
}
module.exports = twemoji;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
function lojax(method, route, params) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        resolve(xhttp.responseText);
      } else if (xhttp.readyState == 4 && xhttp.status != 200) {
        resolve(xhttp.responseText);
      }
    };
    xhttp.open(method, route, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(params));
  });
}

module.exports = {
  create: function (model, params) {
    const method = 'POST';
    const route = '/api/' + model + 's';
    return lojax(method, route, params)
  },
  read: function (model, params) {
    const method = 'GET';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else if (params.email && model === 'user') {
      route = '/api/' + model + 's/' + params.email;
    }
    return lojax(method, route, params)
  },
  update: function (model, params) {
    const method = 'PUT';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else {
      return 'Update requires an id!';
    }
    return lojax(method, route, params)
  },
  delete: function (model, params) {
    const method = 'DELETE';
    let route = '/api/' + model + 's';
    if (params.id) {
      route = '/api/' + model + 's/' + params.id;
    } else {
      return 'Delete requires an id!';
    }
    return lojax(method, route, params)
  },
  logout: function () {
    const method = 'POST';
    const route = '/api/users/logout';
    return lojax(method, route)
  },
  login: function (email, password) {
    const method = 'POST';
    const route = '/api/users/login';
    return lojax(method, route, { email, password })
  },
};

},{}],3:[function(require,module,exports){
const lo = require('./api/lojax.js')
let claps = 0

class Clap {
  constructor (id) {
    this.id = id,
    this.claps = 0
  }

  async clap (event) {
    this.claps++
    if (!event.target.classList.contains('clap')) {
      return false
    }
    const clap = event.target
    const wrapper = event.target.parentElement
    const count = wrapper.querySelector('.count')
    let clapCount = parseInt(count.innerHTML)
    if (!clapCount) {
      clapCount = 0
    }
    let currentCount = await lo.update('post', {id: this.id, claps: (clapCount + 1)})
    const confetti = wrapper.querySelector('.confetti')
    const plus = wrapper.querySelector('.plus')
    const bits = confetti.querySelectorAll('.bit')
    clap.classList.add('text-gray-800')
    clap.style = '-webkit-transform: scale3d(1.1,1.1,1.1)'
    confetti.classList.replace('hidden', 'visible')
    bits.forEach((bit) => {
      bit.classList.replace('opacity-0', 'opacity-100')
    })
    setTimeout(() => {
      confetti.classList.replace('scale-50', 'scale-110')
    }, 50)
    plus.classList.replace('opacity-0', 'opacity-100')
    plus.classList.replace('translate-y-0', '-translate-y-2')
    plus.innerHTML = '+' + this.claps
    count.classList.add('-translate-y-2', 'opacity-0')
    setTimeout(() => {
      clap.classList.remove('text-gray-800')
      clap.style = '-webkit-transform: scale3d(1,1,1)'
      confetti.classList.replace('visible', 'hidden')
      bits.forEach((bit) => {
        bit.classList.replace('opacity-100', 'opacity-0')
      })
      plus.classList.replace('-translate-y-2', 'translate-y-0')
      plus.classList.replace('opacity-100', 'opacity-0')
      count.innerHTML = JSON.parse(currentCount).claps
      if (JSON.parse(currentCount).claps == 1) {
        count.innerHTML = '1'
        count.parentElement.innerHTML += ' claps'
      }
      count.classList.remove('-translate-y-2', 'opacity-0')
      setTimeout(() => {
        confetti.classList.replace('scale-110', 'scale-50')
      }, 150)
    }, 300)
  }
}

module.exports = {
  start: (id) => new Clap(id)
}

},{"./api/lojax.js":2}],4:[function(require,module,exports){
var stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"];

function dot(vector1, vector2) {
  var result = 0;
  for (var i = 0; i < vector1.length; i++) {
    result += vector1[i] * vector2[i];
  }
  return result;
}

function sentenceTokinization (text) {
  return text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
};

function tokenizeWords(text) {
  var processedText = text.replace(/[^a-zA-Z ]/g, "");
  processedText = processedText.replace(/\d+/g, '');
  var words = processedText.split(/\W+/).filter(function(token) {
      token = token.toLowerCase();
      return token.length >= 2 && stopwords.indexOf(token) == -1;
  });
  return words;
}
var nGramNumber = 2

function generate_ngrams (words, n) {
  var nGramsList = [];
  for (let i = 0; i < words.length; i++) {
    var nGramWord = words.slice(i, i + nGramNumber).join(' ');
    if (nGramWord.split(' ').length >= 2) {
      nGramsList.push(nGramWord);
    }
  }
  return nGramsList;
}

function frequencyOfWords(words) {
  var freq = {};
  var uniqueWords = [];
  for (let i = 0; i < words.length; i++) {
    if (!uniqueWords.includes(words[i])) {
      uniqueWords.push(words[i]);
    }
  }
  for (let i = 0; i < words.length; i++) {
    var result = words.filter(word => word === words[i]);
    freq[words[i]] = result.length;
  }
  return freq;
}

function tfScore (word, sentence) {
  var wordFreqInSentence = 1;
  var sentenceInNGrams = generate_ngrams(sentence.split(' '), nGramNumber);
  for (let i = 0; i < sentenceInNGrams.length; i++) {
    if (word === sentenceInNGrams[i]) {
      wordFreqInSentence++;
    }
  }
  var tf = wordFreqInSentence / sentenceInNGrams.length;
  return tf;
}

function idfScore (word, sentences) {
  var noOfSentencesContainingWord = 1;
  for (let i = 0; i < sentences.length; i++) {
    let eachSentenceInNGrams = generate_ngrams(sentences[i].split(' '), nGramNumber);
    for (let k = 0; k < eachSentenceInNGrams.length; k++) {
      if (word === eachSentenceInNGrams[k]) {
        noOfSentencesContainingWord++;
      }
    }
  }
  var idf = Math.log10(sentences.length / noOfSentencesContainingWord);
  return idf;
}

function createMatrix (text) {
  //Tokenize Sentences
  var sentences = sentenceTokinization(text);
  var numberOfWords = [];
  for (let i = 0; i < sentences.length; i++) {
    let words = generate_ngrams(tokenizeWords(sentences[i]), nGramNumber);
    numberOfWords.push(words.length);
  }
  var numberOfColumns = Math.max(...numberOfWords);
  var matrix = [];
  for (let i = 0; i < sentences.length; i++) {
    let words = generate_ngrams(tokenizeWords(sentences[i]), nGramNumber);
    let thisSentence = [];
    for (let k = 0; k < numberOfColumns; k++) {
      if (words[k]) {
        let tf = tfScore(words[k], sentences[i]);
        let idf = idfScore(words[k], sentences);
        let tfidfValue = tf * idf;
        thisSentence.push(tfidfValue);
      } else {
        thisSentence.push(0);
      }
    }
    matrix.push(thisSentence);
  }
  return matrix;
}

function zeros (columns, rows) {
  var matrix = [];
  var rowMatrix = [];
  for (let i = 0; i < columns; i++) {
    rowMatrix = [];
    for (let k = 0; k < rows; k++) {
      rowMatrix.push(0);
    }
    matrix.push(rowMatrix);
  }
  return matrix;
}

function cosineSimilarity (matrix) {
  var resultMatrix = zeros(matrix.length, matrix[0].length);
  var rowCount = 0;
  var columnCount = 0;
  for (let i = 0; i < matrix.length; i++) {
    var A = matrix[i];
    columnCount = 0;
    for (let k = 0; k < matrix.length; k++) {
      var B = matrix[k];
      abDotProduct = dot(A, B);
      denominator = Math.sqrt(dot(A, A)) * Math.sqrt(dot(B, B));
      cosTheta = abDotProduct / denominator;
      resultMatrix[rowCount][columnCount] = cosTheta;
      columnCount++;
    }
    rowCount++;
  }
  var sentenceImportance = {};
  var count = 0;
  for (let i = 0; i < resultMatrix.length; i++) {
    sentenceImportance[count] = resultMatrix[i].reduce((a, b) => a + b, 0) / resultMatrix[i].length;
    count++;
  }
  return sentenceImportance;
}

function sortObjectEntries(obj, n){
  let sortedList = []
  //Sorting by values asc
  sortedList = Object.entries(obj).sort((a,b)=>{
      if(b[1] > a[1]) return 1;
      else if(b[1] < a[1]) return -1;
  //if values are same do edition checking if keys are in the right order
      else {
         if(a[0] > b[0]) return 1;
         else if(a[0] < b[0]) return -1;
         else return 0
  }
  })
  // return first n values from sortedList
  return sortedList.map(el=>el[0]).slice(0,n)
}

function dumas (text, k) {
  var matrix = createMatrix(text);
  var cosSim = cosineSimilarity(matrix);
  var importantSentencesArray = sortObjectEntries(cosSim, k);
  var sentences = sentenceTokinization(text);
  var importantSentences = [];
  for (let i = 0; i < k; i++) {
    importantSentences.push(sentences[importantSentencesArray[i]]);
  }
  return importantSentences.join(' ');
}

module.exports = { dumas: dumas }

},{}],5:[function(require,module,exports){
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

},{"./api/lojax.js":2,"./clap.js":3,"./dumas.js":4,"./modal.js":6}],6:[function(require,module,exports){
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

},{"./api/lojax.js":2,"./tailwind-toast/twtoast.js":10}],7:[function(require,module,exports){
const h = require('../utils/helpers')
const options = require('../utils/options.json')
const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero', 'ten', 'eleven']

class Snackbar {
  constructor (color, icon, duration, positionX, positionY, fontColor, fontTone, tone, shape, speed) {
    this.color = color,
      this.icon = icon,
      this.duration = duration,
      this.positionX = positionX,
      this.positionY = positionY,
      this.fontColor = fontColor,
      this.fontTone = fontTone,
      this.tone = tone,
      this.shape = shape,
      this.speed = speed,
      this.buttons = [],
      this.html,
      this.id,
      this.title,
      this.message
  }

  as (shape) {
    this.shape = shape
    return this
  }

  for (ms) {
    this.duration = ms
    return this
  }

  from (positionY, positionX = this.positionX) {
    this.positionX = positionX
    this.postionY = positionY
    return this
  }

  with (params) {
    Object.keys(params).forEach((p) => {
      let object = params
      if (options.includes(p)) {
        eval('this.' + p + ' = ' + 'object.' + p)
      }
    })
    return this
  }

  default (title, message) {
    this.title = title
    this.message = message
    return this
  }

  danger (title, message) {
    this.title = title
    this.message = message
    this.color = 'red'
    this.fontColor = 'gray'
    this.icon = 'fas fa-hand-paper'
    return this
  }

  success (title, message) {
    this.title = title
    this.message = message
    this.color = 'green'
    this.fontColor = 'gray'
    this.icon = 'fas fa-check'
    return this
  }

  warning (title, message) {
    this.title = title
    this.message = message
    this.color = 'yellow'
    this.fontColor = 'gray'
    this.icon = 'fas fa-exclamation-triangle'
    return this
  }

  addButtons (...buttonObjects) {
    this.buttons = buttonObjects
    return this
  }

  hide () {
    let snackbar = document.querySelector("#" + this.id)
    snackbar.classList.remove(`${this.positionY === 'top' ? 'translate-y-36' : '-translate-y-36'}`)
    snackbar.classList.add(`${this.positionY === 'top' ? '-translate-y-36' : 'translate-y-36'}`)
    setTimeout(() => {
      snackbar.remove()
    }, (this.speed + 100))
  }

  show () {
    this.shape = this.shape === 'pill' ? 'rounded-full' : 'rounded'
    let wrapper = document.createElement('DIV')
    wrapper.classList = `absolute ease-in-out transform duration-${this.speed} -${this.positionY}-24 flex justify-${this.positionX} w-full`
    wrapper.innerHTML = eval('`' + h.getFile('../templates/snackbar.toast') + '`')
    this.id = `tawilwind-snackbar-${numbers[Math.floor(Math.random() * Math.floor(11))]}`
    wrapper.id = this.id
    let buttonWrapper = wrapper.querySelector('.twsnackbar').querySelector('#buttons')
    this.buttons.forEach((button) => {
      let newButton = document.createElement('DIV')
      newButton.classList = `cursor-pointer hover:bg-${this.color}-${(parseInt(this.tone) + 100)} p-2 rounded flex justify-center items-center`
      newButton.innerHTML = `<b class="uppercase"> ${Object.keys(button)[0]}</b>`
      newButton.onclick = Object.values(button)[0]
      buttonWrapper.append(newButton)
    })
    document.body.prepend(wrapper)
    setTimeout(() => {
      document.querySelector("#" + this.id)
        .classList
        .add(`${this.positionY === 'top' ? 'translate-y-36' : '-translate-y-36'}`)
    }, 1)
  }
}

module.exports = Snackbar

},{"../utils/helpers":11,"../utils/options.json":12}],8:[function(require,module,exports){
const h = require('../utils/helpers')
const options = require('../utils/options.json')
const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero', 'ten', 'eleven']
const twemoij = require('twemoji');

class Toast {
  constructor (color, icon, duration, positionX, positionY, fontColor, fontTone, tone, shape, speed) {
    this.color = color,
    this.icon = icon,
    this.duration = duration,
    this.positionX = positionX,
    this.positionY = positionY,
    this.fontColor = fontColor,
    this.fontTone = fontTone,
    this.tone = tone,
    this.shape = shape,
    this.speed = speed,
    this.buttons = [],
    this.html,
    this.id,
    this.title,
    this.message
  }

  as (shape) {
    this.shape = shape
    return this
  }

  for (ms) {
    this.time = ms
    return this
  }

  from (positionY, positionX = this.positionX) {
    this.positionX = positionX
    this.postionY = positionY
    return this
  }

  with (params) {
    Object.keys(params).forEach((p) => {
      let object = params
      if (options.includes(p)) {
        eval('this.' + p + ' = ' + 'object.' + p)
      }
    })
    return this
  }

  default (title, message) {
    this.title = title
    this.message = message
    return this
  }

  danger (title, message) {
    this.title = title
    this.message = message
    this.color = 'red'
    this.fontColor = 'gray'
    this.icon = 'fas fa-hand-paper'
    return this
  }

  success (title, message) {
    this.title = title
    this.message = message
    this.color = 'green'
    this.fontColor = 'gray'
    this.icon = 'fas fa-check'
    return this
  }

  warning (title, message) {
    this.title = title
    this.message = message
    this.color = 'yellow'
    this.fontColor = 'gray'
    this.icon = 'fas fa-exclamation-triangle'
    return this
  }

  show () {
    this.shape = this.shape === 'pill' ? 'rounded-full' : 'rounded'
    let wrapper = document.createElement('DIV')
    wrapper.classList = `fixed z-50 ease-in-out transform duration-${this.speed} -${this.positionY}-24 flex justify-${this.positionX} w-full`
    wrapper.innerHTML = `<div class="twthis flex items-center mx-4 text-${this.fontColor}-${this.fontTone} px-6 py-4 border-0 ${this.shape} relative mb-4 bg-${this.color}-${this.tone}">
      <span id="charecters" class="lg:text-3xl md:text-2xl sm:text-xl" style="padding-right: 10px;">
        ${this.icon}
      </span>
      <span class="">
        <b class="title">${this.title}</b> ${this.message}
      </span>
    </div>`
    this.id = `tawilwind-toast-${numbers[Math.floor(Math.random() * Math.floor(11))]}`
    wrapper.id = this.id
    twemoji.parse(wrapper);
    document.body.prepend(wrapper)
    let toast = document.querySelector("#" + this.id)
    setTimeout(() => {
      toast.classList.add(`${this.position === 'top' ? '-translate-y-36' : 'translate-y-36'}`)
    }, 1)
    setTimeout(() => {
      let toast = document.querySelector("#" + this.id)
      toast.classList.remove(`${this.position === 'top' ? '-translate-y-36' : 'translate-y-36'}`)
      toast.classList.add(`${this.position === 'top' ? 'translate-y-36' : '-translate-y-36'}`)
    }, this.duration)
    setTimeout(() => {
      toast.remove()
    }, (this.duration + this.speed + 100))
  }
}

module.exports = Toast

},{"../utils/helpers":11,"../utils/options.json":12,"twemoji":1}],9:[function(require,module,exports){
{
  //default values
  modules: [
    //custom modules
  ]
}

},{}],10:[function(require,module,exports){
const config = require('./twtoast.config.js')
const Toast = require('./classes/Toast')
const Snackbar = require('./classes/Snackbar')

if (config.methods) {
  config.methods.forEach((method) => {
    eval('Toast.prototype.' + Object.keys(method)[0] + ' = ' + Object.values(method))
    eval('Snackbar.prototype.' + Object.keys(method)[0] + ' = ' + Object.values(method))
  })
}

module.exports = {
  toast: () => {
    return new Toast(
      config.color ? config.color : 'blue',
      config.icon ? config.icon : 'fas fa-bell',
      config.duration ? config.duration : 3000,
      config.positionX ? config.positionX : 'center',
      config.positionY ? config.positionY : 'top',
      config.fontColor ? config.fontColor : 'grey',
      config.fontTone ? config.fontTone : 100,
      config.tone ? config.tone : 500,
      config.shape ? config.shape : 'square',
      config.speed ? config.speed : 500
    )
  },

  snackbar: () => {
    return new Snackbar(
      config.color ? config.color : 'blue',
      config.icon ? config.icon : 'fas fa-bell',
      config.duration ? config.duration : 3000,
      config.positionX ? config.positionX : 'center',
      config.positionY ? config.positionY : 'top',
      config.fontColor ? config.fontColor : 'grey',
      config.fontTone ? config.fontTone : 100,
      config.tone ? config.tone : 500,
      config.shape ? config.shape : 'square',
      config.speed ? config.speed : 500
    )
  }
}

},{"./classes/Snackbar":7,"./classes/Toast":8,"./twtoast.config.js":9}],11:[function(require,module,exports){
function getFile(file) {
  var x = new XMLHttpRequest();
  x.open('GET', file, false);
  x.send();
  return x.responseText;
}

module.exports = {
  getFile: getFile
}

},{}],12:[function(require,module,exports){
module.exports=[
  "color",
  "title",
  "message",
  "icon",
  "duration",
  "postion",
  "fontColor",
  "fontTone",
  "tone",
  "shape",
  "speed"
]

},{}]},{},[5]);
