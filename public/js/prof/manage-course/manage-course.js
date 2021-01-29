const sideTabs = document.getElementsByClassName("sideTab");
const quizContainer = document.getElementById("quizContainer");
const gradeContainer = document.getElementById("gradeContainer");
const studentContainer = document.getElementById("studentContainer");
const txtStudCount = document.getElementById("txtStudCount");
const txtStudCount2 = document.getElementById("txtStudCount2");
const tableBody = document.getElementById("tableBody");
const gradeTableBody = document.getElementById("gradeTableBody");
const studentTableBody = document.getElementById("studentTableBody");
let activeTab = sideTabs[0];
let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

function changeTab(element) {
  if (activeTab == element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");
  if (element.textContent.trim() === "Quizzes") {
    removeDNone(quizContainer);
    addDNone(gradeContainer);
    addDNone(studentContainer);
  } else if (element.textContent.trim() === "Grades") {
    removeDNone(gradeContainer);
    addDNone(quizContainer);
    addDNone(studentContainer);
  } else if (element.textContent.trim() === "Students") {
    removeDNone(studentContainer);
    addDNone(quizContainer);
    addDNone(gradeContainer);
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    firebase
      .database()
      .ref("courses/" + courseId)
      .once("value")
      .then((snapshot) => {
        const courseData = snapshot.val();
        if (courseData.prof_id === user.uid) {
          firebase
            .database()
            .ref("course_chapters/" + courseData.contents)
            .once("value")
            .then((chapters) => {
              const chaptersData = chapters.val();
              for (i in chaptersData) {
                const chapterData = chaptersData[i];
                for (j in chapterData.chapter_contents) {
                  const contentData = chapterData.chapter_contents[j];
                  if (!contentData.video) {
                    const rowNode = document.createElement("tr");
                    let status = "";
                    status = contentData.submit_count + "/" + courseData.student_count;

                    rowNode.innerHTML = `
                    <td class="tableBold">${contentData.title}</td>
                    <td class="tableThin">${status}</td>`;
                    tableBody.appendChild(rowNode);
                  }
                }
              }
            });

          firebase
            .database()
            .ref("course_students/" + courseId)
            .once("value")
            .then((snapshot) => {
              if (snapshot.val()) {
                txtStudCount.innerHTML,
                  (txtStudCount2.innerHTML = Object.keys(snapshot.val()).length);
                const data = snapshot.val();
                for (id in data) {
                  const studentData = data[id];
                  const status = studentData.grade ? "Completed" : "In-progress";
                  const grade = studentData.grade || "-";
                  const statusClass = studentData.grade ? "gradeComplete" : "gradeInProgress";
                  firebase
                    .database()
                    .ref("users/" + studentData.user)
                    .once("value")
                    .then((studUser) => {
                      const userData = studUser.val();
                      const newRowNode = document.createElement("tr");
                      newRowNode.innerHTML = `
                          <td class="d-flex align-items-center">
                            <div class="studentAvatar mr-2 mr-sm-3"></div> 
                            <div class="gradeTableTxt">${userData.fullname}</div>
                          </td>
                          <td class="gradeTableTxt ${statusClass}">${status}</td>
                          <td class="gradeTableTxt">${grade}</td>`;
                      gradeTableBody.appendChild(newRowNode);

                      const newRowNode2 = document.createElement("tr");
                      newRowNode2.innerHTML = `
                          <td class="d-flex align-items-center">
                          <div class="studentAvatar mr-2 mr-sm-3"></div> 
                            <div class="">${userData.fullname} <i class="${statusClass}">(${status})</i></div>
                          </td>`;
                      studentTableBody.appendChild(newRowNode2);
                    });
                }
              } else {
                txtStudCount.innerHTML = 0;
              }
            });
        } else {
          alert("Invalid user");
          window.history.back();
        }
      });
  }
});

function removeDNone(element) {
  element.classList.remove("d-none");
  element.classList.add("d-block");
}

function addDNone(element) {
  element.classList.remove("d-block");
  element.classList.add("d-none");
}
