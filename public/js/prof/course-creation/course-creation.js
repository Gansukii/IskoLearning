const btnBack = document.getElementById("btnBack");
const headerCourseTitle = document.getElementById("headerCourseTitle");
const btnDetails = document.getElementById("btnDetails");
const btnContent = document.getElementById("btnContent");
const courseDetails = document.getElementById("courseDetails");
const courseContent = document.getElementById("courseContent");
const courseTitleInput = document.getElementById("courseTitleInput");
const courseBriefInput = document.getElementById("courseBriefInput");
const categoryInput = document.getElementById("categoryInput");
const unitsInput = document.getElementById("unitsInput");
const prerequisiteInput = document.getElementById("prerequisiteInput");
const thumbUpload = document.getElementById("thumbUpload");
const deleteImage = document.getElementById("deleteImage");
const thumb = document.getElementById("thumb");
const chapterContainer = document.getElementById("chapterContainer");
const btnAddChapter = document.getElementById("btnAddChapter");
const chapterItemContainer = document.getElementById("chapterItemContainer");
const btnSubmit = document.getElementById("btnSubmit");
// const btnModalContinue = document.getElementById("btnModalContinue");
// const videoLinkInput = document.getElementById("videoLinkInput");
// const validVidContainer = document.getElementById("validVidContainer");
let currentUser;
firebase.auth().onAuthStateChanged(function (user) {
  currentUser = user;
  btnSubmit.removeAttribute("disabled");
});

let isDetailsDone = false;
let chapterCount = 1;
let formData = {};
let imageFile;
let hasImage = false;
// let vidsPerChapter = [];

btnBack.onclick = () => {
  window.history.back();
};

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

  isDetailsDone = checkDetailsFields();
  if (isDetailsDone) {
    btnDetails.firstElementChild.classList.remove("fa-circle");
    btnDetails.firstElementChild.classList.add("fa-check-circle");
  } else {
    btnDetails.firstElementChild.classList.add("fa-circle");
    btnDetails.firstElementChild.classList.remove("fa-check-circle");
  }
};
courseTitleInput.onkeyup = () => {
  headerCourseTitle.innerHTML =
    courseTitleInput.value.trim() !== "" ? courseTitleInput.value.trim() : "Untitled Course";
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

// ###############################  HANDLE UPLOAD IMAGE  ################################
thumbUpload.onchange = (e) => {
  imageFile = e.target.files[0];
  imageUrl = URL.createObjectURL(imageFile);
  thumb.style = `background: url(${imageUrl}) no-repeat center; background-size: cover;`;
  hasImage = true;
};
deleteImage.onclick = (e) => {
  e.preventDefault();
  hasImage = false;
  imageFile = null;
  if (thumb.hasAttribute("style")) thumb.removeAttribute("style");
};
// ####################### ADD AND DELETING CHAPTER ############################

btnAddChapter.onclick = () => {
  chapterCount++;
  let btnDel = createDeleteBtn(chapterCount);
  if (chapterCount > 2) {
    document.getElementById(`close-${chapterCount - 1}`).remove();
  }

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
                            id="chapterTitleInput-${chapterCount}"
                            placeholder="Enter a title"
                          />
                        </div>

                        <div class="form-group">
                          <label for="chapterDescriptionInput-${chapterCount}">Description</label>
                          <textarea
                            class="form-control"
                            id="chapterDescriptionInput-${chapterCount}"
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
                                         onclick="checkValidVid(this,'add')"
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
                          <button 
                            class="btn btnAdd"
                            data-toggle="modal"
                            data-target="#addQuizModal-${chapterCount}">
                            <i class="fas fa-plus-circle"></i> Quiz
                          </button>
                          <div
                            class="modal fade"
                            id="addQuizModal-${chapterCount}"
                            tabindex="-1"
                            role="dialog"
                            aria-hidden="true"
                          >
                            <div class="modal-dialog modal-dialog-centered" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <div class="txtTitle">Create Quiz</div>
                                  <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body pb-0">
                                  <div class="row w-100 mx-0">
                                    <div class="col-12 px-0">
                                      <label for="quizTitleInput-${chapterCount}">Quiz Title</label>
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="quizTitleInput-${chapterCount}"
                                        placeholder="Quiz Title Here"
                                      />
                                    </div>
                                    <div class="col-12 px-0 mt-4">
                                      <label for="quizInstructionsInput-${chapterCount}">Instructions</label>
                                      <textarea
                                        class="form-control"
                                        id="quizInstructionsInput-${chapterCount}"
                                        rows="3"
                                      ></textarea>
                                    </div>
                                  </div>
                                  <hr class="w-100" />
                                  <div class="row w-100 mx-0">
                                    <div class="row w-100 mx-0" id="quizItemsContainer-${chapterCount}">
                                      <div class="row w-100 mx-0" id="questionItem-1-${chapterCount}">
                                        <div>1.</div>
                                        <div class="col">
                                          <div class="row w-100 mx-0">
                                            <div class="col-12 px-0">
                                              <label for="question1-${chapterCount}">Question</label>
                                              <textarea
                                                class="form-control"
                                                id="question1-${chapterCount}"
                                                rows="2"
                                              ></textarea>
                                            </div>
                                            <div class="col-12 mt-3 px-0">
                                              <label for="answer1-${chapterCount}">Answer</label>
                                              <input
                                                type="text"
                                                class="form-control"
                                                id="answer1-${chapterCount}"
                                              />
                                            </div>
                                          </div>
                                          <div class="col-12 px-0 mt-3 d-flex justify-content-end">
                                            <div
                                              class="deleteQuestion"
                                              id="btnTrash-1-${chapterCount}"
                                              onclick="deleteQuestionItem(this)"
                                            >
                                              <i class="far fa-trash-alt"></i> Delete Question
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <hr class="w-100 mb-0" />
                                    <div class="col-12 p-3">
                                      <button
                                        class="btn w-100 btnAddChapter"
                                        id="addQuestion-${chapterCount}"
                                        onclick="addQuestionItem(this)"
                                      >
                                        <i class="fas fa-plus-circle"></i> Add Question
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div class="modal-footer">
                                  <div
                                    class="mr-auto deleteQuiz"
                                    id="btnDel-1-${chapterCount}"
                                    onclick="deleteQuiz(this)"
                                  >
                                    <i class="far fa-trash-alt"></i> Delete Quiz
                                  </div>
                                  <button
                                    type="button"
                                    class="btn px-3 py-1 mr-2 btnModalCancel"
                                    data-dismiss="modal"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    class="btn px-3 py-1 btnModalAdd btnAddActive"
                                    id="btnModalQuizAdd-${chapterCount}"
                                    data-dismiss="modal"
                                    onclick="addQuiz(this, 'add')"

                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
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

function videoLinkFilled(e) {
  // checkValidVid();
  let id = e.id.split("-")[1];
  let btnModalContinue = document.getElementById(`btnModalContinue-${id}`);
  if (e.value === "") {
    btnModalContinue.setAttribute("disabled", "");
    btnModalContinue.classList.remove("btnModalContinueActive");
  } else {
    btnModalContinue.removeAttribute("disabled");
    btnModalContinue.classList.add("btnModalContinueActive");
  }
}

function checkValidVid(e, action) {
  let id = e.id.split("-")[1];
  let videoLinkInput = document.getElementById(`videoLinkInput-${id}`);
  let validVidContainer = document.getElementById(`validVidContainer-${id}`);
  let btnModalAdd = document.getElementById(`btnModalAdd-${id}`);
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
      validVidContainer.innerHTML = "";
      validVidContainer.innerHTML = getIframe(id, vidId);
      btnModalAdd.removeAttribute("disabled");
      btnModalAdd.classList.add("btnAddActive");
      if (action === "add") {
        btnModalAdd.onclick = () => {
          addNewItem(id, vidId, action);
        };
      } else {
        let chapterId = e.getAttribute("chap");
        formData[`chapter${chapterId}`][id].videoId = vidId;
      }
    } else {
      validVidContainer.innerHTML = `<div class="small text-center" style="color: #f00"> Invalid Video URL</div>`;
      btnModalAdd.setAttribute("disabled", "");
      btnModalAdd.classList.remove("btnAddActive");
    }
  };
}

const getIframe = (id, src) => {
  return `<div class="col-12 px-0">
          <label for="videoTitleInput-${id}">Video Title</label>
          <input
            type="text"
            class="form-control"
            id="videoTitleInput-${id}"
            placeholder="Video Title (based on video link title)"
          />
        </div>
        <div class="col-12 px-0 mt-3">
           <iframe
            src="https://www.youtube.com/embed/${src}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            id="iframe${id}"
          ></iframe>
        </div>
        <div class="col-12 px-0 mt-3">
          <label for="videoDescriptionInput">Description</label>
          <textarea
            class="form-control"
            id="videoDescriptionInput-${id}"
            rows="2"
            placeholder="Add Description Here"
          ></textarea>
        </div>`;
};

function addNewItem(id, vidId, action) {
  let newNode;
  let itemId;
  if (action === "add") {
    newNode = document.createElement("div");
    itemId = Date.now() + "x" + randomId() + "0" + randomId() + "0" + randomId();
    newNode.id = itemId;
  } else {
    newNode = document.getElementById(id);
    itemId = id;
  }
  newNode.innerHTML = `<button
                        class="btn mt-2 mb-4 w-100 d-flex justify-content-between align-items-center btnAdd itemAdded"
                        data-toggle="modal"
                        data-target="#editVideoModal-${itemId}"
                        itemId= ${itemId}
                        id="addedItemButton-${itemId}"
                        chap = ${id}
                        onclick="editItem(this)"
                        
                        >
                          <i class="far fa-play-circle mr-2" ></i> 
                          <div>${document.getElementById(`videoTitleInput-${id}`).value}
                          </div>
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
                                      <label for="videoLinkInput-1">Video Link</label>
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="videoLinkInput-${itemId}"
                                        placeholder="Paste video link here"
                                        onkeyup="{videoLinkFilled(this,'edit')}"
                                      />
                                    </div>
                                    <div
                                      class="col px-0 d-flex justify-content-end align-items-end"
                                    >
                                      <button
                                        class="btn btnModalContinue btnModalContinueActive"
                                        id="btnModalContinue-${itemId}"
                                        chap=${id}
                                        onclick="checkValidVid(this,'edit')"
                                        
                                      >
                                        Continue
                                      </button>
                                    </div>

                                    <div class="row w-100 mx-0 my-3" id="validVidContainer-${itemId}"></div>
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
                                    id="btnModalAdd-${itemId}"
                                    data-dismiss="modal"
                                    chap=${id}
                                    onclick={saveChanges(this)}
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>`;

  document.getElementById(`vidQuizContainer-${id}`).appendChild(newNode);
  document.getElementById(`validVidContainer-${itemId}`).innerHTML = getIframe(itemId, vidId);
  if (action === "add") {
    let data = {
      video: true,
      itemId: itemId,
      chapter: id,
      title: document.getElementById(`videoTitleInput-${id}`).value,
      desciption: document.getElementById(`videoDescriptionInput-${id}`).value,
      videoId: vidId,
    };

    let chapterKey = `chapter${id}`;
    if (formData[chapterKey] === undefined) formData[chapterKey] = {};
    formData[chapterKey][itemId] = data;

    // reset the buttons for modal
    document.getElementById(`videoLinkInput-${id}`).value = "";

    document.getElementById(`videoDescriptionInput-${id}`).value = "";
    document.getElementById(`videoTitleInput-${id}`).value = "";
    let btnModalContinue = document.getElementById(`btnModalContinue-${id}`);
    let btnModalAdd = document.getElementById(`btnModalAdd-${id}`);
    btnModalContinue.setAttribute("disabled", "");
    btnModalContinue.classList.remove("btnModalContinueActive");
    btnModalAdd.setAttribute("disabled", "");
    btnModalAdd.classList.remove("btnAddActive");
    document.getElementById(`validVidContainer-${id}`).innerHTML = "";
    $(`#addVideoModal-${id}`).modal("toggle");
  }
}

function randomId() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function removeItem(ele, e) {
  e.stopPropagation();
  let id = ele.parentNode.getAttribute("chap");
  let deleteItemId = ele.parentNode.getAttribute("itemId");
  ele.parentNode.remove();

  delete formData[`chapter${id}`][deleteItemId];
}

function editItem(element) {
  let itemId = element.getAttribute("itemId");
  let id = element.getAttribute("chap");
  // let data = formData.filter((data) => {
  //   if (data.itemId === itemId) return data;
  // });
  let data = formData[`chapter${id}`][itemId];

  // console.log(data);
  document.getElementById(`videoTitleInput-${itemId}`).value = data.title;
  document.getElementById(`videoDescriptionInput-${itemId}`).value = data.desciption;
}

function saveChanges(element) {
  let itemId = element.id.split("-")[1];
  let id = element.getAttribute("chap");

  formData[`chapter${id}`][itemId].title = document.getElementById(
    `videoTitleInput-${itemId}`
  ).value;
  formData[`chapter${id}`][itemId].desciption = document.getElementById(
    `videoDescriptionInput-${itemId}`
  ).value;
  document.getElementById(
    `addedItemButton-${itemId}`
  ).children[1].innerHTML = document.getElementById(`videoTitleInput-${itemId}`).value;
  document.getElementById(`validVidContainer-${itemId}`).innerHTML = getIframe(
    itemId,
    formData[`chapter${id}`][itemId].videoId
  );
}

// ############################# QUIZ HANDLER ####################################

function addQuestionItem(element) {
  let id = element.id.split("-")[1];
  let quizItemsContainer = document.getElementById(`quizItemsContainer-${id}`);
  let questionNumber = quizItemsContainer.children.length + 1;

  let newQuestionitem = document.createElement("div");
  newQuestionitem.className = "row w-100 mx-0";
  newQuestionitem.id = `questionItem-${questionNumber}-${id}`;
  newQuestionitem.innerHTML = `<div >${questionNumber}.</div>
                                <div class="col">
                                  <div class="row w-100 mx-0">
                                    <div class="col-12 px-0">
                                      <label for="question${questionNumber}-${id}">Question</label>
                                      <textarea
                                        class="form-control"
                                        id="question${questionNumber}-${id}"
                                        rows="2"
                                      ></textarea>
                                    </div>
                                    <div class="col-12 mt-3 px-0">
                                      <label for="answer${questionNumber}-${id}">Answer</label>
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="answer${questionNumber}-${id}"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    class="col-12 px-0 mt-3 d-flex justify-content-end"
                                    
                                  >
                                    <div class="deleteQuestion" id="btnTrash-${questionNumber}-${id}" onclick="deleteQuestionItem(this)">
                                      <i class="far fa-trash-alt"></i> Delete Question
                                    </div>
                                  </div>
                                </div>
                              </div>`;

  quizItemsContainer.appendChild(newQuestionitem);
}

function deleteQuestionItem(element) {
  let questionNumber = element.id.split("-")[1];
  let id = element.id.split("-")[2];
  let quizItemsContainer = document.getElementById(`quizItemsContainer-${id}`);

  document.getElementById(`questionItem-${questionNumber}-${id}`).remove();

  let elementArr = Array.from(quizItemsContainer.children);

  for (let i = 0; i < elementArr.length; i++) {
    let element = elementArr[i];
    let elementCount = i + 1;
    let elementNumber = element.id.split("-")[1];
    let elementId = element.id.split("-")[2];

    element.firstElementChild.innerHTML = `${elementCount}.`;
    element.querySelector(
      `#question${elementNumber}-${elementId}`
    ).id = `question${elementCount}-${elementId}`;

    element.querySelector(
      `#answer${elementNumber}-${elementId}`
    ).id = `answer${elementCount}-${elementId}`;

    element.querySelector(
      `#btnTrash-${elementNumber}-${elementId}`
    ).id = `btnTrash-${elementCount}-${elementId}`;

    element.id = `questionItem-${elementCount}-${elementId}`;
  }
}

function addQuiz(element, action) {
  element.setAttribute("disabled", "");
  let chapterNumber = element.id.split("-")[1];
  let newNode;
  let itemId;
  if (action === "add") {
    newNode = document.createElement("div");
    itemId = Date.now() + "x" + randomId() + "0" + randomId() + "0" + randomId();
    newNode.id = itemId;
  } else {
    newNode = document.getElementById(id);
    itemId = id;
  }

  $(`#addQuizModal-${chapterNumber}`).modal("toggle");
  let quizItemsContainer = document.getElementById(`quizItemsContainer-${chapterNumber}`);
  let questionNumber = quizItemsContainer.children.length;

  newNode.innerHTML = `<button
                        class="btn mt-2 mb-4 w-100 d-flex justify-content-between align-items-center btnAdd itemAdded"
                        data-toggle="modal"
                        data-target="#editQuizModal-${itemId}"
                        itemId= ${itemId}
                        id="addedItemButton-${itemId}"
                        chap = ${chapterNumber}
                        >
                          <i class="far fa-file-alt mr-2" ></i> 
                          <div>${document.getElementById(`quizTitleInput-${chapterNumber}`).value}
                          </div>
                          <i
                          class="far fa-times-circle ml-auto"
                          style="font-size: 20px; cursor: pointer"
                          onclick="removeItem(this,event)"
                          ></i>
                        </button>`;

  document.getElementById(`vidQuizContainer-${chapterNumber}`).appendChild(newNode);

  let newModal = document.getElementById(`addQuizModal-${chapterNumber}`).cloneNode(true);

  newNode.appendChild(newModal);

  newModal.id = `editQuizModal-${itemId}`;
  newModal.style = "display: none";

  document.getElementById(`quizTitleInput-${chapterNumber}`).id = `quizTitleInput-${itemId}`;
  document.getElementById(
    `quizInstructionsInput-${chapterNumber}`
  ).id = `quizInstructionsInput-${itemId}`;

  document.getElementById(
    `quizItemsContainer-${chapterNumber}`
  ).id = `quizItemsContainer-${itemId}`;
  let items = {};
  for (let i = 1; i <= questionNumber; i++) {
    items[i] = {
      question: document.getElementById(`question${i}-${chapterNumber}`).value,
      answer: document.getElementById(`answer${i}-${chapterNumber}`).value,
    };
    document.getElementById(
      `questionItem-${i}-${chapterNumber}`
    ).id = `questionItem-${i}-${itemId}`;
    document.getElementById(`question${i}-${chapterNumber}`).id = `question${i}-${itemId}`;
    document.getElementById(`answer${i}-${chapterNumber}`).id = `answer${i}-${itemId}`;
    document.getElementById(`btnTrash-${i}-${chapterNumber}`).id = `btnTrash-${i}-${itemId}`;
  }

  let data = {
    video: false,
    itemId: itemId,
    chapter: chapterNumber,
    title: document.getElementById(`quizTitleInput-${chapterNumber}`).value,
    instructions: document.getElementById(`quizInstructionsInput-${chapterNumber}`).value,
    questions: items,
  };

  let chapterKey = `chapter${chapterNumber}`;
  if (formData[chapterKey] === undefined) formData[chapterKey] = {};
  formData[chapterKey][itemId] = data;

  document.getElementById(`addQuestion-${chapterNumber}`).id = `addQuestion-${itemId}`;
  document.getElementById(`btnModalQuizAdd-${chapterNumber}`).id = `btnModalQuizAdd-${itemId}`;
  document
    .getElementById(`btnModalQuizAdd-${itemId}`)
    .setAttribute("onclick", "saveQuizChanges(this)");
  document.getElementById(`btnModalQuizAdd-${itemId}`).setAttribute("chap", chapterNumber);

  element.removeAttribute("disabled");
  document.getElementById(`btnModalQuizAdd-${itemId}`).removeAttribute("disabled");

  let mainItemContainer = document.getElementById(`quizItemsContainer-${chapterNumber}`);

  for (let i = mainItemContainer.children.length; i > 1; i--) {
    document.getElementById(`questionItem-${i}-${chapterNumber}`).remove();
  }

  document.getElementById(`question1-${chapterNumber}`).value = "";
  document.getElementById(`answer1-${chapterNumber}`).value = "";
  document.getElementById(`quizTitleInput-${chapterNumber}`).value = "";
  document.getElementById(`quizInstructionsInput-${chapterNumber}`).value = "";
}

function saveQuizChanges(element) {
  let itemId = element.id.split("-")[1];
  let id = element.getAttribute("chap");

  formData[`chapter${id}`][itemId].title = document.getElementById(
    `quizTitleInput-${itemId}`
  ).value;
  formData[`chapter${id}`][itemId].instructions = document.getElementById(
    `quizInstructionsInput-${itemId}`
  ).value;
  document.getElementById(
    `addedItemButton-${itemId}`
  ).children[1].innerHTML = document.getElementById(`quizTitleInput-${itemId}`).value;
}

btnSubmit.onclick = () => {
  isDetailsDone = checkDetailsFields();

  if (!isDetailsDone || formData.chapter1 === undefined) {
    document.getElementById(
      "alertContainer"
    ).innerHTML = `<div class="alert alert-danger alert-dismissible fade show position-fixed" style="bottom: 0" role="alert">
  Ooops! Looks like missed something on <strong>Course Details</strong> or <strong>Course Content</strong>.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`;
    setTimeout(() => $(".alert").alert("close"), 3000);
    return;
  } else {
    document.getElementById(
      "submitModalContainer"
    ).innerHTML = `<div class="modal fade" id="submitModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Confirm Submission</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div id="modalConfirmTxt">Are you sure this is done? </div>

        <div class="d-none" id="loadingContainer">
          <div class="text-center">
            <div class="spinner-border" style="width: 2rem; height: 2rem;" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        <div class="text-center my-3" id="txtLoading" style="font-size: 1rem;">Creating Course</div>
        <div class="col-12 mb-3 d-none" id="progressContainer">
            <div class="progress">
              <div
                class="progress-bar progress-bar-striped"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                id="uploadProgressBar"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer py-0">
        <button type="button" class="btn mr-2" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn px-3 py-1 btnModalAdd btnAddActive" onclick="btnConfirmSubmit(this)">Confirm</button>
      </div>
    </div>
  </div>
</div>`;
    // if (currentUser) saveToDb(currentUser);
  }
  // let courseData = {
  //   course_title: courseTitleInput.value.trim(),
  //   course_brief: courseBriefInput.value.trim(),
  //   category: categoryInput.value.trim(),
  //   units: unitsInput.value.trim(),
  //   prerequisite: prerequisiteInput.value.trim(),
  //   contents: [],
  // };

  // for (let i = 1; i <= chapterCount; i++) {
  //   let chapterObj = {};
  //   chapterObj[`chapter${i}`] = {
  //     chapter_number: i,
  //     chapter_title: document.getElementById(`chapterTitleInput-${i}`).value,
  //     chapter_description: document.getElementById(`chapterDescriptionInput-${i}`).value,
  //     chapter_contents: formData[`chapter${i}`],
  //   };
  //   courseData.contents.push(chapterObj);
  // }

  // courseTitleInput.value.trim();
  // courseBriefInput.value.trim();
  // categoryInput.value.trim();
  // unitsInput.value.trim();
  // prerequisiteInput.value.trim();

  // console.log(courseData);
};

function btnConfirmSubmit(element) {
  let user = currentUser;
  let newCourseKey = firebase.database().ref().child("courses").push().key;
  element.setAttribute("disabled", "");
  document.getElementById("modalConfirmTxt").remove();
  document.getElementById("loadingContainer").classList.remove("d-none");
  if (hasImage) {
    progressContainer.classList.remove("d-none");
    const uploadProgressBar = document.getElementById("uploadProgressBar");
    let storageRef = firebase.storage().ref("courseThumbnail/" + newCourseKey);
    let task = storageRef.put(imageFile);
    task.on(
      "state_changed",
      function progress(snapshot) {
        let percentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        uploadProgressBar.style.width = `${percentage}%`;
        uploadProgressBar.innerHTML = `Uploading image ${percentage}%`;
        if (percentage === 100) uploadProgressBar.innerHTML = "Upload Complete!";
      },
      function error(err) {
        console.log(err);
        alert("error uploading image" + err);
      },
      function complete() {
        uploadProgressBar.innerHTML = "Upload Complete!";
        let starsRef = firebase.storage().ref().child(`courseThumbnail/${newCourseKey}`);
        starsRef.getDownloadURL().then(function (url) {
          saveToDb(url, newCourseKey);
        });
      }
    );
  } else {
    saveToDb(null, newCourseKey);
  }
}

function saveToDb(url, newCourseKey) {
  let user = currentUser;

  let newCourseChapterKey = firebase.database().ref().child("course_chapters").push().key;
  let courseData = {
    course_id: newCourseKey,
    course_title: courseTitleInput.value.trim(),
    course_brief: courseBriefInput.value.trim(),
    category: categoryInput.value.trim(),
    chapter_number: chapterCount,
    units: unitsInput.value.trim(),
    prerequisite: prerequisiteInput.value.trim(),
    course_thumbnail: url,
    student_count: 0,
    created_datetime: firebase.database.ServerValue.TIMESTAMP,
    contents: newCourseChapterKey,
    prof_name: user.displayName,
    rating: 0,
  };

  let chapterObj = {};
  for (let i = 1; i <= chapterCount; i++) {
    chapterObj[`chapter${i}`] = {
      chapter_number: i,
      chapter_title: document.getElementById(`chapterTitleInput-${i}`).value,
      chapter_description: document.getElementById(`chapterDescriptionInput-${i}`).value,
      chapter_contents: formData[`chapter${i}`],
    };
    // courseData.contents.push(chapterObj);
  }

  let updates = {};
  updates["courses/" + newCourseKey] = courseData;
  updates["user_course/" + user.uid + "/" + newCourseKey] = courseData;
  updates["course_chapters/" + newCourseChapterKey] = chapterObj;
  firebase.database().ref().update(updates);
  setTimeout(() => {
    window.history.back();
  }, 500);
}
