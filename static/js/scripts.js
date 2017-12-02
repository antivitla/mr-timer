console.log('Welcome to Titamota project page!')

setTimeout(function () {
  document.querySelector('#welcome article').classList.add('active')
}, 200);

document.querySelectorAll('a[data-href*=titamota]').forEach(function (a) {
  a.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    var url = a.getAttribute('data-href');
    document.querySelector('#welcome article').classList.remove('active')
    document.body.classList.remove('active')
    setTimeout(function () {
      document.querySelector('#welcome-player').classList.remove('active')
      document.querySelector('#welcome .overlay').classList.remove('active')
    }, 500)
    setTimeout(function () {
      location.href = url;
    }, 1500)
  });
});

// Video

window.onYouTubeIframeAPIReady = function (event) {
  var player = new YT.Player('welcome-player', {
    videoId: 'Wimkqo8gDZ0',
    events: {
      onStateChange: function (event) {
        if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
          player.playVideo();
        } else if (event.data === YT.PlayerState.PLAYING) {
          document.body.classList.add('active')
          document.getElementById('welcome-player').classList.add('active');
          document.querySelector('#welcome .overlay').classList.add('active');
        }
      }
    }
  });
}
