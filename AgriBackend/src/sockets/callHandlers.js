const { getUser, updateUserCallState, activeCalls } = require('./socketUtils');

const registerCallHandlers = (io, socket) => {
    // Initiate a call
    socket.on("call:initiate", ({ callId, callerId, receiverId, type, conversationId }) => {
        try {
            const receiver = getUser(receiverId);
            const caller = getUser(callerId);

            if (!receiver) {
                socket.emit("call:error", { message: "Receiver is offline", callId });
                return;
            }

            if (receiver.callState !== 'idle') {
                socket.emit("call:error", { message: "User is already in a call", callId });
                return;
            }

            updateUserCallState(callerId, 'calling');
            updateUserCallState(receiverId, 'ringing');

            activeCalls.set(callId, {
                participants: [callerId, receiverId],
                status: 'ringing',
                type,
                conversationId,
                initiatedAt: new Date(),
                timeoutId: null
            });

            io.to(receiver.socketId).emit("call:incoming", {
                callId,
                callerId,
                callerName: caller?.name || "Unknown",
                type,
                conversationId
            });

            const timeoutId = setTimeout(() => {
                const call = activeCalls.get(callId);
                if (call && call.status === 'ringing') {
                    io.to(receiver.socketId).emit("call:timeout", { callId });
                    const callerUser = getUser(callerId);
                    if (callerUser) io.to(callerUser.socketId).emit("call:timeout", { callId });

                    updateUserCallState(callerId, 'idle');
                    updateUserCallState(receiverId, 'idle');
                    activeCalls.delete(callId);
                }
            }, 30000);

            const call = activeCalls.get(callId);
            if (call) {
                call.timeoutId = timeoutId;
                activeCalls.set(callId, call);
            }
        } catch (error) {
            console.error("Error initiating call:", error);
            socket.emit("call:error", { message: "Failed to initiate call", error: error.message });
        }
    });

    // Accept a call
    socket.on("call:accept", ({ callId, userId }) => {
        try {
            const call = activeCalls.get(callId);
            if (!call) {
                socket.emit("call:error", { message: "Call not found", callId });
                return;
            }

            if (call.timeoutId) {
                clearTimeout(call.timeoutId);
                call.timeoutId = null;
            }

            call.status = 'active';
            call.startTime = new Date();
            activeCalls.set(callId, call);

            call.participants.forEach(participantId => {
                updateUserCallState(participantId, 'in-call');
            });

            const caller = call.participants.find(id => id !== userId);
            const callerUser = getUser(caller);
            if (callerUser) {
                io.to(callerUser.socketId).emit("call:accepted", { callId, acceptedBy: userId });
            }
        } catch (error) {
            console.error("Error accepting call:", error);
            socket.emit("call:error", { message: "Failed to accept call", error: error.message });
        }
    });

    // Reject, End, WebRTC signaling...
    socket.on("call:reject", ({ callId, userId }) => {
        try {
            const call = activeCalls.get(callId);
            if (!call) return;
            if (call.timeoutId) clearTimeout(call.timeoutId);
            const caller = call.participants.find(id => id !== userId);
            const callerUser = getUser(caller);
            if (callerUser) {
                io.to(callerUser.socketId).emit("call:rejected", { callId, rejectedBy: userId });
            }
            call.participants.forEach(pid => updateUserCallState(pid, 'idle'));
            activeCalls.delete(callId);
        } catch (error) { console.error("Error rejecting call:", error); }
    });

    socket.on("call:end", ({ callId, userId }) => {
        try {
            const call = activeCalls.get(callId);
            if (!call) return;
            if (call.timeoutId) clearTimeout(call.timeoutId);
            call.participants.forEach(pid => {
                const p = getUser(pid);
                if (p && pid !== userId) io.to(p.socketId).emit("call:ended", { callId, endedBy: userId });
                updateUserCallState(pid, 'idle');
            });
            activeCalls.delete(callId);
        } catch (error) { console.error("Error ending call:", error); }
    });

    socket.on("webrtc:offer", ({ callId, offer, to }) => {
        const receiver = getUser(to);
        if (receiver) io.to(receiver.socketId).emit("webrtc:offer", { callId, offer, from: socket.userId });
    });

    socket.on("webrtc:answer", ({ callId, answer, to }) => {
        const receiver = getUser(to);
        if (receiver) io.to(receiver.socketId).emit("webrtc:answer", { callId, answer, from: socket.userId });
    });

    socket.on("webrtc:ice-candidate", ({ callId, candidate, to }) => {
        const receiver = getUser(to);
        if (receiver) io.to(receiver.socketId).emit("webrtc:ice-candidate", { callId, candidate, from: socket.userId });
    });

    socket.on("call:toggle-audio", ({ callId, userId, isMuted }) => {
        const call = activeCalls.get(callId);
        if (!call) return;
        call.participants.forEach(pid => {
            if (pid !== userId) {
                const p = getUser(pid);
                if (p) io.to(p.socketId).emit("call:peer-audio-toggle", { callId, userId, isMuted });
            }
        });
    });

    socket.on("call:toggle-video", ({ callId, userId, isVideoEnabled }) => {
        const call = activeCalls.get(callId);
        if (!call) return;
        call.participants.forEach(pid => {
            if (pid !== userId) {
                const p = getUser(pid);
                if (p) io.to(p.socketId).emit("call:peer-video-toggle", { callId, userId, isVideoEnabled });
            }
        });
    });
};

module.exports = registerCallHandlers;
