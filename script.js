var hero_word = ""
let history = []
var score = 0
var special = {
  'ADAM': {'emoji': '🧔', 'message': 'David Adam Ballinger!'},
  'AIDA': {'emoji': '🦄', 'message': 'Aida Marie Heller Ballinger!'},
  'MOE': {'emoji': '🐶', 'message': 'Mozart "Moe" Ballinger!'},
  'ANNA': {'emoji': '🤰', 'message': 'We love mom.'},
  'DONNA': {'emoji': '👩', 'message': 'I love you, Grandma Donna. -Aida'}
}

var milestones = [
  {'score': 50, 'message': '50 points! Keep it up! Earn 100 points for more letters', 'function': () => {}},
  {'score': 100, 'message': "100 points! You're ready for more letters.", 'function': () => {
    $('#last_row').after(`
    <div id="new_row" class="row mb-3 text-center">
      <div class="col-4 themed-grid-col">
        <button id="button_7" onclick="button_click(this.id)" class="btn w-100 h-100 rounded-4 shadow-lg"><p class="display-1 fw-bold">G</p></button>
      </div>
      <div class="col-4 themed-grid-col">
        <button id="button_8" onclick="button_click(this.id)" class="btn w-100 h-100 rounded-4 shadow-lg"><p class="display-1 fw-bold">N</p></button>
      </div>
      <div class="col-4 themed-grid-col">
        <button id="button_9" onclick="button_click(this.id)" class="btn w-100 h-100 rounded-4 shadow-lg"><p class="display-1 fw-bold">R</p></button>
      </div>
    </div>
    `)
  }},
  {'score': 150, 'message': '150 points! Great work! Earn 300 points for a medal.', 'function': () => {}},
  {'score': 300, 'message': '300 points! You get the medal! 🏅', 'function': () => {
    $('#header').text("🦄AIDA'S WEBSITE🏅")
  }}
]

var milestone = 0

function button_click(button_id){
  
  var letter = $("#" + button_id + " p").text()
  hero_word = hero_word + letter
  $('#hero_message').text(hero_word)
  if(hero_word.length > 2) {
    if(check_history(hero_word)) {
      $('#message').html('<p>You already found that one.</p>')
    } else if(check_special(hero_word)) {

    } else {
      check_dictionary(hero_word)
    }
    
  }
  $('#clear').removeAttr('disabled')
}

function check_history(word) {
  for(let i = 0; i < history.length; i++) {
    if(word == history[i]) {
      return true
    }
  }
  return false
}

function score_points(word) {
  history.push(word)
  score = score + word.length * word.length
  $('#score').text('🪙' + score)
  $('#message').html('<h6>' + word + '</h6>')
  hero_word = ''
  $("#clear").attr('disabled', true)
  if(score >= milestones[milestone].score) {
    $('#hero_message').text(milestones[milestone].message)
    milestones[milestone].function()
    milestone++
  }
}

function check_dictionary(word) {
  var request = new XMLHttpRequest()
  request.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
  request.onload = () => {
    var response = JSON.parse(request.responseText)
    if(request.status == 404) {
      $('#message').html("Sorry pal, we don't recognize that one.")
    } else if (request.status == 200){
      $('#hero_message').text(word + '🎆')
      score_points(word)
      for(let i = 0; i < response.length; i++) {
        $('#message').append('<p>' + response[i].meanings[0].partOfSpeech + ': ' + response[i].meanings[0].definitions[0].definition + '</p>')
      }
    }
  }
  request.send()
}

function check_special(word) {
  if(word in special) {
    $('#hero_message').text(hero_word + special[word].emoji)
    score_points(word)
    $('#message').append('<p>' + special[word].message + '</p>')
  }
}

$('#clear').click(() => {
  hero_word = ''
  console.log('Updated word: ' + hero_word)
  $('#hero_message').text("🤪")
  $("#clear").attr('disabled', true)
  $('#message').html('<p>Keep going!</p>')
})

