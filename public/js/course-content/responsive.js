const nav = document.getElementById("nav");
const sideNav = document.getElementById("sideNav");
const header = document.getElementById("header");
const mainContent = document.getElementById("mainContent");
const md = 768;

// ################### HANDLE SIDENAV RESPONSIVENESS ###################
window.onscroll = () => {
  if (header.getBoundingClientRect().y + header.offsetHeight >= 0)
    sideNav.style.top = header.getBoundingClientRect().y + header.offsetHeight + "px";
  else {
    sideNav.style.top = 0;
  }
  sideNav.style.height = document.documentElement.clientHeight - sideNav.offsetTop + "px";
};
if (document.documentElement.clientWidth < md) {
  mainContent.classList.add("mainSm");
} else {
  mainContent.classList.remove("mainSm");
}
// if (document.documentElement.clientWidth < sm) {
//   mainContent.classList.add("mainSm");
// } else {
//   mainContent.classList.remove("mainSm");
// }

sideNav.style.height = document.documentElement.clientHeight - sideNav.offsetTop + "px";
window.onresize = () => {
  sideNav.style.height = document.documentElement.clientHeight - sideNav.offsetTop + "px";
  if (document.documentElement.clientWidth < md) {
    mainContent.classList.add("mainSm");
  } else {
    mainContent.classList.remove("mainSm");
  }
};
