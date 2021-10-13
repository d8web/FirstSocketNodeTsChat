const socket = io()

const urlSearch = new URLSearchParams(window.location.search)

const username = urlSearch.get('username')
const room = urlSearch.get('select_room')

const usernameDiv = document.getElementById('username')
usernameDiv.innerHTML = `Olá ${username} - Você está na sala ${room}`

socket.emit("select_room", {
    username,
    room
}, (messages) => {
    //console.log(response)
    messages.forEach(message => createMessage(message))
})

document.getElementById('message_input').addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        const message = event.target.value
        //console.log(message)

        const data = {
            room,
            message,
            username
        }

        socket.emit("message", data)
        event.target.value = ""
    }
})

socket.on("message", data => {
    // console.log(data)
    createMessage(data)
})

const createMessage = (data) => {
    const messageDiv = document.getElementById("messages")

    messageDiv.innerHTML += `
        <div class="new_message">
            <label>
                <strong>${data.username}</strong>
                <span>${data.text} - ${dayjs(data.createdAt).format("DD/MM HH:mm")}</span>
            </label>
        </div>
    `
}

document.getElementById("logout").addEventListener('click', e => {
    window.location.href = "index.html"
})

//console.log( username, room)
// continue to 36 min e 29 seg