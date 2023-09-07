

document.getElementById('send').addEventListener('click', sendMsg)

let msg = document.getElementById('textInput')



// this is use to keep the scrollbar at the bottom when window starts
window.onload = function () {
    const div = document.getElementById("mesgArea");
    div.scrollTop = div.scrollHeight;
}

// get data


getmsg()

async function getmsg() {

    const site = `http://localhost:3000/logIn/get-data`
    let token = localStorage.getItem('token')
    let res = await axios.get(site, { headers: { "Authorization": token } })

    let idarr = []
    let msgarr = []

    let msg = res.data.data
    msg.forEach((e) => {
        idarr.push(e.id)
        msgarr.push(e.message)
    })
    localStorage.setItem('message', msgarr)
    localStorage.setItem('id', idarr)
    allMsg(res.data.data)
}



setInterval(function () {
    let oldMsg = localStorage.getItem('message')
    let msglocal = oldMsg.split(",")
    
    // if message in local stoarage is more than 50 then it removes first 5 message from loacalstorage
    if(msglocal.length > 50){

        for(let i = 45;i<50;i++){
            msglocal.shift()
        }
        localStorage.setItem('message',msglocal)
    }
    localMsg(msglocal)
}, 1000);

function localMsg(data) {
    let div = document.getElementById('mesgArea')
    div.innerHTML = ""
    data.forEach(element => {
        let p = document.createElement('p')
        p.innerHTML = `<h4>${element}</h4>`
        div.append(p)
    });
}

async function sendMsg() {
    try {

        const site = `http://localhost:3000/logIn/send-data`

        let obj = {
            message: msg.value
        }
        let token = localStorage.getItem('token')
        let res = await axios.post(site, obj, { headers: { "Authorization": token } })

        let oldMsg = localStorage.getItem('message')
        let idMsg = localStorage.getItem('id')

        let localmsg = oldMsg.split(',')
        let localid = idMsg.split(',')

        localmsg.push(res.data.data.message)
        localid.push(res.data.data.id)

        localStorage.setItem('message', localmsg)
        localStorage.setItem('id', localid)


        msg.value = ''
        showmsg(res.data.data.message)

    } catch (err) { console.log(err) }
}


function allMsg(data) {
    let div = document.getElementById('mesgArea')
    div.innerHTML = ""
    data.forEach(element => {
        let p = document.createElement('p')
        p.innerHTML = `<h4>${element.message}</h4>`
        div.append(p)
    });
    div.scrollTop = div.scrollHeight;
}


function showmsg(msg) {
    let div = document.getElementById('mesgArea')
    let p = document.createElement('p')
    p.innerHTML = `<h4>${msg}</h4>`
    div.append(p)
    div.scrollTop = div.scrollHeight;
}