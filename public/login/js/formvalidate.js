// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// $('#prodform').validate({
//     rules:{
//         pname:{
//             required:true,
//             minlength:3
//         },
//         pcategory:"required",
//         productPrice:{required:true,
//         minlength:0},
//         productStock:{required:true,
//         minlength:1},
//         pdescription:"required",
//         input:"required"
//     },
//     messages:{
//         pname:{
//             required:"Please enter product Name",
//             minlength:"Minimum 3 charactor required"
//         },
//         pcategory:"Please Select product Catagory",
//         productPrice:{required:"Product price required",
//         minlength:"Minimum price required"},
//         productStock:{required:"Product price required",
//         minlength:"Minimum price required"}
//     }
// })