
import { socketIO } from 'socket.io-client';
const socketIO = io.connect('http://localhost:3000');

socketIo.on('notification', (data) => {
    if (data.userId === loggedInUserId) {
        console.log(`Notification received: ${data.message}`);
        // Display the notification to the user
        displayNotification(data.message);
    }
});
export default socketIO;