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
		loadLogin ();
	};
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	console.log(username);
	console.log(password);
	
	request.open('POST', 'http://nirmalraj17.imad.hasura-app.io/login' ,true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.setRequestHeader( 'Access-Control-Allow-Origin', '*');
	request.send(JSON.stringify({username: username, password: password}));
};

var submit =document.getElementById('signUp_button');
submit.onclick = function(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if (request.readyState === XMLHttpRequest.DONE){
			if (request.status === 200){
				console.log('Signup successful');
				alert('Signup successful. Please proceed to login');
			} else if (request.status === 403) {
			    alert('Already exists');
			} else if (request.status === 500) {
			    alert('Something went wrong!!');
			}
		}
	};
	var username = document.getElementById('username1').value;
	var email = document.getElementById('email').value;
	var password = document.getElementById('password1').value;
	
	console.log(username);
	console.log(email);
	console.log(password);
		
	request.open('POST', 'http://nirmalraj17.imad.hasura-app.io/create-user' ,true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.setRequestHeader( 'Access-Control-Allow-Origin', '*');
	request.send(JSON.stringify({username: username, email: email, password: password}));
};

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
        <h3> Hi <i>${username}</i></h3>
        <a href="/logout">Logout</a>
    `;
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', 'http://nirmalraj17.imad.hasura-app.io/check-login', true);
	request.setRequestHeader( 'Access-Control-Allow-Origin', '*');
    request.send(null);
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                    (${articleData[i].date.split('T')[0]})</li>`;
                }
                content += "</ul>"
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!')
            }
        }
    };
    
    request.open('GET', 'http://nirmalraj17.imad.hasura-app.io/article', true);
	request.setRequestHeader( 'Access-Control-Allow-Origin', '*');
    request.send(null);
}