const btnNewCourse = document.getElementById("btnNewCourse");
const tabItems = document.getElementsByClassName("tabItem");
let activeTab = document.getElementsByClassName("tabItem")[0];

btnNewCourse.onclick = () => {
  window.location.assign("../professor/course-creation.html");
};

function changePage(element) {
  if (activeTab === element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");
}

// let updates = {};

// updates["category_courses"] = {
//   data_structure: { "-MPtNlNYUQqDZJwDaerQ": { course_id: "-MPtNlNYUQqDZJwDaerQ" } },
//   ui_ux_design: { "-MQ0whH25Xfd9GnQgK9T": { course_id: "-MQ0whH25Xfd9GnQgK9T" } },
//   others: {
//     "-MPxsSeda6pH5Fx_v-3B": { course_id: "-MPxsSeda6pH5Fx_v-3B" },
//     "-MQ-qoNxg-ztd4ErdlGr": { course_id: "-MQ-qoNxg-ztd4ErdlGr" },
//   },
// };

// firebase.database().ref().update(updates);
