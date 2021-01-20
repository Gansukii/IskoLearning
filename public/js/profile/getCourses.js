const coursesContainer = document.getElementById("coursesContainer");
const tabs = document.getElementsByClassName("tabs");
let activeTab = tabs[0];
// let allCoursesArr = [];
let inProgressArr = [];
let completedArr = [];

let currDate;
let dateRetriever = firebase.database().ref("/date");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
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
              .ref("student_user_course/" + user.uid)
              .on("child_added", (snapshot) => {
                let progress = snapshot.val();
                let timeAgo = getTimeAgo(
                  Math.abs(currDate - new Date(progress.last_opened)) / 1000
                );
                let remaining = "--";
                if (progress.quiz_done) {
                  if (progress.progress_percent >= 100) {
                    remaining = "COMPLETED";
                  } else {
                    let remaining =
                      Object.keys(progress.quiz_done).length +
                      "/" +
                      progress.quiz_done_count +
                      " to complete";
                  }
                }
                let progressBarColor = "";
                let btnComplete = "";
                let btnText = "Resume";
                if (progress.progress_percent >= 100) {
                  progressBarColor = "progressComplete";
                  btnText = "Download Certificate";
                  btnComplete = "btnActionComplete";
                }
                firebase
                  .database()
                  .ref("courses/" + progress.courseId)
                  .once("value")
                  .then((course) => {
                    for (tab of tabs) {
                      tab.removeAttribute("disabled");
                    }
                    const courseData = course.val();
                    const newCourseNode = document.createElement("div");
                    newCourseNode.className = "row pl-lg-4 w-100 m-0 mt-4 mt-sm-0 mb-4 mb-sm-5";
                    newCourseNode.innerHTML = ` 
            <div class="col-4 col-md-2 px-0">
                <div class="d-flex px-0">
                    <div class="thumb w-100 m-0" style='background: url(${courseData.course_thumbnail}) no-repeat center; background-size: cover;'></div>
                </div>
            </div>
            <div class="col-7 col-md-10 px-0 d-flex flex-column flex-md-row">
                <div class="col-12 col-md-4 m-1 m-sm-0 d-flex px-0">
                <div class="col pl-2 pr-0 d-flex align-items-sm-center">
                    <div class="row">
                    <div class="col-12 pr-0">
                        <div class="courseTitle">${courseData.course_title}</div>
                        <div class="courseSubHead">${courseData.prof_name}</div>
                        <div class="courseSubHead">Opened ${timeAgo}</div>
                    </div>
                    </div>
                </div>
                </div>
                <div class="col-12 col-md-4 m-1 m-sm-0 pl-0 pr-4 d-flex align-items-center">
                <div class="pl-2 w-100">
                    <div class="row m-0">
                    <div class="currentStatus">Chapter ${progress.current_chapter}: ${progress.chapter_name}</div>
                    </div>
                    <div class="progress my-1">
                    <div
                        class="progress-bar progress-bar-striped bg-warning ${progressBarColor}"
                        role="progressbar"
                        style="width: ${progress.progress_percent}%"
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                    </div>
                    <div class="row m-0">
                    <div class="txtProgress">${remaining}</div>
                    </div>
                </div>
                </div>
                <div class="col-12 col-md-4 m-1 m-sm-0 pl-0 pl-sm-2 d-flex align-items-center">
                <div class="row w-100 m-0 pl-2 pl-sm-0">
                    <div class="col-6 p-0">
                    <button class="btn px-4 btnAction ${btnComplete}" onclick="goTo(this)" key="${progress.courseId}">${btnText}</button>
                    </div>
                    <div class="col-6 p-0 d-none d-md-flex align-items-center justify-content-end">
                    <i
                        class="btn p-0 dropdown fas fa-ellipsis-h"
                        id="courseMenuAction"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    ></i>
                    <div class="dropdown-menu" aria-labelledby="courseMenuAction">
                        <a class="dropdown-item" href="#">
                        Action Here
                        </a>
                        <a class="dropdown-item" href="#">
                        Remove
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="col-1 dropleft m-0 p-0 d-flex d-md-none align-items-center">
                <i
                class="btn p-0 dropdown fas fa-ellipsis-h"
                id="courseMenuAction"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                ></i>
                <div class="dropdown-menu m-0" aria-labelledby="courseMenuAction">
                <a class="dropdown-item" href="#">
                    Action Here
                </a>
                <a class="dropdown-item" href="#">
                    Remove
                </a>
                </div>
            </div>`;
                    coursesContainer.prepend(newCourseNode);
                    // allCoursesArr.push(newCourseNode);
                    if (progress.progress_percent >= 100) {
                      completedArr.push(newCourseNode);
                    } else {
                      inProgressArr.push(newCourseNode);
                    }

                    if (courseData.course_thumbnail === undefined) {
                      newCourseNode.firstElementChild.firstElementChild.firstElementChild.removeAttribute(
                        "style"
                      );
                    }
                  });
              });
          });
      });
  }
});

function goTo(element) {
  if (element.textContent === "Resume") {
    const key = element.getAttribute("key");
    window.location.assign(`/course-content?id=${key}`);
  }
}

function changePage(element) {
  if (activeTab === element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");

  if (element.id === "all") {
    elArrDisplay(inProgressArr);
    elArrDisplay(completedArr);
  }
  if (element.id === "inProgress") {
    elArrDisplay(inProgressArr);
    elArrHide(completedArr);
  }
  if (element.id === "completed") {
    elArrDisplay(completedArr);
    elArrHide(inProgressArr);
  }
}

function elArrDisplay(elementArr) {
  for (element of elementArr) {
    element.classList.remove("d-none");
  }
}

function elArrHide(elementArr) {
  for (element of elementArr) {
    element.classList.add("d-none");
  }
}
