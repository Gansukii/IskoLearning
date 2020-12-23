const ratingContainer = document.getElementById("ratingContainer");
const reviewColumn = document.getElementById("reviewColumn");
const rowReview = document.getElementById("rowReview");
console.log(lg);

if (document.documentElement.clientWidth < lg) {
  rowReview.appendChild(ratingContainer);
} else reviewColumn.appendChild(ratingContainer);

window.onresize = () => {
  if (document.documentElement.clientWidth < lg) {
    rowReview.appendChild(ratingContainer);
  } else reviewColumn.appendChild(ratingContainer);
};
