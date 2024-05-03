      
      let image = document.getElementById('image');
      let input1 = document.getElementById('input1');
      let input2 = document.getElementById('input2');
      let input3 = document.getElementById('input3');
      
      let $modal = $('#modal');
      let cropper;


      

      input1.addEventListener('change', function (e) {
        let files = e.target.files[0];

        let allowedTypes = ['image/jpeg', 'image/png'];

        if (!allowedTypes.includes(files.type)) {
           $.alert('Invalid file type. Please upload a JPEG, PNG, or PDF file.');
           document.getElementById('input').value = '';
        }

        let done = function (url) {
          input.value = '';
          image.src = url;
          
          $modal.modal('show');

        };
        let reader;
        let file;
        let url;

        if (files && files.length > 0) {
          file = files[0];

          if (URL) {
            done(URL.createObjectURL(file));
          } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function (e) {
              done(reader.result);
            };
            reader.readAsDataURL(file);
          }
        }
      });

      $modal.on('shown.bs.modal', function () {
        cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 3,
        });
      }).on('hidden.bs.modal', function () {
        cropper.destroy();
        cropper = null;
      });

      document.getElementById('crop').addEventListener('click', function () {
   
        let canvas;

        $modal.modal('hide');

        if (cropper) {
          canvas = cropper.getCroppedCanvas({
            width: 160,
            height: 160,
          });

         
        //   canvas.toBlob(function (blob) {
        //     const url = URL.createObjectURL(blob);
        //     console.log(url)
        //     let reader = new FileReader();
        //     reader.readAsDataURL(blob)


        
            
        //   });
        var dataUrl = canvas.toDataURL('image/jpeg');
        var bytes = dataUrl.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataUrl.split(',')[1]) :
            (window).unescape(dataUrl.split(',')[1]);
            var mime = dataUrl.split(',')[0].split(':')[1].split(';')[0];
            var max = bytes.length;
            var ia = new Uint8Array(max);
            for (var i = 0; i < max; i++) {
            ia[i] = bytes.charCodeAt(i);
            }

            var newImageFileFromCanvas = new File([ia], 'fileName.jpg', { type: mime });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(newImageFileFromCanvas);
            input.files = dataTransfer.files;

        }
        
      });
    
//   $('#prodform').on('submit', function(e){
//     e.preventDefault()

    
//     $name = document.getElementById('pname').value
//     $cat = document.getElementById('pcategory').value
//     $img = document.getElementById('input').value
//     $price = document.getElementById('productPrice').value
//     $stock = document.getElementById('productStock').value
//     $desc = document.getElementById('pdescription').value

//     const newData = {
//         name: $name,
//         category:$cat,
//         image:$img,
//         price:$price,
//         stock:$stock,
//         description:$desc
//     }
//      console.log("the Form is :", newData)

//     $.ajax({
//         type:"POST",
//         url:'http://127.0.0.1:3000/admin/products/insertprod',
//         data :newData ,
//         dataType:"json",
//         cache:false,
//         processData:false,
//         contentType:"multipart/form-data",
//         success:(response)=>{
//             if(response.status==1){
//                 $.alert('Success'+response.message)
//             }
//         }
//     })

//   });