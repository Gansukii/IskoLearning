const answersContainer = document.getElementById("answersContainer");

function getAnswers(questionId, answerUpvotesArr) {
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
            // .orderByChild("answered_datetime")
            // .limitToLast(10)
            .once("value")
            .then((snapshot) => {
              // console.log(snapshot.val());
              if (!snapshot.val()) {
                document.getElementById("txtAnswers").innerHTML = "0 Answer :(";
                return;
              }
              let answersArr = Object.values(snapshot.val()).reverse();
              document.getElementById("txtAnswers").innerHTML =
                answersArr.length +
                (answersArr.length < 2 ? " Answer" : " Answers");

              answersArr.forEach((answer) => {
                let timeAgo = getTimeAgo(
                  Math.abs(currDate - new Date(answer.answered_datetime)) / 1000
                );
                let node = document.createElement("div");
                let isUpvoted = answerUpvotesArr.includes(answer.answer_id)
                  ? "upvoted"
                  : null;
                firebase
                  .database()
                  .ref("users/" + answer.user)
                  .once("value")
                  .then((snapshot) => {
                    let userInfo = snapshot.val();

                    if (userInfo) {
                      node.innerHTML = `<div class="col-12 mb-3">
          <div class="row mb-4 questionIcons">
              <div class="d-flex align-items-center iconToggle ${isUpvoted}" onClick={upvoteAnswer(this)} akey='${answer.answer_id}' qkey='${questionId}'>
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

function upvoteAnswer(e) {
  const user = firebase.auth().currentUser;
  const answer_id_key = e.getAttribute("akey");
  const question_id_key = e.getAttribute("qkey");
  let answerDb = firebase
    .database()
    .ref("answers/" + question_id_key + "/" + answer_id_key);
  if (e.classList.contains("upvoted")) {
    e.lastElementChild.innerHTML = parseInt(e.lastElementChild.textContent) - 1;
    e.classList.remove("upvoted");
    answerDb.update(
      {
        upvote_count: firebase.database.ServerValue.increment(-1),
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          firebase
            .database()
            .ref("answer_upvotes/" + user.uid)
            .once("value")
            .then((snapshot) => {
              snapshot.forEach((singleSnapshot) => {
                const snapKey = singleSnapshot.key;
                if (singleSnapshot.val().answer_id === answer_id_key) {
                  firebase
                    .database()
                    .ref()
                    .child("answer_upvotes/" + user.uid + "/" + snapKey)
                    .remove();
                }
              });
            });
        }
      }
    );
  } else {
    e.lastElementChild.innerHTML = parseInt(e.lastElementChild.textContent) + 1;
    e.classList.add("upvoted");
    answerDb.update(
      {
        upvote_count: firebase.database.ServerValue.increment(1),
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          firebase
            .database()
            .ref("answer_upvotes/" + user.uid)
            .push()
            .set({
              answer_id: answer_id_key,
            });
        }
      }
    );
  }
}
