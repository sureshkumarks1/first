function viewImage(e){

    const img = document.getElementById('img');

    // const img0 = document.getElementById('img0');

    
    img.src = URL.createObjectURL(e.target.files[0])

    $("#img0").attr("value","changedone");


}

function viewImage2(e){

    const img1 = document.getElementById('imgone');

    console.log("image changed",e.target.files[0])
     img1.src = URL.createObjectURL(e.target.files[0])

    $("#img1").attr("value","changedtwo");

}
function viewImage3(e){

    const img2 = document.getElementById('imgtwo');

    img2.src = URL.createObjectURL(e.target.files[0])

    $("#img2").attr("value","changedthree");

}