const commonSubstitutions = new Map([
			['a', '[aAåÅ4@]'], ['b', '[bB86]'], ['c', '[cC[{('], ['d', '[dD]'],
			['e', '[eE3£€]'], ['f', '[fF]'], ['g', '[gG9]'], ['h', '[hH#]'],
			['i', '[iI1|!]'], ['j', '[jJ1|!]'], ['k', '[kK]'], ['l', '[lL17|]'],
			['m', '[mM]'], ['n', '[nN]'], ['o', '[oO0QøØ]'], ['p', '[pP9]'],
			['q', '[qQ9]'], ['r', '[rR2]'], ['s', '[sS5$zZ2]'], ['t', '[tT7+]'],
			['u', '[uUvV]'], ['v', '[vV]'], ['w', '[wW]'], ['x', '[xX]'],
			['y', '[yYjJ47]'], ['z', '[zZ275sS]'], [' ', '']
		]);

var flaggedWords = [
	'\\w{1}\\*+', /* All words containing * (from speech profanity filter) */
	// '(are|r)? (you|u)? (a)? (girl|gril)',

	/* Name calling / Inappropriate words */
	'bitch',
	'slut',
	'(you|u) ((a)?r(e)?)? (probably|sound)? (a)? (f|ph)at',
	'ugly',
	'cunt',
	'whore',
	'piece (o(f)?)? shit',
	'pu(s)+y',
	'vagina',
	'rape(d)?',

	/* Sexist Comments */
	'(because|cos|coz|cus|cuz) ((you|u)(r|re)?)? (a)? girl',
	'(get|go|belong|be|stay|leave)? (in|to|into)? (the)? kitchen',
	'stop playing',
	'(should)? (just)? (get off|leave|disconnect|quit|exit) (the)? (game)?',
	'((should (be)?|go)? play(ing)?|this is n(o)?t) (the)? (tetris|sims|animal crossing|farmville)',
	'game for girls',
	'girls (are|r)? n(o)?t good (at|@)?',
	'girls (are|r)? bad (at|@)?',
	'(all)? girls are (only)? good (for|at)',
	'we ((a)?re going to|will) l(o)+se',
	'girls should n(o)?t be gaming',
	'girls should be banned',
	'girls are n(o)?t gamers',
	'girls (can|should|do) (n)?(o)?t ((know)? (how)? (to)?)? (play)? (game(s)?)?',
	'(fuck|(have)? sex) (with)? me',
	'(give)? (me)? (a)? blowjob',
	'(blow|suck) (me|my)',
	'(you|u|girls) (blow|suck)',
	'mak(e|ing) (me)? (a)? sandwich',
	'wash(ing)? (the)? dishes',
	'dish wash(er|ing)',
	'girl(s)? (always)? get(s)? (knock|kill|down)ed (first|1st)',
	'carry(ing)? (the)? girl(s)?',
	'girls (have|need) (to)? (be|get)? carr(y|ied)',
	'better than girls',
	'men (r|are|play) better',
	'girl(s)? (r|are) n(o)?t (suppose(d)?|meant) to (play)? (game(s)?)?',
	'(send|give|show) (me)? (your|ur)? (nudes|pics|pix|boobs|dick)',
	'(go|should) play support',

	/* Threats */
	'k(ill)? y(our)?s(elf)?',
	'hope you (will)? die',
	'(get (killed)?|die) (of|from|by)? cancer',
	'(get|become) sick',
	'jump (in front|into|off) (of)? (a)? (car|train|traffic|cliff|bridge)',
	
	/* General */
	'fuck off',
	'(delete|uninstall|remove) (the)? (game|apex)',
	'you (are|r|re) (a)? shit (player)?',
]

console.log({
	...flaggedWords
});
console.log(commonSubstitutions);

for (var i = 1; i < flaggedWords.length; i++) {
	flaggedWords[i] = flaggedWords[i].split('').map(chr =>
			commonSubstitutions.has(chr) ? commonSubstitutions.get(chr) + '[\\W]*' : chr).join('');
}

window.onload = () => {

	/* Element References */
	var chatLog = document.getElementById('chat-log');
	var chatInput = document.getElementById('chat-input');
	var micButton = document.getElementById('mic');
	var header = document.getElementById('header');
	var warning = document.getElementById('warning');
	var warningTimeout;
	var audio;
	var audioFiles = document.querySelectorAll('link[rel="preload"]');

	function scrollChat() {
		chatLog.scrollTop = chatLog.scrollHeight;
	}
	scrollChat(); /* Scroll chat on load */

	chatInput.onkeydown = event => {
		if (event.key === "Enter") {
			sendMessage(); /* Send Message on enter keypresss */
		}
	}

	function sendMessage() { /* Send message from chatInput to chatLog*/
		if (!chatInput.value)
			return;
		final_transcript = '';
		/* Create message element */
		var message = document.createElement('p');
		message.classList.add('message');
		/* Add name to start of message */
		var name = document.createElement('span');
		name.classList.add('name3');
		name.innerText = 'You: ';
		message.append(name);

		/* Add chatInput to message */
		messageText = chatInput.value
			var flagged = false;
		for (const word of flaggedWords) {
			var regex = new RegExp('(' + word + ')', 'g');
			messageText = messageText.replace(regex, match => {
				console.log("Flagged for:", word);
				flagged = true;
				return '<span class="toxic">' + match + '</span>'
			});
		}
		message.innerHTML += messageText;
		chatInput.value = '';

		/* Add message to chatLog */
		document.getElementById('chat-log').append(message);
		scrollChat();
		if (flagged) {
			// playAudio('../audio/sample.mp3');
			var randomAudioSource = audioFiles[Math.floor(Math.random() * audioFiles.length)].href;
			playAudio(randomAudioSource);
			syncToxicTextAnimations();
			header.style.display = 'block';
			warning.style.display = 'grid';
			clearTimeout(warningTimeout);
			warningTimeout = setTimeout(() => {
				header.style.display = 'none';
				warning.style.display = 'none'
			}, 10000);
		}
	}

	function syncToxicTextAnimations() {
		Array.from(document.getElementsByClassName('toxic')).forEach(el => {
			el.style.setProperty('animation', 'none');
			requestAnimationFrame(() => el.style.removeProperty('animation'))
		});
	}

	function playAudio(audioFile) {
		return new Promise((resolve, reject) => {
			if (!audio) {
				audio = new Audio(audioFile);
				audio.play();
				audio.onended = () => {
					audio = null;
					resolve();
				}
			} else {
				reject();
			}
		});
	}

	/* Based on Google Web Speech Demo https://github.com/googlearchive/webplatform-samples/blob/master/webspeechdemo/webspeechdemo.html */

	/* SpeechRecognition variables */
	var final_transcript = '';
	var listening = false;
	var recognition;

	if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
		/* If SpeechRecognition is not supported */
		micButton.disabled = true;
	} else {
		/* On click start */
		micButton.onpointerdown = () => {
			listening = true;
			micButton.classList.add('blink-red');
			final_transcript = '';
			recognition.lang = 'en-US';
			recognition.start();
		}
		/* On click released */
		micButton.onpointerup = () => {
			setTimeout(() => {
				listening = false;
				micButton.classList.remove('blink-red');
				if (chatInput.value) { /* Send message, even if not finished */
					sendMessage();
				}
			}, 1000); /* Allow an extra second to finish speechRecognition */
		}

		var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
			if (SpeechRecognition) {
				/* Speech Recognition setup */
				recognition = new SpeechRecognition();
				recognition.continuous = true;
				recognition.interimResults = true;

				recognition.onerror = () => {
					listening = false;
					micButton.classList.remove('blink-red');
				}

				recognition.onresult = function (event) {
					var interim_transcript = '';
					for (var i = event.resultIndex; i < event.results.length; ++i) {
						if (event.results[i].isFinal) {
							final_transcript += event.results[i][0].transcript;
						} else {
							interim_transcript += event.results[i][0].transcript;
						}
					}
					if (!listening)
						return; /* Don't add to chatInput if we're not listening */
					chatInput.value = final_transcript + interim_transcript;
					chatInput.scrollLeft = chatInput.scrollWidth;
					if (final_transcript)
						sendMessage(); /* Automatically send message at the end of a sentence */
				};
			}
	}

	window.audioTest = () => {
		playAudio(audioFiles[0].href)
		.then(() => playAudio(audioFiles[1].href))
		.then(() => playAudio(audioFiles[2].href))
		.then(() => playAudio(audioFiles[3].href))
		.then(() => playAudio(audioFiles[4].href))
		.then(() => playAudio(audioFiles[5].href))
		.then(() => playAudio(audioFiles[6].href))
		.then(() => playAudio(audioFiles[7].href))
		.then(() => playAudio(audioFiles[8].href))
		.then(() => playAudio(audioFiles[9].href))
		.then(() => playAudio(audioFiles[10].href));
	}
}
