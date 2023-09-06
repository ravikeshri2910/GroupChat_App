

document.getElementById('send').addEventListener('click',getmsg)

let msg = document.getElementById('textInput')

async function getmsg(){

    console.log(msg.value)
}