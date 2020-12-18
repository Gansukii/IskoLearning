// let initialLoadDone = false;
const notificationsContainer = document.getElementById("notificationsContainer");
const notifSpinner = document.getElementById("notifSpinner");
const notifIcon = document.getElementById("notifIcon");
const notifToggle = document.getElementById("notifToggle");
// const markRead = document.getElementById("markRead");
// const removeNotif = document.getElementById("removeNotif");
// const notifReminder = document.getElementById("notifReminder");
let isNewNotif = false;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    let currDate;
    // const currDate = localStorage.getItem("timestamp");
    firebase
      .database()
      .ref("user_answer_notif/" + user.uid)
      .on("child_added", (data) => {
        if (notificationsContainer.contains(notifSpinner))
          notificationsContainer.removeChild(notifSpinner);
        if (!data.val()) {
          notificationsContainer.innerHTML = `<div class="p-2 text-muted text-center" id="noNotif">no notification to show</div>`;
          return;
        }
        // snapshot.forEach((data) => {

        const notifData = data.val();
        const node = document.createElement("div");
        firebase
          .database()
          .ref("/date")
          .update({ currTime: firebase.database.ServerValue.TIMESTAMP })
          .then(function () {
            firebase
              .database()
              .ref("/date")
              .once("value")
              .then((snapshot) => {
                // localStorage.setItem("timestamp", );
                currDate = snapshot.val().currTime;
              })
              .then(() => {
                firebase
                  .database()
                  .ref("users/" + user.uid)
                  .once("value")
                  .then((userSnapshot) => {
                    let timeAgo = getTimeAgo((currDate - data.val().notif_datetime) / 1000);
                    let unseen = notifData.seen ? "" : "unseen";
                    let iconRead = notifData.seen ? "far" : "fas";

                    node.innerHTML = `<div class="dropdown-divider my-0"></div>
                <div
                  class="btn mx-0 my-0 pl-3 py-3 col-12 text-left position-relative notifItem ${unseen}"
                  id="btnNotifItem"
                >
                  <div class="position-absolute removeNotif" onclick="removeNotif(event)">
                    <i class="fas fa-times"></i>
                  </div>
                  <div class="row w-100 pt-1 mx-0">
                    <div class="col-11 px-0 mx-0">
                      <div class="col-12 pl-0 mx-0 notifTextContainer">
                        <span class="notifData" id="notifFullName">${
                          userSnapshot.val().fullname
                        }</span>
                        posted an answer to your question:
                        <span class="notifData" id="notifQuestionTitle">${
                          notifData.question_title
                        }</span> 
                      </div>

                      <div class="col-12 px-0 mt-1 text-left notifTimeAgo">${timeAgo}</div>
                    </div>
                    <div class="col-1 px-0 mx-0 d-flex align-items-center">
                      <i class="${iconRead} fa-circle" onclick="unread(event)"></i>
                    </div>
                  </div>
                  <div class="row w-100"></div>
                </div>`;

                    notificationsContainer.prepend(node);
                    // notifData.seen ? notificationsContainer.appendChild(node)
                    //   : notificationsContainer.prepend(node);
                    if (!notifData.seen) isNewNotif = true;

                    if (!isNewNotif) {
                      notifIcon.innerHTML = " ";
                      notifIcon.classList.remove("fas");
                      notifIcon.classList.add("far");
                      notifToggle.removeAttribute("hasNotif");
                    } else {
                      notifIcon.innerHTML = `<i
                      class="fas fa-circle position-absolute"
                       style="font-size: 10px; color: #ff1919; top: -5px; right: 0"
                      ></i>`;
                      notifIcon.classList.add("fas");
                      notifIcon.classList.remove("far");
                      notifToggle.setAttribute("hasNotif", "");
                    }
                  });
              });
          });
      });
  }
});

notifToggle.onclick = () => {
  if (notifToggle.hasAttribute("hasNotif")) {
    notifToggle.removeAttribute("hasNotif");
    notifIcon.innerHTML = " ";
    notifIcon.classList.remove("fas");
    notifIcon.classList.add("far");
    notifToggle.removeAttribute("hasNotif");
    isNewNotif = false;
  }
};

// markRead.onclick = (e) => {
//   e.stopPropagation();
//   if (e.target.classList.contains("fas")) {
//     e.target.classList.remove("fas");
//     e.target.classList.add("far");
//     // console.log(e.target.parentNode.parentNode.parentNode.classList);
//     e.target.parentNode.parentNode.parentNode.classList.remove("unseen");
//   }
// };
// removeNotif.onclick = (e) => {
//   e.stopPropagation();
// };

function unread(e) {
  e.stopPropagation();
  let element = e.target;

  if (element.classList.contains("fas")) {
    element.classList.remove("fas");
    element.classList.add("far");
    element.parentNode.parentNode.parentNode.classList.remove("unseen");
    // firebase.database().ref("user_answer_notif").orderByChild("notif_key")
  }
}

function removeNotif(e) {
  e.stopPropagation();
  let element = e.target;
  notificationsContainer.removeChild(element.parentNode.parentNode.parentNode);
  if (notificationsContainer.children.length === 0) {
    notificationsContainer.innerHTML = `<div class="p-2 text-muted text-center" id="noNotif">no notification to show</div>`;
  }
}
