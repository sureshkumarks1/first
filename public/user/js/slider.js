
$(function (){
    $(".xzoom, .xzoom-gallery").xzoom({
        zoomWidth:300,
        tint:"#333",
        Xoffset:15,
    });

    $("#one").click();
});


/*
const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

imgBtns.forEach((imgItem) => {
    imgItem.addEventListener('click', (event) => {
        event.preventDefault();
        imgId = imgItem.dataset.id;
        console.log(imgId)
        slideImage();
    });
});
///////////////////////////////

///////////////////////////////

function slideImage(){
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

    document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
}

window.addEventListener('resize', slideImage);
*/


            // let options = {
            //     zoom: {
            //         width: 100,
            //         height: 100,
            //         zIndex: 600
            //     },
            //     overlay: {
            //         opacity: 0.65,
            //         zIndex: 500,
            //         backgroundColor: '#000000',
            //         fade: true
            //     },
            //     detail: {
            //         zIndex: 600,
            //         margin: {
            //             top: 0,
            //             left: 10
            //         },
            //         fade: true
            //     }
            // };
            
                // $('#imgZoom').mooZoom(options);
               

               