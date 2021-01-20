var user = firebase.auth().currentUser;

// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//     console.log(user);
//   } else {
//     alert("Please sign-up or sign-in to an existing account");
//     window.location.assign("../../sign-in");
//   }
// });

function goToCategory(element) {
  const category = element.textContent.toLowerCase().trim();
  window.location.assign(`/category?search=${category}`);

  //   switch (category) {
  //     case "Programming":
  //       console.log(" prog");
  //       break;
  //     case "UI UX Design":
  //       console.log(" ui");
  //       break;

  //     case "Data Science":
  //       console.log("ngi DataScience");
  //       break;

  //     case "Machine Learning":
  //       console.log("ngi Machine");
  //       break;

  //     case "Networking":
  //       console.log("ngi Networking");
  //       break;

  //     case "Data Structure":
  //       console.log("ngi Structure");
  //       break;

  //     case "Database":
  //       console.log("ngi Database");
  //       break;

  //     case "Others":
  //       console.log("ngi Others");
  //       break;
  //   }
}
