const rightArrow = document.getElementById('arrowRight');
const leftArrow = document.getElementById('arrowLeft');
const leftArrowCat = document.getElementById('arrowLeftCat');
const rightArrowCat = document.getElementById('arrowRightCat');
const latest = document.getElementById('latest');
const myCourses = document.getElementById('myCourses');
let r = 1;
let l;
let childrenWidthLatest = 0;
let childrenWidthCourse = 0;



if (latest) {
    for (let i = 0; i < latest.children.length - 1; i++) {
        childrenWidthLatest += latest.children[i].clientWidth
    };
    if (childrenWidthLatest < latest.offsetWidth)
        rightArrow.classList.remove("d-flex");

    rightArrow.onclick = () => {
        rightScroll(leftArrow, rightArrow, latest, childrenWidthLatest);
    };
    leftArrow.onclick = () => {
        leftScroll(leftArrow, rightArrow, latest);
    };
}



if (myCourses) {
    for (let i = 0; i < myCourses.children.length - 1; i++) {
        childrenWidthCourse += myCourses.children[i].clientWidth;
    };

    if (childrenWidthCourse < latest.offsetWidth)
        rightArrowCat.classList.remove("d-flex");

    rightArrowCat.onclick = () => {
        rightScroll(leftArrowCat, rightArrowCat, myCourses, childrenWidthCourse);
    }

    leftArrowCat.onclick = () => {
        leftScroll(leftArrowCat, rightArrowCat, myCourses);
    }
}




const rightScroll = (lArrow, rArrow, rParent, cWidth) => {
    rArrow.classList.remove("d-flex");
    let scrollLimit = rParent.scrollLeft + rParent.offsetWidth
    r = rParent.scrollLeft;
    const scrollRight = setInterval(function () {
        if (r > scrollLimit) {
            r = scrollLimit;
            if (r + rParent.scrollLeft >= cWidth)
                rArrow.classList.remove("d-flex");
            else
                rArrow.classList.add("d-flex");
            lArrow.classList.add("d-flex");
            clearInterval(scrollRight);
        }
        rParent.scroll(r, 0);
        r = r + 10;
    }, 1);
}

const leftScroll = (lArrow, rArrow, rParent) => {
    lArrow.classList.remove("d-flex");
    rArrow.classList.add("d-flex");
    let scrollLimit = rParent.scrollLeft - rParent.offsetWidth
    l = rParent.scrollLeft;

    const scrollLeft = setInterval(function () {
        if (l < scrollLimit) {
            if (rParent.scrollLeft <= 0) {
                lArrow.classList.remove("d-flex");
            } else
                lArrow.classList.add("d-flex");

            clearInterval(scrollLeft);
        }
        rParent.scroll(l, 0);
        l = l - 10;
    }, 1);
}
