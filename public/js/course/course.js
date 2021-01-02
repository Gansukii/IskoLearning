const ratingContainer = document.getElementById("ratingContainer");
const reviewColumn = document.getElementById("reviewColumn");
const rowReview = document.getElementById("rowReview");
const btnEnroll = document.getElementById("btnEnroll");
const txtCourseTitle = document.getElementById("txtCourseTitle");
const txtCourseProf = document.getElementById("txtCourseProf");
const desContainer = document.getElementById("desContainer");
const accordionContainer = document.getElementById("accordionContainer");
let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

if (document.documentElement.clientWidth < lg) {
  rowReview.appendChild(ratingContainer);
} else reviewColumn.appendChild(ratingContainer);

window.onresize = () => {
  if (document.documentElement.clientWidth < lg) {
    rowReview.appendChild(ratingContainer);
  } else reviewColumn.appendChild(ratingContainer);
};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    btnEnroll.removeAttribute("disabled");
    btnEnroll.onclick = () => {
      firebase
        .database()
        .ref("courses/" + courseId)
        .update({ student_count: 0 });
      // firebase.database.ServerValue.increment(1)
      firebase
        .database()
        .ref("student_user_course/" + user.uid + "/" + courseId)
        .set({ courseId: courseId }, (error) => {
          if (error) {
            console.log(error);
          } else {
            let newStudentKey = firebase
              .database()
              .ref()
              .child("course_students/" + courseId)
              .push().key;
            let updates = {};
            updates["course_students/" + courseId + "/" + newStudentKey] = {
              user: user.uid,
              student_key: newStudentKey,
            };
            firebase.database().ref().update(updates);
            location.reload();
          }
        });
    };
  }
});

firebase
  .database()
  .ref("courses/" + courseId)
  .once("value")
  .then((snapshot) => {
    txtCourseTitle.classList.remove("loading");
    txtCourseProf.classList.remove("loading");
    desContainer.innerHTML = "";
    const data = snapshot.val();
    txtCourseTitle.innerHTML = data.course_title;
    txtCourseProf.innerHTML = "Prof. " + data.prof_name;
    desContainer.innerHTML = data.course_brief;
    firebase
      .database()
      .ref("course_chapters/" + data.contents)
      .once("value")
      .then((cSnapshot) => {
        let chapterSnapshot = Object.values(cSnapshot.val());
        console.log(chapterSnapshot);
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
              icon = "fa-file-alt";
              itemDes = (chapterContents[i].questions.length - 1).toString() + " questions";
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
          console.log(videoCount);
          console.log(quizCount);
        });
      });
  });

// <div class="col-12 py-2">
//   <button class="btn w-100">
//     <div class="row d-flex align-items-center">
//       <div>
//         <i class="far fa-play-circle"></i>
//       </div>
//       <div class="px-2 d-flex flex-column">
//         <div class="accordionSubItemText lh-1 text-left">Video 1</div>
//         <div class="text-muted small text-left">3:05</div>
//       </div>
//     </div>
//   </button>
// </div>
