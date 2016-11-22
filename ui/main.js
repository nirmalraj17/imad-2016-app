var submit =document.getElementById('signIn_button');
submit.onclick = function(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if (request.readyState === XMLHttpRequest.DONE){
			if (request.status === 200){
				console.log('user loged in');
				alert('Logged in successfully');
			} else if (request.status === 403) {
			    alert('Incorrect user name or credentials');
			} else if (request.status === 500) {
			    alert('Something went wrong!!');
			}else {
				alert('Something went wrong!!');
			}
		} 
		loadLogin ();
	};
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	
	if (username ==''|| password ==''){
		alert("UserName/Password cannot be blank");
		return;
	}
	
	request.open('POST', '/login' ,true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({username: username, password: password}));
};

var submit =document.getElementById('signUp_button');
submit.onclick = function(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if (request.readyState === XMLHttpRequest.DONE){
			if (request.status === 200){
				console.log('Signup successful');
document.getElementById("signup").style.visibility = "hidden" ;
				alert('Signup successful. Please proceed to login');
			} else if (request.status === 403) {
			    alert('Already exists');
			} else if (request.status === 500) {
			    alert('Something went wrong!!');
			} else {
				alert('Something went wrong!!');
			}
		}
	};
	var username = document.getElementById('username1').value;
	var email = document.getElementById('email').value;
	var password = document.getElementById('password1').value;
	
	if (username ==''|| email =='' || password ==''){
		alert("UserName/Email/Password cannot be blank");
		return;
	}
		
		
	request.open('POST', '/create-user' ,true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({username: username, email: email, password: password}));
};

function loadLoggedInUser (username) {
document.getElementById("signin").style.visibility = "hidden" ;
	document.getElementById("login_area").style.display = "block" ;
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
var com = "You are not logged in";
            if (request.status === 200) {
				var matching = this.responseText;
				if (com.match(matching)){
					console.log(this.responseText);


					document.getElementById("sign_up").style.visibility = "visible" ;
					document.getElementById("sign_in").style.visibility = "visible" ;
					document.getElementById("logout").style.display = "none" ;
				} else {
					loadLoggedInUser(this.responseText);	
					document.getElementById("articles_heading").style.display = "block" ;
					document.getElementById("articles").style.display = "block" ;
					document.getElementById("login_area").style.display = "block" ;
					document.getElementById("sign_up").style.visibility = "hidden" ;
					document.getElementById("sign_in").style.visibility = "hidden" ;
					document.getElementById("logout").style.display = "block" ;
				}
            }
        }
    };
    
    request.open('GET', '/check-login', true);	
    request.send(null);
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles');
            if (request.status === 200) {
                var content = '<ul class="left-style">';
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
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}
loadLogin();
loadArticles();