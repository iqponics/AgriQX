const { getUser } = require('./socketUtils');

const registerChatHandlers = (io, socket) => {
    socket.on("sendMessage", ({ _id, senderId, receiverIds, text, conversationId }) => {
        try {
            // console.log(`[socket] sendMessage received from ${senderId} for conversation ${conversationId}`);

            if (!Array.isArray(receiverIds)) {
                console.error("[socket] receiverIds is not an array:", receiverIds);
                return;
            }

            receiverIds.forEach((receiverId) => {
                const user = getUser(receiverId);
                if (user) {
                    io.to(user.socketId).emit("getMessage", {
                        _id,
                        senderId,
                        text,
                        conversationId,
                        createdAt: new Date(),
                    });
                    // console.log(`[socket] Message delivered to user ${receiverId} (socket: ${user.socketId})`);
                } else {
                    // console.log(`[socket] User ${receiverId} not found (offline) for message delivery.`);
                }
            });
        } catch (error) {
            console.error("[socket] Error sending message:", error);
        }
    });
};

module.exports = registerChatHandlers;
