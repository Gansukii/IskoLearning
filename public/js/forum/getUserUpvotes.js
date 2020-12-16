function getUserUpvotes(user, question_id, userUpvotesArr) {
  firebase
    .database()
    .ref("upvotes/" + user.uid)
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((singleSnapshot) => {
        userUpvotesArr.push(singleSnapshot.val().question_id);
      });
    })
    .then(() => {
      let url = new URL(window.location.href);
      if (url.searchParams.get("id")) {
        getQuestionById(question_id, userUpvotesArr);
        getUserAnswerUpvotes(user, question_id);
        // getAnswers(question_id);
      } else getQuestions(user.uid, userUpvotesArr);
    });
}
