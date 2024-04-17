
alert('asdfas')
  const formEl = document.forms.loginfrm;
  const user = document.forms.loginfrm.email;

  user.addEventListener('click',()=>{
    alert('clicked')
  })
  //const formEl = document.querySelector("form");
  const formBtn = document.querySelector("form button");
  

  

  function validateform(event) {
    event.preventDefaulst();
    const formData = new FormData(formEl);

    const jsonData = JSON.stringify(Object.entries(formData));

    console.log(jsonData);

    //var email = document.form.email.value;
    //var password = document.form.password.value;
    //var validRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/;
    /*
      if (email == null || email == "") {
        alert("Please enter an email address ");
        document.form.email.focus();
        return false;
      } else if (email.match(validRegex)) {
      } else {
        alert("Invalid email address!");
        document.form.email.focus();
        return false;
      }
      if (password == "" || password == null) {
        alert("Please enter the password");
        document.form.password.focus();
        return false;
      }*/
  }
  formEl.addEventListner("submit", (e)=>{
    //e.preventDefault()
    console.log('form submitted');
  });
  formBtn.addEventListener('click',(e)=>{
    alert('clicked')
  })


  /*fetch("/login", {
    method: "GET",
    body: jsonData,
  });
  */
