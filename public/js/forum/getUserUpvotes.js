function getUserUpvotes(user, userUpvotesArr) {
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
      getQuestions(user.uid, userUpvotesArr);
    });
}
