const txtSearchTitle = document.getElementById("txtSearchTitle");
const coursesContainer = document.getElementById("coursesContainer");
const btnBadges = document.getElementsByClassName("badgeDev");
const searchNoData = document.getElementById("searchNoData");
const txtSearchNoData = document.getElementById("txtSearchNoData");
let activeBadge = btnBadges[0];
let coursesElement = [];
let forumElement = [];

const url = new URL(window.location.href);
let searchTxt = url.searchParams.get("key");

txtSearchTitle.innerHTML = searchTxt;
txtSearchNoData.innerHTML = searchTxt;

firebase
  .database()
  .ref("courses")
  .orderByChild("course_title")
  .startAt(searchTxt.toLowerCase())
  .endAt(searchTxt.toLowerCase() + "\uf8ff")
  .once("value")
  .then((snapshot) => {
    coursesContainer.innerHTML = "";

    if (snapshot.val()) {
      const dataGroup = snapshot.val();
      for (item in dataGroup) {
        const data = dataGroup[item];
        const brief =
          data.course_brief.length < 225
            ? data.course_brief
            : data.course_brief.slice(0, 225) + "...";
        const newCourseNode = document.createElement("div");
        newCourseNode.className = "row mx-0 courseContainer";
        newCourseNode.id = data.course_id;

        newCourseNode.innerHTML = `<div class="thumb mx-0 mr-lg-2" style="background: url(${data.course_thumbnail}) no-repeat center;" onclick="linkThumb(this)"></div>
           <div class="col-12 col-lg-6 py-1 mt-2 mt-lg-0 pr-0 pl-0 pl-lg-2">
             <div class="row mx-0 w-100">
               <div class="col-10 px-0  courseTitle" onclick="linkTitle(this)">${data.course_title}</div>
               <div class="col-12 px-0 mb-2 courseProf">Prof. ${data.prof_name}</div>
               <div class="col-12 px-0 courseBrief">
                 ${brief}
               </div>
             </div>
           </div>
           <hr class="w-75 my-4" />`;
        coursesContainer.appendChild(newCourseNode);
        if (!data.course_thumbnail) {
          newCourseNode.firstElementChild.removeAttribute("style");
        }
        console.log(data.course_thumbnail);
      }
    } else {
      console.log(searchNoData);
      searchNoData.classList.remove("d-none");
    }
  });

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
  }
});

function changePage(element) {
  if (activeBadge === element) {
    return;
  }
  activeBadge.classList.remove("activeBadge");
  activeBadge = element;
  activeBadge.classList.add("activeBadge");
}

function goToCourse(element) {
  courseId = element.getAttribute("key");
  window.location.assign(`/course?id=${courseId}`);
}

function linkThumb(element) {
  goToCourse(element.parentNode.id);
}

function linkTitle(element) {
  goToCourse(element.parentNode.parentNode.parentNode.id);
}

function goToCourse(id) {
  window.open(`/course?id=${id}`);
}
