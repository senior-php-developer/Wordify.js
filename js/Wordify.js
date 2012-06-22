//"1d05a291d0edc70cf0d010e3eca05ba6f81a960878f72771c"
var letters = $('#letters');
var words = $('#word'); 

var W = {
	api_url: "http://api.wordnik.com/api/",
	api_key: "1cfe79e2fac37fc3971090dd98a02c8a0708139f2e33fc28b",
	
	used_words: [],
	chars: [],
	input_chars: [],
	word: '',
	time: 40,
	score: 0,
	
	generateChars: function(){
		var a = ['a','e','i','o','u','y']
		var b = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','z'];
		for(var i=0; i<3; i++) {
			//var ch = String.fromCharCode(Math.floor(Math.random()*25+65)).toLowerCase();
			var x = a[Math.floor(Math.random()*a.length)];
			var y = b[Math.floor(Math.random()*b.length)];
			var z = b[Math.floor(Math.random()*b.length)];
			
			W.chars.push(x);
			W.chars.push(y);
			W.chars.push(z);
			
			letters.append('<span>'+y+'</span>');
			letters.append('<span>'+x+'</span>');
			letters.append('<span>'+z+'</span>');
		}
	
	
	
	},
	
	checkWord: function(word) {
		W.word = word;
		if (word.length < 3) W.error("This word is too short");
		else if (W.used(word)) W.error("You have already used this word");
		else $.getJSON(W.api_url+'word.json/'+encodeURIComponent(word)+'/definitions?api_key='+W.api_key+'&callback=?', function(r) {
			$('#def').empty();
			if (r.length > 0) {
				var l = Math.min(r.length, 6);
				for(var i=0; i<l; i++) {
					$('#def').append('<p>'+r[i].text+'</p>');				
				}
				W.used_words.push(W.word);
				W.addPoints(W.word);
				$('#used').append('<p>'+W.used_words.length+'. <span>'+W.word+'</span></p>');
			} else W.error("No such word exists");
		});
		
	
	
	},
	
	addPoints: function(word) {
		W.score += word.length;
		W.time += word.length * 2;
		$('#score').text(W.score);
		
		
	},
	
	used: function(word) {
		if (W.used_words.indexOf(word) != -1) return true;
		else return false;
	
	
	},
	
	checkChar: function(ch) {
		var idx = W.chars.indexOf(ch);
		if (idx != -1) {
			W.input_chars.push(W.chars.splice(idx, 1)[0]);
			W.showLetters();
			words.append('<span>'+ch+'</span>');
		} else
			return false;
	},
	
	showLetters: function() {
		letters.empty();
		for(var i=0; i<W.chars.length; i++) {
			letters.append('<span>'+W.chars[i]+'</span>');
		}
	
	},
	
	deleteChar: function(e) {
		if (W.input_chars.length == 0) return;
		var el = W.input_chars.pop();
		W.chars.push(el);
		letters.append('<span>'+el+'</span>');
		words.find('span').last().remove();	
	},
	
	error: function(msg) {
		$('#error').text(msg).fadeIn().delay(2000).fadeOut('slow');
	
	},
	
	reset: function() {
		W.used_words = [];
		W.chars = [];
		W.input_chars = [];
		W.word = '';
		W.time = 40;
		W.score = 0;
		clearInterval(W.timer);
		words.empty();
		letters.empty();
		$('#def').empty();
		$('#used').empty();
		$('#time').text('40');
		$('#score').text('0');
	},

	start: function() {
		W.reset();
		W.generateChars();
		$(document).keydown(function(e){
			if (e.keyCode == 8) W.deleteChar();
			if (e.keyCode == 13) W.submitWord();
			if (e.keyCode > 64 && e.keyCode < 91) W.checkChar(String.fromCharCode(e.keyCode).toLowerCase());
		});
		
		$(document).keypress(function(e){
			if (e.keyCode == 8) return false;
		}).keydown(function(e){
			if (e.keyCode == 8) return false;
		});
		
		W.timer = setInterval(function(){
			if (W.time > 0) {
				W.time--;
				$('#time').text(W.time);
			} else {
				clearInterval(W.timer);
				W.gameOver();
			}		
		}, 1000);
		
		W.error('Game has started');
	
	},
	
	gameOver: function() {
		$(document).unbind('keydown');
		W.error("Game over");
		$('#used p span').css('cursor','pointer').css('text-decoration','underline').click(function(){
			var term = $(this).text();
			$.getJSON(W.api_url+'word.json/'+encodeURIComponent(term)+'/definitions?api_key='+W.api_key+'&callback=?', function(r) {
				$('#def').empty();
				var l = Math.min(r.length, 6);
				for(var i=0; i<l; i++) {
					$('#def').append('<p>'+r[i].text+'</p>');				
				}
			});
		});		
	},
	
	
	submitWord: function() {
		var word = '';
		for(var i=0; i<W.input_chars.length; i++) {
			var ch = W.input_chars[i];
			W.chars.push(ch);
			word += ch;		
		}
		W.input_chars.splice(0, W.input_chars.length);
		words.empty();
		W.showLetters();
		W.checkWord(word);
	
	}
	
	













}