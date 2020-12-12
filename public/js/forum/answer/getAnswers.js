const answersContainer = document.getElementById("answersContainer");

function getAnswers(questionId) {
  //   document.getElementById("txtAnswers").innerHTML =
  //     numAnswers + (numAnswers < 2 ? " Answer" : " Answers");

  let currDate;
  firebase
    .database()
    .ref("/date")
    .update({ currTime: firebase.database.ServerValue.TIMESTAMP })
    .then(function (data) {
      firebase
        .database()
        .ref("/date")
        .once("value")
        .then((snapshot) => {
          currDate = new Date(snapshot.val().currTime);
        })
        .then(() => {
          firebase
            .database()
            .ref("answers/" + questionId)
            .once("value")
            .then((snapshot) => {
              if (!snapshot.val()) {
                document.getElementById("txtAnswers").innerHTML = "0 Answer";
                return;
              }
              let answersArr = Object.values(snapshot.val());
              document.getElementById("txtAnswers").innerHTML =
                answersArr.length +
                (answersArr.length < 2 ? " Answer" : " Answers");

              answersArr.forEach((answer) => {
                let timeAgo = getTimeAgo(
                  Math.abs(currDate - new Date(answer.created_datetime)) / 1000
                );
                let node = document.createElement("div");
                let isUpvoted = null;
                firebase
                  .database()
                  .ref("users/" + answer.user)
                  .once("value")
                  .then((snapshot) => {
                    let userInfo = snapshot.val();

                    if (userInfo) {
                      node.innerHTML = `<div class="col-12 mb-3">
                    <div class="row mb-4 questionIcons">
                        <div class="d-flex align-items-center iconToggle ${isUpvoted}" onClick={upvoteAnswer(this,${answer.answer_id})}>
                        <i class="far fa-caret-square-up mr-1"></i><div>${answer.upvote_count}</div>
                        </div>
                    </div>
                    <div class="row d-flex align-items-center">
                        <button class="btn avatar" style='background: url(${userInfo.photoUrl}) no-repeat center; background-size: cover;' id="avatar"></button>
                        <div class="col mx-2">
                        <div class="row questionName">${userInfo.fullname}</div>
                        <div class="row questionTime">${timeAgo}</div>
                        </div>
                    </div>
                    <div class="row mt-1">
                        ${answer.answer_body}
                    </div>
                    </div>
                    <hr class="mb-1" />`;
                    }
                  });
                answersContainer.appendChild(node);
              });
            });
        });
    });
}
