document.addEventListener('DOMContentLoaded', function () {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.swiper', {
            loop: true,
            autoplay: { delay: 4000 },
            pagination: { el: '.swiper-pagination' }
        });
    }
});
