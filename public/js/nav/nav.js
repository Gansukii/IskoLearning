const search = document.getElementById("search");
const avatar = document.getElementById("avatar");
const menuPop = document.getElementById("menuPop");
const signOut = document.getElementById("sign-out");
// const navFullName = document.getElementById("navFullName");
// const navUserType = document.getElementById("navUserType");
let isOpen = false;
var lg = 992;

// $(document).click(function (event) {
//   console.log(isOpen);
//   console.log(menuPop);
// });

if (menuPop) {
  window.onresize = () => {
    if (document.documentElement.clientWidth < lg) {
      menuPop.style.left = "-100px";
    } else {
      menuPop.removeAttribute("style");
    }
  };
  if (document.documentElement.clientWidth < lg) {
    if (document.documentElement.clientWidth < lg) {
      menuPop.style.left = "-100px";
    } else {
      menuPop.removeAttribute("style");
    }
  }
}
avatar
  ? (avatar.onclick = () => {
      if (!isOpen) {
        menuPop.classList.remove("d-none");
        menuPop.classList.remove("menuClose");
        menuPop.classList.add("d-flex");
        menuPop.classList.add("menuOpen");
        isOpen = true;
      } else {
        menuPop.classList.remove("menuOpen");
        menuPop.classList.add("menuClose");
        menuPop.classList.add("d-none");
        isOpen = false;
      }
    })
  : null;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // if (user.displayName) localStorage.setItem("displayName", user.displayName);
    // else {
    //   let randomDisplayName =
    //     "user" + Math.floor(Math.random() * 999).toString();
    //   user.updateProfile({ displayName: randomDisplayName });
    //   localStorage.setItem("displayName", randomDisplayName);
    // }
    // navFullName.innerHTML = localStorage.getItem("fullname");
    // navUserType.innerHTML = localStorage.getItem("username");
    console.log("update nav");
  }
  // else {
  //   alert("Please sign-up or sign-in to an existing account");
  //   window.location.assign("../../sign-in");
  // }
});

signOut
  ? (signOut.onclick = () => {
      firebase
        .auth()
        .signOut()
        .then(function () {
          localStorage.clear();
          window.location.assign("../../sign-in");
        })
        .catch(function (error) {
          alert("Error occured");
        });
    })
  : null;
