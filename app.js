'use strict'

const fs = require('fs');
const path = require('path');
const request = require('request')
const config = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));
const tg = require('telegram-node-bot')(config.token)
const BASE_URL = 'https://yande.re/post.json?limit=100'

/**
 * Command mode.
 */
tg.router.
  when([
    '/start',
    '/help',
    '/tags',
    '/tags :tags',
    '/thighhighs',
    '/pantsu',
    '/nipples',
    '/swimsuits',
    '/animal_ears',
    '/loli'
  ], 'AppController').
  otherwise('OtherwiseController')

tg.controller('AppController', ($) => {
  tg.for('/start', () => {
    $.sendMessage("Type " + config.username + " to search images.")
  })

  tg.for('/help', () => {
    $.sendMessage("Type " + config.username + " to search images.")
  })

  tg.for('/tags',         () => { getPost('') })
  tg.for('/tags :tags',   () => { getPost($.query.tags) })
  tg.for('/thighhighs',   () => { getPost('thighhighs') })
  tg.for('/pantsu',       () => { getPost('pantsu') })
  tg.for('/nipples',      () => { getPost('nipples') })
  tg.for('/swimsuits',    () => { getPost('swimsuits') })
  tg.for('/animal_ears',  () => { getPost('animal_ears') })
  tg.for('/loli',         () => { getPost('loli') })

  /**
   * Get one random post by tags.
   */
  function getPost(tags) {
    console.log('Command mode: ' + tags)

    request.get({
      url: BASE_URL + '&tags=' + tags.trim(),
      json: true
    }, (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        if (body.length > 0) {
          var post = body[getRandomInt(0, body.length+1)]
          if (post) {
            $.sendPhotoFromUrl(post.sample_url)
          } else {
            $.sendMessage('OOPS, try it again.')
          }
        } else {
          $.sendMessage('OOPS, please try other tags.')
        }
      }
    })
  }
})

tg.controller('OtherwiseController', ($) => {

})

/**
 * Inline mode.
 * Fetch and paginate all posts.
 */
tg.inlineMode(($) => {
  console.log('Inline mode: ' + $.query)

  fetchPosts($.query, (error, response, body) => {
    if (error) {
      console.log(error);
    } else {
      if (body.length > 0) {
        var results = []

        for (var i = 0; i < body.length; i++) {
          results.push({
            type: 'photo',
            photo_url: body[i].sample_url,
            thumb_url: body[i].preview_url,
            photo_width: body[i].sample_width,
            photo_height: body[i].sample_height
          })
        }

        shuffle(results)
        $.paginatedAnswer(results, 6)
      }
    }
  })
})

/**
 * Get posts by tags with callback.
 */
function fetchPosts(tags, callback) {
  request.get({
    url: BASE_URL + '&tags=' + tags,
    json: true
  }, (error, response, body) => {
    callback(error, response, body)
  })
}

/**
 * Returns a random integer between min (included) and max (excluded)
 * @param  {number} min included
 * @param  {number} max excluded
 * @return {number} a random integer
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
