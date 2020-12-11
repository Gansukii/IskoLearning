const btnAskQuestion = document.getElementById("btnAskQuestion");
const questionBody = document.getElementById("questionBody");
const questionTitle = document.getElementById("questionTitle");
let userUpvotesArr = [];

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    getUserUpvotes(user, null, userUpvotesArr);
    btnAskQuestion.onclick = () => {
      if (
        questionBody.value.trim() !== "" &&
        questionTitle.value.trim() !== ""
      ) {
        btnAskQuestion.setAttribute("disabled", "");
        addQuestion(user, questionTitle.value, questionBody.value);
      } else {
        console.log("Fields could not be empty");
      }
    };
  } else {
    alert("An error has occured. Please try again");
  }
});
