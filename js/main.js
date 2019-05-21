$(document).ready(function(){
  var _url = "https://my-json-server.typicode.com/MHeruA07/pwaapi/company"

  var dataresults = ''
  var categoryresults = ''
  var categories = []

  function renderPage(data){
      $.each(data, function(key, items){
        _cat = items.category

        dataresults += "<div>"
                          + "<h3>" + items.name + "</h3>"
                          + "<p>" + _cat + "</p>"
                        "<div>";

        if($.inArray(_cat, categories) == -1){
          categories.push(_cat)
          categoryresults += "<option value'" + _cat + "'>" + _cat + "</option>"
        }
      })

      $('#company').html(dataresults)
      $('#cat-select').html("<option value='all'>Semua</option>" + categoryresults)
  }

  var networkDataReceived = false

  //refresh data when online
  var networkUpdate = fetch(_url).then(function(response){
    return response.json()
  }).then(function(data){
    networkDataReceived = true
    renderPage(data)
  })

  //return data from cache
  caches.match(_url).then(function(response){
    if(!response) throw Error('no data on cache')
    return response.json()
  }).then(function(data){
    if(!networkDataReceived){
      renderPage(data)
      console.log('render data from cache')
    }
  }).catch(function(){
    return networkUpdate
  })

  //Fungsi Filter Value
  $("#cat-select").on('change', function(){
    updateCompany($(this).val())
  })

  function updateCompany(cat){
    var _newUrl = _url
    var dataresults = ''

    if(cat != 'all'){
      _newUrl = _url + "?category=" + cat
    }

    $.get(_newUrl, function(data){

      $.each(data, function(key, items){
        _cat = items.category

        dataresults += "<div>"
                          + "<h3>" + items.name + "</h3>"
                          + "<p>" + _cat + "</p>"
                        "<div>";
      })

      $('#company').html(dataresults)
    })
  }
}) //end crawling data from api

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
