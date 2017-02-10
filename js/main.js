/*
  [LEARN IT]
  Agar tidak terlalu jauh dengan materi yang akan dibahas,
  ada baiknya untuk membaca dan mengikuti beberapa tutorial dasar jquery
  di link di bawah ini, atau bisa sambil jalan mempelajari langsung code ini
  karena hampir setiap line sudah diberi penjelasan dan link referensinya

  tutorial dasar jquery. referensi:
    - http://www.w3schools.com/jquery/default.asp
    - http://www.duniailkom.com/tutorial-belajar-jquery-bagi-pemula/
*/


// Memastikan bahwa dokumen sudah ter-load / termuat dengan sempurna
$(document).ready(function () {

  // Memastikan User untuk menuju home terlebih dahulu
  window.location.hash = '#/home'


  /*
    Untuk mengambil semua post yang tersedia

    Post-post ini yang nantinya akan diolah dan ditampilkan pada home page
    maupun pada single page pada masing-masing postnya. Data post ini diambil
    dari JSON file karena kita tidak mempunyai server sungguhan yang online dan
    menyediakan API. Jadi untuk mensimulasikannya, kita menggunakan json file
  */

  /*
    Mendeklarasikan variabel allPosts degan tipe Array
    referensi: https://developer.mozilla.org/en-US/docs/Glossary/array
  */
  var allPosts = []

  // Mendeklarasikan function getData
  // referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
  function getData() {
    /*
      Mengambil data yanng ada di file posts.json melalui $.ajax
      referensi: https://api.jquery.com/jQuery.get/
    */
    $.get('./api/posts.json')
    .then(function(res) {
      // Menyimpan data yang telah diambil ke dalam variable allPosts
      allPosts = res

      /*
        menyembunyikan elemen ber-id 'loading'
        referensi: https://api.jquery.com/hide/
      */
      $('#loading').hide()

      // Merender Home Page
      RenderHome()
    })
  }

  // Menjalankan function getData yang telah dideklarasikan
  getData()



  /*
    Untuk mengambil post berdasarkan id

    Post-post ini diambil dari variabel allPosts yang sebelumnya telah kita isi
    dengan data json yang diambil dari "server" melalui method getData()
  */
  // Mendeklarasikan function getPostById
  function getPostById(id) {
    /*
      Jangan lupa, function ini terdapat parameter 'id' yang nantinya menjadi acuan
      untuk mencari post berdasarkan id.

      Karena sudah kita dideklarasikan di dalam parameter function, maka secara tidak
      langsung, kita telah mendeklarasikan variable 'id'

      referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
    */

    // Mendeklarasikan variable target, digunakan untuk menyimpan post yang telah diseleksi
    var target;

    /*
      Iterasi / looping di Javascript ada banyak, ada for ada while ada forEach.
      Tapi berhubung kita tidak memakai babel atau es2015, untuk amannya kita menggunakan
      iterasi jenis 'while'
    */
    // Mendeklarasikan variable i untuk melakukan iterasi
    var i = 0;

    /*
      Melakukan iterasi menggunakan While
      referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while

      Maksud yang ada di dalam kurung setelah 'while' tsb. adalah kita tidak akan menghentikan
      iterasi / looping sampai variable target bernilai benar atau ada isinya. Ini kita tulis
      dengan !target yang artinya:

      'variable target tidak boleh kosong atau undefined'

      sedangkan tanda penghubung '&&' itu fungsinya untuk menambahkan kondisi. Jadi, selain variabel
      target belum terisi, looping juga tidak boleh berhenti sampai variabel i itu nilainya kurang dari
      jumlah data post yang kita miliki di variable allPost

      allPost.length disini adalah method untuk mengetahui jumlah post yang telah kita simpan di variable allPost
      referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
    */
    while (!target && i < allPosts.length) {
      /*
        Mendeklarasikan variabel post untuk kemudahan dalam penulisan
        daripada kita menuliskan allPosts[i] terus, mending kita simpan
        kedalam variabel yang mudah diingat.
      */
      var post = allPosts[i]


      /*
        Mengecek, apakah ada post yang id-nya itu sama dengan id yang dipassingkan pada function ini
        Jika ada, maka kita simpan post tersebut pada variable target.
      */
      if (post.id == id) {
        // Jika ditemukan, Simpan pada variabel target
        target = post
      }

      // Tambahkan value dari variable i untuk melakukan putaran iterasi / looping selanjutnya
      i++
    }


    /*
      Jika proses seleksi pada function ini telah selesai,
      maka passing-kan variabel target yang isinya adalah post yang telah terseleksi
    */
    return target
  }


  /*
    Sembunyikan Halaman lain (yang harusnya tidak tampil)

    digunakan untuk menyembunyikan halaman lain yang tidak aktif pada saat ini
  */
  // Mendeklarasikan function HideOtherPage
  function HideOtherPage(currentActive) {
    $('#main-content') // Melakukan seleksi
      /*
        mecari elemen yang harusnya active, kita membacanya dari variable currentActive yang telah
        kita passing kan melalui parameter pada function ini

        misal yang kita passingkan adalah HideOtherPage('home')
        maka akan menghasilkan '#home'
        referensi:
      */
      // disini kita akan menambahkan pagar sebagai identifikasi bahwa kita sedang menyeleksi id dari suatu elemen
      .find('#' + currentActive )

      /*
        Sibling ini untuk mencari kembarannya yang bukan dia. maksudnya gimana? maksudnya misal yang
        terkena seleksi adalah elemen #home, maka yang dianggap sebagai siblings adalah elemen yang selevel
        tapi bukan elemen #home. Maka kita akan mendapatkan elemen #post, dll. pokoknya yang selain elemen #home
        referensi:
      */
      .siblings()

      /*
        Mengisi HTML dengan kosong, jadi sama saja kita dengan menghapus konten HTML yang ada di dalam siblings
        referensi:
      */
      .html('')
  }


  /*
    Render Halaman Home

    digunakan untuk menampilkan atau merender halaman home pada PWA kita
  */
  // Mendeklarasikan function RenderHome
  function RenderHome() {

    // Menjalankan Function HideOtherPage dengan passing paramter bernilai 'home'
    // sehingga halaman lain akan disembunyikan sedangkan halaman 'home' tidak
    HideOtherPage('home')

    /*
      Kali ini kita menggunakan iterasi dengan cara lain
      yaitu menggunakan iterasi 'for'. Konsepnya hampir sama
      tapi yang membuatnya beda adalah "biasanya" iterasi ini
      digunakan apabila variable i tidak ditambah lebih dari 1
      pada setiap putaran iterasinya.

      i++ itu sama dengan i += 1 yang artinya, variable i value-nya
      ditambah 1

      referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for
    */
    // Mendeklarasikan variable html degan tipe Array yang nantinya akan kit jadikan tampilan di halaman home
    var html = []
    for (var i = 0; i < allPosts.length; i++) {
      // Membuat lebih mudah diingat dengan memasukkannya kedalam variable post
      var post = allPosts[i]

      // Membuat template untuk masing-masing item pada listing post di laman home
      // Kita menggunakan array supaya mudah menulisnya, daripada kita menuliskannya dengan string biasa
      var template = [
        '<a href="#/post/'+ post.id +'" class="post-item">',
          '<img src="'+ post.cover +'" />',
          '<h2>'+ post.title +'</h2>',
        '</a>'
      ]

      /*
        Menyatukannya supaya tidak ada tanda koma dan bentuknya jadi String
        referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
      */
      template = template.join('')


      /*
        Memasukkan setiap template yang telah dijadikan string tadi kedalam variable array 'html'
        Untuk memasukkan variable baru ke dalam Array, salah satu metodenya adalah dengan menggunakan 'push'
        referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
      */
      html.push(template)
    }

    // Ini adalah contoh jika kita membuat template menggunakan string.
    // Nggak enaknya itu harus panjang, atau menambahkan tanda (+) pada setiap baris baru
    var fullTemplate = '<h1>PWA Jquery</h1><div class="post-list">'+ html.join('') +'</div>'

    // Memasukkan HTML yang ada di dalam variable 'fullTemplate' kedalam elemen dengan id 'home'
    // referensi: https://api.jquery.com/html/
    $('#home').html(fullTemplate)
  }




  /*
    Render Halaman Post

    digunakan untuk menampilkan atau merender halaman post pada PWA kita
    dengan tampilan detail dari post yang ingin dituju oleh user
  */
  // Mendeklarasikan function RenderPost
  function RenderPost(hash) {
    // Ingat, kita telah memiliki variable 'hash' yang isinya adalah url setelah tanda pagar
    // ex: '#/post/2' atau '#/post/3'

    // Menjalankan Function HideOtherPage dengan passing paramter bernilai 'post'
    // sehingga halaman lain akan disembunyikan sedangkan halaman 'post' tidak
    HideOtherPage('post')

    /*
      Mengambil paramter ID setelah url '#/post/{id}'

      Untuk mengambilnya memang agak ribet, tapi InsyaaAllah bakalan mudah kalau kita mau baca
      referensinya. Jadi untuk awal kita mendeklarasikan variable 'url' dimana variable ini
      akan kita jadikan acuan untuk pencarian 'id'
    */
    var url = '/post/'


    /*
      Kita mencari tahu dimana posisi tulisan '/post/' dan mengambil tulisan yang ada setelah tulisan tsb yaitu 'id' nya.
      indexOf ini fungsinya untuk mencari posisi.
      referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
    */
    var idPosition = hash.indexOf(url) + url.length

    // Setelah mengetahui posisi ID, sekarang kita ambil id tersebut dengan cara mensubsitusikan string tersebut
    // referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
    var id = hash.substr(idPosition, hash.length)

    // Kemudian jalan function getPostById dengan parameter 'id' yang telah kita dapatkan tadi
    var post = getPostById(id)

    // Kita membuat template lagi
    var template = [
      '<img src="'+ post.cover +'" />',
      '<div class="post-content">',
        '<h1>'+ post.title +'</h1>',
        '<p>'+ post.content +'</p>',
      '</div>'
    ]

    // Lalu menyatukannya kemudian langsung memasukkannya kedalam html dari elemen ber-id 'post'
    $('#post').html(template.join(''))
  }



  /*
    Event Listener,

    adalah sebuah fitur yang dimiliki oleh javascript untuk mendengarkan atau mengawasi suatu event
    yang terjadi pada laman web kita. Contoh: Saat user click, saat user tekan keyboard, saat user input, dll.
    referensi: https://api.jquery.com/on/

    Nah, kali ini kita akan membuat event Listener yang akan mendengarkan atau mengawasi perubahan pada url hash (#)
    kalau kita perhatikan, url hash pada single page app selalu berubah, dan perubahan tersebut yang memicu sebuah page muncul
  */
  $(window).on('hashchange', function(e) {
    // Setiap Listener biasanya membawa sebuat argument yang isinya adalah info detail tentang event itu sendiri
    // Dalam function ini, info-info tersebut dimasukkan ke dalam variable 'e'

    // dideklarasikan variable 'hash' dengan isi yaitu url hash pada browser saat ini. ex: '#/home' atau '#/post/1'
    var hash = window.location.hash


    /*
      Function ini berfungsi untuk mengecek terlebih dahulu url hash
      untuk menentukan halaman apa yang harusnya ditampilkan.
    */
    // dideklarasikan function shouldRenderPage
    function shouldRenderPage(page) {
      // mencari posisi kata dari page yang akan dituju
      // misal user ingin ke post, maka kita cari tulisan '/post' pada urlnya.
      // Jika ditemukan maka nilainya !== -1, jika tidak ditemukan, maka nilainya adalah -1
      var itShould = hash.indexOf('/' + page) !== -1

      // Jika ditemukan, maka function ini bernilai 'true'
      // dan kita bisa melanjutkan ke proses selanjutnya
      return itShould
    }

    // Apakah function shouldRenderPage bernilai true saat ini?
    // Jika memang aplikasi berada pada url '#/home' maka dia akan bernilai true
    // Dan akan menampilkan halaman Home
    if (shouldRenderPage('home')) {
      // Tampilkan halaman Home dengan menjalankan function RenderHome()
      RenderHome()
    }

    // Sama halnya dengan function di atas, hanya saja ini untuk halaman postnya
    if (shouldRenderPage('post')) {
      RenderPost(hash)
    }

  })
})
