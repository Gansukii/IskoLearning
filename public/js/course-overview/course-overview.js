const sideTabs = document.getElementsByClassName("sideTab");
const contentContainer = document.getElementById("contentContainer");
const gradeContentContainer = document.getElementById("gradeContentContainer");
const btnGoTo = document.getElementById("goToCourse");
const txtCourseTitle = document.getElementById("txtCourseTitle");
const tableBody = document.getElementById("tableBody");
const courseGrade = document.getElementById("courseGrade");
let activeTab = sideTabs[0];
let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");
let studentRecord = {};
let totalScore = 0;
let totalPoint = 0;

function changeTab(element) {
  if (activeTab == element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");
  if (element.textContent.trim() === "Course Overview") {
    contentContainer.classList.remove("d-none");
    gradeContentContainer.classList.add("d-none");
  } else {
    gradeContentContainer.classList.remove("d-none");
    contentContainer.classList.add("d-none");
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // ################ IF ENROLLED ######################
    firebase
      .database()
      .ref("course_students/" + courseId)
      .once("value")
      .then((snapshot) => {
        btnGoTo.removeAttribute("disabled");
        if (snapshot.val()) {
          if (user.uid in snapshot.val()) {
            firebase
              .database()
              .ref("student_user_course/" + user.uid + "/" + courseId)
              .once("value")
              .then((snapshot) => {
                const data = snapshot.val();
                // btnEnroll.removeAttribute("disabled");
                // courseProgressContainer.classList.remove("d-none");
                // courseProgressContainer.classList.add("d-flex");
                if (data.progress_percent < 100) {
                  firebase
                    .database()
                    .ref("student_user_course/" + user.uid + "/" + courseId)
                    .update({
                      progress_text: "Resume",
                    });
                  btnGoTo.innerHTML = "Resume";
                }
                btnGoTo.innerHTML = data.progress_text;

                document.getElementById("txtProgressPercent").innerHTML = data.progress_percent;
                document.getElementById("txtCurrentChapter").innerHTML = data.current_chapter;
                document.getElementById("txtChapterName").innerHTML = data.chapter_name;
                document.getElementById(
                  "courseProgressBar"
                ).style = `width: ${data.progress_percent}%;`;

                if (data.quiz_done) {
                  studentRecord = data.quiz_done;
                }

                showData();
                btnGoTo.onclick = () => {
                  startCourse(user);
                };
              });
          } else {
            alert("Please enroll first to record your data");
            window.history.back();
          }
        } else {
          alert("No course data found");
        }
      });
  }
});

function showData() {
  firebase
    .database()
    .ref("courses/" + courseId)
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val();
      txtCourseTitle.classList.remove("loading");
      txtCourseTitle.innerHTML = data.course_title;
      firebase
        .database()
        .ref("course_chapters/" + data.contents)
        .once("value")
        .then((cSnapshot) => {
          let chapterSnapshot = Object.values(cSnapshot.val());
          // console.log(chapterSnapshot);
          chapterSnapshot.forEach((data) => {
            const newNode = document.createElement("div");
            newNode.innerHTML = `<div
                class="accordion md-accordion"
                id="accordionEx"
                role="tablist"
                aria-multiselectable="true"
              >
                <div class="card">
                  <button
                    class="btn p-0"
                    data-toggle="collapse"
                    data-parent="#accordionEx"
                    href="#collapse${data.chapter_number}"
                    aria-expanded="false"
                    aria-controls="collapse${data.chapter_number}"
                  >
                    <div class="card-header" role="tab" id="heading${data.chapter_number}">
                      <div class="w-100 mb-0 d-flex justify-content-between align-items-center">
                        <div class="row text-left">
                          <div class="col-12 accordionHeaderText lh-1">${data.chapter_title}</div>
                          <div class="col-12 text-muted small" id="itemsCount${data.chapter_number}">2 videos, 1 quiz</div>
                        </div>
                        <i class="fas fa-angle-down rotate-icon"></i>
                      </div>
                    </div>
                  </button>
                  <div
                    id="collapse${data.chapter_number}"
                    class="collapse"
                    role="tabpanel"
                    aria-labelledby="heading${data.chapter_number}"
                    data-parent="#accordionEx"
                  >
                    <div class="card-body p-0">
                      <div class="row mx-0" id="accordionInnerContainer${data.chapter_number}">
                        
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
            accordionContainer.appendChild(newNode);
            let videoCount = 0;
            let quizCount = 0;
            const chapterContents = Object.values(data.chapter_contents);
            for (let i = 0; i < chapterContents.length; i++) {
              let icon;
              let itemDes;
              if (chapterContents[i].video) {
                videoCount++;
                icon = "fa-play-circle";
                itemDes = "Video";
              } else {
                quizCount++;
                totalScore += chapterContents[i].questions.length - 1;
                icon = "fa-file-alt";
                itemDes =
                  (chapterContents[i].questions.length - 1).toString() +
                  (chapterContents[i].questions.length - 1 < 2 ? " question" : " questions");
                const rowNode = document.createElement("tr");
                let status = "";
                let score = "-";
                if (chapterContents[i].itemId in studentRecord) {
                  status = "Submitted";
                  const key = chapterContents[i].itemId;
                  score = studentRecord[key].score + "/" + studentRecord[key].over;
                  totalPoint += parseInt(studentRecord[key].score);
                } else {
                  status = "Not Taken";
                }

                rowNode.innerHTML = `
                    <td class="tableBold">${chapterContents[i].title}</td>
                    <td class="tableThin">${status}</td>
                    <td class="tableBold">${score}</td>`;

                tableBody.appendChild(rowNode);

                courseGrade.innerHTML = Number(((totalPoint / totalScore) * 100).toFixed(1));
              }
              const itemNode = document.createElement("div");
              itemNode.className = "col-12 py-2";
              itemNode.innerHTML = `<button class="btn w-100">
                                    <div class="row d-flex align-items-center">
                                      <div>
                                        <i class="far ${icon}"></i>
                                      </div>
                                      <div class="px-2 d-flex flex-column">
                                        <div class="accordionSubItemText lh-1 text-left">${chapterContents[i].title}</div>
                                        <div class="text-muted small text-left">${itemDes}</div>
                                      </div>
                                    </div>
                                  </button>
                                </div>`;
              document
                .getElementById(`accordionInnerContainer${data.chapter_number}`)
                .appendChild(itemNode);
            }
            const itemsCount = document.getElementById(`itemsCount${data.chapter_number}`);
            let vidString, quizString;
            vidString = videoCount.toString() + (videoCount > 1 ? " videos" : " video");
            quizString = quizCount.toString() + (quizCount > 1 ? " quizzes" : " quiz");
            itemsCount.innerHTML = vidString + " &#x25CF; " + quizString;
          });
        });

      //   console.log(studentRecord);
    });
}

function startCourse() {
  window.location.assign(`/course-content?id=${courseId}`);
}
