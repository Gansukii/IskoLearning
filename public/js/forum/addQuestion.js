function addQuestion(user, title, body) {
  let newQuestionKey = firebase.database().ref().child("questions").push().key;
  let questionForm = {
    question_id: newQuestionKey,
    user: user.uid,
    question_title: title,
    question_body: body,
    upvote_count: 0,
    answer_count: 0,
    answers: null,
    created_datetime: firebase.database.ServerValue.TIMESTAMP,
  };

  let updates = {};
  updates["questions/" + newQuestionKey] = questionForm;
  updates["user-questions/" + user.uid + "/" + newQuestionKey] = questionForm;

  firebase.database().ref().update(updates);
  location.reload();

  // firebase
  //   .database()
  //   .ref("questions/" + newQuestionKey)
  //   .set(
  //     {
  //       question_id: newQuestionKey,
  //       user: user.uid,
  //       question_title: title,
  //       question_body: body,
  //       upvote_count: 0,
  //       answer_count: 0,
  //       answers: null,
  //       created_datetime: firebase.database.ServerValue.TIMESTAMP,
  //     },
  // (error) => {
  //   if (error) {
  //     btnAskQuestion.removeAttribute("disabled");
  //     alert("An error has occured. Please try again");
  //   } else {
  //     console.log("Successfully added");
  //     location.reload();
  //   }
  // }
  // );
}
