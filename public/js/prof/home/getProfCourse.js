const coursesContainer = document.getElementById("coursesContainer");
const courseSpinner = document.getElementById("courseSpinner");
const txtNoCourse = document.getElementById("txtNoCourse");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    firebase
      .database()
      .ref("user_course/" + user.uid)
      .once("value")
      .then((snapshot) => {
        courseSpinner.classList.add("d-none");
        courseSpinner.classList.remove("d-flex");
        if (snapshot.val()) {
          snapshot.forEach((course) => {
            const courseData = course.val();
            const newNode = document.createElement("div");
            newNode.className = "col-12 p-0 paperCourse mb-3 mb-md-4 p-2 p-sm-3";
            newNode.id = courseData.course_id;
            newNode.setAttribute("onclick", "goToCourse(this)");
            newNode.innerHTML = `
           <div class="row w-100 m-0">
              <div class="col-4 col-sm-3 p-0">
                <div class="d-flex w-100 p-0 thumb" style="background: url(${courseData.course_thumbnail}) no-repeat center;"></div>
              </div>
              <div class="col ml-2 ml-lg-0 p-0 d-flex align-items-center">
                <div class="row w-100 m-0">
                  <div class="col-12 p-0 courseTitle">${courseData.course_title}</div>
                  <div class="badgeDev px-2">Published</div>
                </div>
              </div>
            </div>`;
            coursesContainer.appendChild(newNode);
            if (courseData.course_thumbnail === undefined) {
              newNode.firstElementChild.firstElementChild.firstElementChild.removeAttribute(
                "style"
              );
            }
          });
        } else {
          txtNoCourse.classList.add("d-flex");
        }
      });
  }
});

function goToCourse(element) {
  const key = element.id;
  window.location.assign(`/professor/manage-course?id=${key}`);
}
