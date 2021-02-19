// let initialLoadDone = false;
const notificationsContainer = document.getElementById("notificationsContainer");
const notifSpinner = document.getElementById("notifSpinner");
const notifIcon = document.getElementById("notifIcon");
const notifToggle = document.getElementById("notifToggle");
// const markRead = document.getElementById("markRead");
// const removeNotif = document.getElementById("removeNotif");
// const notifReminder = document.getElementById("notifReminder");
let isNewNotif = false;
let userId;
let noData = true;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    userId = user.uid;
    let currDate;
    firebase
      .database()
      .ref("user_answer_notif/" + user.uid)
      .on("child_added", (data) => {
        noData = false;
        if (notificationsContainer.contains(notifSpinner))
          notificationsContainer.removeChild(notifSpinner);
        if (!data.val()) {
          notificationsContainer.innerHTML = `<div class="p-2 text-muted text-center" id="noNotif">no notification to show</div>`;
          return;
        }
        if (document.getElementById("noNotif")) document.getElementById("noNotif").remove();
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
                currDate = snapshot.val().currTime;
              })
              .then(() => {
                firebase
                  .database()
                  .ref("users/" + notifData.user)
                  .once("value")
                  .then((userSnapshot) => {
                    let timeAgo = getTimeAgo((currDate - data.val().notif_datetime) / 1000);
                    let unseen = notifData.seen ? "" : "unseen";
                    let iconRead = notifData.seen ? "far" : "fas";

                    node.innerHTML = `<div class="dropdown-divider my-0"></div>
                <div
                  class="btn mx-0 my-0 pl-3 py-3 col-12 text-left position-relative notifItem ${unseen}" qId=${
                      notifData.item
                    }
                  id="btnNotifItem"
                  onclick='goToItem(this)'
                >
                  <div class="position-absolute removeNotif" >
                    <i class="fas fa-times" notifId="${data.key}" onclick="removeNotif(event)"></i>
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
                      <i class="${iconRead} fa-circle" notifId="${
                      data.key
                    }" onclick="unread(event)"></i>
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

    if (noData) {
      if (notificationsContainer.contains(notifSpinner))
        notificationsContainer.removeChild(notifSpinner);
      notificationsContainer.innerHTML = `<div class="p-2 text-muted text-center" id="noNotif">no notification to show</div>`;
    }
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

function unread(e) {
  e.stopPropagation();
  let element = e.target;
  if (element.classList.contains("fas")) {
    element.classList.remove("fas");
    element.classList.add("far");
    element.parentNode.parentNode.parentNode.classList.remove("unseen");
    firebase
      .database()
      .ref("user_answer_notif/" + userId + "/" + element.getAttribute("notifId"))
      .update({
        seen: true,
      });
  }
}

function removeNotif(e) {
  e.stopPropagation();
  let element = e.target;
  let notifId = element.getAttribute("notifId");
  firebase
    .database()
    .ref("user_answer_notif/" + userId + "/" + notifId)
    .remove();
  notificationsContainer.removeChild(element.parentNode.parentNode.parentNode);
  if (notificationsContainer.children.length === 0) {
    notificationsContainer.innerHTML = `<div class="p-2 text-muted text-center" id="noNotif">no notification to show</div>`;
  }
}

function goToItem(element) {
  let questionId = element.getAttribute("qId");
  let notifId = element.firstElementChild.firstElementChild.getAttribute("notifId");
  firebase
    .database()
    .ref("user_answer_notif/" + userId + "/" + notifId)
    .update({
      seen: true,
    });
  window.location.assign(`/answer?id=${questionId}`);
}
