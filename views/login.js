
document.getElementById('login').addEventListener("click",logInData)
async function logInData(event) {
    try {
        event.preventDefault()
        console.log("here")


        let email = document.getElementById('email')
        let password = document.getElementById('password')

        if (!email.value || !password.value) {
            return alert('Fill the form properly')
        }
        let logInData = {

            email: email.value,
            password: password.value
        }


        let res = await axios.post("http://localhost:3000/user/chat-login-data", logInData)


        email.value = ""
        password.value = ""


        if (res.status == 201) {
         
            localStorage.setItem('token', res.data.token)
         alert("login done")
            // window.location.href = "expenseData.html"
        }
        if (res.status == 404) {
         
            alert("Wrong email")
           
        }

        // console.log(res)Request failed with status code 400

    } catch (err) {
        // console.log(err)
        if (err.message === 'Request failed with status code 401') {
            alert("Password wrong")
        }
        if (err.message === 'Request failed with status code 404') {
            alert("Incoorrect Email")
        }
        // console.log('msg'+) 
    }
}


