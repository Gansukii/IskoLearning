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
const validVidContainer = document.getElementById("validVidContainer");
let chapterCount = 1;

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
  let addbtnDel = document.createElement("div");
  addbtnDel.className = "col-12 px-0 mb-3 d-flex justify-content-end";
  addbtnDel.innerHTML = `<i class="far fa-times-circle" style="font-size: 20px"></i>`;
  let newNode = chapterItemContainer.cloneNode(true);
  newNode.firstElementChild.prepend(addbtnDel);
  chapterContainer.appendChild(newNode);
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
    if (this.width !== 120) {
      validVidContainer.innerHTML = getIframe(chapterCount, vidId);
      document.getElementById("btnModalAdd-1").removeAttribute("disabled");
      document.getElementById("btnModalAdd-1").classList.add("btnAddActive");
      document.getElementById("btnModalAdd-1").onclick = () => {
        console.log("gakdmgka");
      };
    } else {
      validVidContainer.innerHTML = `<div class="small text-center" style="color: #f00"> Invalid Video URL</div>`;
      document.getElementById("btnModalAdd-1").setAttribute("disabled", "");
      document.getElementById("btnModalAdd-1").classList.remove("btnAddActive");
    }
  };
};

const getIframe = (count, src) => {
  return `<div class="col-12 px-0">
          <label for="videoTitleInput">Video Title</label>
          <input
            type="text"
            class="form-control"
            id="videoTitleInput"
            placeholder="Video Title (based on video link title)"
          />
        </div>
        <div class="col-12 px-0 mt-3">
          <iframe
            src="https://www.youtube.com/embed/${src}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            id="iframe${count}"
          ></iframe>
        </div>
        <div class="col-12 px-0 mt-3">
          <label for="videoDescriptionInput">Description</label>
          <textarea
            class="form-control"
            id="videoDescriptionInput"
            rows="2"
            placeholder="Add Description Here"
          ></textarea>
        </div>`;
};
