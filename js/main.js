

$(document).ready(function () {

  window.location.hash = '#/home'

  var allPosts = []

  function getData() {
    $.get('./api/posts.json')
    .then(function(res) {
      allPosts = res
      $('#loading').hide()
      RenderHome()
    })
  }
  getData()


  function getPostById(id) {
    var target;
    var i = 0;
    while (!target && i < allPosts.length) {
      var post = allPosts[i]
      if (post.id == id) {
        target = post
      }
      i++
    }
    return target
  }


  function HideOtherPage(currentActive) {
    $('#main-content')
      .find('#' + currentActive )
      .siblings()
      .html('')
  }


  function RenderHome() {
    HideOtherPage('home')

    var html = []
    for (var i = 0; i < allPosts.length; i++) {
      var post = allPosts[i]

      var template = [
        '<a href="#/post/'+ post.id +'" class="post-item">',
          '<img src="'+ post.cover +'" />',
          '<h2>'+ post.title +'</h2>',
        '</a>'
      ]

      template = template.join('')

      html.push(template)
    }

    var fullTemplate = '<h1>PWA Jquery</h1><div class="post-list">'+ html.join('') +'</div>'
    $('#home').html(fullTemplate)
  }


  function RenderPost(hash) {
    HideOtherPage('post')

    var url = '/post/'
    var idPosition = hash.indexOf(url) + url.length
    var id = hash.substr(idPosition, hash.length)

    var post = getPostById(id)

    var template = [
      '<img src="'+ post.cover +'" />',
      '<div class="post-content">',
        '<h1>'+ post.title +'</h1>',
        '<p>'+ post.content +'</p>',
      '</div>'
    ]

    $('#post').html(template.join(''))
  }



  $(window).on('hashchange', function(e) {
    var hash = window.location.hash

    function shouldRenderPage(page) {
      var itShould = hash.indexOf('/' + page) !== -1
      return itShould
    }

    if (shouldRenderPage('home')) {
      RenderHome()
    }

    if (shouldRenderPage('post')) {
      RenderPost(hash)
    }

  })

})
