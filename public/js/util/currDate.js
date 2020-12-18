// setInterval(() => {
//   firebase
//     .database()
//     .ref("/date")
//     .update({ currTime: firebase.database.ServerValue.TIMESTAMP })
//     .then(function () {
//       firebase
//         .database()
//         .ref("/date")
//         .once("value")
//         .then((snapshot) => {
//           localStorage.setItem("timestamp", snapshot.val().currTime);
//         });
//     });
// }, 120000);
