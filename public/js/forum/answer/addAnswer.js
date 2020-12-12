function addAnswer(user, questionId, body) {
  let newAnswerKey = firebase
    .database()
    .ref()
    .child("answers/" + questionId)
    .push().key;
  firebase
    .database()
    .ref("answers/" + questionId + "/" + newAnswerKey)
    .set({
      //   question_id: questionId,
      user: user.uid,
      answered_datetime: firebase.database.ServerValue.TIMESTAMP,
      answer_body: body,
      upvote_count: 0,
    })
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
              alert(error);
            } else {
              location.reload();
            }
          }
        );
    });
}
