allUsers()


async function allUsers(){

    const newGroupName = localStorage.getItem('newGroupName');
    const userId = localStorage.getItem('userId');

    

    let div = document.getElementById('addMember')
    let p = document.createElement('p')
    p.innerHTML = `<h4>Group Name:-${newGroupName}</h4>`
    div.append(p)


    let token = localStorage.getItem('token')
    const site = `http://localhost:3000/logIn/all-users/${userId}`
    let res = await axios.get(site, { headers: { "Authorization": token } })

    allUserDetails(res.data.allUsers)

}

function allUserDetails (data){

    console.log(data)
    const newGroupId = localStorage.getItem('newGroupId');
    const userId = localStorage.getItem('userId');

    let div = document.getElementById('users')
    div.innerHTML = ""
    // console.log(userId)
    data.forEach(users => {

        let p = document.createElement('p')
        p.className = "groupNmae"
        p.innerHTML = `<h4 id="user"> ${users.name}</h4><button type="button" class="btn btn-warning"  onclick="addInGroup(event,${users.id},${newGroupId})">Add</button>`
        // console.log(chatTitle)
        div.append(p)
    });
}

async function addInGroup (e,userId, groupId){
    console.log(userId, groupId)

    const obj = {
        userId : userId,
        groupId : groupId
    }

    let token = localStorage.getItem('token')
    const site = `http://localhost:3000/logIn/add-member`
    let res = await axios.post(site, obj, { headers: { "Authorization": token } })

    if(res.status == 200){
        e.target.parentElement.remove();
    }

    console.log(res.status)
}

document.getElementById('submit').addEventListener('click', finish)

function finish(){
    window.location.href = "chat.html"
    
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

    result.forEach((member)=>{

        let p = document.createElement('p')
        p.innerHTML = `<h4>${member.name}-<button type="button" class="btn btn-warning"  onclick="addInGroupSearch(event,${member.id})">Add</button></h4>`
        div.append(p)
    })

}

function addInGroupSearch(e , userId){
    alert("not configered")
}