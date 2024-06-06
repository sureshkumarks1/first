// const formel = document.forms.loginfrm;
const formel = document.querySelector("form");

formel.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = formel.email.value;

  const password = formel.password.value;
  const formData = {
    email,
    password,
  };

  if (!email) {
    document.getElementById("emailmessage").innerText = "Email requried";
  } else {
    document.getElementById("emailmessage").innerText = "";
  }
  if (!password) {
    document.getElementById("passwordmessage").innerText = "Password requried";
  } else {
    document.getElementById("passwordmessage").innerText = "";
  }
  if (email && password) {
    try {
      const res = await fetch("http://localhost:3000/admin/verify", {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); //"Invalid Credentials"

      if (data.message == "success") {
        window.location.replace("http://localhost:3000/admin/home", {
          name: "admin",
        });
      } else if (data.message == "nouser") {
        document.getElementById("messageerr").innerText =
          "Email id doesn't exist";
      } else if (data.message == "passwordmismatch") {
        document.getElementById("messageerr").innerText =
          "Password is not correct Try again";
      } else {
        console.log("not working");
      }
    } catch (error) {}
  }
});
