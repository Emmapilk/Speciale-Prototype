window.onload = () => {

	/* Element References */
	var chatLog = document.getElementById('chat-log');
	var chatInput = document.getElementById('chat-input');
	var micButton = document.getElementById('mic');

	function scrollChat() {
		chatLog.scrollTop = chatLog.scrollHeight;
	}
	scrollChat(); /* Scroll chat on load */
	
	function sendMessage() { /* Send message from chatInput to chatLog*/
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
		message.append(chatInput.value);
		chatInput.value = '';
		
		/* Add message to chatLog */
		document.getElementById('chat-log').append(message);
		scrollChat();
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
				if(chatInput.value) { /* Send message, even if not finished */
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
					if(!listening) return; /* Don't add to chatInput if we're not listening */
					chatInput.value = final_transcript + interim_transcript;
					chatInput.scrollLeft = chatInput.scrollWidth;
					if(final_transcript) sendMessage(); /* Automatically send message at the end of a sentence */
				};
			}
	}
}


