import { useState, useEffect, useRef } from "react";
import { Send, Phone, Video, Search, MoreHorizontal, MessageCircle } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { jwtDecode } from "jwt-decode";
import io, { type Socket } from "socket.io-client";
import CallInterface from "../components/CallInterface";
import IncomingCallModal from "../components/IncomingCallModal";
import OutgoingCallModal from "../components/OutgoingCallModal";

import { API_BASE_URL } from "../config/api";
import { useToast } from "../components/ToastProvider";

const SOCKET_URL = API_BASE_URL;

interface Message {
  _id: string;
  text: string;
  senderId: string | { _id: string; username: string; profilePicture?: string };
  createdAt: string;
}

interface Conversation {
  _id: string;
  members: any[];
  name?: string;
  lastMessage?: any;
  isGroup: boolean;
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { fetchData } = useApi();
  const { success, error: toastError } = useToast();

  // Call State
  const [socket, setSocket] = useState<Socket | null>(null);
  const [callState, setCallState] = useState<'idle' | 'incoming' | 'outgoing' | 'active'>('idle');
  const [callData, setCallData] = useState<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const timerRef = useRef<any>(null);

  const selectedConvo = conversations.find(c => c._id === selectedId);

  // Load current user
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Decode user
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        const userId = decoded.id;
        fetchData<unknown, any>(`/users/${userId}`, 'GET').then(data => {
          setCurrentUser(data);
        });

        // Initialize Socket
        const newSocket = io(SOCKET_URL, {
          auth: { token },
          transports: ['websocket']
        });

        newSocket.on("connect", () => {
          console.log("Socket connected:", newSocket.id);
          newSocket.emit("addUser", userId);
        });

        newSocket.on("call:incoming", (data: any) => {
          console.log("Incoming call:", data);
          setCallData(data);
          setCallState('incoming');
        });

        newSocket.on("call:accepted", (data: any) => {
          console.log("Call accepted:", data);
          setCallState('active');
          startTimer();
          // WebRTC offer will be sent by caller separate/parallel
        });

        newSocket.on("call:rejected", () => {
          console.log("Call rejected");
          endCallCleanup();
        });

        newSocket.on("call:ended", () => {
          console.log("Call ended by remote");
          endCallCleanup();
        });

        // WebRTC Signaling
        newSocket.on("webrtc:offer", async ({ offer, from }: { offer: RTCSessionDescriptionInit, from: string }) => {
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            const callId = `call-${Date.now()}`; // Need consistent ID, but for now unique
            newSocket.emit("webrtc:answer", { callId, answer, to: from });
          }
        });

        newSocket.on("webrtc:answer", async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        newSocket.on("webrtc:ice-candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
          if (peerConnection.current) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };

      } catch (err) {
        console.error('Failed to decode token or connect socket:', err);
      }
    }
  }, []); // Run once on mount

  // Fetch conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser?._id) return;
      setLoading(true);
      try {
        console.log("Fetching conversations for user:", currentUser._id);
        const data = await fetchData<unknown, Conversation[]>(`/conversation/${currentUser._id}`, 'GET');
        console.log("Conversations fetched:", data);
        setConversations(data || []);
      } catch (err) {
        console.error('Failed to load conversations:', err);
        setError("Failed to load conversations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [currentUser?._id]);

  // Fetch contacts
  useEffect(() => {
    const loadContacts = async () => {
      if (!currentUser?._id) return;
      try {
        const data = await fetchData<unknown, any[]>(`/users/contacts/${currentUser._id}`, 'GET');
        console.log("Contacts fetched:", data);
        setContacts(data || []);
      } catch (err) {
        console.error('Failed to load contacts:', err);
      }
    };
    loadContacts();
  }, [currentUser?._id]);

  // Fetch messages for selected conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedId) return;
      try {
        console.log("Fetching messages for conversation:", selectedId);
        const data = await fetchData<unknown, Message[]>(`/message/${selectedId}`, 'GET');
        console.log("Messages fetched:", data);
        setMessages(data || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Simple polling for messages
    return () => clearInterval(interval);
  }, [selectedId]);

  useEffect(() => {
    if (selectedId) {
      setShowSidebar(false);
    }
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedId || !currentUser?._id) return;

    try {
      const payload = {
        conversationId: selectedId,
        senderId: currentUser._id,
        text: newMessage,
      };

      const result = await fetchData<typeof payload, Message>('/message', 'POST', {
        body: payload
      });

      setMessages(prev => [...prev, result]);
      setNewMessage("");

      // Update conversations list with last message optimistically
      setConversations(prev => prev.map(c => {
        if (c._id === selectedId) {
          return { ...c, lastMessage: result };
        }
        return c;
      }));
    } catch (err) {
      console.error('Failed to send message:', err);
      toastError("Failed to send message. Please try again.");
    }
  };

  const getOtherMember = (convo: Conversation) => {
    if (convo.isGroup) return { name: convo.name || 'Group', profilePic: '', type: 'Group' };
    const other = convo.members.find(m => m._id !== currentUser?._id);
    return {
      name: 'Unknown',
      profilePic: other?.profilePic || other?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${other?.id || other?._id || 'User'}`,
      type: other?.lawyerType || 'User'
    };
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCallDuration(0);
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const endCallCleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCallState('idle');
    setCallData(null);
    setCallDuration(0);
  };

  // Call Handlers
  const handleInitiateCall = async (type: 'audio' | 'video') => {
    if (!selectedId || !currentUser || !selectedConvo) return;

    const otherMember = getOtherMember(selectedConvo);
    // For now, assuming direct messaging (not group for calls, or just calling first member)
    const receiverId = selectedConvo.members.find(m => m._id !== currentUser._id)?._id;

    if (!receiverId) return;

    try {
      // Get local stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true
      });
      setLocalStream(stream);
      setIsVideoEnabled(type === 'video');

      // Initialize WebRTC
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("webrtc:ice-candidate", {
            callId: `call-${Date.now()}`, // Temporary ID logic, assumes backend handles
            candidate: event.candidate,
            to: receiverId
          });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peerConnection.current = pc;

      const callId = `call-${Date.now()}`; // Generate a client-side ID or fetch from backend
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket?.emit("call:initiate", {
        callId,
        conversationId: selectedId,
        callerId: currentUser._id,
        receiverId,
        type,
        sdp: offer // sending SDP with initiate for simplicity or emit separately
      });

      // Send offer separately as per backend socket.js logic usually
      socket?.emit("webrtc:offer", { callId, offer, to: receiverId });

      setCallData({ ...otherMember, type, callId });
      setCallState('outgoing');

    } catch (err) {
      console.error("Failed to initiate call:", err);
      toastError("Could not access camera/microphone");
    }
  };

  const handleAcceptCall = async () => {
    if (!callData || !socket) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callData.type === 'video',
        audio: true
      });
      setLocalStream(stream);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc:ice-candidate", {
            callId: callData.callId,
            candidate: event.candidate,
            to: callData.callerId
          });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peerConnection.current = pc;

      socket.emit("call:accept", { callId: callData.callId, userId: currentUser._id });
      setCallState('active');
      startTimer();

    } catch (err) {
      console.error("Failed to accept call:", err);
    }
  };

  const handleRejectCall = () => {
    if (callData && socket) {
      socket.emit("call:reject", { callId: callData.callId, userId: currentUser._id });
    }
    endCallCleanup();
  };

  const handleEndCall = () => {
    if (callData && socket) {
      socket.emit("call:end", { callId: callData.callId, userId: currentUser._id });
    }
    endCallCleanup();
  };

  const handleToggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-leaf-50 pt-24 pb-4 md:pb-8 px-2 md:px-6 lg:px-8 relative">
      {/* Call Overlays */}
      {callState === 'incoming' && callData && (
        <IncomingCallModal
          callerName={callData.callerName || 'Unknown'}
          callType={callData.type}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {callState === 'outgoing' && callData && (
        <OutgoingCallModal
          recipientName={callData.name || 'Unknown'}
          callType={callData.type}
          onCancel={handleEndCall}
        />
      )}

      {callState === 'active' && (
        <div className="fixed inset-0 z-50 bg-black">
          <CallInterface
            localStream={localStream}
            remoteStream={remoteStream}
            isMuted={isMuted}
            isVideoEnabled={isVideoEnabled}
            callDuration={callDuration}
            participantName={callData?.name || callData?.callerName || 'User'}
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onEndCall={handleEndCall}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] min-h-[500px] bg-white/70 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-leaf-100 shadow-2xl flex overflow-hidden relative">

        {/* Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-leaf-50 flex flex-col transition-all duration-300 ${!showSidebar ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 md:p-6 border-b border-leaf-50">
            <h1 className="text-xl md:text-2xl font-bold text-charcoal-900 font-poppins mb-4">Inbox</h1>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim().length > 1) {
                    fetchData<unknown, any[]>(`/users/search/query?q=${e.target.value}`, 'GET')
                      .then(data => setSearchResults(data))
                      .catch(console.error);
                  } else {
                    setSearchResults([]);
                  }
                }}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 bg-leaf-50/50 border border-leaf-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-leaf-400" />
            </div>
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-50 w-full left-0 mt-2 bg-white shadow-xl rounded-xl border border-leaf-100 max-h-60 overflow-y-auto">
                {searchResults.map(user => (
                  <div
                    key={user._id}
                    onClick={async () => {
                      try {
                        // Find or create conversation
                        const convo = await fetchData<unknown, Conversation>(`/conversation/find/${currentUser._id}/${user._id}`, 'GET');

                        // Check if already in list
                        if (!conversations.find(c => c._id === convo._id)) {
                          setConversations(prev => [convo, ...prev]);
                        }

                        setSelectedId(convo._id);
                        setSearchTerm("");
                        setSearchResults([]);
                        setShowSidebar(false);
                      } catch (err) {
                        console.error("Failed to start conversation:", err);
                        toastError("Failed to start conversation");
                      }
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-leaf-50 cursor-pointer border-b border-leaf-50 last:border-0"
                  >
                    <img
                      src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user._id}`}
                      alt={user.firstname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-charcoal-800">{user.firstname} {user.lastname}</p>
                      <p className="text-xs text-gray-500">@{user.username || 'user'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2">
            {loading && conversations.length === 0 ? (
              <div className="text-center text-gray-500 py-4">Loading conversations...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <>
                {/* Active Conversations */}
                {conversations.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Conversations</h3>
                    {conversations.map(convo => {
                      const other = getOtherMember(convo);
                      return (
                        <div
                          key={convo._id}
                          onClick={() => {
                            setSelectedId(convo._id);
                            setShowSidebar(false);
                          }}
                          className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all ${selectedId === convo._id
                            ? "bg-leaf-600 shadow-lg shadow-leaf-200 text-white"
                            : "hover:bg-leaf-50 text-charcoal-900"
                            }`}
                        >
                          <div className="relative flex-shrink-0">
                            <img src={other.profilePic} alt={other.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-bold truncate text-sm md:text-base">{other.name}</p>
                              <span className={`text-[9px] md:text-[10px] ${selectedId === convo._id ? "text-leaf-100" : "text-gray-400"} uppercase tracking-widest font-bold ml-2`}>{other.type}</span>
                            </div>
                            <p className={`text-xs md:text-sm truncate ${selectedId === convo._id ? "text-leaf-50" : "text-gray-500"}`}>{convo.lastMessage?.text || 'No messages yet'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Contacts List (Start new chat) */}
                {contacts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Contacts</h3>
                    {contacts.map(contact => (
                      <div
                        key={contact._id}
                        onClick={async () => {
                          try {
                            // Check if conversation already exists
                            const existing = conversations.find(c => {
                              // Check members for contact ID
                              return c.members.some((m: any) => m._id === contact._id || m === contact._id);
                            });

                            if (existing) {
                              setSelectedId(existing._id);
                            } else {
                              // Start new conversation
                              const convo = await fetchData<unknown, Conversation>(`/conversation/find/${currentUser._id}/${contact._id}`, 'GET');
                              setConversations(prev => [convo, ...prev]);
                              setSelectedId(convo._id);
                            }
                            setShowSidebar(false);
                          } catch (err) {
                            console.error("Failed to start chat with contact:", err);
                          }
                        }}
                        className="flex items-center gap-4 p-4 rounded-3xl cursor-pointer hover:bg-leaf-50 text-charcoal-900 transition-all"
                      >
                        <div className="relative flex-shrink-0">
                          <img src={contact.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${contact._id}`} alt={contact.firstname} className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20 grayscale opacity-70" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-sm md:text-base">Unknown</p>
                          <p className="text-xs text-gray-500">Start a new conversation</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {conversations.length === 0 && contacts.length === 0 && (
                  <div className="text-center text-gray-500 py-4">No conversations or contacts found.</div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConvo ? (
          <div className={`flex-1 flex flex-col bg-white/50 transition-all duration-300 ${showSidebar ? 'hidden md:flex' : 'flex'}`}>
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-leaf-50 flex items-center justify-between bg-white/40 sticky top-0 z-10">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden p-2 -ml-2 text-leaf-600 hover:bg-leaf-50 rounded-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <img src={getOtherMember(selectedConvo).profilePic} alt={getOtherMember(selectedConvo).name} className="w-10 h-10 rounded-xl object-cover border border-leaf-100" />
                <div className="truncate">
                  <h2 className="font-bold text-charcoal-900 leading-tight truncate">{getOtherMember(selectedConvo).name}</h2>
                  <p className="text-[10px] md:text-xs text-green-500 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <button onClick={() => handleInitiateCall('audio')} className="p-2 md:p-3 bg-leaf-50 rounded-xl md:rounded-2xl text-leaf-600 hover:bg-leaf-100 transition-colors"><Phone className="w-4 h-4 md:w-5 md:h-5" /></button>
                <button onClick={() => handleInitiateCall('video')} className="p-2 md:p-3 bg-leaf-50 rounded-xl md:rounded-2xl text-leaf-600 hover:bg-leaf-100 transition-colors"><Video className="w-4 h-4 md:w-5 md:h-5" /></button>
                <button className="p-2 md:p-3 bg-leaf-50 rounded-xl md:rounded-2xl text-leaf-600 hover:bg-leaf-100 transition-colors hidden sm:block"><MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" /></button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
              {messages.map(msg => {
                const isMe = (typeof msg.senderId === 'string' ? msg.senderId : msg.senderId._id) === currentUser?._id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl md:rounded-3xl ${isMe
                      ? "bg-leaf-600 text-white rounded-tr-none shadow-xl shadow-leaf-100"
                      : "bg-white border border-leaf-100 text-charcoal-800 rounded-tl-none shadow-sm"
                      }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${isMe ? 'text-leaf-200' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-6 bg-white/80 backdrop-blur-md border-t border-leaf-50">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-4 bg-leaf-50/50 border border-leaf-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-leaf-600 hover:bg-leaf-700 disabled:opacity-50 text-white p-4 rounded-2xl shadow-xl shadow-leaf-100 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 text-center bg-white/50">
            <MessageCircle className="w-20 h-20 mb-6 opacity-10" />
            <h2 className="text-2xl font-bold text-charcoal-700 mb-2">Ponics Inbox</h2>
            <p className="max-w-xs">Select a farmer or vendor to start a conversation about sustainable produce.</p>
          </div>
        )}
      </div>
    </div>
  );
}
