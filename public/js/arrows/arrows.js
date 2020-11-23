const rightArrow = document.getElementById('arrowRight');
const latest = document.getElementById('latest');

rightArrow.onclick = () => {
    let x = 1;

    const scrollRight = setInterval(function () {
        if (x > latest.offsetWidth) {
            clearInterval(scrollRight);
        }
        latest.scroll(x, 0);
        x = x + 10;
    }, 1);




}
