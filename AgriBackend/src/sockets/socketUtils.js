const users = new Map();
const activeCalls = new Map();

const socketUtils = {
    users,
    activeCalls,

    addUser: (userId, socketId, name = 'Unknown') => {
        try {
            users.set(userId, { userId, socketId, callState: 'idle', name });
            // console.log(`User ${userId} (${name}) added with socketId ${socketId}`);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    },

    removeUser: (socketId) => {
        try {
            for (let [userId, user] of users) {
                if (user.socketId === socketId) {
                    users.delete(userId);
                    // console.log(`User ${userId} removed on disconnect`);
                    break;
                }
            }
        } catch (error) {
            console.error("Error removing user:", error);
        }
    },

    getUser: (userId) => {
        try {
            return users.get(userId);
        } catch (error) {
            console.error("Error getting user:", error);
            return null;
        }
    },

    updateUserCallState: (userId, callState) => {
        try {
            const user = users.get(userId);
            if (user) {
                user.callState = callState;
                users.set(userId, user);
            }
        } catch (error) {
            console.error("Error updating user call state:", error);
        }
    }
};

module.exports = socketUtils;
