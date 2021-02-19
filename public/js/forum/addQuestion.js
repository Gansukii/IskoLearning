function addQuestion(user, title, body, tags) {
  let newQuestionKey = firebase.database().ref().child("questions").push().key;
  let questionForm = {
    question_id: newQuestionKey,
    user: user.uid,
    question_title: title,
    question_body: body,
    upvote_count: 0,
    answer_count: 0,
    answers: null,
    tags: tags,
    created_datetime: firebase.database.ServerValue.TIMESTAMP,
  };

  firebase
    .database()
    .ref("tags")
    .once("value")
    .then((snapshot) => {
      let newTags = tags.concat(snapshot.val());
      var seen = {};
      let finalTags = [];
      var j = 0;
      for (let i = 0; i < newTags.length; i++) {
        if (newTags[i]) {
          var item = newTags[i].toLowerCase();
          if (seen[item] !== 1) {
            seen[item] = 1;
            finalTags[j] = item;
            j++;
          }
        }
      }
      return finalTags.sort();
    })
    .then((finalTags) => {
      let updates = {};
      // questionForm["tags"] = finalTags;
      updates["questions/" + newQuestionKey] = questionForm;
      updates["user-questions/" + user.uid + "/" + newQuestionKey] = questionForm;
      updates["tags"] = finalTags;
      tags.forEach((tag) => {
        updates["tags_questions/" + tag + "/" + newQuestionKey] = { question_id: newQuestionKey };
      });
      // updates["tags_questions"] = finalTags;
      firebase.database().ref().update(updates);
      location.reload();
    });

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
