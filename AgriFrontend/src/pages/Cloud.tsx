import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Folder,
  Clock,
  Image as ImageIcon,
  Search,
  Upload,
  Cloud as CloudIcon,
  Trash,
  Share2,
  FileText,
  Video as VideoIcon,
} from "lucide-react";
import { useApi } from "../hooks/useApi";
import { useToast } from "../components/ToastProvider";
import { userApi } from "../api/userApi";
import { fileApi } from "../api/fileApi";

type ActiveTab = "files" | "recent" | "images" | "documents" | "videos";

interface FileItem {
  id: string;
  _id: string;
  fileName: string;
  url: string;
  createdAt: Date;
}

interface CurrentUser {
  id: string;
  accessToken: string;
  firstname?: string;
  lastname?: string;
}

export default function Cloud() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("files");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchData } = useApi();
  const { success, error } = useToast();

  // On mount, retrieve token and fetch current user
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userIdFromToken = decoded.id || decoded._id;
        if (!userIdFromToken) {
          console.error("User ID not found in token");
          return;
        }

        fetchData<unknown, any>(userApi.getUser(userIdFromToken), 'GET')
          .then((data) => {
            setCurrentUser({ ...data, id: data._id, accessToken: token });
          })
          .catch((err) => console.error("Failed to fetch current user:", err));
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const userId = currentUser?.id;
  const authToken = currentUser?.accessToken;

  // Fetch files when userId and authToken are available
  useEffect(() => {
    if (!userId || !authToken) return;
    const fetchFiles = async () => {
      try {
        const data = await fetchData<unknown, any[]>(fileApi.base(), "POST", {
          body: { userId },
        });
        const mappedFiles = data.map((file: any) => ({
          ...file,
          id: file._id,
        }));
        setFiles(mappedFiles);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, [userId, authToken]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !authToken) return;
    const newFiles = e.target.files;
    if (!newFiles) return;
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      try {
        const uploadedFile = await fetchData<unknown, any>(fileApi.upload(), "POST", {
          body: formData as unknown as any,
        });
        const mappedFile = { ...uploadedFile, id: uploadedFile._id };
        setFiles((prev) => [mappedFile, ...prev]);
      } catch (err) {
        console.error("Error during file upload:", err);
      }
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!userId) return;
    try {
      await fetchData<unknown, any>(
        fileApi.permanentDelete(fileId, userId),
        "DELETE"
      );
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error("Error during file deletion:", err);
    }
  };

  const shareFile = async (fileId: string) => {
    if (!userId) return;
    const emails = prompt("Enter email(s) to share with (comma separated):");
    if (!emails) return;
    const sharedWith = emails.split(",").map((email) => email.trim());
    try {
      await fetchData<unknown, any>(fileApi.shared(), "PUT", {
        body: { fileId, userId, sharedWith },
      });
      success("File shared successfully!");
    } catch (err) {
      console.error("Error sharing file:", err);
    }
  };

  const getVideoThumbnailUrl = (url: string) => {
    const modified = url.replace("/video/upload/", "/video/upload/w_200,h_200,c_fill/");
    return modified.replace(/\.[a-z]+$/, ".jpg");
  };

  const Thumbnail = ({ file }: { file: FileItem }) => {
    const lowerName = file.fileName.toLowerCase();

    if (/\.(png|jpe?g|gif|webp)$/i.test(lowerName)) {
      return (
        <img
          src={file.url}
          alt={file.fileName}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
      );
    } else if (/\.(mp4|mov|3gp)$/i.test(lowerName)) {
      const videoThumb = getVideoThumbnailUrl(file.url);
      return (
        <div className="relative w-full h-full">
          <img
            src={videoThumb}
            alt={file.fileName}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <VideoIcon className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-full h-full bg-leaf-50 group-hover:bg-leaf-100 transition-colors">
          <FileText className="w-12 h-12 text-leaf-400" />
        </div>
      );
    }
  };

  const getFilteredFiles = () => {
    let filtered = files;
    const now = new Date();
    switch (activeTab) {
      case "recent":
        filtered = filtered.filter((file) => {
          const fileDate = new Date(file.createdAt);
          return now.getTime() - fileDate.getTime() < 7 * 24 * 3600 * 1000;
        });
        break;
      case "images":
        filtered = filtered.filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file.fileName));
        break;
      case "documents":
        filtered = filtered.filter((file) => /\.(pdf|doc|docx)$/i.test(file.fileName));
        break;
      case "videos":
        filtered = filtered.filter((file) => /\.(mp4|mov|3gp)$/i.test(file.fileName));
        break;
      default:
        break;
    }
    if (searchQuery) {
      filtered = filtered.filter((file) => file.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  };

  const NavItem = ({ id, icon: Icon, label }: { id: ActiveTab; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === id
        ? "bg-leaf-600 text-white shadow-lg shadow-leaf-200"
        : "text-leaf-600 hover:bg-leaf-50"
        }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-cream-200 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-leaf-800 font-poppins mb-2">Ponics Cloud</h1>
            <p className="text-gray-500 font-medium">Manage your farm docs, harvest photos, and training videos.</p>
          </div>
          <div className="flex gap-4">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*, video/*, application/pdf, .doc, .docx"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-leaf-600 hover:bg-leaf-700 text-white font-bold rounded-2xl shadow-xl shadow-leaf-100 transition-all hover:scale-105 active:scale-95"
            >
              <Upload className="w-5 h-5" /> Upload File
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-leaf-100/10 border border-leaf-100/50">
              <div className="mb-8 px-4 py-6 bg-leaf-50/50 rounded-3xl border border-leaf-100 text-center">
                <p className="text-xs font-black text-leaf-600 uppercase tracking-widest mb-1">Signed in as</p>
                <p className="text-lg font-black text-charcoal-900 truncate">
                  {currentUser?.firstname} {currentUser?.lastname}
                </p>
              </div>

              <div className="space-y-2">
                <NavItem id="files" icon={Folder} label="All Files" />
                <NavItem id="recent" icon={Clock} label="Recent" />
                <NavItem id="images" icon={ImageIcon} label="Photos" />
                <NavItem id="documents" icon={FileText} label="Documents" />
                <NavItem id="videos" icon={VideoIcon} label="Videos" />
              </div>

              <div className="mt-10 p-6 bg-cream-200/50 rounded-3xl border border-leaf-100">
                <div className="flex items-center justify-between mb-4">
                  <CloudIcon className="w-6 h-6 text-leaf-500" />
                  <span className="text-xs font-black text-leaf-700 bg-leaf-100 px-3 py-1 rounded-full">BASIC</span>
                </div>
                <div className="w-full bg-leaf-100 rounded-full h-3 mb-3">
                  <div className="bg-leaf-600 h-full rounded-full transition-all duration-1000" style={{ width: "35%" }}></div>
                </div>
                <p className="text-xs font-bold text-gray-500">1.2 GB of 10 GB used</p>
                <button className="w-full mt-6 py-3 bg-white hover:bg-leaf-50 text-leaf-700 font-bold border-2 border-leaf-600 rounded-2xl transition-all">
                  Upgrade Storage
                </button>
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <main className="lg:col-span-9 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-leaf-100/10 border border-leaf-100/50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                <h2 className="text-2xl font-black text-charcoal-900 font-poppins capitalize">{activeTab}</h2>
                <div className="relative w-full md:w-96">
                  <input
                    type="text"
                    placeholder="Search in cloud..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-leaf-50/50 border border-leaf-100 rounded-2xl text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-400 w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredFiles().length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <CloudIcon className="w-16 h-16 mx-auto mb-4 text-leaf-100" />
                    <p className="text-gray-400 font-medium">Your cloud is empty. Start uploading some files!</p>
                  </div>
                ) : (
                  getFilteredFiles().map((file) => (
                    <div key={file.id} className="group relative bg-white border border-leaf-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-leaf-100/20 transition-all duration-300 transform hover:-translate-y-2">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <Thumbnail file={file} />

                        {/* Actions Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              <button onClick={() => shareFile(file.id)} className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 active:scale-90 transition-all">
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteFile(file.id)} className="p-2 bg-red-500/40 backdrop-blur-md rounded-xl text-white hover:bg-red-500/60 active:scale-90 transition-all">
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-leaf-600 rounded-xl text-white hover:bg-leaf-700 transition-all shadow-lg active:scale-90">
                              <Upload className="w-4 h-4 rotate-180" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="font-bold text-charcoal-800 truncate mb-1">{file.fileName}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
