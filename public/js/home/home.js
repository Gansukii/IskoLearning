// var user = firebase.auth().currentUser;

function goToCategory(element) {
  const category = element.textContent.toLowerCase().trim();
  window.location.assign(`/category?search=${category}`);
}
