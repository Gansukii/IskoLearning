function getSortedQuestion(tag) {
  const questionsContainer = document.getElementById("questionsContainerInner");
  const questionsContainerSorted = document.getElementById("questionsContainerSorted");

  let currDate;
  let dateRetriever = firebase.database().ref("/date");
  dateRetriever.update({ currTime: firebase.database.ServerValue.TIMESTAMP }).then(function (data) {
    dateRetriever
      .once("value")
      .then((snapshot) => {
        currDate = new Date(snapshot.val().currTime);
      })
      .then(() => {
        firebase
          .database()
          .ref("tags_questions/" + tag)
          .once("value")
          .then((snapshot) => {
            // console.log(snapshot.val());
            // questionsContainer.innerHTML = "";
            questionsContainerSorted.innerHTML = "";
            questionsContainer.classList.add("d-none");
            document.getElementById("spinnerContainer").classList.remove("d-flex");
            if (!snapshot.val()) {
              questionsContainerSorted.innerHTML = `<div class="text-muted">no data found</div>`;
              return;
            }
            // let questionsArr = Object.values(snapshot.val()).reverse();
            // console.log(questionsArr);
            snapshot.forEach((indivData) => {
              //   let node = document.createElement("div");
              //   console.log(indivData.key);
              firebase
                .database()
                .ref("/questions")
                .orderByChild("question_id")
                .equalTo(indivData.key)
                .once("value")
                .then((questionData) => {
                  let data = questionData.val()[indivData.key];
                  //   let data = questionData.val()[indivData.key];
                  //   console.log(questionData.val());
                  //   console.log(questionData.val()[indivData.key]);
                  let dateDiff = Math.abs(currDate - new Date(data.created_datetime)) / 1000;
                  let timeAgo = getTimeAgo(dateDiff);

                  let isUpvoted = userUpvotesArr.includes(data.question_id) ? "upvoted" : null;

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
                        questionsContainerSorted.appendChild(node);
                      }
                    });
                });
            });
            // questionsContainerSorted.innerHTML = "";
            // questionsContainer.classList.add("d-none");
            // document.getElementById("spinnerContainer").classList.remove("d-flex");
            // if (!snapshot.val()) {
            //   questionsContainerSorted.innerHTML = `<div class="text-muted">no data found</div>`;
            //   return;
            // }
            // let questionsArr = Object.values(snapshot.val()).reverse();

            // questionsArr.forEach((data) => {
            //   console.log(data);
            //   let dateDiff = Math.abs(currDate - new Date(data.created_datetime)) / 1000;
            //   let timeAgo = getTimeAgo(dateDiff);

            //   let isUpvoted = userUpvotesArr.includes(data.question_id) ? "upvoted" : null;

            //   let node = document.createElement("div");
            //   firebase
            //     .database()
            //     .ref("users/" + data.user)
            //     .once("value")
            //     .then((snapshot) => {
            //       let userInfo = snapshot.val();
            //       if (userInfo) {
            //         node.innerHTML = `<div class='col-12 mb-3'>
            //           <div class='row mb-3 questionIcons' key=${data.question_id} time='12'>
            //             <div class='p-0 d-flex align-items-center mr-3 iconToggle ${isUpvoted}' onClick='upvote(this)'>
            //               <i class='far fa-caret-square-up mr-1'></i><div>${data.upvote_count}</div>
            //             </div>
            //             <div class='d-flex align-items-center iconToggle' onClick='comment(this)'>
            //               <i class='far fa-comment mr-1'></i>${data.answer_count}
            //             </div>
            //           </div>
            //           <div class='row d-flex align-items-center'>
            //             <button class='btn avatar' style='background: url(${userInfo.photoUrl}) no-repeat center; background-size: cover;' id='avatar'></button>
            //             <div class='col mx-2'>
            //               <div class='row questionName'>${userInfo.fullname}</div>
            //               <div class='row questionTime'>${timeAgo}</div>
            //             </div>
            //           </div>
            //           <div class='row mt-1 questionTitle'>
            //             ${data.question_title}
            //           </div>
            //           <div class='row mt-2'>
            //             ${data.question_body}
            //           </div>
            //         </div>
            //         <hr class='mb-1' />`;
            //       }
            //     });

            //   questionsContainerSorted.appendChild(node);
            // });
          });
      });
  });
}
