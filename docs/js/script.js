const commonSubstitutions = new Map([
			['a', '[aAåÅ4@]'], ['b', '[bB86]'], ['c', '[cC[{(<'], ['d', '[dD]'],
			['e', '[eE3£€]'], ['f', '[fF]'], ['g', '[gG9]'], ['h', '[hH#]'],
			['i', '[iI1|!]'], ['j', '[jJ1|!]'], ['k', '[kK]'], ['l', '[lL17|]'],
			['m', '[mM]'], ['n', '[nN]'], ['o', '[oO0QøØ]'], ['p', '[pP9]'],
			['q', '[qQ9]'], ['r', '[rR2]'], ['s', '[sS5$zZ2]'], ['t', '[tT7+]'],
			['u', '[uUvV]'], ['v', '[vV]'], ['w', '[wW]'], ['x', '[xX]'],
			['y', '[yYjJ47]'], ['z', '[zZ275sS]'], [' ', '']
		]);

var flaggedWords = [
	'\\w{1}\\*+',
	'(are|r)? (you|u)? (a)? (girl|gril)',
	'(get|go|belong|be|stay|leave)? (in|to|into)? (the)? kitchen',
	'make (me)? (a)? sandwich',
]

console.log({
	...flaggedWords
});
console.log(commonSubstitutions);

for (var i = 1; i < flaggedWords.length; i++) {
	flaggedWords[i] = flaggedWords[i].split('').map(chr =>
			commonSubstitutions.has(chr) ? commonSubstitutions.get(chr) + '[\\W]*' : chr).join('');
}
console.log(flaggedWords);

window.onload = () => {

	/* Element References */
	var chatLog = document.getElementById('chat-log');
	var chatInput = document.getElementById('chat-input');
	var micButton = document.getElementById('mic');
	var warning = document.getElementById('warning');
	var warningTimeout;
	var audio;

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
			playAudio('../audio/sample.mp3');
			syncToxicTextAnimations();
			warning.style.display = 'grid';
			clearTimeout(warningTimeout);
			warningTimeout = setTimeout(() => warning.style.display = 'none', 10000);
		}
	}

	function syncToxicTextAnimations() {
		Array.from(document.getElementsByClassName('toxic')).forEach(el => {
			el.style.setProperty('animation', 'none');
			requestAnimationFrame(() => el.style.removeProperty('animation'))
		});
	}

	function playAudio(audioFile) {
		if (!audio) {
			audio = new Audio(audioFile);
			audio.play();
			audio.onended = () => audio = null;
		}
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
		micButton.onmousedown = () => {
			listening = true;
			micButton.classList.add('blink-red');
			final_transcript = '';
			recognition.lang = 'en-US';
			recognition.start();
		}
		/* On click released */
		micButton.onmouseup = () => {
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
}
