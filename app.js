'use strict'

var tg = require('telegram-node-bot')('218892755:AAES6qdhI1wt39YDDL6Hrp6e3hMGy4ZrszU')
var request = require('request')
const BASE_URL = 'https://yande.re/post.json?limit=100'

tg.router.
  when(['/start'], 'AppController').
  when(['/pic'], 'PhotoController').
  when(['/pic :tags'], 'PhotoController')


tg.controller('AppController', ($) => {
  tg.for('/start', () => {
    runMenu($)
  })
});

tg.controller('PhotoController', ($) => {
  tg.for('/pic', () => {
    getPost('', $)
  })

  tg.for('/pic :tags', () => {
    var tags = $.query.tags
    getPost(tags, $)
  })
})

function runMenu($) {
  $.runMenu({
    message: '',
    layout: 3,
    'thighhighs': () => { console.log(1); getPost('thighhighs', $) },
    'pantsu': () => { getPost('pantsu', $) },
    'nipples': () => { getPost('nipples', $) },
    'swimsuits': () => { getPost('swimsuits', $) },
    'animal_ears': () => { getPost('animal_ears', $) },
    'loli': () => { getPost('loli', $) },
    'random': () => { getPost('', $) }
  })
}

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
        $.sendPhotoFromUrl(post.sample_url)
        runMenu($)
      } else {
        $.sendMessage('找不到你要的图片（')
      }
    }
  })
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
