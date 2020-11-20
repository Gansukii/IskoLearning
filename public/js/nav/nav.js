const search = document.getElementById('search');
var lg = 992;

window.onresize = () => {
    if (document.documentElement.clientWidth < lg) {
        if (!search.classList.contains('col-8')) {
            search.classList.add('col-8')
        }
    } else
        search.classList.remove('col-8')
}
if (document.documentElement.clientWidth < lg) {
    if (document.documentElement.clientWidth < lg) {
        if (!search.classList.contains('col-8')) {
            search.classList.add('col-8')
        }
    } else
        search.classList.remove('col-8')
}