const sideTabs = document.getElementsByClassName("sideTab");
const quizContainer = document.getElementById("quizContainer");
let activeTab = sideTabs[0];
let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

function changeTab(element) {
  if (activeTab == element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    firebase
      .database()
      .ref("courses/" + courseId)
      .once("value")
      .then((snapshot) => {
        const courseData = snapshot.val();
        if (courseData.prof_id === user.uid) {
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
                    const questionsCount = contentData.questions.length - 1;
                    const newNode = document.createElement("div");
                    newNode.className = "col-12 px-4 my-4 px-sm-5 py-2 py-sm-3 paperCourse";
                    newNode.id = contentData.itemId;
                    newNode.innerHTML = `
                    <div class="row mx-0 w-100">
                        <div class="col-12 px-0 quizTitle">${contentData.title}</div>
                        <div class="col-12 px-0 qNum">${questionsCount} questions</div>
                    </div>`;
                    quizContainer.appendChild(newNode);
                  }
                }
              }
            });
        } else {
          alert("Invalid user");
          window.history.back();
        }
      });
  }
});
