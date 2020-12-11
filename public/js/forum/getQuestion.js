const questionsContainer = document.getElementById("questionsContainer");

function getQuestions(uid, userUpvotesArr) {
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
            .ref("/questions")
            .once("value")
            .then((snapshot) => {
              document
                .getElementById("spinnerContainer")
                .classList.remove("d-flex");
              if (!snapshot.val()) {
                questionsContainer.innerHTML = `<div class="text-muted">no data found</div>`;
                return;
              }
              let questionsArr = Object.values(snapshot.val()).reverse();

              questionsArr.forEach((data) => {
                let dateDiff =
                  Math.abs(currDate - new Date(data.created_datetime)) / 1000;
                let timeAgo = getTimeAgo(dateDiff);

                let isUpvoted = userUpvotesArr.includes(data.question_id)
                  ? "upvoted"
                  : null;

                let node = document.createElement("div");
                firebase
                  .database()
                  .ref("users/" + data.user)
                  .once("value")
                  .then((snapshot) => {
                    let userInfo = snapshot.val();
                    if (userInfo) {
                      node.innerHTML = `<div class='col-12 mb-3'>
                      <div class='row mb-3 questionIcons' key=${data.question_id} time='12'>
                        <div class='p-0 d-flex align-items-center mr-3 iconToggle ${isUpvoted}' onClick='upvote(this)'>
                          <i class='far fa-caret-square-up mr-1'></i><div>${data.upvote_count}</div>
                        </div>
                        <div class='d-flex align-items-center iconToggle' onClick='comment(this)'>
                          <i class='far fa-comment mr-1'></i>${data.answer_count}
                        </div>
                      </div>
                      <div class='row d-flex align-items-center'>
                        <button class='btn avatar' style='background: url(${userInfo.photoUrl}) no-repeat center; background-size: cover;' id='avatar'></button>
                        <div class='col mx-2'>
                          <div class='row questionName'>${userInfo.fullname}</div>
                          <div class='row questionTime'>${timeAgo}</div>
                        </div>
                      </div>
                      <div class='row mt-1 questionTitle'>
                        ${data.question_title}
                      </div>
                      <div class='row mt-2'>
                        ${data.question_body}
                      </div>
                    </div>
                    <hr class='mb-1' />`;
                    }
                  });

                questionsContainer.appendChild(node);
              });
            });
        });
    });
}

function upvote(e) {
  const user = firebase.auth().currentUser;
  const question_id_key = e.parentNode.getAttribute("key");
  // const newUpvoteKey = firebase.database().ref().child("upvotes").push().key;

  let questionDb = firebase.database().ref("questions/" + question_id_key);
  if (e.classList.contains("upvoted")) {
    e.lastElementChild.innerHTML = parseInt(e.lastElementChild.textContent) - 1;
    e.classList.remove("upvoted");
    questionDb.update(
      {
        upvote_count: firebase.database.ServerValue.increment(-1),
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          firebase
            .database()
            .ref("upvotes/" + user.uid)
            .once("value")
            .then((snapshot) => {
              snapshot.forEach((singleSnapshot) => {
                const snapKey = singleSnapshot.key;
                if (singleSnapshot.val().question_id === question_id_key) {
                  firebase
                    .database()
                    .ref()
                    .child("upvotes/" + user.uid + "/" + snapKey)
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
    questionDb.update(
      {
        upvote_count: firebase.database.ServerValue.increment(1),
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          firebase
            .database()
            .ref("upvotes/" + user.uid)
            .push()
            .set({
              question_id: question_id_key,
            });
        }
      }
    );
  }
}

function comment(e) {
  let forumId = e.parentNode.getAttribute("key");
  // let isUp = 0;
  // if (e.previousElementSibling.classList.contains("upvoted")) isUp = 1;
  window.location.assign(`/answer?id=${forumId}`);
}
