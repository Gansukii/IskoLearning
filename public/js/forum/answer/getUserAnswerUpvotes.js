function getUserAnswerUpvotes(user, questionId) {
  let answerUpvotesArr = [];
  firebase
    .database()
    .ref("answer_upvotes/" + user.uid)
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((singleSnapshot) => {
        answerUpvotesArr.push(singleSnapshot.val().answer_id);
      });
    })
    .then(() => {
      getAnswers(question_id, answerUpvotesArr);
    });
}
