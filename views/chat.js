

document.getElementById('send').addEventListener('click', sendMsg)

let msg = document.getElementById('textInput')

setInterval(function () {
    getmsg()
}, 1000);

// this is use to keep the scrollbar at the bottom when window starts
window.onload = function () {
    const myDiv = document.getElementById("mesgArea");
    myDiv.scrollTop = myDiv.scrollHeight;
}

// get data
async function sendMsg() {

    try {

        const site = `http://localhost:3000/logIn/send-data`

        let obj = {
            message: msg.value
        }
        let token = localStorage.getItem('token')
        let res = await axios.post(site, obj, { headers: { "Authorization": token } })

        // console.log(res.data)
        msg.value = ''
        showmsg(res.data.data.message)

    } catch (err) { console.log(err) }
}

getmsg()

async function getmsg() {

    const site = `http://localhost:3000/logIn/get-data`
    let token = localStorage.getItem('token')
    let res = await axios.get(site, { headers: { "Authorization": token } })
    // console.log(res.data.data)
    allMsg(res.data.data)
}

function allMsg(data) {
    let div = document.getElementById('mesgArea')
    div.innerHTML = ""
    data.forEach(element => {
        let p = document.createElement('p')
        p.innerHTML = `<h4>${element.message}</h4>`
        div.append(p)
    });
}


function showmsg(msg) {
    let div = document.getElementById('mesgArea')
    let p = document.createElement('p')
    p.innerHTML = `<h4>${msg}</h4>`
    div.append(p)
    div.scrollTop = div.scrollHeight;
}