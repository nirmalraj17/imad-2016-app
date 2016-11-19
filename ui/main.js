var submit =document.getElementById('submit_btn');
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
	var  username = document.getElementById('username').value;
	var  password = document.getElementById('password').value;
	
	console.log(username);
	console.log(password);
	
// 	var name = username.value;
	request.open('POST', 'http://nirmalraj17.imad.hasura-app.io/login' ,true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({username: username, password: password}));
	
};