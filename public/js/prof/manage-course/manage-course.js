const sideTabs = document.getElementsByClassName("sideTab");
const txtCourseTitle = document.getElementById("txtCourseTitle");
const quizContainer = document.getElementById("quizContainer");
const gradeContainer = document.getElementById("gradeContainer");
const studentContainer = document.getElementById("studentContainer");
const txtStudCount = document.getElementById("txtStudCount");
const txtStudCountNP = document.getElementById("txtStudCountNP");
const txtStudCount2 = document.getElementById("txtStudCount2");
const newQuizTable = document.getElementById("newQuizTable");
const newQuizTableClose = document.getElementById("newQuizTableClose");
const newQuizTableSpinner = document.getElementById("newQuizTableSpinner");
const tableBody = document.getElementById("tableBody");
const gradeTableBody = document.getElementById("gradeTableBody");
const studentTableBody = document.getElementById("studentTableBody");
let activeTab = sideTabs[0];
let quizArr = [];
let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

function changeTab(element) {
  if (activeTab == element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");
  if (element.textContent.trim() === "Quizzes") {
    removeDNone(quizContainer);
    addDNone(gradeContainer);
    addDNone(studentContainer);
  } else if (element.textContent.trim() === "Grades") {
    newQuizTableClose.classList.add("d-none");
    newQuizTable.classList.add("d-none");
    newQuizTableSpinner.classList.add("d-none");
    quizTable.classList.remove("d-none");
    document.getElementById("newQuizTableBody").innerHTML = "";
    removeDNone(gradeContainer);
    addDNone(quizContainer);
    addDNone(studentContainer);
  } else if (element.textContent.trim() === "Students") {
    removeDNone(studentContainer);
    addDNone(quizContainer);
    addDNone(gradeContainer);
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    firebase
      .database()
      .ref("courses/" + courseId)
      .once("value")
      .then((snapshot) => {
        document.getElementById("spinnerContainer1").remove();

        const courseData = snapshot.val();
        if (courseData.prof_id === user.uid) {
          txtCourseTitle.innerHTML = courseData.course_title;
          firebase
            .database()
            .ref("course_chapters/" + courseData.contents)
            .once("value")
            .then((chapters) => {
              const chaptersData = chapters.val();
              for (i in chaptersData) {
                const chapterData = chaptersData[i];
                for (j in chapterData.chapter_contents) {
                  const contentData = chapterData.chapter_contents[j];
                  if (!contentData.video) {
                    quizArr.push(contentData);
                    const rowNode = document.createElement("tr");
                    rowNode.id = contentData.itemId;
                    rowNode.setAttribute("over", contentData.questions.length - 1);
                    rowNode.setAttribute("onclick", "getScores(this)");
                    let status = "";
                    status = contentData.submit_count + "/" + courseData.student_count;

                    rowNode.innerHTML = `
                    <td class="tableBold">${contentData.title}</td>
                    <td class="tableThin">${status}</td>`;
                    tableBody.appendChild(rowNode);
                  }
                }
              }
            });

          firebase
            .database()
            .ref("course_students/" + courseId)
            .once("value")
            .then((snapshot) => {
              document.getElementById("spinnerContainer2").remove();
              document.getElementById("spinnerContainer3").remove();
              if (snapshot.val()) {
                txtStudCountNP.innerHTML = Object.keys(snapshot.val()).length;
                txtStudCount.innerHTML = Object.keys(snapshot.val()).length;
                txtStudCount2.innerHTML = Object.keys(snapshot.val()).length;

                const data = snapshot.val();
                for (id in data) {
                  const studentData = data[id];
                  const status = studentData.grade ? "Completed" : "In-progress";
                  const grade = studentData.grade || "-";
                  const statusClass = studentData.grade ? "gradeComplete" : "gradeInProgress";

                  firebase
                    .database()
                    .ref("users/" + studentData.user)
                    .once("value")
                    .then((studUser) => {
                      const userData = studUser.val();
                      const newRowNode = document.createElement("tr");
                      newRowNode.setAttribute("key", studentData.user);
                      newRowNode.setAttribute("onclick", "showGrade(this)");
                      const newPage = document.createElement("div");
                      newPage.id = studentData.user;
                      newPage.className = "paperCourse d-none p-2 p-sm-3";
                      newPage.innerHTML = `
                          <div class="row mx-0">
                            <div class="btn col-12 mb-2 close" onclick="hideGrade(this)">
                              <span>&times;</span>
                            </div>
                            <div class="col-12 py-3 mb-3 d-flex align-items-center studentContainer">
                              <div class="studentAvatar mr-2 mr-sm-3" style='background: url(${userData.photoUrl}) no-repeat center; background-size: cover;'></div>
                              <div class="">${userData.fullname} <i class="${statusClass}">(${status})</i></div>
                            </div>
                            <div class="col-12 px-0 txtCourseGrade">Course Grade</div>
                            <div class="col-12 px-0 numGrade">${grade}</div>
                          </div>

                          <table class="table mt-4">
                            <thead>
                              <tr>
                                <th scope="col" class="col-6 gradeTableTxt">ITEM</th>
                                <th scope="col" class="col-4 gradeTableTxt">STATUS</th>
                                <th scope="col" class="col gradeTableTxt">GRADE</th>
                              </tr>
                            </thead>
                            <tbody id="studGradeTableBody"></tbody>
                          </table>
                          <div class="col-12 py-3 mb-4 tableBold text-center paperCourse">
                            Course Grade: <span style="color: rgb(40, 176, 46)" id="courseGrade">${grade}</span>
                          </div>`;

                      newRowNode.innerHTML = `
                          <td class="d-flex align-items-center">
                            <div class="studentAvatar mr-2 mr-sm-3" style='background: url(${userData.photoUrl}) no-repeat center; background-size: cover;'></div> 
                            <div class="gradeTableTxt">${userData.fullname}</div>
                          </td>
                          <td class="gradeTableTxt ${statusClass}">${status}</td>
                          <td class="gradeTableTxt">${grade}</td>`;
                      gradeTableBody.appendChild(newRowNode);
                      gradeContainer.appendChild(newPage);
                      if (!userData.photoUrl) {
                        newRowNode.querySelector(".studentAvatar").removeAttribute("style");
                      }
                      if (!userData.photoUrl) {
                        newPage.querySelector(".studentAvatar").removeAttribute("style");
                      }
                      let newPageNode;
                      for (i of quizArr) {
                        if (studentData.quiz_done) {
                          if (i.itemId in studentData.quiz_done) {
                            newPageNode = newGradeNode(i, studentData.quiz_done[i.itemId]);
                          } else {
                            newPageNode = noGradeNode(i);
                          }
                        } else {
                          newPageNode = noGradeNode(i);
                        }

                        newPage.querySelector("#studGradeTableBody").appendChild(newPageNode);
                      }

                      const newRowNode2 = document.createElement("tr");
                      newRowNode2.innerHTML = `
                          <td class="d-flex align-items-center">
                          <div class="studentAvatar mr-2 mr-sm-3" style='background: url(${userData.photoUrl}) no-repeat center; background-size: cover;'></div> 
                            <div class="">${userData.fullname} <i class="${statusClass}">(${status})</i></div>
                          </td>`;
                      studentTableBody.appendChild(newRowNode2);
                      if (!userData.photoUrl) {
                        newRowNode2.querySelector(".studentAvatar").removeAttribute("style");
                      }
                    });
                }
              } else {
                txtStudCount.innerHTML = 0;
              }
            });
        } else {
          alert("Invalid user");
          window.history.back();
        }
      });
  }
});

function removeDNone(element) {
  element.classList.remove("d-none");
  element.classList.add("d-block");
}

function addDNone(element) {
  element.classList.remove("d-block");
  element.classList.add("d-none");
}

function showGrade(element) {
  document.getElementById(element.getAttribute("key")).classList.remove("d-none");
  document.getElementById("gradeTable").classList.add("d-none");
}

function hideGrade(element) {
  element.parentNode.parentNode.classList.add("d-none");
  document.getElementById("gradeTable").classList.remove("d-none");
}

function newGradeNode(data, userQuiz) {
  const newNode = document.createElement("tr");
  let score = userQuiz.score + "/" + userQuiz.over;

  newNode.innerHTML = `
      <td class="tableBold">${data.title}</td>
      <td class="tableThin">Submitted</td>
      <td class="tableBold">${score}</td>`;

  return newNode;
}

function noGradeNode(data) {
  const newNode = document.createElement("tr");

  newNode.innerHTML = `
      <td class="tableBold">${data.title}</td>
      <td class="tableThin">Not Taken</td>
      <td class="tableBold">-</td>`;

  return newNode;
}

function getScores(element) {
  const id = element.id;
  let over = element.getAttribute("over");
  newQuizTableClose.classList.remove("d-none");
  newQuizTableSpinner.classList.remove("d-none");
  const quizTable = document.getElementById("quizTable");
  const quizTablePaper = document.getElementById("quizTablePaper");
  newQuizTable.classList.remove("d-none");
  quizTable.classList.add("d-none");
  firebase
    .database()
    .ref("course_students/" + courseId)
    .once("value")
    .then((snapshot) => {
      newQuizTableSpinner.classList.add("d-none");

      const dataColl = snapshot.val();
      for (i in dataColl) {
        const data = dataColl[i];
        // const dataArr = [];
        // if (data.quiz_done) {
        //   if (id in data.quiz_done) dataArr.push(data.quiz_done[id].score);
        //   else dataArr.push(-1);
        // } else dataArr.push(-1);
        let score;
        let submit_date = null;
        let scoreTxt = "--/" + over;
        if (data.quiz_done) {
          if (id in data.quiz_done) {
            score = data.quiz_done[id].score;
            scoreTxt = score + "/" + over;
            submit_date = String(new Date(data.quiz_done[id].submit_datetime)).slice(4, 21);
          } else {
            score = -1;
            submit_date = "-";
          }
        } else {
          score = -1;
          submit_date = "-";
        }

        firebase
          .database()
          .ref("users/" + data.user)
          .once("value")
          .then((studUser) => {
            const userData = studUser.val();

            const newNode = document.createElement("tr");
            newNode.id = data.user;
            newNode.setAttribute("onclick", "showSpecStud(this)");
            newNode.setAttribute("key", id);
            const status = score < 0 ? "Not Graded" : "Graded";

            newNode.innerHTML = `
                <td class="tableBold">${userData.fullname}</td>
                <td class="tableThin">${status}</td>
                <td class="tableThin">${submit_date}</td>
                <td class="tableBold">${scoreTxt}</td>`;

            document.getElementById("newQuizTableBody").appendChild(newNode);
          });
      }
    });

  newQuizTableClose.onclick = () => {
    newQuizTableClose.classList.add("d-none");
    newQuizTable.classList.add("d-none");
    newQuizTableSpinner.classList.add("d-none");
    quizTable.classList.remove("d-none");
    document.getElementById("newQuizTableBody").innerHTML = "";
  };
}
// Fri Jan 29 2021 02:05
function showSpecStud(element) {
  // console.log(element.id);
  const itemId = element.getAttribute("key");
  for (quiz of quizArr) {
    if (quiz.itemId === itemId) {
      const questions = quiz.questions;
      firebase
        .database()
        .ref("student_user_course/" + element.id + "/" + courseId)
        .once("value")
        .then((studUser) => {
          firebase
            .database()
            .ref("users/" + element.id)
            .once("value")
            .then((studUser) => {
              const userData = studUser.val();
              // console.log(userData);
              document.getElementById(
                "userAvatarS"
              ).style = `background: url(${userData.photoUrl}) no-repeat center; background-size: cover;`;
              document.getElementById("txtNameS").innerHTML = userData.fullname;
            });
          const userData = studUser.val();
          if (userData.quiz_done) {
            //exists
            if (userData.quiz_done[itemId]) {
              //if quiz was taken
              const quizDoneItem = userData.quiz_done[itemId];
              document.getElementById("txtScoreS").innerHTML =
                quizDoneItem.score + "/" + quizDoneItem.over;
              document.getElementById("txtDatetimeS").innerHTML = String(
                new Date(quizDoneItem.submit_datetime)
              ).slice(4, 21);
              const userAnswers = quizDoneItem.answers;
              for (let i = 0; i < questions.length; i++) {
                const item = questions[i];
                if (item === undefined) continue;
                const newQNode = document.createElement("div");
                newQNode.className = "row w-100 mx-0";
                newQNode.innerHTML = `
                      <div class="itemNumber"><span id="txtNumber">1</span>.</div>
                      <div class="col pr-0 txtQuestion">
                        ${item.question}
                      </div>
                      <div class="col-12 mt-4 txtQuestion">Answer:</div>
                      <input type="text" class="col-12  col-md-6 ml-md-4 mt-1 form-control" id="txtUserAnswer" disabled value=${
                        userAnswers[i - 1]
                      }></input>
                      <input type="text" class="col-12  col-md-6 ml-md-4 mt-1 form-control" style ="border: 0.75px solid #008F28;" id="txtRightAns" disabled value=${
                        item.answer
                      }></input>`;
                document.getElementById("questionsContainerS").appendChild(newQNode);
              }
              $("#specificQuizModal").modal("show");
            } else {
              modalSpecificNoGrade();
            }
          } else {
            modalSpecificNoGrade();
          }
        });
    }
  }
}
// $("#specificQuizModal").modal("show");

// style = "background: url(${userData.photoUrl}) no-repeat center; background-size: cover;";
function modalSpecificNoGrade() {
  document.getElementById("txtScoreS").innerHTML = "--/--";
  document.getElementById("txtDatetimeS").innerHTML = "-";
  const newQNode = document.createElement("div");
  newQNode.className = "row w-100 mx-0";
  newQNode.innerHTML = "Quiz not taken yet";
  document.getElementById("questionsContainerS").appendChild(newQNode);
  $("#specificQuizModal").modal("show");
}
