window.location.hash = ''

$(document).ready(function() {

  // Ambil Data
  $.ajax('./api/posts.json').then(function(data) {

    // Semua Post
    var allPosts = data

    // Deklarasi
    function cariPost(id) {
      var i = 0;
      var target = {};
      var targetBelumDitemukan = target === undefined
      while (targetBelumDitemukan || i < allPosts.length) {
        var post = allPosts[i]
        if (post.id == id) target = post
        i++
      }

      // Beri Value
      return target
    }


    function RenderHome() {

      var templateAllPosts = []
      for (var i = 0; i < allPosts.length; i++) {
        var post = allPosts[i]
        var templatePost = [
          '<a href="#/post/'+ post.id +'">',
            '<h2>' + post.title + '</h2>',
            '<img src="' + post.cover + '" />',
            '<p>' + post.content + '</p>',
          '</a>'
        ]

        // Daftarkan variable templatePost ke array templateAllPosts
        templateAllPosts.push(templatePost.join(''))
      }

      // Sisipkan konten
      $('#content').html(templateAllPosts)
    }

    function RenderPost(id) {
      var post = cariPost(id)
      var templatePost = [
        '<div>',
          '<h2>' + post.title + '</h2>',
          '<img src="' + post.cover + '" />',
          '<p>' + post.content + '</p>',
        '</div>'
      ]
      $('#content').html(templatePost)
    }


    function ambilAngkaSetelahUrlPost(hash) {
      // Mengambil 1 karakter dari belakang
      var idPostYangDicari = hash.substr(-1)
      // Beri Value
      return idPostYangDicari
    }


    // Deklarasi Event Listener
    $(window).on('hashchange', function(e) {
      var hash = window.location.hash

      var adaTulisanHome = hash.indexOf('/home') !== -1
      if (adaTulisanHome) RenderHome()

      var adaTulisanPost = hash.indexOf('/post') !== -1
      if (adaTulisanPost) {
        // Call function ambilAngkaSetelahUrlPost() untuk mengetahui id yang sedang dicari
        var idPostYangDicari = ambilAngkaSetelahUrlPost(hash)
        RenderPost(idPostYangDicari)
      }

    })

    // Mengarahkan User Ke Url Hash '#/home'
    window.location.hash = '#/home'

  })

})
