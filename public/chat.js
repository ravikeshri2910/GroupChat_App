

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
    groupname.value = ""
    console.log(res.data)


    localStorage.setItem("newGroupName", res.data.groupD.group)
    localStorage.setItem("newGroupId", res.data.groupD.id)

    window.location.href = "addGroupMem.html"
    // groupDetail(res.data.groupD.group)

}

function groupDetail(data) {
    let div = document.getElementById('groupsDetails')

    getmsg(1)

    console.log(div)
    let p = document.createElement('p')
    p.className = "groupNmae"
    p.innerHTML = `<h4  id="admin">${data}--</h4><button type="button" class="btn btn-warning" >Chat</button>`
    div.append(p)

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

        if (admin == "admin") {
            p.innerHTML = `<h4 id="admin"> ${element.group}--${admin}</h4><button type="button" class="btn btn-warning"  onclick="opengroup(${element.id},${userId})">Chat</button>--<button type="button" class="btn btn-danger"  onclick="openAddmember(${element.id},${userId})">Add member</button>`

        } else {
            p.innerHTML = `<h4 id="admin"> ${element.group}</h4><button type="button" class="btn btn-warning"  onclick="opengroup(${element.id},${userId})">Chat</button>`
        }
        console.log(chatTitle)
        div.append(p)
    });
}

function openAddmember(groupId, userId ) {
    console.log(groupId, userId )
    localStorage.setItem("groupId", groupId)
    // localStorage.setItem("newGroupName", res.data.groupD.group)
    // localStorage.setItem("newGroupId", res.data.groupD.id)
    window.location.href = "./addGroupMem.html"
}



// this is use to keep the scrollbar at the bottom when window starts
window.onload = function () {
    const div = document.getElementById("mesgArea");
    div.scrollTop = div.scrollHeight;
}

// get data


getmsg()

async function getmsg(id) {

    // io("http://localhost:5000")


    const site = `http://localhost:3000/logIn/get-data/${id}`
    let token = localStorage.getItem('token')
    let res = await axios.get(site, { headers: { "Authorization": token } })



    // let msg = res.data.data
    // msg.forEach((e) => {
    //     idarr.push(e.id)
    //     msgarr.push(e.message)
    // })
    // localStorage.setItem('message', msgarr)
    console.log('res.data.username', res.data.username)
    localStorage.setItem('sender', res.data.username)
    localStorage.setItem("userId", res.data.userId)

    let div = document.getElementById('name')
    div.innerHTML = ""
    let p = document.createElement('p')
    p.innerHTML = `<p>User :- ${res.data.username}</p>`
    div.append(p)

    const name = res.data.username.split(" ")
    console.log('name', name[0])

    // opengroup(id,res.data.userId)
    allMsg(res.data.data, res.data.userId, res.data.username)
    groupDetails(res.data.groupData, res.data.userId)
    allgroupDetails(res.data.notMemeber)
    // socket.emit('new-user', {res.data.username})
    console.log('whole res', res)
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



let flag = false;


async function opengroup(groupId, userId) {

    socket.emit('new-user', { groupId, userId })

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

socket.on('user joined', (data) => {

    console.log(data.groupId)
    // userJoined(data.groupId)

})

socket.on('chat-message', (msg) => {

    console.log(msg.groupId)

    let groupId = localStorage.getItem('groupId')
    // userJoined(data.groupId)
    if (msg.groupId == groupId) {
        console.log('same')
        showmsgToOther(msg.message, msg.name)
    }

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



function allMsg(data, groupName, userid) {
    // console.log(userid)

    const front = localStorage.getItem('sender')
    console.log('front' + front)

    let head = document.getElementById('head')
    head.innerText = groupName

    let div = document.getElementById('mesgArea')
    div.innerHTML = ""
    data.forEach(element => {
        console.log(element.sender) //t
        let p = document.createElement('p')
        if (element.userId == +userid) {

            p.innerHTML = `<h4>${element.message}</h4>`
            p.className = "msgmargin"
        } else {
            p.innerHTML = `<h4>${element.sender}-${element.message}</h4>`
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
        let username = localStorage.getItem("sender")
        let msgValue = msg.value

        if (!msgValue) {
            return
        }

        showmsg(msgValue)

        socket.emit('send-chat-message', { msgValue, username, groupId })

        let obj = {
            message: msgValue,
            sender: username
        }
        // console.log(groupId)
        let token = localStorage.getItem('token')
        const site = `http://localhost:3000/logIn/send-data/${groupId}`
        let res = await axios.post(site, obj, { headers: { "Authorization": token } })


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

function showmsgToOther(msg, name) {
    let div = document.getElementById('mesgArea')
    let p = document.createElement('p')
    p.innerHTML = `<h4>${name}-${msg}</h4>`
    p.className = "notyourmsgmargin"
    div.append(p)
    div.scrollTop = div.scrollHeight;
}

document.getElementById('search').addEventListener('click', search)

async function search(event){
     event.preventDefault()

    const searchInput =  document.getElementById('searchInput').value
    console.log(searchInput)
    
    const obj = {
        searchInput:searchInput
    }

    let token = localStorage.getItem('token')
    const site = `http://localhost:3000/logIn/search`
    let res = await axios.post(site, obj, { headers: { "Authorization": token } })

    console.log(res.data.searchDetails)

    const result= res.data.searchDetails

    let div = document.getElementById('searchMember')
    div.innerHTML = ""

    result.forEach((member)=>{

        let p = document.createElement('p')
        p.innerHTML = `<h4>${member.name}-<button type="button" class="btn btn-warning"  onclick="addInGroupSearch(event,${member.id})">Add</button></h4>`
        div.append(p)
    })

}

document.getElementById('logout').addEventListener('click', logOut)

function logOut(){
    localStorage.clear()
    window.location.href = './login.html'
}
