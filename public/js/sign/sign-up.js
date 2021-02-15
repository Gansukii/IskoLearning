const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPass");
const signUp = document.getElementById("sign-up");
const match = document.getElementById("match");
const selectType = document.getElementById("selectType");
let passMatch = false;
const auth = firebase.auth();

var database = firebase.database();

const handleConfirm = () => {
  if (confirmPassword.value == password.value && (password.value != "" || password.value != "")) {
    match.classList.remove("d-none");
    passMatch = true;
  } else {
    match.classList.add("d-none");
    passMatch = false;
  }
};

confirmPassword.addEventListener("keyup", handleConfirm);
password.addEventListener("keyup", handleConfirm);

const verifyEmail = () => {
  auth.currentUser.sendEmailVerification().then(() => {
    window.location.assign("../../home");
  });
};

signUp.onclick = (e) => {
  e.preventDefault();
  if (passMatch) {
    signUp.innerHTML = `<div class="spinner-border spinner-border-sm text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>`;
    auth
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((user) => {
        let randomDisplayName = "user" + Math.floor(Math.random() * 999).toString();
        writeUserData(user.user.uid, randomDisplayName, user.user.email, selectType.value);
        verifyEmail();
      })
      .catch((error) => {
        var errorMessage = error.message;
        signUp.innerHTML = "Sign Up";
        alert(errorMessage);
        console.log(errorMessage);
      });
  } else {
    e.preventDefault();
    alert("Passwords should match");
  }
};

function writeUserData(userId, name, email, userType) {
  database.ref("users/" + userId).set({
    fullname: name,
    username: name,
    email: email,
    user_type: userType,
  });
  firebase.auth().currentUser.updateProfile({
    displayName: name,
  });
  localStorage.setItem("fullname", name);
  localStorage.setItem("username", name);
  localStorage.setItem("user_type", userType);
}
