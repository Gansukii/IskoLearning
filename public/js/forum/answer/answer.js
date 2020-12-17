const answerBody = document.getElementById("answerBody");
const btnSubmitAns = document.getElementById("btnSubmitAns");

let url = new URL(window.location.href);
let question_id = url.searchParams.get("id");
let isUp = url.searchParams.get("isUp");
let userUpvotesArr = [];

// let time = Math.abs(parseInt(url.searchParams.get("t")));

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    getUserUpvotes(user, question_id, userUpvotesArr);

    btnSubmitAns.onclick = () => {
      if (answerBody.value.trim() !== "") {
        addAnswer(user, question_id, answerBody.value);
        btnSubmitAns.setAttribute("disabled", "");
      } else alert("field cannot be empty");
    };
  }
});
