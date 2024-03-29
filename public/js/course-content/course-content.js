const textCourseTitle = document.getElementById("textCourseTitle");
const btnShowChapInfo = document.getElementById("btnShowChapInfo");
const sideNavDataContainer = document.getElementById("sideNavDataContainer");
const questionsContainer = document.getElementById("questionsContainer");
const modalCourseTitle = document.getElementById("modalCourseTitle");
const btnDlCert = document.getElementById("btnDlCert");
const reviewInput = document.getElementById("reviewInput");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const stars = document.getElementsByClassName("fa-star");
let btnSideItems = [];
let firstIter = true;
let chapFirstIter = true;
let btnSideItemActive;
let currentChap = 1;
let chapNames = {};
let totalQuizCount = 0;
let currentInfo;
let currentMain;
let currentUser;
let courseDone = false;
let courseTitle = "";
let profId = "";
let totalOver = 0;
let totalScore = 0;
let starRating;

let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

function changeActive(element) {
  disableNavBtn(element);
  currentChap = element.parentNode.getAttribute("chapNumber");
  if (currentMain === questionsContainer) {
    questionsContainer.innerHTML = "";
  }
  btnSideItemActive.classList.remove("btnSideItemActive");
  element.classList.add("btnSideItemActive");
  currentMain.classList.add("d-none");
  currentMain = document.getElementById(element.getAttribute("key"));
  currentMain.classList.remove("d-none");
  btnSideItemActive = element;
  // element.getAttribute("vid") === "true"
  //   ? showVid(element.getAttribute("key"))
  //   : showQuiz(element.getAttribute("key"));

  // for (let i = 0; i < btnSideItem.length; i++) {
  //   btnSideItem[i].classList.remove("btnSideItemActive");
  //   if (btnSideItem[i] === element) {
  //     console.log(element);
  //     break;
  //   }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    currentUser = user;
    firebase
      .database()
      .ref("course_students/" + courseId)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          if (user.uid in snapshot.val()) {
            verified(user);
          } else {
            alert("Please enroll first to record your data");
            window.history.back();
          }
        } else {
          alert("Please enroll first to record your data");
          window.history.back();
        }
      });
  }
});

function verified(user) {
  firebase
    .database()
    .ref("student_user_course/" + currentUser.uid + "/" + courseId)
    .update({
      last_opened: firebase.database.ServerValue.TIMESTAMP,
    });
  document.getElementById("sideLoadingContainer").remove();
  document.getElementById("loadingMain").remove();
  sideNavDataContainer.classList.remove("d-none");
  firebase
    .database()
    .ref("courses/" + courseId)
    .once("value")
    .then((snapshot) => {
      const courseData = snapshot.val();
      courseTitle = courseData.course_title;
      profId = courseData.prof_id;
      firebase
        .database()
        .ref("student_user_course/" + user.uid + "/" + courseId)
        .once("value")
        .then((progress) => {
          if (progress.val().progress_percent >= 100) {
            showModal();
          }
        });
      textCourseTitle.innerHTML = `
        <span style='cursor: pointer;' onclick=goToOverview()>${courseData.course_title}</span>
        <span class='ml-1' style='color: #ffffff;'> > Course Content </span>`;
      firebase
        .database()
        .ref("course_chapters/" + courseData.contents)
        .once("value")
        .then((chapterSnapshot) => {
          chapterSnapshot.forEach((data) => {
            const chapterData = data.val();
            chapNames[chapterData.chapter_number] = chapterData.chapter_title;
            totalQuizCount += chapterData.quiz_count;
            const newSideNode = document.createElement("div");
            newSideNode.className = "col-12 mb-4";
            newSideNode.id = `chapter${chapterData.chapter_number}`;
            newSideNode.setAttribute("chapNumber", chapterData.chapter_number);
            newSideNode.innerHTML = `
              <div class="txtChapter mb-2">Chapter ${chapterData.chapter_number}: ${chapterData.chapter_title}
              </div>
              <div class="chapterContents${chapterData.chapter_number}">
              </div>`;
            sideNavDataContainer.appendChild(newSideNode);
            addNewChapterInfo(chapterData);

            for (let itemId in chapterData.chapter_contents) {
              const chapterContents = chapterData.chapter_contents[itemId];
              const icon = chapterContents.video ? "fa-play-circle" : "fa-file-alt";
              const newSideBtn = document.createElement("button");
              newSideBtn.className = "btn w-100 text-left d-flex align-items-center btnSideItem";
              newSideBtn.setAttribute("onclick", "changeActive(this)");
              newSideBtn.setAttribute("key", chapterContents.itemId);
              newSideBtn.innerHTML = `
                <i class="far ${icon} mr-2"></i>${chapterContents.title}
              `;

              document
                .getElementById(`chapter${chapterData.chapter_number}`)
                .appendChild(newSideBtn);
              btnSideItems.push(newSideBtn);
              let newMainNode = document.createElement("div");
              newMainNode.className = "w-100 d-none";
              newMainNode.classList.remove(chapFirstIter ? "d-none" : "x");
              if (chapFirstIter) currentMain = newMainNode;
              chapFirstIter = false;
              newMainNode.id = chapterContents.itemId;
              if (chapterContents.video) {
                newMainNode.innerHTML = `
                  <div class="col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 txtMain">${chapterContents.title}</div>
                  <div class="thumbContainer">
                    <iframe
                      class="w-100 h-100"
                      src="https://www.youtube.com/embed/${chapterContents.videoId}"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <div class="col-12 my-3 text-justify px-0 vidDescription" id="vidDescription">
                    ${chapterContents.description}
                  </div>
                `;
              } else {
                totalOver += chapterContents.questions.length - 1;
                firebase
                  .database()
                  .ref("student_user_course/" + user.uid + "/" + courseId + "/quiz_done")
                  .once("value")
                  .then((doneKeys) => {
                    let startButton = `<button class="btn btn-danger px-4 btnStart" id="btnStartQuiz" qTitle=" ${chapterContents.title}" chapNum="${chapterContents.chapter}" cKey="${courseData.contents}" key="${chapterContents.itemId}" onclick="startQuiz(this)">Start Quiz</button>`;
                    if (doneKeys.val()) {
                      if (chapterContents.itemId in doneKeys.val()) {
                        totalScore += doneKeys.val()[chapterContents.itemId].score;
                        startButton = `<button class="btn btn-danger px-4 btnStart" disabled><i class="far fa-check-circle"></i> Quiz Done</button>`;
                      }
                    }
                    newMainNode.innerHTML = `
                    <div class="col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 txtMain">${
                      chapterContents.title
                    }</div>
                    <div class="row w-100 mx-0 py-3 px-4 paper">
                      <div class="col-12 px-0 points" id="points">${
                        chapterContents.questions.length - 1
                      } items</div>
                      <div class="col-12 px-0 mt-2 mb-1 txtQuizHead">Instructions</div>
                      <div class="col-12 px-0 txtInstructions" id="intructions">
                        ${chapterContents.instructions}
                      </div>
                    </div>
                    <div class="col-12 px-0 mt-4 d-flex justify-content-end">
                      ${startButton}
                    </div>`;
                  });
              }
              document.getElementById("contentItem").appendChild(newMainNode);

              if (firstIter) {
                btnSideItemActive = newSideBtn;
                newSideBtn.classList.add("btnSideItemActive");
                firstIter = false;
              }
            }
            btnNext.removeAttribute("disabled");
          });
        });
    });

  btnShowChapInfo.onclick = () => {
    currentInfo = document.getElementById("chapInfoContainer" + currentChap);
    currentInfo.classList.remove("d-none");
    // btnShowChapInfo.setAttribute("disabled", "");
    disabler(btnShowChapInfo);
  };
}
function hideChapText(element) {
  currentInfo.classList.add("d-none");
  btnShowChapInfo.removeAttribute("disabled");
}

// function showVid(data) {}

// function showQuiz(data) {
//   console.log("quiz", id);
// }

function addNewChapterInfo(data) {
  let newChapterInfoNode = document.createElement("div");
  newChapterInfoNode.className = "row w-100 mx-0 d-none";
  newChapterInfoNode.id = `chapInfoContainer${data.chapter_number}`;
  newChapterInfoNode.innerHTML = `
            <div
              class="col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 d-none d-flex justify-content-between txtMain"
            >
              <span id="txtChapterTitle1">${data.chapter_title}</span>
              <div class="d-flex align-items-center">
                <i class="far fa-times-circle c-p" onclick="hideChapText(this)"></i>
              </div>
            </div>
            <div class="col-12 mb-5 text-justify px-0" id="chapterDes1">
              ${data.chapter_description}
            </div>
  `;
  document.getElementById("contentItem").prepend(newChapterInfoNode);
}

btnNext.onclick = () => {
  const elementIndex = btnSideItems.indexOf(btnSideItemActive);

  disableNavBtn(btnSideItems[elementIndex + 1]);
  btnSideItemActive.classList.remove("btnSideItemActive");
  btnSideItemActive = btnSideItems[elementIndex + 1];
  btnSideItemActive.classList.add("btnSideItemActive");
  currentMain.classList.add("d-none");
  currentMain = document.getElementById(btnSideItems[elementIndex + 1].getAttribute("key"));
  currentMain.classList.remove("d-none");
};
btnPrev.onclick = () => {
  const elementIndex = btnSideItems.indexOf(btnSideItemActive);

  disableNavBtn(btnSideItems[elementIndex - 1]);
  btnSideItemActive.classList.remove("btnSideItemActive");
  btnSideItemActive = btnSideItems[elementIndex - 1];
  btnSideItemActive.classList.add("btnSideItemActive");
  currentMain.classList.add("d-none");
  currentMain = document.getElementById(btnSideItems[elementIndex - 1].getAttribute("key"));
  currentMain.classList.remove("d-none");
};

function disableNavBtn(element) {
  if (btnSideItems.indexOf(element) > 0) {
    btnPrev.removeAttribute("disabled");
    btnPrev.classList.add("lessonNavActive");
  } else {
    // btnPrev.setAttribute("disabled", "");
    disabler(btnPrev);
    btnPrev.classList.remove("lessonNavActive");
  }
  if (btnSideItems.indexOf(element) === btnSideItems.length - 1) {
    // btnNext.setAttribute("disabled", "");
    disabler(btnNext);

    btnNext.classList.remove("lessonNavActive");
  } else {
    btnNext.removeAttribute("disabled");
    btnNext.classList.add("lessonNavActive");
  }
}

function startQuiz(element) {
  let key = element.getAttribute("key");
  let chapter = element.getAttribute("chapNum");
  let contentKey = element.getAttribute("ckey");
  let quizTitle = element.getAttribute("qTitle");
  questionsContainer.classList.remove("d-none");
  let answersArr = [];
  // element.setAttribute("disabled", "");
  disabler(element);
  element.innerHTML = `<div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                      </div>`;
  for (el of btnSideItems) {
    // el.setAttribute("disabled", "");
    disabler(el);
  }

  firebase
    .database()
    .ref("course_chapters/" + contentKey + `/chapter${chapter}/chapter_contents/` + key)
    .once("value")
    .then((data) => {
      let over = 0;
      const quizQuestionArr = data.val().questions;
      let quizTitleNode = document.createElement("div");
      quizTitleNode.className = "col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 txtMain";
      quizTitleNode.id = "quizTitle" + key;
      quizTitleNode.innerHTML = quizTitle;
      questionsContainer.appendChild(quizTitleNode);
      for (let i = 0; i < quizQuestionArr.length; i++) {
        let question = quizQuestionArr[i];
        if (question) {
          over++;
          currentMain.classList.add("d-none");
          let newQuizNode = document.createElement("div");
          newQuizNode.className = "row w-100 mx-0 py-4 px-4 mb-4 paper";
          newQuizNode.innerHTML = `
              <div class="row w-100 mx-0">
                <div class="itemNumber">${i}.</div>
                <div class="col pr-0 txtQuestion">
                  ${question.question}
                </div>
                <div class="col-12 mt-4 txtQuestion">Answer:</div>
                <input type="text" class="col-12 col-lg-5 col-md-6 ml-md-4 mt-1 form-control"></input>
              </div>
            </div>`;
          questionsContainer.appendChild(newQuizNode);
          answersArr.push(question.answer);
        }
      }

      let submitButton = document.createElement("div");
      submitButton.className = "col-12 px-0 mt-4 d-flex justify-content-end";
      submitButton.innerHTML = `<button class="btn btn-danger px-4 btnStart" id="btnSubmitQuiz">Submit Quiz</button>`;
      questionsContainer.appendChild(submitButton);

      btnSubmitQuiz.onclick = () => {
        // btnSubmitQuiz.setAttribute("disabled", "");
        btnSubmitQuiz.innerHTML = `<div class="d-flex justify-content-center">
                        <div class="spinner-border spinner-border-sm" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                      </div>`;

        let userAnswersArr = [];
        let score = 0;
        for (let i = 1; i < questionsContainer.children.length - 1; i++) {
          const questionElement = questionsContainer.children[i];
          const userAnswer = questionElement.firstElementChild.lastElementChild.value;
          userAnswersArr.push(userAnswer);
          const correctAns = answersArr[i - 1];
          if (userAnswer.toString().toLowerCase() == correctAns.toString().toLowerCase()) {
            score++;
            questionElement.firstElementChild.lastElementChild.style =
              "border: 0.75px solid #008F28;";
            disabler(questionElement.firstElementChild.lastElementChild);
          } else {
            questionElement.firstElementChild.lastElementChild.style =
              "border: 1.5px solid #FF0000;";
            disabler(questionElement.firstElementChild.lastElementChild);
            const correctAnsElement = document.createElement("input");
            correctAnsElement.setAttribute("type", "text");
            correctAnsElement.className = "col-12 col-lg-5 col-md-6 ml-md-4 mt-1 form-control";
            questionElement.firstElementChild.appendChild(correctAnsElement);
            correctAnsElement.style = "border: 0.75px solid #008F28;";
            questionElement.firstElementChild.lastElementChild.value = correctAns;
            disabler(questionElement.firstElementChild.lastElementChild);
          }
        }
        let resultNode = document.createElement("div");
        resultNode.className = "row w-100 mx-0 py-4 px-4 mb-4 paper";
        resultNode.innerHTML = `
          <div class="col-12 px-0 txtResult">Results</div>
          <div class="col-12 px-0 score">${score}/${over}</div>
          <div class="col-12 px-0">answered correctly</div>`;
        questionsContainer.insertBefore(resultNode, questionsContainer.children[1]);
        totalScore += score;
        // firebase
        //   .database()
        //   .ref("course_chapters/" + contentKey + `/chapter${chapter}`)
        //   .once("value")
        //   .then((snapshot) => {
        //     console.log(snapshot);
        //     console.log(snapshot.val());
        //   });
        firebase
          .database()
          .ref("student_user_course/" + currentUser.uid + "/" + courseId)
          .once("value")
          .then((snapshot) => {
            let done_count = snapshot.val().quiz_done_count;
            let quiz_done = snapshot.val().quiz_done;
            if (quiz_done) {
              quiz_done[key] = {
                itemId: key,
                score: score,
                over: over,
                submit_datetime: firebase.database.ServerValue.TIMESTAMP,
                answers: userAnswersArr,
              };
            } else {
              quiz_done = {};
              quiz_done[key] = {
                itemId: key,
                score: score,
                over: over,
                submit_datetime: firebase.database.ServerValue.TIMESTAMP,
                answers: userAnswersArr,
              };
            }
            let progress_percent = ((done_count + 1) / totalQuizCount) * 100;
            let progress_text = progress_percent >= 100 ? "Completed" : "Resume";

            firebase
              .database()
              .ref("course_chapters/" + contentKey + `/chapter${chapter}/chapter_contents/` + key)
              .update({
                submit_count: firebase.database.ServerValue.increment(1),
              });

            if (progress_percent >= 100) {
              firebase
                .database()
                .ref("course_students/" + courseId + "/" + currentUser.uid)
                .update({
                  grade: Number(((totalScore / totalOver) * 100).toFixed(1)),
                });
            }

            firebase
              .database()
              .ref("student_user_course/" + currentUser.uid + "/" + courseId)
              .update(
                {
                  progress_percent: progress_percent,
                  current_chapter: currentChap,
                  chapter_name: chapNames[currentChap],
                  quiz_done: quiz_done,
                  progress_text: progress_text,
                  quiz_done_count: firebase.database.ServerValue.increment(1),
                  last_opened: firebase.database.ServerValue.TIMESTAMP,
                  grade: Number(((totalScore / totalOver) * 100).toFixed(1)),
                },
                (error) => {
                  if (error) {
                    alert(error);
                    console.log(error);
                  } else {
                    if (progress_percent >= 100) {
                      $("#reviewModal").modal("show");
                    }
                    firebase
                      .database()
                      .ref("course_students/" + courseId + "/" + currentUser.uid)
                      .once("value")
                      .then((snapshot) => {
                        let courseStudentQuiz = snapshot.val().quiz_done;
                        if (courseStudentQuiz) {
                          courseStudentQuiz[key] = {
                            itemId: key,
                            score: score,
                            over: over,
                            submit_datetime: firebase.database.ServerValue.TIMESTAMP,
                            answers: userAnswersArr,
                          };
                        } else {
                          courseStudentQuiz = {};
                          courseStudentQuiz[key] = {
                            itemId: key,
                            score: score,
                            over: over,
                            submit_datetime: firebase.database.ServerValue.TIMESTAMP,
                            answers: userAnswersArr,
                          };
                        }

                        firebase
                          .database()
                          .ref("course_students/" + courseId + "/" + currentUser.uid)
                          .update(
                            {
                              quiz_done: courseStudentQuiz,
                            },
                            (error) => {
                              if (error) {
                                console.log(error);
                              } else {
                                for (el of btnSideItems) {
                                  el.removeAttribute("disabled");
                                }
                                btnSubmitQuiz.remove();
                                window.scrollTo(0, 0);
                                currentMain = questionsContainer;
                                element.innerHTML = '<i class="far fa-check-circle"></i> Quiz Done';
                              }
                            }
                          );
                      });
                  }
                }
              );
          });
      };
    });
}

function disabler(element) {
  element.setAttribute("disabled", "");
}

function showModal() {
  courseDone = true;
  $("#certModal").modal("show");
  modalCourseTitle.innerHTML = courseTitle;

  firebase
    .storage()
    .ref()
    .child("Certificate.pdf")
    .getDownloadURL()
    .then((url) => {
      firebase
        .database()
        .ref("users/" + profId)
        .once("value")
        .then((snapshot) => {
          modifyPdf(url, snapshot.val().fullname);
        });
    });
}

function goToOverview() {
  window.location.assign(`/course-overview?id=${courseId}`);
}

for (i of stars) {
  i.onmouseover = (e) => {
    let end = false;
    for (j of stars) {
      if (!end) {
        j.classList.remove("far");
        j.classList.add("fas");
      } else {
        j.classList.remove("fas");
        j.classList.add("far");
      }
      if (e.target == j) end = true;
    }
  };
  i.onmouseout = () => {
    if (!starRating) {
      for (j of stars) {
        j.classList.remove("fas");
        j.classList.add("far");
      }
    }
  };
}

function starCount(element) {
  starRating = parseInt(element.getAttribute("count"));
}

function submitReview(element) {
  firebase
    .database()
    .ref("reviews/" + courseId + "/" + currentUser.uid)
    .update(
      {
        user: currentUser.uid,
        created_datetime: firebase.database.ServerValue.TIMESTAMP,
        review_number: starRating,
        review_text: reviewInput.value,
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          firebase
            .database()
            .ref("courses/" + courseId)
            .update({
              review_count: firebase.database.ServerValue.increment(1),
            });

          element.setAttribute("disabled", "");
          $("#reviewModal").modal("hide");
          showModal();
        }
      }
    );
}

var PDFDocument = PDFLib.PDFDocument;
var rgb = PDFLib.rgb;
var StandardFonts = PDFLib.StandardFonts;

async function modifyPdf(url, profName) {
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaThinFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  const studName = currentUser.displayName;

  const courseTitleCap = courseTitle
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

  const currDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const drawDate =
    monthNames[currDate.getMonth()] + " " + currDate.getDate() + ", " + currDate.getFullYear();

  var test1 = document.getElementById("Test");
  var test2 = document.getElementById("Test2");
  var test3 = document.getElementById("Test3");
  var test4 = document.getElementById("Test4");
  test1.innerHTML = studName;
  test2.innerHTML = courseTitle.slice(0, 40);
  test3.innerHTML = profName;
  test4.innerHTML = drawDate;

  var width1 = test1.clientWidth + 1;
  var width2 = test2.clientWidth + 1;
  var width3 = test3.clientWidth + 1;
  var width4 = test4.clientWidth + 1;

  firstPage.drawText(studName, {
    x: width / 2 - width1 / 2,
    y: height / 2,
    size: 25,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(courseTitleCap, {
    x: width / 2 - width2 / 2,
    y: height / 3,
    size: 25,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(profName, {
    x: width / 2 - width3 / 2,
    y: 70,
    size: 15,
    font: helveticaThinFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(drawDate, {
    x: width / 2 - width4 / 2,
    y: 140,
    size: 15,
    font: helveticaThinFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  btnDlCert.onclick = () => {
    download(pdfBytes, `${courseTitle}-Certificate.pdf`, "application/pdf");
  };
}
