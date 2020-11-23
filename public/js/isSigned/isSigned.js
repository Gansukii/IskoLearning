firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      console.log(user)
  } else {
//    const body = document.getElementsByName
      console.log('not signed in')
  }
});