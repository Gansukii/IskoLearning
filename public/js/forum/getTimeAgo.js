function getTimeAgo(dateDiff) {
  let hh = Math.floor(dateDiff / 3600);
  dateDiff -= hh * 3600;
  let mm = Math.floor(dateDiff / 60);
  dateDiff -= mm * 60;
  let ss = Math.floor(dateDiff);
  dateDiff -= ss;
  let timeAgo;
  if (hh < 1 && mm < 1) {
    timeAgo = "few seconds ago";
  } else if (hh < 1) {
    if (mm == 1) timeAgo = "1 minute ago";
    else timeAgo = mm.toString() + " minutes ago";
  } else if (hh < 24) {
    timeAgo = hh.toString() + " hours ago";
  } else if (hh <= 48) {
    timeAgo = "1 day ago";
  } else {
    var days = Math.floor(hh / 24);
    timeAgo = days.toString() + " days ago";
  }
  return timeAgo;
}
