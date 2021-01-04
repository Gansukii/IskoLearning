const textCourseTitle = document.getElementById("textCourseTitle");
const btnShowChapInfo = document.getElementById("btnShowChapInfo");
const sideNavDataContainer = document.getElementById("sideNavDataContainer");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
let btnSideItems = [];
let firstIter = true;
let chapFirstIter = true;
let btnSideItemActive;
let currentChap = 1;
let currentInfo;
let currentMain;

let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

function changeActive(element) {
  disableNavBtn(element);

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
  document.getElementById("sideLoadingContainer").remove();
  document.getElementById("loadingMain").remove();
  sideNavDataContainer.classList.remove("d-none");
  firebase
    .database()
    .ref("courses/" + courseId)
    .once("value")
    .then((snapshot) => {
      const courseData = snapshot.val();
      textCourseTitle.innerHTML = courseData.course_title;
      firebase
        .database()
        .ref("course_chapters/" + courseData.contents)
        .once("value")
        .then((chapterSnapshot) => {
          chapterSnapshot.forEach((data) => {
            const chapterData = data.val();
            const newSideNode = document.createElement("div");
            newSideNode.className = "col-12 mb-4";
            newSideNode.id = `chapter${chapterData.chapter_number}`;
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
                newMainNode.innerHTML = `
                    <div class="col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 txtMain">${chapterContents.title}</div>
                    <div class="row w-100 mx-0 py-3 px-4 paper">
                      <div class="col-12 px-0 points" id="points">${chapterContents.questions.length} items</div>
                      <div class="col-12 px-0 mt-2 mb-1 txtQuizHead">Instructions</div>
                      <div class="col-12 px-0 txtInstructions" id="intructions">
                        ${chapterContents.instructions}
                      </div>
                    </div>
                    <div class="col-12 px-0 mt-4 d-flex justify-content-end">
                      <button class="btn btn-danger px-4 btnStart" id="btnStartQuiz">Start Quiz</button>
                    </div>
                  `;
              }
              document.getElementById("contentItem").appendChild(newMainNode);

              if (firstIter) {
                btnSideItemActive = newSideBtn;
                newSideBtn.classList.add("btnSideItemActive");
                // chapterContents.video ? showVid(chapterContents) : showQuiz(chapterContents);
                firstIter = false;
              }
            }
            btnNext.removeAttribute("disabled");
          });
          // btnSideItem = document.getElementsByClassName("btnSideItem");
        });
    });

  btnShowChapInfo.onclick = () => {
    currentInfo = document.getElementById("chapInfoContainer" + currentChap);
    currentInfo.classList.remove("d-none");
    btnShowChapInfo.setAttribute("disabled", "");
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
    btnPrev.setAttribute("disabled", "");
    btnPrev.classList.remove("lessonNavActive");
  }
  if (btnSideItems.indexOf(element) === btnSideItems.length - 1) {
    btnNext.setAttribute("disabled", "");
    btnNext.classList.remove("lessonNavActive");
  } else {
    btnNext.removeAttribute("disabled");
    btnNext.classList.add("lessonNavActive");
  }
}

{
  /* <button
  class="btn w-100 text-left d-flex align-items-center btnSideItem"
  onclick="changeActive(this)"
>
  <i class="far fa-play-circle mr-2"></i>Lesson 3: Title
</button> */
}

{
  /* <div class="col-12" id="chapter1">
  <div class="txtChapter mb-2">Chapter 1: Title</div>
  <div class="chapterContents1">
    <button
      class="btn w-100 text-left d-flex align-items-center btnSideItem btnSideItemActive"
      onclick="changeActive(this)"
    >
      <i class="far fa-play-circle mr-2"></i>Lesson 1: Title
    </button>
    <button
      class="btn w-100 text-left d-flex align-items-center btnSideItem"
      onclick="changeActive(this)"
    >
      <i class="far fa-play-circle mr-2"></i>Lesson 2: Title
    </button>
    <button
      class="btn w-100 text-left d-flex align-items-center btnSideItem"
      onclick="changeActive(this)"
    >
      <i class="far fa-play-circle mr-2"></i>Lesson 3: Title
    </button>
  </div>
</div>; */
}
