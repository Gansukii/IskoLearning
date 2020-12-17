let initialLoadDone = false;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    firebase
      .database()
      .ref("answers")
      .on("child_added", (data) => {
        console.log(initialLoadDone);
        if (initialLoadDone) {
          // console.log(data.key;
          console.log(data.val());
        }
        // addNotif(data.val().question_id, user.uid);
        initialLoadDone = true;
      });
  }
});

const addNotif = (questionId, userId) => {
  // let questionTitle;
  // let questionBody;
  firebase
    .database()
    .ref("questions/" + questionId)
    .once("value")
    .then((snapshot) => {
      console.log(snapshot.val());
      return snapshot.val();
    })
    .then((data) => {
      if (data) {
        firebase
          .database()
          .ref("user_notif/" + userId + "/" + questionId)
          .set({
            notif_datetime: firebase.database.ServerValue.TIMESTAMP,
            item: questionId,
            question_title: data.question_title,
            question_body: data.question_body,
            seen: false,
          });
      }
    });
};
