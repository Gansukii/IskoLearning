const email = document.getElementById('email');
const password = document.getElementById('password');
const signIn = document.getElementById('sign-in');
const btnGoogle = document.getElementById('googleSign');
//var lg = 992;
var provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth()
var user;

signIn.onclick = (e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(email.value, password.value)
        .then((user) => {
            window.location.assign('../../home')
        })
        .catch((error) => {
            var errorMessage = error.message;
            alert(errorMessage)

        });
}



btnGoogle.onclick = (e) => {
    e.preventDefault()
    auth.signInWithPopup(provider).then(function (result) {
        user = result.user;
        window.location.assign('../../home')
    }).catch(function (error) {
        var errorMessage = error.message;
        console.log(errorMessage)
        alert(errorMessage)
    });
}
