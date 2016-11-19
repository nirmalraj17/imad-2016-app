function myFunction() {
    alert(document.getElementById("userid").value + " " +  document.getElementById("psw").value);
}
function visible(id) {
    document.getElementById(id).style.visibility = "visible" ;
    document.getElementById("signin").style.display ="block";
    if (id == "signin"){
        document.getElementById("signup").style.visibility = "hidden" ;
    } else {
        document.getElementById("signin").style.display = "none" ;
    }
}

function invisible(){
    document.getElementById("signin").style.visibility = "hidden" ;
    document.getElementById("signup").style.visibility = "hidden" ;
}
