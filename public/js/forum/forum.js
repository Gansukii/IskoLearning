const btnAskQuestion = document.getElementById("btnAskQuestion");
const questionBody = document.getElementById("questionBody");
const questionTitle = document.getElementById("questionTitle");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    getQuestions(user.uid);
    btnAskQuestion.onclick = () => {
      if (
        questionBody.value.trim() !== "" &&
        questionTitle.value.trim() !== ""
      ) {
        btnAskQuestion.setAttribute("disabled", "");
        addQuestion(user, questionTitle.value, questionBody.value);
        // if (success) {
        //   console.log("Successfully added");
        //   //   location.reload()
        // } else {
        //   btnAskQuestion.removeAttribute("disabled");
        //   alert("An error has occured. Please try again");
        // }
      } else {
        console.log("Fields could not be empty");
      }
    };
  } else {
    alert("An error has occured. Please try again");
  }
});
