

document.getElementById('submit').addEventListener("click", sinUpData)

async function sinUpData(event) {
    try {
        event.preventDefault()
        
        let name = document.getElementById('name')
        let email = document.getElementById('email')
        console.log(email)

        // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        const emailCheck = /^[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,4}$/


        


        function validateEmail(email) {
          return emailCheck.test(email);
        }
        
        // Example usage:
        // const email = 'example@email.com';
        if (validateEmail(email.value)) {
          console.log('Email is valid');
        } else {
            alert("Enter a valid email")
            return
        }
        




        let password = document.getElementById('password')
        let phone  = document.getElementById('pnone')

        if (!name.value || !email.value || !password.value || !phone.value) {
            return alert('Fill the form properly')
        }
        let user = {
            name: name.value,
            email: email.value,
            password: password.value,
            phone : phone.value
        }


        // console.log(user)

        // let res = await axios.post("http://3.80.172.222:4000/user/expense-sinup-data", sinUpData)
        let res = await axios.post("http://localhost:3000/user/chat-sinup-data", user)

        name.value = "";
        email.value = ""
        password.value = ""
        phone.value = ""

        console.log(res)

        if (res.status == 201) {
            alert("Account registered")
            window.location.href="login.html"
        }
        // console.log(res)Request failed with status code 400

    } catch (err) {
        // console.log(err)
        if (err.message === 'Request failed with status code 400') {
            alert("User already exists")
        }
        // console.log('msg'+) 
    }
}
