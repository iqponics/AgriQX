const jwt = require('jsonwebtoken');
const socketUtils = require('./socketUtils');
const registerChatHandlers = require('./chatHandlers');
const registerCallHandlers = require('./callHandlers');

const initializeSocket = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            if (!token) return next(new Error('Authentication error: No token provided'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id || decoded._id;
            socket.userEmail = decoded.email;
            socket.userName = decoded.username || decoded.name || 'Unknown';
            next();
        } catch (err) {
            console.error('Socket authentication error:', err);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on("connection", (socket) => {
        // console.log(`User connected: ${socket.userName} (${socket.userId})`);

        socketUtils.addUser(socket.userId, socket.id, socket.userName);
        io.emit("getUsers", Array.from(socketUtils.users.values()));

        socket.on("addUser", (userId) => {
            if (!socketUtils.users.has(userId)) {
                socketUtils.addUser(userId, socket.id, socket.userName);
                io.emit("getUsers", Array.from(socketUtils.users.values()));
            }
        });

        // Register modular handlers
        registerChatHandlers(io, socket);
        registerCallHandlers(io, socket);

        socket.on("disconnect", () => {
            // console.log("A user disconnected.");
            let disconnectedUserId = null;
            for (let [userId, user] of socketUtils.users) {
                if (user.socketId === socket.id) {
                    disconnectedUserId = userId;
                    break;
                }
            }

            if (disconnectedUserId) {
                for (let [callId, call] of socketUtils.activeCalls) {
                    if (call.participants.includes(disconnectedUserId)) {
                        if (call.timeoutId) clearTimeout(call.timeoutId);
                        call.participants.forEach(pid => {
                            if (pid !== disconnectedUserId) {
                                const p = socketUtils.getUser(pid);
                                if (p) io.to(p.socketId).emit("call:ended", { callId, endedBy: disconnectedUserId, reason: "disconnect" });
                                socketUtils.updateUserCallState(pid, 'idle');
                            }
                        });
                        socketUtils.activeCalls.delete(callId);
                    }
                }
            }

            socketUtils.removeUser(socket.id);
            io.emit("getUsers", Array.from(socketUtils.users.values()));
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
    });
};

module.exports = initializeSocket;
