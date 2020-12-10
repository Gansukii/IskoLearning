const profileAvatar = document.getElementById("profileAvatar");
const profileFullName = document.getElementById("profileFullName");
const profileUserType = document.getElementById("profileUserType");
const modalFullName = document.getElementById("modalFullName");
const modalUserName = document.getElementById("modalUserName");
const imageUpload = document.getElementById("imageUpload");
const progressContainer = document.getElementById("progressContainer");
const uploadProgressBar = document.getElementById("uploadProgressBar");
const editProfileAvatar = document.getElementById("editProfileAvatar");
const btnSave = document.getElementById("btnSave");
var database = firebase.database();
let imageFile = null;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (user.photoURL) {
      editProfileAvatar.style = `background: url(${user.photoURL}) no-repeat center; background-size: cover;`;
      profileAvatar.style = `background: url(${user.photoURL}) no-repeat center; background-size: cover;`;
    }
  }
});

profileFullName.innerHTML = localStorage.getItem("fullname");
profileUserType.innerHTML = localStorage.getItem("user_type");

modalFullName.value = localStorage.getItem("fullname");
modalUserName.value = "@" + localStorage.getItem("username");

modalUserName.onkeyup = () => {
  if (modalUserName.value.charAt(0) != "@") {
    modalUserName.value = "@" + modalUserName.value;
  }
};

modalUserName.onkeypress = (e) => {
  const key = e.keyCode;
  if (key === 32) {
    e.preventDefault();
  }
};

imageUpload.onchange = (e) => {
  imageFile = e.target.files[0];
  imageUrl = URL.createObjectURL(imageFile);
  editProfileAvatar.style = `background: url(${imageUrl}) no-repeat center; background-size: cover;`;
};

btnSave.onclick = () => {
  if (modalFullName.value.trim() == "" || modalUserName.value.length < 2) {
    alert("Both fields cannot not be empty");
  } else {
    const user = firebase.auth().currentUser;
    if (user) {
      if (imageFile) {
        progressContainer.classList.remove("d-none");
        btnSave.setAttribute("disabled", "");
        let storageRef = firebase.storage().ref("profileImage/" + user.uid);
        let task = storageRef.put(imageFile);
        task.on(
          "state_changed",
          function progress(snapshot) {
            let percentage = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            uploadProgressBar.style.width = `${percentage}%`;
            uploadProgressBar.innerHTML = `Uploading image ${percentage}%`;
            if (percentage === 100)
              uploadProgressBar.innerHTML = "Upload Complete!";
          },
          function error(err) {
            console.log(err);
            alert("error uploading image" + err);
          },
          function complete() {
            uploadProgressBar.innerHTML = "Upload Complete!";
            let starsRef = firebase
              .storage()
              .ref()
              .child(`profileImage/${user.uid}`);
            starsRef.getDownloadURL().then(function (url) {
              database.ref("users/" + user.uid).update({
                photoUrl: url,
              });
              user
                .updateProfile({
                  photoURL: url,
                })
                .then(function () {
                  alert("Updated profile will be shown in a few seconds");
                  location.reload();
                })
                .catch(function (error) {
                  console.log(error);
                });
            });
          }
        );
      }

      database
        .ref("users/" + user.uid)
        .update({
          username: modalUserName.value.slice(1),
          fullname: modalFullName.value,
        })
        .then(() => {
          if (!imageFile) {
            alert("Updated profile will be shown in a few seconds");
            location.reload();
          }
        });
    } else {
      alert("User error. Please try again");
    }
  }
};

// request.auth != null;
