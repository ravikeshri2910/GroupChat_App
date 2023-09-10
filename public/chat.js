

const socket = io('http://localhost:3000')



document.getElementById('submit').addEventListener('click', groupname)




async function groupname(event) {
    event.preventDefault()
    const groupname = document.getElementById('groupname')
    // console.log(groupname.value)
    const obj = {
        groupname: groupname.value
    }
    let token = localStorage.getItem('token')
    const site = `http://localhost:3000/logIn/group-name`
    let res = await axios.post(site, obj, { headers: { "Authorization": token } })

    console.log(res.data.groupD.group)
    groupDetail(res.data.groupD.group)

}

function groupDetail(data) {
    let div = document.getElementById('groupsDetails')

    console.log(div)
    let p = document.createElement('p')
    p.innerHTML = `<h4>${data}</h4><button type="button" class="btn btn-warning" >Chat</button>`
    div.append(p)

}





// this is use to keep the scrollbar at the bottom when window starts
window.onload = function () {
    const div = document.getElementById("mesgArea");
    div.scrollTop = div.scrollHeight;
}

// get data


getmsg(1)

async function getmsg(id) {

    // io("http://localhost:5000")
    

    const site = `http://localhost:3000/logIn/get-data/${id}`
    let token = localStorage.getItem('token')
    let res = await axios.get(site, { headers: { "Authorization": token } })

    console.log(res)
    let idarr = []
    let msgarr = []

    let msg = res.data.data
    msg.forEach((e) => {
        idarr.push(e.id)
        msgarr.push(e.message)
    })
    localStorage.setItem('message', msgarr)
    localStorage.setItem('id', idarr)

    let div = document.getElementById('name')
    div.innerHTML = ""
    let p = document.createElement('p')
    p.innerHTML = `<p>User :- ${res.data.username}</p>`
    div.append(p)

    // opengroup(id,res.data.userId)
    allMsg(res.data.data, res.data.userId, res.data.username)
    groupDetails(res.data.groupData, res.data.userId)
    allgroupDetails(res.data.notMemeber)
    // socket.emit('new-user', {res.data.username})
    console.log(res)
}


function allgroupDetails(data) {
    let div = document.getElementById('groupsDetailsNot')
    div.innerHTML = ""
    data.forEach(element => {
        let p = document.createElement('h5')
        p.className = "groupNmae"
        p.innerHTML = `${element.group}<button type="button" class="btn btn-warning"  onclick="joingroup(event ,${element.id})">Join</button>`
        div.append(p)
    });


}

async function joingroup(e, id) {
    console.log(id)

    const site = `http://localhost:3000/logIn/join-group/${id}`
    let token = localStorage.getItem('token')
    let res = await axios.get(site, { headers: { "Authorization": token } })
    console.log(res)
    groupDetail(res.data.groupName.group)
    e.target.parentElement.remove();
}


function groupDetails(data, userId) {
    let div = document.getElementById('groupsDetails')
    div.innerHTML = ""
    // console.log(userId)
    data.forEach(element => {

        // const chatTitle = element.group

        let admin;
        if (+element.adminId == userId) {
            admin = "admin"
        } else {
            admin = ""
        }
        let p = document.createElement('p')
        p.className = "groupNmae"
        const chatTitle = element.group
        p.innerHTML = `<h4 id="admin"> ${element.group}--${admin}</h4><button type="button" class="btn btn-warning"  onclick="opengroup(${element.id},${userId})">Chat</button>`
        console.log(chatTitle)
        div.append(p)
    });
}

let flag = false;


async function opengroup(groupId, userId) {

    socket.emit('new-user', {groupId,userId})

   
    
    localStorage.setItem("groupId", groupId)
    localStorage.setItem("userId", userId)
    flag = true
    
    let token = localStorage.getItem('token')
    const site = `http://localhost:3000/logIn/group-data/${groupId}/${userId}`
    let res = await axios.get(site, { headers: { "Authorization": token } })
    console.log(res)

    //socket.emit('new-user', name)
    
    allMsg(res.data.message, res.data.groupName.group, userId)
    // div.scrollTop = div.scrollHeight;
}

socket.on('user joined',(data)=>{

    console.log(data.groupId)
    userJoined(data.groupId)

})

socket.on('chat-message',(msg)=>{

    console.log(msg)
    // userJoined(data.groupId)
    showmsgToOther(msg.message)

})

function userJoined(groupId) {
    // e.preventDefault()

    let div = document.getElementById('mesgArea')
    let p = document.createElement('p')
    p.innerHTML = `<h4>${groupId}-connected</h4>`
    p.className = "msgmargin"
    div.append(p)
    div.scrollTop = div.scrollHeight;
}

// setInterval(function () {
//     if (flag == true) {
//         let groupid = localStorage.getItem('groupId') || 1
//         // console.log("groupid" + groupid)
//         let userId = localStorage.getItem('userId')
//         // console.log("userId" + +userId)
//         opengroup(groupid, userId)
        
//     }
//     else{
//         return
//     }
// }, 1000);


function allMsg(data, groupName, userid) {
    // console.log(userid)


    let head = document.getElementById('head')
    head.innerText = groupName

    let div = document.getElementById('mesgArea')
    div.innerHTML = ""
    data.forEach(element => {
        let p = document.createElement('p')
        if (element.userId == +userid) {

            p.innerHTML = `<h4>${element.message}</h4>`
            p.className = "msgmargin"
        } else {
            p.innerHTML = `<h4> ${element.message}</h4>`
            p.className = "notyourmsgmargin"

        }
        div.append(p)
        // div.scrollTop = div.scrollHeight;
    });
    // div.scrollTop = div.scrollHeight;
}



// function localMsg(data) {
//     let div = document.getElementById('mesgArea')
//     div.innerHTML = ""
//     data.forEach(element => {
//         let p = document.createElement('p')
//         p.innerHTML = `<h4>${element}</h4>`
//         div.append(p)
//     });
// }

document.getElementById("send").addEventListener('click', sendMsg)

async function sendMsg() {
    try {

        let groupId = localStorage.getItem("groupId")
        let msg = document.getElementById('textInput')
        showmsg(msg.value)
        socket.emit('send-chat-message', msg.value)

        let obj = {
            message: msg.value
        }
        console.log(groupId)
        let token = localStorage.getItem('token')
        const site = `http://localhost:3000/logIn/send-data/${groupId}`
        let res = await axios.post(site, obj, { headers: { "Authorization": token } })

        // let oldMsg = localStorage.getItem('message')
        // let idMsg = localStorage.getItem('id')

        // let localmsg = oldMsg.split(',')
        // let localid = idMsg.split(',')

        // localmsg.push(res.data.data.message)
        // localid.push(res.data.data.id)

        // localStorage.setItem('message', localmsg)
        // localStorage.setItem('id', localid)


        msg.value = ''


        console.log(res)
        // showmsg(res.data.data.message, res.data.data.userId, res.data.data.groupId)

    } catch (err) { console.log(err) }

}




function showmsg(msg, userId, groupId) {
    let div = document.getElementById('mesgArea')
    let p = document.createElement('p')
    p.innerHTML = `<h4>${msg}</h4>`
    p.className = "msgmargin"
    div.append(p)
    div.scrollTop = div.scrollHeight;
}
function showmsgToOther(msg) {
    let div = document.getElementById('mesgArea')
    let p = document.createElement('p')
    p.innerHTML = `<h4>${msg}</h4>`
    p.className = "notyourmsgmargin"
    div.append(p)
    div.scrollTop = div.scrollHeight;
}