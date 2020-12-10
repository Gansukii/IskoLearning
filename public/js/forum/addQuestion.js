function addQuestion(user, title, body) {
  let newQuestionKey = firebase.database().ref().child("questions").push().key;
  firebase
    .database()
    .ref("questions/" + newQuestionKey)
    .set(
      {
        question_id: newQuestionKey,
        user: {
          userId: user.uid,
          fullname: localStorage.getItem("fullname"),
          username: localStorage.getItem("username"),
          photoURL: user.photoURL,
        },
        question_title: title,
        question_body: body,
        upvote_count: 0,
        answer_count: 0,
        answers: null,
        created_datetime: firebase.database.ServerValue.TIMESTAMP,
      },
      (error) => {
        if (error) {
          btnAskQuestion.removeAttribute("disabled");
          alert("An error has occured. Please try again");
        } else {
          console.log("Successfully added");
          location.reload();
        }
      }
    );
}
