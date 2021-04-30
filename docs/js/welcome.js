var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
if (SpeechRecognition) {
	var recognition = new SpeechRecognition();
	recognition.continuos = true;
	recognition.interimResults = true;
	recognition.start();
} else {
	var button = document.getElementById('continue');
	button.innerText = "Your browser is not supported";
	button.disabled = true;
}

function nextPage() {
	createCookie('doRedirect','true','999');
	window.location = '/app';
}

function redirect(){
	var thecookie = readCookie('doRedirect');
	if(thecookie){
		nextPage();
	}
}

function createCookie(name,value,days){
	if (days){
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	} else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name){
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++){
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

window.onload = function(){
	redirect();
}