var recognition;

var chatLog = document.getElementById('chat-log');
var final_transcript = '';

function scrollChat() {
	setTimeout(() => {
		chatLog.scrollTop = chatLog.scrollHeight;
	}, 500);
}

scrollChat();

var listening = false;
var pttButton = document.getElementById('mic');
pttButton.onmousedown = () => {
	if(!listening) {
		final_transcript = '';
		listening = true;
		recognition.start();
	} else {
		listening = false;
		recognition.stop();
	}
}
pttButton.onmouseup = () => {
	listening = false;
	recognition.stop();
}

var chatInput = document.getElementById('chat-input');

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
if (SpeechRecognition) {
	recognition = new SpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	
	recognition.onstop = (event) => {
		// <p class="message"><span class="name">Kitaki:</span> i cant see it</p>
		
	}

	recognition.onresult = function(event) {
	  var interim_transcript = '';
	  for (var i = event.resultIndex; i < event.results.length; ++i) {
		if (event.results[i].isFinal) {
		  final_transcript += event.results[i][0].transcript;
		} else {
		  interim_transcript += event.results[i][0].transcript;
		}
	  }
	  chatInput.value = interim_transcript;
	  if(final_transcript) {
			chatInput.value = '';
			var message = document.createElement('p');
			message.classList.add('message');
			var name = document.createElement('span');
			name.classList.add('name3');
			name.innerText = 'You:';
			message.append(name);
			message.append(' ' + final_transcript);
			document.getElementById('chat-log').append(message);
			scrollChat();
	  };
	};
} else {
	pttButton.disabled = true;
}