firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(user);
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
                });
              });
          });
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
