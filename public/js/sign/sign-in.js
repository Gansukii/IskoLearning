const email = document.getElementById("email");
const password = document.getElementById("password");
const signIn = document.getElementById("sign-in");
const btnGoogle = document.getElementById("googleSign");
//var lg = 992;
var provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
var database = firebase.database();
var user;

signIn.onclick = (e) => {
  e.preventDefault();
  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .then((user) => {
      getUserData(user.user);
      // window.location.assign("../../home");
    })
    .catch((error) => {
      var errorMessage = error.message;
      alert(errorMessage);
    });
};

btnGoogle.onclick = (e) => {
  e.preventDefault();
  auth
    .signInWithPopup(provider)
    .then(function (result) {
      user = result.user;
      writeUserData(user.uid, user.displayName, user.email, "Student");
      // window.location.assign("../../home");
    })
    .catch(function (error) {
      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    });
};

function writeUserData(userId, name, email, userType) {
  database.ref("users/" + userId).set({
    fullname: name,
    username: name,
    email: email,
    user_type: userType,
  });
  localStorage.setItem("fullname", name);
  localStorage.setItem("username", name);
  localStorage.setItem("user_type", userType);
  window.location.assign("../../home");
}

function getUserData(user) {
  console.log(user);
  database
    .ref("users/" + user.uid)
    .once("value")
    .then((snapshot) => {
      let userInfo = snapshot.val();
      console.log(userInfo);
      localStorage.setItem("fullname", userInfo.fullName);
      localStorage.setItem("username", userInfo.username);
      localStorage.setItem("user_type", userInfo.user_type);
      window.location.assign("../../home");
    });
}
