const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPass');
const signUp = document.getElementById('sign-up');
const match = document.getElementById('match');
const search = document.getElementById('search');
var lg = 992;

window.onresize = () => {
    if (document.documentElement.clientWidth < lg) {
        if (!search.classList.contains('col-8')) {
            search.classList.add('col-8')
        }
    }
    else
        search.classList.remove('col-8')
}
if (document.documentElement.clientWidth < lg) {
    if (document.documentElement.clientWidth < lg) {
        if (!search.classList.contains('col-8')) {
            console.log('add')
            search.classList.add('col-8')
        }
    }
    else
        search.classList.remove('col-8')
}

const handleConfirm = () => {
    
    if(confirmPassword.value == password.value && (password.value != ''||password.value != '')){
        match.classList.remove('d-none');
    }
    else{
        match.classList.add('d-none');
    }

}


confirmPassword.addEventListener('keyup', handleConfirm);
password.addEventListener('keyup', handleConfirm);

