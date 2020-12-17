function addAnswer(user, questionId, body) {
  let newAnswerKey = firebase
    .database()
    .ref()
    .child("answers/" + questionId)
    .push().key;
  let answerForm = {
    answer_id: newAnswerKey,
    user: user.uid,
    answered_datetime: firebase.database.ServerValue.TIMESTAMP,
    answer_body: body,
    upvote_count: 0,
  };
  notifyUser(user.uid, questionId);
  firebase
    .database()
    .ref("answers/" + questionId + "/" + newAnswerKey)
    .set(answerForm)
    .then(() => {
      firebase
        .database()
        .ref("user-answers/" + user.uid + "/" + newAnswerKey)
        .set(answerForm)
        .then(() => {
          firebase
            .database()
            .ref("questions/" + questionId)
            .update(
              {
                answer_count: firebase.database.ServerValue.increment(1),
              },
              (error) => {
                if (error) {
                  console.log(error);
                  document
                    .getElementById("btnSubmitAns")
                    .removeAttribute("disabled");
                  alert(error);
                } else {
                  // location.reload();
                }
              }
            );
        });
    });
}

function notifyUser(uid, questionId) {
  firebase
    .database()
    .ref("questions/" + questionId)
    .once("value")
    .then((snapshot) => {
      if (snapshot.val()) {
        const data = snapshot.val();
        const newAnswerNotifKey = firebase
          .database()
          .ref()
          .child("user_answer_notif/" + data.user)
          .push().key;
        firebase
          .database()
          .ref("user_answer_notif/" + data.user + "/" + newAnswerNotifKey)
          .set({
            user: uid,
            notif_datetime: firebase.database.ServerValue.TIMESTAMP,
            item: data.question_id,
            question_title: data.question_title,
            // question_body: data.question_body,
            seen: false,
          });
      }
    });
}
