'use strict'

var tg = require('telegram-node-bot')('218892755:AAES6qdhI1wt39YDDL6Hrp6e3hMGy4ZrszU')
var request = require('request')
const BASE_URL = 'https://yande.re/post.json?limit=100'

tg.router.
  when(['/start'], 'AppController').
  when(['/help'], 'AppController').
  when(['/tags'], 'PhotoController').
  when(['/tags :tags'], 'PhotoController').
  when(['/thighhighs'], 'PhotoController').
  when(['/pantsu'], 'PhotoController').
  when(['/nipples'], 'PhotoController').
  when(['/swimsuits'], 'PhotoController').
  when(['/animal_ears'], 'PhotoController').
  when(['/loli'], 'PhotoController').
  otherwise('OtherwiseController')

tg.controller('AppController', ($) => {
  tg.for('/start', () => {
    $.sendMessage("Type / to see a list of commands.")
    $.sendMessage("Type @yandere_girl_bot to search images.")
  })

  tg.for('/help', () => {
    $.sendMessage("Type / to see a list of commands.")
    $.sendMessage("Type @yandere_girl_bot to search images.")
  })
})

tg.controller('PhotoController', ($) => {
  tg.for('/tags', () => {
    getPost('', $)
  })

  tg.for('/tags :tags', () => {
    var tags = $.query.tags
    getPost(tags, $)
  })

  tg.for('/thighhighs', () => {
    getPost('thighhighs', $)
  })

  tg.for('/pantsu', () => {
    getPost('pantsu', $)
  })

  tg.for('/nipples', () => {
    getPost('nipples', $)
  })

  tg.for('/swimsuits', () => {
    getPost('swimsuits', $)
  })

  tg.for('/animal_ears', () => {
    getPost('animal_ears', $)
  })

  tg.for('/loli', () => {
    getPost('loli', $)
  })
})

tg.controller('OtherwiseController', ($) => {

})

tg.inlineMode(($) => {
  console.log('inlineMode... tags: ' + $.query)
  
  request.get({
    url: BASE_URL + '&tags=' + $.query,
    json: true
  }, (error, response, body) => {
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

function getPost(tags, $) {
  console.log('getPost... tags: ' + tags)

  request.get({
    url: BASE_URL + '&tags=' + tags,
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
