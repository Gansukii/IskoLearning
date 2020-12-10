const questionsContainer = document.getElementById("questionsContainer");

function getQuestions(uid) {
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
              let questionsArr = Object.values(snapshot.val());

              questionsArr.forEach((data) => {
                let dateDiff =
                  Math.abs(currDate - new Date(data.created_datetime)) / 1000;

                let hh = Math.floor(dateDiff / 3600);
                dateDiff -= hh * 3600;
                let mm = Math.floor(dateDiff / 60);
                dateDiff -= mm * 60;
                let ss = Math.floor(dateDiff);
                dateDiff -= ss;
                let timeAgo;
                if (hh < 1 && mm < 1) {
                  timeAgo = "few seconds ago";
                } else if (hh < 1) {
                  if (mm == 1) timeAgo = "1 minute ago";
                  else timeAgo = mm.toString() + " minutes ago";
                } else if (hh <= 48) {
                  timeAgo = "1 day ago";
                } else {
                  console.log(hh);
                  var days = Math.floor(hh / 24);
                  timeAgo = days.toString() + " days ago";
                }
                let node = document.createElement("div");
                node.innerHTML = `<div class='col-12 mb-3'>
                      <div class='row mb-3 questionIcons' key=${data.question_id} time='12'>
                        <div class='p-0 d-flex align-items-center mr-3 iconToggle isUpvoted' onClick='upvote(this)'>
                          <i class='far fa-caret-square-up mr-1'></i><div>${data.upvote_count}</div>
                        </div>
                        <div class='d-flex align-items-center iconToggle' onClick='comment(this)'>
                          <i class='far fa-comment mr-1'></i>${data.answer_count}
                        </div>
                      </div>
                      <div class='row d-flex align-items-center'>
                        <button class='btn avatar' style='background: url(${data.user.photoURL}) no-repeat center; background-size: cover;' id='avatar'></button>
                        <div class='col mx-2'>
                          <div class='row questionName'>${data.user.fullname}</div>
                          <div class='row questionTime'>${timeAgo}</div>
                        </div>
                      </div>
                      <div class='row mt-1'>
                        ${data.question_body}
                      </div>
                    </div>
                    <hr class='mb-1' />`;

                questionsContainer.appendChild(node);
              });
            });
        });
    });
}

function upvote(e) {
  let questionDb = firebase
    .database()
    .ref("questions/" + e.parentNode.getAttribute("key"));
  if (e.classList.contains("upvoted")) {
    e.classList.remove("upvoted");
    questionDb.update(
      {
        upvote_count: firebase.database.ServerValue.increment(-1),
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
        }
      }
    );
  } else {
    e.classList.add("upvoted");
    questionDb.update(
      {
        upvote_count: firebase.database.ServerValue.increment(1),
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
        }
      }
    );
  }
}
