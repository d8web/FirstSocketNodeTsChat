import { io } from "./http";

interface RoomUser {
    socket_id: string,
    username: string,
    room: string
}

interface Message {
    room: string,
    username: string
    text: string,
    createdAt: Date,
}

const users: RoomUser[] = []

const messages: Message[] = []

io.on("connection", socket => {
    socket.on('select_room', (data, callback) => {
        
        socket.join(data.room)

        const usersInRoom = users.find(user => user.username === data.username && user.room === data.room)

        if(usersInRoom) {
            usersInRoom.socket_id = socket.id
        } else {
            users.push({
                room: data.room,
                username: data.username,
                socket_id: socket.id
            })
        }

        const messagesRoom = getMessagesRoom(data.room)
        callback(messagesRoom)

        // console.log(users)
    })

    socket.on('message', data => {
        // Salvar as mensagens
        const message: Message = {
            room: data.room,
            username: data.username,
            text: data.message,
            createdAt: new Date()
        }

        messages.push(message)

        // Enviar mensagem para usuários da sala
        io.to(data.room).emit("message", message)
    })
})

const getMessagesRoom = ( room: string ) => {
    const messagesRoom = messages.filter(message => message.room === room)
    return messagesRoom
}