
const formEl = document.forms.frm;

const formotp = document.querySelector('#verify');

formotp.addEventListener('click',(e)=>{
    e.preventDefault();
    const txtfirst = document.getElementById("txtfirst").value
    const txtsecond = document.getElementById("txtsecond").value
    const txtthird = document.getElementById("txtthird").value
    const txtforth = document.getElementById("txtforth").value

    

    if(txtfirst!=="" && txtsecond!=="" && txtthird!=="" && txtforth!==""){
        const otp = txtfirst+txtsecond+txtthird+txtforth
        console.log(otp)
        const sotp = {
            otp
        }
        callVerifyOtp(sotp)
    }
    

})


// const formotp = document.forms.otpverify;
/*
formotp.addEventListener('submit', (e)=>{
    e.preventDefault();
    const txtfirst = document.getElementById("txtfirst").value
    const txtsecond = document.getElementById("txtsecond").value
    const txtthird = document.getElementById("txtthird").value
    const txtforth = document.getElementById("txtforth").value

    console.log("working")

    // if(txtfirst!=="" && txtsecond!=="" && txtthird!=="" && txtforth!==""){
    //     const otp = txtfirst+txtsecond+txtthird+txtforth
    //     console.log(otp)
    // }
});
*/
// const btn = document.querySelector('#submitbtn')

// btn.addEventListener("click",()=>{
//     console.log("working")
// })


formEl.addEventListener('submit', async (e)=>{
e.preventDefault();



const name = document.getElementById("inputFirstName").value
const email = document.getElementById("inputEmail").value
const password = document.getElementById("inputPassword").value
const cpassword = document.getElementById("inputPasswordConfirm").value


if(name==""){
    document.getElementById("nameerror").innerText = "Name is required"
    // document.getElementById("inputFirstName").focus()
} else{document.getElementById("nameerror").innerText = ""}
if(email==""){
    document.getElementById("emailerror").innerText = "Email is required"
    // document.getElementById("inputEmail").focus()
}else{
    document.getElementById("emailerror").innerText = ""
}
if(password==""){
    document.getElementById("passworderror").innerText = "Password is required"
    // document.getElementById("inputPassword").focus()
}else{
    document.getElementById("passworderror").innerText = ""
}
if(cpassword==""){
    document.getElementById("cpassworderror").innerText = "Confirm Password is required"
    // document.getElementById("inputPasswordConfirm").focus()
}else{
    document.getElementById("cpassworderror").innerText = ""
}

 if(cpassword != ''  && password!==cpassword){
    if(password!="") 
    document.getElementById("messageerror").innerText = "Confirm password doesn't match"
 }else{
    document.getElementById("messageerror").innerText = "";

   const fromValues = {
    name,email,password}

    //console.log(JSON.stringify(fromValues))
    const res = await callVerify(fromValues)

    console.log(res)
    if(res){
        document.getElementById('timer').click()
        return;
    }
   

 }

 

// const JsonData = JSON.stringify(fromValues)

})


async function callVerify(obj){
    try {
        
        const result = await  fetch("http://localhost:3000/register", {
              method:"POST",
              headers:{
                  'Content-Type': 'application/json'
              },
              body:JSON.stringify(obj)
          })
          const data  = await result.json()
          console.log(data)
          if(data.message == 'success'){
              //
              return true;
          }
           // window.location.replace(data.url)
          
  
      } catch (error) {
          console.log(error.message)        
      }
}

async function callVerifyOtp(otps){
    try {
        
        const result = await  fetch("http://localhost:3000/verifyotp", {
              method:"POST",
              headers:{
                  'Content-Type': 'application/json'
              },
              body:JSON.stringify(otps)
          })
          const data  = await result.json()

          //console.log(data)

          if(data.message == 'success')
            document.querySelector("#divotpform").innerHTML = `<div  class="container innerfrm" >
            <h4>
              OTP VERIFIED SUCCESSFULLY
            </h4>
                <a href="http://localhost:3000/login" class="btn btn-primary" >Login</a>            
          </div>`
           // window.location.replace(data.url)
          
  
      } catch (error) {
          console.log(error.message)        
      }
}


