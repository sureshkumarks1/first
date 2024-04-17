const formEl = document.forms.loginfrm

formEl.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const formData = new FormData(formEl)
    const jsonData = JSON.stringify(Object.fromEntries(formData))
	//console.log(jsonData)

 await fetch('http://127.0.0.1:3000/login', {
  method: 'POST',
  body:jsonData,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  }
}).then((response)=> response.json())
.then((data)=>{
    if(data.data.errors){
        document.getElementById('errors').innerText = data.data.errors
    } else{

     if ( data.data.url) {
        window.location.href = data.data.url;
        return;
     } else {
        console.log("User name doesn't exists")
        return;
     }
    }
}

)



/*if ( response.result.url) {
    window.location.href = response.result.url;
    return;
 }*/

});