const search = document.getElementById('search');
const avatar = document.getElementById('avatar');
const menuPop = document.getElementById('menuPop');
const signOut = document.getElementById('sign-out');
let isOpen = false;
var lg = 992;

window.onresize = () => {
    if (document.documentElement.clientWidth < lg) {
        if (!search.classList.contains('col-8')) {
            search.classList.add('col-8');
            avatar.classList.add()
            menuPop.style.left = "-100px";
        }
    } else {
        search.classList.remove('col-8');
        menuPop.removeAttribute("style")
    }
}
if (document.documentElement.clientWidth < lg) {
    if (document.documentElement.clientWidth < lg) {
        if (!search.classList.contains('col-8')) {
            search.classList.add('col-8');
            avatar.classList.add()
            menuPop.style.left = "-100px";
        }
    } else {
        search.classList.remove('col-8');
        menuPop.removeAttribute("style")
    }
}

avatar ? avatar.onclick = () => {

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
} : null

signOut ? signOut.onclick = () => {
        firebase.auth().signOut().then(function () {
            window.location.assign('../../sign-in')
        }).catch(function (error) {
            alert("Error occured")
        });
    } :
    null
