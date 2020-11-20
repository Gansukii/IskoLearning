const email = document.getElementById('email');
const password = document.getElementById('password');
const signIn = document.getElementById('sign-in');
const search = document.getElementById('search');
const btnGoogle = document.getElementById('googleSign');
var lg = 992;
var provider = new firebase.auth.GoogleAuthProvider();
var user;

window.onresize = () => {
    if (document.documentElement.clientWidth < lg) {
        if (!search.classList.contains('col-8')) {
            search.classList.add('col-8')
        }
    } else
        search.classList.remove('col-8')
}
if (document.documentElement.clientWidth < lg) {
    if (document.documentElement.clientWidth < lg) {
        if (!search.classList.contains('col-8')) {
            console.log('add')
            search.classList.add('col-8')
        }
    } else
        search.classList.remove('col-8')
}

btnGoogle.onclick = (e) => {
    e.preventDefault()
    firebase.auth().signInWithPopup(provider).then(function (result) {
        user = result.user;
        window.location.assign('../../home')
    }).catch(function (error) {
        var errorMessage = error.message;
        console.log(errorMessage)
    });
}
