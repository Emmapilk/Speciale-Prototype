var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
if(SpeechRecognition) {
	var recognition = new SpeechRecognition();
	recognition.continuos = true;
	recognition.interimResults = true;
	recognition.start();
}
