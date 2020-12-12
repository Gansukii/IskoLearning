const questionContainer = document.getElementById("questionContainer");

function getQuestionById(question_id, userUpvotesArr) {
  let currDate;
  let dateRetriever = firebase.database().ref("/date");
  dateRetriever
    .update({ currTime: firebase.database.ServerValue.TIMESTAMP })
    .then(function (data) {
      dateRetriever
        .once("value")
        .then((snapshot) => {
          currDate = new Date(snapshot.val().currTime);
        })
        .then(() => {
          firebase
            .database()
            .ref("questions/" + question_id)
            .once("value")
            .then((snapshot) => {
              document
                .getElementById("spinnerContainer")
                .classList.remove("d-flex");
              let question = snapshot.val();
              let timeAgo = getTimeAgo(
                Math.abs(currDate - new Date(question.created_datetime)) / 1000
              );
              let isUpvoted = userUpvotesArr.includes(question.question_id)
                ? "upvoted"
                : null;
              firebase
                .database()
                .ref("users/" + question.user)
                .once("value")
                .then((snapshot) => {
                  let userInfo = snapshot.val();
                  questionContainer.innerHTML = `
               <div class='row d-flex align-items-center'>
                <button class='btn avatar' style='background: url(${userInfo.photoUrl}) no-repeat center; background-size: cover;' id='avatar'></button>
                <div class='col mx-2'>
                  <div class='row questionName'>${userInfo.fullname}</div>
                  <div class='row questionTime'>${timeAgo}</div>
                </div>
              </div>
               <div class='row mt-1 questionTitle'>
                        ${question.question_title}
                      </div>
              <div class='row mt-2'>
                ${question.question_body}
              </div>

              <div class='row mt-3 mt-lg-4 questionIcons' key=${question.question_id}>
                <div class='d-flex align-items-center mr-3 iconToggle ${isUpvoted}' onClick='upvote(this)'>
                  <i class='far fa-caret-square-up mr-1'></i><div>${question.upvote_count}</div>
                </div>
                <div class='d-flex align-items-center'>
                  <i class='far fa-comment mr-1'></i><div>${question.answer_count}
                </div>
              </div>`;
                });
            });
        });
    });
}
