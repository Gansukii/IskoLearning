const search = document.getElementById("search");
const avatar = document.getElementById("avatar");
const menuAvatar = document.getElementById("menuAvatar");
const menuPop = document.getElementById("menuPop");
const signOut = document.getElementById("sign-out");
const navFullName = document.getElementById("navFullName");
const navUserType = document.getElementById("navUserType");
// const markRead = document.getElementById("markRead");
// const removeNotif = document.getElementById("removeNotif");
const btnNotifItem = document.getElementById("btnNotifItem");
let isOpen = false;
var lg = 992;

// $(document).click(function (event) {
//   console.log(isOpen);
//   console.log(menuPop);
// });

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (user.photoURL && avatar) {
      avatar.style = `background: url(${user.photoURL}) no-repeat center; background-size: cover;`;
      menuAvatar.style = `background: url(${user.photoURL}) no-repeat center; background-size: cover;`;
    }
  }
});

if (menuPop) {
  navFullName.innerHTML = localStorage.getItem("fullname");
  navUserType.innerHTML = localStorage.getItem("user_type");
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
