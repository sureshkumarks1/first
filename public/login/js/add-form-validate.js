$().ready(function () {
  $("#addAddressForm").validate({
    wrapper: "span",
    errorPlacement: function (error, element) {
      console.log(element);
      error.css({
        "padding-left": "10px",
        "margin-right": "20px",
        "padding-bottom": "2px",
      });
      error.addClass("arrow");
      error.insertAfter(element);
    },
    // In 'rules' user have to specify all the
    // constraints for respective fields
    rules: {
      firstName: {
        required: true,
        minlength: 2, // For length of lastname
      },
      lastName: {
        required: true,
        minlength: 2, // For length of lastname
      },
    },
    // In 'messages' user have to specify message as per rules
    messages: {
      firstName: " Please enter your firstname",
      lastName: " Please enter your lastname",
    },
  });
});
