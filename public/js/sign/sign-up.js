const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPass");
const signUp = document.getElementById("sign-up");
const match = document.getElementById("match");
const selectType = document.getElementById("selectType");
let passMatch = false;
const auth = firebase.auth();
// const firebaseConfig = {
//   apiKey: "AIzaSyB6AKJ00dXzFcWZ3fDRofoBj1ryXUYr-R4",
//   authDomain: "iskolearning.firebaseapp.com",
//   databaseURL: "https://iskolearning.firebaseio.com",
//   projectId: "iskolearning",
//   storageBucket: "iskolearning.appspot.com",
//   messagingSenderId: "218405436604",
//   appId: "1:218405436604:web:59cb8c1ee9b9a2777d24b9",
//   measurementId: "G-C1QSFZTCJ4",
// };

// var config = {
//   apiKey: "AIzaSyB6AKJ00dXzFcWZ3fDRofoBj1ryXUYr-R4",
//   authDomain: "iskolearning.firebaseapp.com",
//   databaseURL: "https://iskolearning.firebaseio.com",
//   storageBucket: "iskolearning.appspot.com",
// };
// firebase.initializeApp(config);

var database = firebase.database();

const handleConfirm = () => {
  if (
    confirmPassword.value == password.value &&
    (password.value != "" || password.value != "")
  ) {
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
    auth
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((user) => {
        let randomDisplayName =
          "user" + Math.floor(Math.random() * 999).toString();
        writeUserData(
          user.user.uid,
          randomDisplayName,
          user.user.email,
          selectType.value
        );
        verifyEmail();
      })
      .catch((error) => {
        var errorMessage = error.message;
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
    fullName: name,
    username: name,
    email: email,
    user_type: userType,
  });
  localStorage.setItem("fullname", name);
  localStorage.setItem("username", name);
  localStorage.setItem("user_type", userType);
}
