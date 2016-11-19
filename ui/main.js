var submit =document.getElementById('signIn_button');
submit.onclick = function(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if (request.readyState === XMLHttpRequest.DONE){
			if (request.status === 200){
				console.log('user loged in');
				alert('Logged in successfully');
			} else if (request.status === 403) {
			    alert('Incorrect user naeme or credentials');
			} else if (request.status === 500) {
			    alert('Something went wrong!!');
			}
		} 	
	};
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	console.log(username);
	console.log(password);
	
	request.setRequestHeader('Content-Type', 'application/json');
	request.open('POST', 'http://nirmalraj17.imad.hasura-app.io/login' ,true);
	request.send(JSON.stringify({username: username, password: password}));
};

var submit =document.getElementById('signUp_button');
submit.onclick = function(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if (request.readyState === XMLHttpRequest.DONE){
			if (request.status === 200){
				console.log('Signup successful');
				alert('Signup successful');
			} else if (request.status === 403) {
			    alert('Already exists');
			} else if (request.status === 500) {
			    alert('Something went wrong!!');
			}
		} 	
	};
	var username = document.getElementById('username').value;
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	
	console.log(username);
	console.log(email);
	console.log(password);
	
	request.setRequestHeader('Content-Type', 'application/json');
	request.open('POST', 'http://nirmalraj17.imad.hasura-app.io/create-user' ,true);
	request.send(JSON.stringify({username: username, email: email, password: password}));
};