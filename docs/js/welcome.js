window.onload = function () {
	redirect();
	
	var button = document.getElementById('continue');

	if (!('webkitSpeechRecognition' in window)) { // && !('SpeechRecognition' in window)) {
		upgrade();
	} else {
		var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
			if (SpeechRecognition) {
				var recognition = new SpeechRecognition();
				recognition.continuos = true;
				recognition.interimResults = true;

				recognition.onerror = function (event) {
					console.log(event);
					showInfo('info_error');
					button.disabled = true;
				};
				recognition.start();
			}
	}

	function upgrade() {
		button.disabled = true;
		showInfo('info_upgrade');
	}


	function showInfo(s) {
	var info = document.getElementById('info');
		if (s) {
			for (var child = info.firstChild; child; child = child.nextSibling) {
				console.log(child);
				if (child.style) {
					child.style.display = child.id == s ? 'inline' : 'none';
				}
			}
			info.style.display = 'block';
		} else {
			info.style.display = 'none';
		}
	}

	function nextPage() {
		createCookie('doRedirect', 'true', '999');
		window.location = 'app';
	}

	function redirect() {
		var thecookie = readCookie('doRedirect');
		if (thecookie) {
			nextPage();
		}
	}

	function createCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		} else
			var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ')
				c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

}
