const btnDetails = document.getElementById("btnDetails");
const btnContent = document.getElementById("btnContent");
const courseDetails = document.getElementById("courseDetails");
const courseContent = document.getElementById("courseContent");
const courseTitleInput = document.getElementById("courseTitleInput");
const courseBriefInput = document.getElementById("courseBriefInput");
const categoryInput = document.getElementById("categoryInput");
const unitsInput = document.getElementById("unitsInput");
const chapterContainer = document.getElementById("chapterContainer");
const btnAddChapter = document.getElementById("btnAddChapter");
const chapterItemContainer = document.getElementById("chapterItemContainer");
const btnModalContinue = document.getElementById("btnModalContinue");
const videoLinkInput = document.getElementById("videoLinkInput");

btnDetails.onclick = () => {
  btnDetails.firstElementChild.classList.remove("fa-circle");
  btnDetails.firstElementChild.classList.add("fa-check-circle");
  btnDetails.classList.add("activeTab");
  btnContent.firstElementChild.classList.remove("fa-check-circle");
  btnContent.firstElementChild.classList.add("fa-circle");
  btnContent.classList.remove("activeTab");
  courseContent.classList.remove("d-flex");
  courseContent.classList.add("d-none");
  courseDetails.classList.add("d-flex");
};

btnContent.onclick = () => {
  btnContent.firstElementChild.classList.remove("fa-circle");
  btnContent.firstElementChild.classList.add("fa-check-circle");
  btnContent.classList.add("activeTab");
  btnDetails.firstElementChild.classList.add("fa-circle");
  btnDetails.firstElementChild.classList.remove("fa-check-circle");
  btnDetails.classList.remove("activeTab");
  courseDetails.classList.remove("d-flex");
  courseDetails.classList.add("d-none");
  courseContent.classList.add("d-flex");

  let isDetailsDone = checkDetailsFields();
  if (isDetailsDone) {
    btnDetails.firstElementChild.classList.remove("fa-circle");
    btnDetails.firstElementChild.classList.add("fa-check-circle");
  } else {
    btnDetails.firstElementChild.classList.add("fa-circle");
    btnDetails.firstElementChild.classList.remove("fa-check-circle");
  }
};

btnAddChapter.onclick = () => {
  console.log(chapterContainer.children.length);
};

const checkDetailsFields = () => {
  if (
    courseTitleInput.value.trim() !== "" &&
    courseBriefInput.value.trim() !== "" &&
    categoryInput.value.trim() &&
    unitsInput.value.trim()
  ) {
    return true;
  } else return false;
};

videoLinkInput.onkeyup = (e) => {
  // checkValidVid();
  if (videoLinkInput.value === "") {
    btnModalContinue.setAttribute("disabled", "");
    btnModalContinue.classList.remove("btnModalContinueActive");
  } else {
    btnModalContinue.removeAttribute("disabled");
    btnModalContinue.classList.add("btnModalContinueActive");
  }
};

btnModalContinue.onclick = () => {
  checkValidVid();
};

const checkValidVid = () => {
  let vidId = "";
  let newval = "";
  if ((newval = videoLinkInput.value.match(/(\?|&)v=([^&#]+)/))) {
    vidId = newval.pop();
  } else if ((newval = videoLinkInput.value.match(/(\.be\/)+([^\/]+)/))) {
    vidId = newval.pop();
  } else if ((newval = videoLinkInput.value.match(/(\embed\/)+([^\/]+)/))) {
    vidId = newval.pop().replace("?rel=0", "");
  }

  let img = new Image();
  img.src = "http://img.youtube.com/vi/" + vidId + "/mqdefault.jpg";
  img.onload = function () {
    // checkThumbnail(this.width);
    if (this.width !== 120) {
      console.log("ngak");
    } else console.log("yoen");
  };
};

{
  /* <div class="col-12 py-2 d-flex justify-content-end">
                  <i class="far fa-times-circle" style="font-size: 20px"></i>
                </div>
                <div class="row w-100 mx-0 py-3 px-4">
                  <div class="row w-100 mx-0">
                    <div class="">Chapter 1:</div>
                    <div class="col">
                      <form class="w-100">
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            id="chapterTitleInput"
                            placeholder="Enter a title"
                          />
                        </div>

                        <div class="form-group">
                          <label for="chapterDescriptionInput">Description</label>
                          <textarea
                            class="form-control"
                            id="chapterDescriptionInput"
                            rows="2"
                            placeholder="Max of x characters"
                          ></textarea>
                        </div>
                        <div class="form-group">
                          <label>Content</label>
                          <div class>
                            <button class="btn mr-3 btnAdd">
                              <i class="fas fa-plus-circle"></i> Video Link
                            </button>
                            <button class="btn btnAdd">
                              <i class="fas fa-plus-circle"></i> Quiz
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div> */
}
