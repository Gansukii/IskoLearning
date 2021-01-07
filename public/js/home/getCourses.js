let allUserCourses = [];
let inProgressUserCourses = [];
let completedUserCourses = [];
let latestCourses = [];
const arrowLeftCat = document.getElementById("arrowLeftCat");
const arrowRightCat = document.getElementById("arrowRightCat");
const myCoursesContainer = document.getElementById("myCourses");
const btnBadges = document.getElementsByClassName("badgeDev");
let activeBadge = btnBadges[0];
let currentUser;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    currentUser = user;
    const latest = document.getElementById("latest");
    const arrowRight = document.getElementById("arrowRight");
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
              .ref("/courses")
              .orderByChild("created_datetime")
              .limitToLast(10)
              .once("value")
              .then((snapshot) => {
                let questionsArr = Object.values(snapshot.val()).reverse();
                // console.log(questionsArr);
                questionsArr.forEach((data) => {
                  let timeAgo = getTimeAgo(
                    Math.abs(currDate - new Date(data.created_datetime)) / 1000
                  );
                  const newNode = document.createElement("div");
                  newNode.className = "col-6 col-lg-3 px-1 mt-2";
                  newNode.id = data.course_id;
                  newNode.setAttribute("key", `${data.course_id}`);
                  newNode.setAttribute("onclick", `goToCourse(this)`);
                  newNode.innerHTML = `<div class="card rounded">
                  <div class="thumb" style="background: url(${data.course_thumbnail}) no-repeat center;"></div>
                  <div class="card-body py-2 px-3">
                    <p class="courseDate mb-1">Added ${timeAgo}</p>
                    <p class="courseTitle">${data.course_title}</p>
                    <p class="courseProf mb-1">prof. ${data.prof_name}</p>
                  </div>
                </div>`;
                  latest.insertBefore(newNode, arrowRight);
                  if (data.course_thumbnail === undefined) {
                    newNode.firstElementChild.firstElementChild.removeAttribute("style");
                  }
                  latestCourses.push(newNode);
                  latestArrow(latestCourses);
                });
              });
          });
      });

    firebase
      .database()
      .ref("student_user_course/" + user.uid)
      .on("child_added", (snapshot) => {
        let courseKey = snapshot.key;
        let courseNode = document.createElement("div");
        if (snapshot.val()) {
          firebase
            .database()
            .ref("courses/" + courseKey)
            .once("value")
            .then((courseMain) => {
              const courseMainData = courseMain.val();
              // console.log(courseMainData);

              courseNode.className = "col-6 col-lg-4 px-2 mt-2";
              courseNode.setAttribute("key", courseMainData.course_id);
              courseNode.setAttribute("onclick", `goToCourse(this)`);

              courseNode.innerHTML = `
                  <div class="card rounded courseCard">
                    <div class="courseThumb" style="background: url(${courseMainData.course_thumbnail}) no-repeat center;"></div>
                    <div class="card-body py-2 px-3">
                      <p class="courseTitle mb-0">${courseMainData.course_title}</p>
                      <p class="courseProf mb-2">${courseMainData.prof_name}</p>
                      <p class="courseDes">
                        ${courseMainData.course_brief}
                      </p>
                    </div>
                  </div>`;

              myCoursesContainer.insertBefore(courseNode, arrowRightCat);
              if (courseMainData.course_thumbnail === undefined) {
                courseNode.firstElementChild.firstElementChild.removeAttribute("style");
              }
              // myCoursesContainer.appendChild(courseNode);
              allUserCourses.push(courseNode);

              myCoursesArrow(allUserCourses);
            });

          // console.log(allUserCourses);
        } else {
          for (let i = 0; i < btnBadges.length; i++) {
            btnBadges[i].setAttribute("disabled", "");
          }
        }
      });
  }
});

{
  /* <div class="col-6 col-lg-3 px-1 mt-2">
                <div class="card rounded">
                  <div class="thumb"></div>
                  <div class="card-body py-2 px-3">
                    <p class="courseDate mb-1">Added 6 days ago</p>
                    <p class="courseTitle">System Integration &amp; Architecture</p>
                    <p class="courseProf mb-1">prof. ramos</p>
                  </div>
                </div>
              </div> */
}

function goToCourse(element) {
  courseId = element.getAttribute("key");
  window.location.assign(`/course?id=${courseId}`);
}

function changePage(element) {
  if (activeBadge === element) {
    return;
  }
  activeBadge.classList.remove("activeBadge");
  activeBadge = element;
  activeBadge.classList.add("activeBadge");

  if (element.id === "all") {
    elArrDnone(inProgressUserCourses);
    elArrDnone(completedUserCourses);
    elArrDisplay(allUserCourses);
    myCoursesArrow(allUserCourses);
  }

  if (element.id === "inProgress") {
    elArrDnone(allUserCourses);
    elArrDnone(completedUserCourses);
    if (inProgressUserCourses.length > 0) elArrDisplay(inProgressUserCourses);
    else getInprogress();
  }

  if (element.id === "completed") {
    elArrDnone(allUserCourses);
    elArrDnone(inProgressUserCourses);
    if (completedUserCourses.length > 0) elArrDisplay(completedUserCourses);
    else getCompleted();
  }
}

function getInprogress() {
  firebase
    .database()
    .ref("student_user_course/" + currentUser.uid)
    .on("child_added", (snapshot) => {
      let data = snapshot.val();
      let courseNode = document.createElement("div");

      if (data.progress_percent < 100) {
        firebase
          .database()
          .ref("courses/" + data.courseId)
          .once("value")
          .then((courseMain) => {
            const courseMainData = courseMain.val();

            courseNode.className = "col-6 col-lg-4 px-2 mt-2";
            courseNode.setAttribute("key", courseMainData.course_id);
            courseNode.setAttribute("onclick", `goToCourse(this)`);

            courseNode.innerHTML = `
                  <div class="card rounded courseCard">
                    <div class="courseThumb" style="background: url(${courseMainData.course_thumbnail}) no-repeat center;"></div>
                    <div class="card-body py-2 px-3">
                      <p class="courseTitle mb-0">${courseMainData.course_title}</p>
                      <p class="courseProf mb-2">${courseMainData.prof_name}</p>
                      <p class="courseDes">
                        ${courseMainData.course_brief}
                      </p>
                    </div>
                  </div>`;

            myCoursesContainer.insertBefore(courseNode, arrowRightCat);
            if (courseMainData.course_thumbnail === undefined) {
              courseNode.firstElementChild.firstElementChild.removeAttribute("style");
            }
            // myCoursesContainer.appendChild(courseNode);
            inProgressUserCourses.push(courseNode);

            myCoursesArrow(inProgressUserCourses);
          });
      }
    });
}

function getCompleted() {
  firebase
    .database()
    .ref("student_user_course/" + currentUser.uid)
    .on("child_added", (snapshot) => {
      let data = snapshot.val();
      let courseNode = document.createElement("div");

      if (data.progress_percent == 100) {
        firebase
          .database()
          .ref("courses/" + data.courseId)
          .once("value")
          .then((courseMain) => {
            const courseMainData = courseMain.val();

            courseNode.className = "col-6 col-lg-4 px-2 mt-2";
            courseNode.setAttribute("key", courseMainData.course_id);
            courseNode.setAttribute("onclick", `goToCourse(this)`);

            courseNode.innerHTML = `
                  <div class="card rounded courseCard">
                    <div class="courseThumb" style="background: url(${courseMainData.course_thumbnail}) no-repeat center;"></div>
                    <div class="card-body py-2 px-3">
                      <p class="courseTitle mb-0">${courseMainData.course_title}</p>
                      <p class="courseProf mb-2">${courseMainData.prof_name}</p>
                      <p class="courseDes">
                        ${courseMainData.course_brief}
                      </p>
                    </div>
                  </div>`;

            myCoursesContainer.insertBefore(courseNode, arrowRightCat);
            if (courseMainData.course_thumbnail === undefined) {
              courseNode.firstElementChild.firstElementChild.removeAttribute("style");
            }
            // myCoursesContainer.appendChild(courseNode);
            completedUserCourses.push(courseNode);

            myCoursesArrow(completedUserCourses);
          });
      }
    });
}

function elArrDnone(elementArr) {
  for (element of elementArr) {
    element.classList.add("d-none");
  }
  arrowRightCat.classList.remove("d-flex");
  arrowLeftCat.classList.remove("d-flex");
}

function elArrDisplay(elementArr) {
  for (element of elementArr) {
    element.classList.remove("d-none");
  }
  // arrowRightCat.classList.remove("d-flex");
  // arrowLeftCat.classList.remove("d-flex");
}
