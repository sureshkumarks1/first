const formEl = document.forms.frm;

const resendOtp = document.querySelector("#resendverify");

const formotp = document.querySelector("#verify");

formotp.addEventListener("click", (e) => {
  e.preventDefault();
  const txtfirst = document.getElementById("txtfirst").value;
  const txtsecond = document.getElementById("txtsecond").value;
  const txtthird = document.getElementById("txtthird").value;
  const txtforth = document.getElementById("txtforth").value;

  if (
    txtfirst !== "" &&
    txtsecond !== "" &&
    txtthird !== "" &&
    txtforth !== ""
  ) {
    const otp = txtfirst + txtsecond + txtthird + txtforth;
    ///console.log(otp)
    const sotp = {
      otp,
    };
    callVerifyOtp(sotp);
  }
});

let formsubmitted = false;

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (formsubmitted) {
    return false;
  }

  formsubmitted = true;

  const name = document.getElementById("inputFirstName").value;
  const email = document.getElementById("inputEmail").value;
  const password = document.getElementById("inputPassword").value;
  const cpassword = document.getElementById("inputPasswordConfirm").value;

  if (name == "") {
    document.getElementById("nameerror").innerText = "Name is required";
    // document.getElementById("inputFirstName").focus()
  } else {
    document.getElementById("nameerror").innerText = "";
  }
  if (email == "") {
    document.getElementById("emailerror").innerText = "Email is required";
    // document.getElementById("inputEmail").focus()
  } else {
    document.getElementById("emailerror").innerText = "";
  }
  if (password == "") {
    document.getElementById("passworderror").innerText = "Password is required";
    // document.getElementById("inputPassword").focus()
  } else {
    document.getElementById("passworderror").innerText = "";
  }
  if (cpassword == "") {
    document.getElementById("cpassworderror").innerText =
      "Confirm Password is required";
    // document.getElementById("inputPasswordConfirm").focus()
  } else {
    document.getElementById("cpassworderror").innerText = "";
  }

  if (cpassword != "" && password !== cpassword) {
    if (password != "")
      document.getElementById("messageerror").innerText =
        "Confirm password doesn't match";
  } else {
    document.getElementById("messageerror").innerText = "";

    if (name != "" && email != "" && password != "") {
      const fromValues = {
        name,
        email,
        password,
      };

      console.log(JSON.stringify(fromValues));
      const res = await callVerify(fromValues);

      console.log("this is", res);

      if (res) {
        document.getElementById("timer").click();
        formsubmitted = true;
      }
    } else {
      formsubmitted = false;
    }
  }

  // const JsonData = JSON.stringify(fromValues)
});

async function callVerify(obj) {
  try {
    const result = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const data = await result.json();

    if (data.message == "success") {
      //
      return true;
    }
    // window.location.replace(data.url)
  } catch (error) {
    console.log(error.message);
  }
}

async function callInsert(users) {
  try {
    const result = await fetch("http://localhost:3000/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });
    const data = await result.json();
    if (data.message == "success") {
      return true;
    }
  } catch (error) {}
}

async function callVerifyOtp(otps) {
  try {
    const result = await fetch("http://localhost:3000/verifyotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(otps),
    });
    const data = await result.json();

    //console.log(data)errormessage

    if (data.message == "success") {
      /*user creation*/

      const user = {
        name: formEl.fname.value,
        email: formEl.email.value,
        password: formEl.password.value,
      };

      document.querySelector(
        "#divotpform"
      ).innerHTML = `<div  class="container innerfrm" >
            <h4>
              User Registration Successfull
            </h4>
                <a href="http://localhost:3000/login" class="btn btn-primary" >Login</a>            
          </div>`;
      const resp = await callInsert(user);
    } else {
      document.querySelector("#errormessage").innerText =
        "OTP doesn't match Try again";
      document.getElementById("txtfirst").value = "";
      document.getElementById("txtsecond").value = "";
      document.getElementById("txtthird").value = "";
      document.getElementById("txtforth").value = "";
    }
    // window.location.replace(data.url)
  } catch (error) {
    console.log(error.message);
  }
}

$("#resendverify").on("click", async function (e) {
  const user = {
    name: formEl.name.value,
    email: formEl.email.value,
    password: formEl.password.value,
  };

  const resp = await callVerify(user);

  if (resp) {
    $("#verify").show();
    $("#resendverify").hide();
    countdown.start();
  }
});

$("#exampleModal").on("hidden.bs.modal", function (e) {
  window.location.reload();
});
