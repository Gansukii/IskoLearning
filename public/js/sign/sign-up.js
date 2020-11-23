const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPass');
const signUp = document.getElementById('sign-up');
const match = document.getElementById('match');
let passMatch = false
const auth = firebase.auth()

const handleConfirm = () => {
    if (confirmPassword.value == password.value && (password.value != '' || password.value != '')) {
        match.classList.remove('d-none');
        passMatch = true
    } else {
        match.classList.add('d-none');
        passMatch = false
    }

}

confirmPassword.addEventListener('keyup', handleConfirm);
password.addEventListener('keyup', handleConfirm);


const verifyEmail = () => {
    auth.currentUser.sendEmailVerification().then(() => {
        window.location.assign('../../get-started')
    })
}


signUp.onclick = (e) => {
    e.preventDefault()
    if (passMatch) {
        auth.createUserWithEmailAndPassword(email.value, password.value)
            .then((user) => {
                verifyEmail()
            })
            .catch((error) => {
                var errorMessage = error.message;
                alert(errorMessage)
                console.log(errorMessage)
            });
    } else {
        e.preventDefault();
        alert("Passwords should match")
    }
}
