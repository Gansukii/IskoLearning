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
// const btnModalContinue = document.getElementById("btnModalContinue");
// const videoLinkInput = document.getElementById("videoLinkInput");
// const validVidContainer = document.getElementById("validVidContainer");
let chapterCount = 1;
let formData = [];
// let vidsPerChapter = [];

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

// ####################### ADD AND DELETING CHAPTER ############################

btnAddChapter.onclick = () => {
  chapterCount++;
  let btnDel = createDeleteBtn(chapterCount);
  if (chapterCount > 2) {
    document.getElementById(`close-${chapterCount - 1}`).remove();
  }
  // let newNode = chapterItemContainer.cloneNode(true);
  // newNode.firstElementChild.prepend(btnDel);
  // newNode.firstElementChild.children[1].innerHTML = `Chapter ${chapterCount}`;
  // newNode.querySelector("#btnModalAdd-1").id = `btnModalAdd-${chapterCount}`;
  // newNode.querySelector("#videoLinkInput-1").id = `videoLinkInput-${chapterCount}`;
  // newNode.querySelector(`#videoLinkInput-${chapterCount}`).onkeyup = (e) => {
  //   videoLinkFilled;
  // };

  let newChapter = document.createElement("div");
  newChapter.className = "row w-100 mx-0 py-3 px-4";
  newChapter.innerHTML = `
                  <div class="row w-100 mx-0">
                    <div class="mb-3 mb-sm-0 d-flex px-0 txtChapter">Chapter ${chapterCount}:</div>
                    <div class="col pr-sm-0">
                      <div class="w-100">
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
                      </div>
                      <div class="form-group">
                        <label>Content</label>
                        <div>
                        <div id="vidQuizContainer-${chapterCount}">

                          </div>
                          <button
                            class="btn mr-3 btnAdd"
                            data-toggle="modal"
                            data-target="#addVideoModal-${chapterCount}"
                          >
                            <i class="fas fa-plus-circle"></i> Video Link
                          </button>
                          <div
                            class="modal fade"
                            id="addVideoModal-${chapterCount}"
                            tabindex="-1"
                            role="dialog"
                            aria-hidden="true"
                          >
                            <div class="modal-dialog modal-dialog-centered" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <div class="txtTitle">Add Video</div>
                                  <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body">
                                  <div class="row w-100 mx-0">
                                    <div class="col-9 px-0">
                                      <label for="videoLinkInput-${chapterCount}">Video Link</label>
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="videoLinkInput-${chapterCount}"
                                        placeholder="Paste video link here"
                                        onkeyup={videoLinkFilled(this)}
                                      />
                                    </div>
                                    <div
                                      class="col px-0 d-flex justify-content-end align-items-end"
                                    >
                                      <button
                                        class="btn btnModalContinue"
                                        id="btnModalContinue-${chapterCount}"
                                         onclick="checkValidVid(this)"
                                        disabled
                                      >
                                        Continue
                                      </button>
                                    </div>

                                    <div class="row w-100 mx-0 my-3" id="validVidContainer-${chapterCount}"></div>
                                  </div>
                                </div>
                                <div class="modal-footer">
                                  <button
                                    type="button"
                                    class="btn px-3 py-1 btnModalCancel"
                                    data-dismiss="modal"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    class="btn px-3 py-1 btnModalAdd"
                                    id="btnModalAdd-${chapterCount}"
                                    data-dismiss="modal"
                                    disabled
                                  >
                                    Add Video
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button class="btn btnAdd">
                            <i class="fas fa-plus-circle"></i> Quiz
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="w-100 m-0" />`;

  newChapter.firstElementChild.prepend(btnDel);
  chapterContainer.appendChild(newChapter);
};
function removeChapter() {
  chapterCount--;
  chapterContainer.lastElementChild.remove();
  if (chapterCount > 1) {
    let btnDel = createDeleteBtn(chapterCount);
    chapterContainer.lastElementChild.prepend(btnDel);
  }
}

function createDeleteBtn(count) {
  let addbtnDel = document.createElement("div");
  addbtnDel.className = "col-12 px-0 mb-3 d-flex justify-content-end";
  addbtnDel.id = `close-${count}`;
  addbtnDel.innerHTML = `<i class="far fa-times-circle" style="font-size: 20px; cursor: pointer;" onclick={removeChapter()}></i>`;
  return addbtnDel;
}

// **************************************************************************

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

function videoLinkFilled(e) {
  // checkValidVid();
  let count = e.id.split("-")[1];
  let btnModalContinue = document.getElementById(`btnModalContinue-${count}`);
  if (e.value === "") {
    btnModalContinue.setAttribute("disabled", "");
    btnModalContinue.classList.remove("btnModalContinueActive");
  } else {
    btnModalContinue.removeAttribute("disabled");
    btnModalContinue.classList.add("btnModalContinueActive");
  }
}

function checkValidVid(e) {
  let count = e.id.split("-")[1];
  let videoLinkInput = document.getElementById(`videoLinkInput-${count}`);
  let validVidContainer = document.getElementById(`validVidContainer-${count}`);
  let btnModalAdd = document.getElementById(`btnModalAdd-${count}`);
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
      btnModalAdd.removeAttribute("disabled");
      btnModalAdd.classList.add("btnAddActive");
      btnModalAdd.onclick = () => {
        addNewItem(btnModalAdd, count, vidId);
      };
    } else {
      validVidContainer.innerHTML = `<div class="small text-center" style="color: #f00"> Invalid Video URL</div>`;
      btnModalAdd.setAttribute("disabled", "");
      btnModalAdd.classList.remove("btnAddActive");
    }
  };
}

const getIframe = (count, src) => {
  return `<div class="col-12 px-0">
          <label for="videoTitleInput-${count}">Video Title</label>
          <input
            type="text"
            class="form-control"
            id="videoTitleInput-${count}"
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
            id="videoDescriptionInput-${count}"
            rows="2"
            placeholder="Add Description Here"
          ></textarea>
        </div>`;
};

function addNewItem(e, count, vidId) {
  let newItem = document.createElement("div");
  let itemId = randomId() + "-" + randomId() + "-" + randomId() + "-" + randomId();
  newItem.innerHTML = `<button
                        class="btn mt-2 mb-4 w-100 d-flex justify-content-between align-items-center btnAdd itemAdded"
                        data-toggle="modal"
                        data-target="#editVideoModal-${itemId}"
                        itemId= ${itemId}
                        onclick="editItem(this,${count})"
                        
                        >
                          <i class="far fa-play-circle mr-2" ></i> ${
                            document.getElementById(`videoTitleInput-${count}`).value
                          }
                          <i
                          class="far fa-times-circle ml-auto"
                          style="font-size: 20px; cursor: pointer"
                          onclick="removeItem(this,event)"
                          ></i>
                        </button>
                        
                        <div
                            class="modal fade"
                            id="editVideoModal-${itemId}"
                            tabindex="-1"
                            role="dialog"
                            aria-hidden="true"
                          >
                            <div class="modal-dialog modal-dialog-centered" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <div class="txtTitle">Add Video</div>
                                  <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body">
                                  <div class="row w-100 mx-0">
                                    <div class="col-9 px-0">
                                      <label for="videoLinkInputEdit-1">Video Link</label>
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="videoLinkInputEdit-${itemId}"
                                        placeholder="Paste video link here"
                                        onkeyup="{videoLinkFilled(this)}"
                                      />
                                    </div>
                                    <div
                                      class="col px-0 d-flex justify-content-end align-items-end"
                                    >
                                      <button
                                        class="btn btnModalContinue"
                                        id="btnModalContinueEdit-${itemId}"
                                        onclick="checkValidVid(this)"
                                        disabled
                                      >
                                        Continue
                                      </button>
                                    </div>

                                    <div class="row w-100 mx-0 my-3" id="validVidContainerEdit-${itemId}"></div>
                                  </div>
                                </div>
                                <div class="modal-footer">
                                  <button
                                    type="button"
                                    class="btn px-3 py-1 btnModalCancel"
                                    data-dismiss="modal"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    class="btn px-3 py-1 btnModalAdd btnAddActive"
                                    id="btnModalEdit-1"
                                    data-dismiss="modal"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>`;
  document.getElementById(`vidQuizContainer-${chapterCount}`).appendChild(newItem);
  let data = {
    video: true,
    itemId: itemId,
    chapter: count,
    title: document.getElementById(`videoTitleInput-${count}`).value,
    desciption: document.getElementById(`videoDescriptionInput-${count}`).value,
    videoId: vidId,
  };
  formData.push(data);

  // reset the buttons for modal
  document.getElementById(`videoLinkInput-${count}`).value = "";
  document.getElementById(`videoDescriptionInput-${count}`).value = "";
  document.getElementById(`videoTitleInput-${count}`).value = "";
  let btnModalContinue = document.getElementById(`btnModalContinue-${count}`);
  let btnModalAdd = document.getElementById(`btnModalAdd-${count}`);
  btnModalContinue.setAttribute("disabled", "");
  btnModalContinue.classList.remove("btnModalContinueActive");
  btnModalAdd.setAttribute("disabled", "");
  btnModalAdd.classList.remove("btnAddActive");
  document.getElementById(`validVidContainer-${count}`).innerHTML = "";
}

function randomId() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function removeItem(ele, e) {
  e.stopPropagation();
  let deleteItemId = ele.parentNode.getAttribute("itemId");
  ele.parentNode.remove();
  formData = formData.filter((data) => {
    if (data.itemId !== deleteItemId) {
      return data;
    }
  });
}

function editItem(element, count) {
  let itemId = element.getAttribute("itemId");
  let data = formData.filter((data) => {
    if (data.itemId === itemId) return data;
  });
  console.log(data);
}
