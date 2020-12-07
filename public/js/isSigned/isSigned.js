var database = firebase.database();
const navFullName = document.getElementById("navFullName");
const navUserType = document.getElementById("navUserType");
navFullName.innerHTML = localStorage.getItem("fullname");
navUserType.innerHTML = localStorage.getItem("username");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    database
      .ref("users/" + user.uid)
      .once("value")
      .then((snapshot) => {
        let userInfo = snapshot.val();
        localStorage.setItem("fullname", userInfo.fullName);
        localStorage.setItem("username", userInfo.username);
        localStorage.setItem("user_type", userInfo.user_type);
      });
    console.log(user);
  } else {
    alert("Please sign-up or sign-in to an existing account");
    window.location.assign("../../sign-in");
  }
});
