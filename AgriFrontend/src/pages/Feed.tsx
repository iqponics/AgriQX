import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { formatDistanceToNow } from "date-fns";
import { ImageIcon, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { useToast } from "../components/ToastProvider";
import { postApi } from "../api/postApi";
import { userApi } from "../api/userApi";

interface AppUser {
  _id: string;
  firstname: string;
  lastname: string;
  profilePic?: string;
  isLawyer?: boolean;
  accessToken?: string;
  contacts?: string[]; // array of contact user IDs
}

interface Comment {
  userId: string;
  firstname: string;
  lastname: string;
  comment: string;
  createdAt: string;
  profilePic?: string;
}

interface Post {
  _id: string;
  userId: string;
  firstname: string;
  lastname: string;
  profilePic?: string;
  desc: string;
  img?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export default function Feed() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [contacts, setContacts] = useState<AppUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ content: "", image: "" });
  const [newComment, setNewComment] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { fetchData } = useApi();
  const { error } = useToast();

  // Fetch current user from token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const userId = decoded.id;
        fetchData<unknown, any>(userApi.getUser(userId), 'GET')
          .then((data) => {
            setCurrentUser({ ...data, _id: data._id, accessToken: token });
          })
          .catch((err) => console.error("Failed to fetch current user:", err));
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    } else {
      console.error("No auth token found");
    }
  }, []);

  // Fetch contacts from the current user's data
  useEffect(() => {
    if (currentUser) {
      const fetchContacts = async () => {
        try {
          const userData = await fetchData<unknown, any>(userApi.getUser(currentUser._id), 'GET');
          if (!userData.contacts || userData.contacts.length === 0) {
            setContacts([]);
            return;
          }
          const acceptedContacts: AppUser[] = await Promise.all(
            userData.contacts.map(async (contactId: string) => {
              const data = await fetchData<unknown, any>(userApi.getUser(contactId), 'GET');
              return {
                _id: contactId,
                firstname: data.firstname,
                lastname: data.lastname,
                profilePic: data.profilePic || "",
                isLawyer: data.isLawyer,
              };
            })
          );
          setContacts(acceptedContacts);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      };
      fetchContacts();
    }
  }, [currentUser]);

  // Fetch feed posts: current user's posts + contacts' posts
  useEffect(() => {
    if (currentUser) {
      fetchData<unknown, Post[]>(postApi.feed(currentUser._id), 'GET')
        .then((data) => setPosts(data))
        .catch((err) => console.error("Error fetching feed posts:", err));
    }
  }, [currentUser]);

  // Handle creating a new post
  const handlePost = () => {
    if (!newPost.content) return;
    const payload = {
      userId: currentUser?._id,
      user: currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : "",
      desc: newPost.content,
      img: newPost.image,
    };
    fetchData<typeof payload, Post>(postApi.base(), "POST", { body: payload })
      .then((createdPost) => {
        setPosts([createdPost, ...posts]);
        setNewPost({ content: "", image: "" });
      })
      .catch((err) => console.error("Error creating post:", err));
  };

  // Handle image upload (converting file to base64 for simplicity)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPost({ ...newPost, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle liking a post
  const handleLike = (postId: string) => {
    fetchData<unknown, any>(postApi.like(postId), "PUT", { body: { userId: currentUser?._id } })
      .then(() => {
        if (currentUser) {
          fetchData<unknown, Post[]>(postApi.feed(currentUser._id), 'GET')
            .then((data) => setPosts(data));
        }
      })
      .catch((err) => console.error("Error liking post:", err));
  };

  // Handle commenting on a post
  const handleComment = (post: Post) => {
    if (!newComment.trim()) return;
    fetchData<unknown, any>(postApi.addComment(post._id), "PUT", {
      body: { userId: currentUser?._id, comment: newComment },
    })
      .then(() => {
        if (currentUser) {
          fetchData<unknown, Post[]>(postApi.feed(currentUser._id), 'GET')
            .then((data) => setPosts(data));
        }
        setNewComment("");
        setSelectedPostId(null);
      })
      .catch((err) => console.error("Error adding comment:", err));
  };

  // Handle sharing a post using the native share API
  const handleShare = async (post: Post) => {
    try {
      await navigator.share({
        title: `Post by ${post.firstname} ${post.lastname}`,
        text: post.desc,
        url: window.location.href,
      });
    } catch (err) {
      error("Sharing failed: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-cream-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 mt-16">
          {/* Left Sidebar - Profile Info (hidden on small screens) */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-leaf-100/20 border border-leaf-100">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-4 mb-8">
                    <img
                      src={
                        currentUser.profilePic ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.firstname}+${currentUser.lastname}`
                      }
                      className="w-14 h-14 rounded-full border-2 border-leaf-200 shadow-sm"
                      alt="Profile"
                    />
                    <div>
                      <p className="font-bold text-charcoal-900 text-lg">
                        {currentUser.firstname} {currentUser.lastname}
                      </p>
                      <p className="text-xs font-bold text-leaf-600 uppercase tracking-wider">Vendor Consultant</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-5 bg-leaf-50/50 rounded-2xl border border-leaf-100">
                      <h3 className="text-xs font-black text-leaf-700 mb-3 uppercase tracking-widest">
                        Profile Strength
                      </h3>
                      <div className="w-full bg-leaf-100 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-leaf-500 to-farm-500 rounded-full h-2.5 shadow-sm shadow-leaf-200"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-5 bg-white rounded-2xl border border-leaf-100 shadow-sm">
                      <h3 className="text-xs font-black text-leaf-700 mb-4 uppercase tracking-widest">
                        Recent Activity
                      </h3>
                      <ul className="space-y-4 text-sm">
                        <li className="flex items-center space-x-3 text-charcoal-700 font-medium group cursor-pointer hover:text-leaf-600 transition-colors">
                          <div className="w-8 h-8 bg-leaf-50 rounded-xl flex items-center justify-center border border-leaf-100 group-hover:bg-leaf-100 transition-colors">
                            <span className="text-sm">✏️</span>
                          </div>
                          <span>Posted an update</span>
                        </li>
                        <li className="flex items-center space-x-3 text-charcoal-700 font-medium group cursor-pointer hover:text-leaf-600 transition-colors">
                          <div className="w-8 h-8 bg-farm-50 rounded-xl flex items-center justify-center border border-farm-100 group-hover:bg-farm-100 transition-colors">
                            <span className="text-sm">👍</span>
                          </div>
                          <span>Liked a post</span>
                        </li>
                        <li className="flex items-center space-x-3 text-charcoal-700 font-medium group cursor-pointer hover:text-leaf-600 transition-colors">
                          <div className="w-8 h-8 bg-soil-50 rounded-xl flex items-center justify-center border border-soil-100 group-hover:bg-soil-100 transition-colors">
                            <span className="text-sm">💬</span>
                          </div>
                          <span>Commented on article</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <div className="w-12 h-12 border-4 border-leaf-200 border-t-leaf-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-charcoal-500 font-bold uppercase text-[10px] tracking-widest">Loading seeds...</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:w-1/2 w-full">
            {/* New Post Section */}
            <div className="mb-8 bg-white p-6 rounded-[2rem] shadow-xl shadow-leaf-100/10 border border-leaf-100">
              <div className="flex items-start gap-4">
                <img
                  src={
                    currentUser?.profilePic ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.firstname}+${currentUser?.lastname}`
                  }
                  className="w-12 h-12 rounded-full border-2 border-leaf-100 shadow-sm"
                  alt="User"
                />
                <div className="flex-1 space-y-4">
                  <textarea
                    placeholder="What's new with you?"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-[1.5rem] bg-leaf-50/30 border border-leaf-100 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 text-charcoal-900 placeholder-gray-400 resize-none font-medium transition-all"
                    rows={3}
                  />
                  {newPost.image && (
                    <div className="relative group">
                      <img
                        src={newPost.image}
                        className="rounded-2xl object-cover w-full aspect-video shadow-lg border border-leaf-100"
                        alt="Post media"
                      />
                      <button
                        onClick={() => setNewPost({ ...newPost, image: "" })}
                        className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-lg"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2.5 px-4 py-2 bg-leaf-50 text-leaf-700 hover:bg-leaf-100 rounded-xl cursor-pointer transition-all border border-leaf-100 font-bold text-sm">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <ImageIcon className="w-5 h-5" />
                      <span>Attach Media</span>
                    </label>
                    <button
                      onClick={handlePost}
                      disabled={!newPost.content.trim()}
                      className={`px-8 py-2.5 bg-leaf-600 hover:bg-leaf-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-leaf-200/50 active:scale-95 ${!newPost.content.trim() ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            {posts.map((post) => (
              <div
                key={post._id}
                className="mb-8 bg-white rounded-[2rem] shadow-xl shadow-leaf-100/10 border border-leaf-100 group overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          post.profilePic ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${post.firstname}+${post.lastname}`
                        }
                        className="w-12 h-12 rounded-full border-2 border-leaf-100 shadow-sm"
                        alt="Post User"
                      />
                      <div>
                        <p className="font-bold text-charcoal-900 text-lg group-hover:text-leaf-800 transition-colors">
                          {post.firstname} {post.lastname}
                        </p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-charcoal-700 mb-6 leading-relaxed font-medium">{post.desc}</p>
                  {post.img && (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-leaf-100 shadow-md">
                      <img
                        src={post.img}
                        className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-700"
                        alt="Post media"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-leaf-50">
                    <div className="flex items-center gap-2">
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${post.likes.includes(currentUser?._id || "")
                          ? "bg-leaf-50 text-leaf-600 border border-leaf-200"
                          : "text-gray-500 hover:bg-leaf-50 hover:text-leaf-600 group/btn"
                          }`}
                        onClick={() => handleLike(post._id)}
                      >
                        <ThumbsUp className={`w-5 h-5 ${post.likes.includes(currentUser?._id || "") ? "fill-leaf-600" : "group-hover/btn:scale-110 transition-transform"}`} />
                        <span>{post.likes.length}</span>
                      </button>
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${selectedPostId === post._id
                          ? "bg-farm-50 text-farm-700 border border-farm-200"
                          : "text-gray-500 hover:bg-farm-50 hover:text-farm-600 group/btn"
                          }`}
                        onClick={() =>
                          setSelectedPostId(
                            post._id === selectedPostId ? null : post._id
                          )
                        }
                      >
                        <MessageCircle className={`w-5 h-5 ${selectedPostId === post._id ? "fill-farm-600" : "group-hover/btn:scale-110 transition-transform"}`} />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                    <button
                      className="p-2 text-gray-400 hover:text-leaf-600 hover:bg-leaf-50 rounded-xl transition-all"
                      onClick={() => handleShare(post)}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  {selectedPostId === post._id && (
                    <div className="mt-6 pt-6 border-t border-leaf-50 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="space-y-4 mb-6">
                        {post.comments.map((c, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <img
                              src={
                                c.profilePic ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${c.firstname}+${c.lastname}`
                              }
                              className="w-9 h-9 rounded-full border border-leaf-100 shadow-sm"
                              alt="Comment User"
                            />
                            <div className="flex-1 bg-leaf-50/50 p-4 rounded-2xl border border-leaf-100">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-black text-leaf-800">{c.firstname} {c.lastname}</p>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm text-charcoal-700 font-medium">
                                {c.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <img
                          src={
                            currentUser?.profilePic ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.firstname}+${currentUser?.lastname}`
                          }
                          className="w-10 h-10 rounded-full border border-leaf-200 shadow-sm"
                          alt="Current User"
                        />
                        <div className="flex-1 relative">
                          <input
                            placeholder="Write a heartfelt comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-5 py-3 pr-24 bg-leaf-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:bg-white border border-leaf-100 text-sm font-medium transition-all"
                          />
                          <button
                            onClick={() => handleComment(post)}
                            disabled={!newComment.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-90 disabled:opacity-50 disabled:grayscale"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar - Contacts (hidden on smaller screens) */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-leaf-100/20 border border-leaf-100 h-fit sticky top-24">
              <h3 className="text-lg font-black text-leaf-800 mb-6 font-poppins px-2 uppercase tracking-tight">
                Marketplace Peers
              </h3>
              <div className="space-y-2">
                {contacts.length === 0 ? (
                  <div className="p-8 text-center bg-leaf-50/30 rounded-[1.5rem] border border-dashed border-leaf-200">
                    <p className="text-sm font-bold text-gray-400">Grow your network to see peers here!</p>
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-leaf-50 cursor-pointer transition-all border border-transparent hover:border-leaf-100 group"
                    >
                      <div className="relative">
                        <img
                          src={
                            contact.profilePic ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${contact.firstname}+${contact.lastname}`
                          }
                          className="w-11 h-11 rounded-full border-2 border-leaf-100 shadow-sm group-hover:border-leaf-300 transition-colors"
                          alt="Contact"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-leaf-500 rounded-full border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-leaf-100"></div>
                      </div>
                      <div>
                        <p className="text-charcoal-800 font-bold group-hover:text-leaf-800 transition-colors line-clamp-1">
                          {contact.firstname} {contact.lastname}
                        </p>
                        <p className="text-[10px] font-black text-leaf-600/60 uppercase tracking-tighter">
                          {contact.isLawyer ? 'Vendor' : 'Vendor'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
