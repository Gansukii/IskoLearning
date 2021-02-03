// const navFullName = document.getElementById("navFullName");
// const navUserType = document.getElementById("navUserType");
// navFullName.innerHTML = localStorage.getItem("fullname");
// navUserType.innerHTML = localStorage.getItem("username");
// var currUser = null;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // currUser = user;
    firebase
      .database()
      .ref("users/" + user.uid)
      .once("value")
      .then((snapshot) => {
        let userInfo = snapshot.val();
        console.log();
        localStorage.setItem("fullname", userInfo.fullname);
        localStorage.setItem("username", userInfo.username);
        localStorage.setItem("user_type", userInfo.user_type);
      });
    // localStorage.setItem("photoURL", user.photoURL);
  } else {
    alert("Please sign-up or sign-in to an existing account");
    localStorage.clear();
    window.location.assign("../../sign-in");
  }
});
