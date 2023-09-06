

document.getElementById('send').addEventListener('click',sendMsg)

let msg = document.getElementById('textInput')

// get data
async function sendMsg() {
   
    try {
       
        const site = `http://localhost:3000/logIn/get-data`
       
        let obj = {
            message : msg.value
        }
        let token = localStorage.getItem('token')
        let res = await axios.post(site, obj, { headers: { "Authorization": token } })

        // console.log(res.data)
        msg.value = ''
        showmsg(res.data.data.message)

    } catch (err) { console.log(err) }
}



function showmsg (msg){
    let div = document.getElementById('mesgArea')

    let p = document.createElement('p')
    p.innerHTML = `<h4>${msg}</h4>`
    div.append(p)

}