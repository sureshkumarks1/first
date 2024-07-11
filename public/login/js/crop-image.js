let cropper;
let $image = $("#image");
let $imageDisplay1 = $("#imageDisplay1");
let $imageDisplay2 = $("#imageDisplay2");
let $imageDisplay3 = $("#imageDisplay3");

$("#input3").change(function (event) {
  var files = event.target.files;
  var done = function (url) {
    $imageDisplay3.attr("src", url);
  };
  var reader;
  var file;
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
});

$("#input1").change(function (event) {
  var files = event.target.files;
  var done = function (url) {
    $imageDisplay1.attr("src", url);
  };
  var reader;
  var file;
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
});

$("#input2").change(function (event) {
  var files = event.target.files;
  var done = function (url) {
    $imageDisplay2.attr("src", url);
  };
  var reader;
  var file;
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
});

$("#cropModal").on("hidden.bs.modal", function () {
  cropper.destroy();
  cropper = null;
});

$("#cropButton").click(function () {
  if (cropper) {
    var canvas = cropper.getCroppedCanvas();
    canvas.toBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      $imageDisplay3.attr("src", url);

      // You can also upload the cropped image blob to the server using FormData and AJAX
      // var formData = new FormData();
      // formData.append('croppedImage', blob);
      // $.ajax('/path/to/upload', {
      //     method: 'POST',
      //     data: formData,
      //     processData: false,
      //     contentType: false,
      //     success: function(response) {
      //         console.log('Upload success');
      //     },
      //     error: function(response) {
      //         console.log('Upload error');
      //     }
      // });
    });
    $("#cropModal").modal("hide");
  }
});
