const btnAskQuestion = document.getElementById("btnAskQuestion");
const questionBody = document.getElementById("questionBody");
const questionTitle = document.getElementById("questionTitle");
const tagsContainer = document.getElementById("tagsContainer");
const questionTags = document.getElementById("questionTags");
const tagSearchContainer = document.getElementById("tagSearchContainer");
const tagsPaperContainer = document.getElementById("tagsPaperContainer");
let userUpvotesArr = [];
let tags = [];
localStorage.setItem("tags", []);
firebase
  .database()
  .ref("tags")
  .on("child_added", (data) => {
    let localTags = localStorage.getItem("tags");

    if (localTags) {
      if (localTags.includes(data.val())) return;
    }
    let dataTag = [data.val()];
    dataTag = dataTag.concat(localTags);
    localStorage.setItem("tags", dataTag);

    let searchTagItem = document.createElement("div");
    searchTagItem.className = "p-1 d-none searchTagItem";
    searchTagItem.setAttribute("onclick", "addTag(this,'container')");
    searchTagItem.innerHTML = data.val();
    tagSearchContainer.appendChild(searchTagItem);
    let selectTag = document.createElement("div");
    selectTag.className = "badge badge-pill mx-1 mb-2 tagSelect";
    selectTag.innerHTML = `<span class="badgeDelete ml-1" onclick="">${data.val()}</span>`;
    tagsPaperContainer.appendChild(selectTag);
  });

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    getUserUpvotes(user, null, userUpvotesArr);
    btnAskQuestion.onclick = () => {
      if (questionBody.value.trim() !== "" && questionTitle.value.trim() !== "") {
        btnAskQuestion.setAttribute("disabled", "");
        addQuestion(user, questionTitle.value, questionBody.value, tags);
      } else {
        console.log("Fields could not be empty");
      }
    };
  } else {
    alert("An error has occured. Please try again. Maybe you're not signed in");
  }
});

questionTags.onkeyup = (e) => {
  if (e.key === "Enter" || e.keyCode === 13) {
    addTag(e.target, "input");
    // tags.push(questionTags.value);
    // let newTag = document.createElement("span");
    // newTag.className = "badge badge-pill mx-1 mb-2 tagItem d-flex flex-row";
    // newTag.innerHTML = `<div>${questionTags.value}</div><span class="badgeDelete ml-1" onclick="deleteTag(this)">&times;</span>`;
    // tagsContainer.appendChild(newTag);
    // questionTags.value = "";
  } else {
    if (questionTags.value === "") tagSearchContainer.classList.add("d-none");
    else tagSearchContainer.classList.remove("d-none");

    let tagItems = document.getElementsByClassName("searchTagItem");
    for (let i = 0; i < tagItems.length; i++) {
      if (tagItems[i].textContent.toUpperCase().indexOf(questionTags.value.toUpperCase()) > -1) {
        tagItems[i].classList.remove("d-none");
      } else tagItems[i].classList.add("d-none");
    }
  }
};

function deleteTag(element) {
  console.log(element.previousSibling.textContent);
  tags = tags.filter((data) => {
    if (data !== element.previousSibling.textContent) {
      return data;
    }
  });
  element.parentNode.remove();
  console.log(tags);
}
function addTag(element, action) {
  let value = action === "input" ? element.value : element.textContent;
  tags.push(value);
  let newTag = document.createElement("span");
  newTag.className = "badge badge-pill mx-1 mb-2 tagItem d-flex flex-row";
  newTag.innerHTML = `<div>${value}</div><span class="badgeDelete ml-1" onclick="deleteTag(this)">&times;</span>`;
  tagsContainer.appendChild(newTag);
  questionTags.value = "";
  tagSearchContainer.classList.add("d-none");
}
