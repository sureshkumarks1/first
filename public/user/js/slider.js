const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

imgBtns.forEach((imgItem) => {
    imgItem.addEventListener('click', (event) => {
        event.preventDefault();
        imgId = imgItem.dataset.id;
        slideImage();
    });
});

function slideImage(){
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

    document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
}

window.addEventListener('resize', slideImage);

const options1 = {
    width: 100,
    zoomWidth: 100,
    offset: {vertical: 0, horizontal: 15}
};

// If the width and height of the image are not known or to adjust the image to the container of it
const options2 = {
    fillContainer: true,
    offset: {vertical: 0, horizontal: 15}
};

new ImageZoom(document.getElementById("img-container"), options2);