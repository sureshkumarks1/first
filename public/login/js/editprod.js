$(document).ready(function () {
  let imageLoation = document.getElementById("place");

  let cropper;
  let $image = $("#image");
  let $imgContainer = $(".img-container");
  let $imgPlace = $(".img-container img");

  $("#file-input").change(function (event) {
    let files = event.target.files;

    let done = function (url) {
      $image.attr("src", url);
      $image.css("width", "100%");
      $("#cropModal").modal("show");
    };
    let reader;
    let file;
    if (files && files.length > 0) {
      file = files[0];
      if (URL) {
        done(URL.createObjectURL(file));
      } else if (FileReader) {
        reader = new FileReader();
        reader.onload = function (event) {
          done(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
    // $("#file-input").val("");
  });

  $("#cropModal")
    .on("shown.bs.modal", function () {
      $imgContainer.css({
        width: "auto",
        height: "auto",
        "max-height": "60vh",
        overflow: "hidden",
        margin: "0 auto",
      });

      cropper = new Cropper($image[0], {
        responsive: true,
        restore: false,
        guides: false,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
      });
    })
    .on("hidden.bs.modal", function () {
      $("#file-input").val("");
      cropper.destroy();
      cropper = null;
    });

  $("#cropButton").click(function () {
    if (cropper) {
      let canvas = cropper.getCroppedCanvas();
      canvas.toBlob(function (blob) {
        let url = URL.createObjectURL(blob);
        let img = document.createElement("img");
        img.src = url;
        img.style = "margin:6px";
        img.width = "100";
        img.height = "100";
        imageLoation.appendChild(img);

        const file = new File([blob], "image.jpeg", {
          type: blob.type,
          lastModified: new Date().getTime(),
        });
        // console.log(file);
        files.push(file);
      });
      cropper.destroy();
      cropper = null;
      $("#cropModal").modal("hide");
    }
  });

  $("#closeBtn").on("click", () => {
    $("#file-input").val("");
    $("#cropModal").modal("hide");
  });
  $("#crossBtn").on("click", () => {
    $("#file-input").val("");
    $("#cropModal").modal("hide");
  });
});
