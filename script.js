var hero_word = ""
let history = []
var score = 0
var special = {
  'ADAM': {'emoji': '👨', 'message': 'David Adam Ballinger!'},
  'AIDA': {'emoji': '🦄', 'message': 'Aida Marie Heller Ballinger!'},
  'MOE': {'emoji': '🐶', 'message': 'Mozart "Moe" Ballinger!'},
  'MOM': {'emoji': '🤰', 'message': 'We love mom'},
}

function button_click(button_id){
  
  var letter = $("#" + button_id + " p").text()
  console.log("Cliked " + button_id + ", got letter " + letter)
  hero_word = hero_word + letter
  console.log("Updated word: " + hero_word)
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

