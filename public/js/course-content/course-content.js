let btnSideItemActive = document.getElementsByClassName("btnSideItem")[0];

function changeActive(element) {
  btnSideItemActive.classList.remove("btnSideItemActive");
  element.classList.add("btnSideItemActive");
  btnSideItemActive = element;
  // for (let i = 0; i < btnSideItem.length; i++) {
  //   btnSideItem[i].classList.remove("btnSideItemActive");
  //   if (btnSideItem[i] === element) {
  //     console.log(element);
  //     break;
  //   }
}
