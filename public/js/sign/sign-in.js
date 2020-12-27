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
  signIn.setAttribute("disabled", "");
  signIn.innerHTML = `<div class="spinner-border spinner-border-sm text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>`;
  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .then((user) => {
      getUserData(user.user);
      // window.location.assign("../../home");
    })
    .catch((error) => {
      var errorMessage = error.message;
      signIn.removeAttribute("disabled");
      signIn.innerHTML = "Sign In";
      alert(errorMessage);
    });
};

btnGoogle.onclick = (e) => {
  e.preventDefault();
  auth
    .signInWithPopup(provider)
    .then(function (result) {
      user = result.user;
      btnGoogle.innerHTML = `<div class="spinner-border spinner-border-sm text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>`;
      writeUserData(user.uid, user.displayName, user.email, "Student");
      // window.location.assign("../../home");
    })
    .catch(function (error) {
      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
      btnGoogle.innerHTML = "Sign In";
    });
};

function writeUserData(userId, name, email, userType) {
  database
    .ref("users/" + userId)
    .set({
      fullname: name,
      username: name,
      email: email,
      user_type: userType,
    })
    .then(() => {
      localStorage.setItem("fullname", name);
      localStorage.setItem("username", name);
      localStorage.setItem("user_type", userType);
      window.location.assign("../../home");
    });
}

function getUserData(user) {
  // console.log(user);
  database
    .ref("users/" + user.uid)
    .once("value")
    .then((snapshot) => {
      let userInfo = snapshot.val();
      console.log(userInfo);
      // userCache.add("userInfo.photoUrl");
      localStorage.setItem("fullname", userInfo.fullname);
      localStorage.setItem("username", userInfo.username);
      localStorage.setItem("user_type", userInfo.user_type);
      if (userInfo.user_type === "Professor") window.location.assign("../../professor/home");
      else window.location.assign("../../home");
    });
}
