import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Camera, 
  MapPin, 
  Plus, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useTitle } from '../hooks/useTitle';

// ─── Component ────────────────────────────────────────────────────────────────
const Community = () => {
  useTitle('Krishi Community');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', cropTag: '', location: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_URL = (import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:3000/api`).replace('/api', '');

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await apiService.community.getFeed();
      const feedData = res.data.posts || [];
      setPosts(feedData);
      console.log('Feed loaded:', feedData.length, 'posts');
    } catch (err) {
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getUserBadges = (userData: any) => {
    const badges = [];
    if (userData.experienceYears >= 10) badges.push({ text: 'Veteran', icon: '🏆', color: 'bg-amber-100 text-amber-700' });
    else if (userData.experienceYears >= 5) badges.push({ text: 'Expert', icon: '🏅', color: 'bg-blue-100 text-blue-700' });
    
    if (userData.totalLand >= 20) badges.push({ text: 'Large Scale', icon: '🚜', color: 'bg-emerald-100 text-emerald-700' });
    else if (userData.totalLand >= 5) badges.push({ text: 'Established', icon: '🏡', color: 'bg-indigo-100 text-indigo-700' });

    return badges;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content && !selectedImage) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      formData.append('cropTag', newPost.cropTag);
      formData.append('location', newPost.location || user.location || '');
      formData.append('uploadType', 'post');
      if (selectedImage) formData.append('image', selectedImage);

      await apiService.community.createPost(formData);
      setShowCreateModal(false);
      setNewPost({ content: '', cropTag: '', location: '' });
      setSelectedImage(null);
      setImagePreview(null);
      fetchFeed();
    } catch (err) {
      console.error('Post error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await apiService.community.toggleLike(postId);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const freshLiked = res.data.liked;
          return {
            ...p,
            isLiked: freshLiked,
            likesCount: freshLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const openComments = async (postId: string) => {
    setActiveComments(postId);
    try {
      const res = await apiService.community.getComments(postId);
      setComments(res.data);
    } catch (err) {
      console.error('Comments error:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeComments) return;

    try {
      const res = await apiService.community.addComment(activeComments, { content: newComment });
      setComments(prev => [...prev, res.data]);
      setPosts(prev => prev.map(p => p.id === activeComments ? { ...p, commentsCount: p.commentsCount + 1 } : p));
      setNewComment("");
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API_URL}/${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans pb-20 md:pb-8">
      
      {/* ── Premium Header ── */}
      <div className="bg-white/80 backdrop-blur-2xl sticky top-0 md:top-0 z-40 border-b border-gray-100/50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
             Krishi Connect <span className="text-green-600 grayscale brightness-125">🤳</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Village Social Network</p>
             <span className="text-gray-200">|</span>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Farming Updates</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl shadow-green-600/20 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
        >
          <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-90 transition-transform">
             <Plus size={18} strokeWidth={3} />
          </div>
          Create Update
        </button>
      </div>

      <div className="max-w-xl mx-auto w-full px-4 pt-10 space-y-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400 gap-4">
             <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
             <p className="font-black uppercase tracking-[0.2em] text-xs">Loading Community Feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-100 shadow-2xl shadow-gray-200/30">
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner">🌱</div>
             <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Community is Quiet</h3>
             <p className="text-gray-500 text-sm font-medium mb-10 max-w-xs mx-auto leading-relaxed">Your district-wide farming community is waiting for its first update. Be the leader!</p>
             <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/20"
             >
                Start a Conversation
             </button>
          </div>
        ) : (
          posts.map((post) => {
            const badges = getUserBadges(post.user);
            return (
              <div key={post.id} className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative group hover:translate-y-[-4px] transition-all duration-500">
                
                {/* Post Header */}
                <div className="p-6 md:p-8 flex items-start justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center overflow-hidden flex-shrink-0 text-green-700 font-black text-xl shadow-sm">
                        {post.user.profileImage ? (
                          <img src={getImageUrl(post.user.profileImage)} alt="U" className="w-full h-full object-cover" />
                        ) : (
                          post.user.name?.charAt(0) || 'F'
                        )}
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h4 className="font-black text-gray-900 leading-none text-base md:text-lg flex items-center gap-1.5 tracking-tight">
                              {post.user.name || 'Anonymous Farmer'}
                              <CheckCircle2 size={16} className="text-blue-500" />
                            </h4>
                         </div>
                         <div className="flex flex-wrap items-center gap-2 mt-2">
                             <div className="flex items-center gap-1.5 p-1.5 px-2.5 bg-gray-50 rounded-lg text-gray-400">
                                <MapPin size={10} className="text-red-400" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{post.location || post.user.location || 'Dist. Area'}</span>
                             </div>
                             {badges.map((b, i) => (
                               <div key={i} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/50 shadow-sm ${b.color}`}>
                                  <span>{b.icon}</span> {b.text}
                               </div>
                             ))}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}</p>
                      {post.cropTag && (
                        <div className="mt-2 text-green-600 text-[10px] font-black underline underline-offset-4 decoration-2 decoration-green-200 uppercase tracking-widest">
                           #{post.cropTag}
                        </div>
                      )}
                   </div>
                </div>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="relative h-[300px] md:h-[450px] bg-gray-100 overflow-hidden group">
                     <img 
                       src={getImageUrl(post.imageUrl)} 
                       alt="Farm Update" 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                     <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                        <p className="text-[10px] text-white font-black uppercase tracking-widest">Live Update</p>
                     </div>
                  </div>
                )}

                {/* Post Content */}
                <div className="p-8 md:p-10 pt-8 relative">
                   {/* Background blur decorative */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>

                   <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed mb-10 relative z-10">
                     {post.content}
                   </p>

                   {/* Activity Interactions */}
                   <div className="flex items-center gap-8 border-t border-gray-50 pt-8 relative z-10">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`group/btn flex items-center gap-3 transition-all ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                      >
                        <div className={`p-2 rounded-xl transition-all ${post.isLiked ? 'bg-red-50' : 'bg-gray-50 group-hover/btn:bg-red-50'}`}>
                           <Heart size={26} fill={post.isLiked ? "currentColor" : "none"} className={post.isLiked ? 'animate-bounce' : ''} />
                        </div>
                        <div>
                           <p className="text-xs font-black tracking-tighter leading-none">{post.likesCount}</p>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mt-1">Likes</p>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => openComments(post.id)}
                        className="group/btn flex items-center gap-3 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <div className="p-2 bg-gray-50 rounded-xl group-hover/btn:bg-blue-50 transition-all">
                           <MessageCircle size={26} />
                        </div>
                        <div>
                           <p className="text-xs font-black tracking-tighter leading-none">{post.commentsCount}</p>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mt-1">Comments</p>
                        </div>
                      </button>

                      <div className="ml-auto">
                         <button className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-green-600 transition-colors flex items-center gap-2">
                             Share <Send size={14} />
                         </button>
                      </div>
                   </div>
                </div>

                {/* Comments Section (Expandable) */}
                {activeComments === post.id && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-8 md:p-10 animate-in slide-in-from-top duration-500">
                     <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {comments.length === 0 ? (
                          <div className="text-center py-10">
                             <p className="text-4xl mb-3 grayscale opacity-30">💭</p>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No expert advice yet</p>
                          </div>
                        ) : (
                          comments.map(c => (
                            <div key={c.id} className="flex gap-4">
                               <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-black uppercase overflow-hidden shadow-sm">
                                  {c.user.profileImage ? (
                                    <img src={getImageUrl(c.user.profileImage)} alt="U" className="w-full h-full object-cover" />
                                  ) : (
                                    c.user.name?.charAt(0) || 'F'
                                  )}
                               </div>
                               <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-none border border-gray-200/50 shadow-xl shadow-gray-200/20 flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                     <p className="text-xs font-black text-gray-900 tracking-tight">{c.user.name}</p>
                                     <p className="text-[9px] font-bold text-gray-400 uppercase">Expert</p>
                                  </div>
                                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{c.content}</p>
                               </div>
                            </div>
                          ))
                        )}
                     </div>
                     
                     <form onSubmit={handleAddComment} className="flex gap-3 sticky bottom-0">
                        <input 
                          type="text" 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add your agronomic advice..."
                          className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-green-500/10 shadow-sm transition-all"
                        />
                        <button type="submit" className="bg-green-600 text-white p-4 rounded-2xl shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all active:scale-95">
                          <Send size={22} strokeWidth={2.5} />
                        </button>
                     </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Create Post Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
           <div 
             className="absolute inset-0 bg-black/60 backdrop-blur-md" 
             onClick={() => !isSubmitting && setShowCreateModal(false)}
           />
           
           <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-700 p-2">
             <div className="bg-gray-50/50 rounded-[2.5rem] p-8 md:p-10">
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter">New Farm Update</h3>
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mt-1">District Broadcasting Feed</p>
                   </div>
                   <button onClick={() => setShowCreateModal(false)} className="bg-white p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-600 shadow-sm transition-all">
                      <X size={20} />
                   </button>
                </div>
                
                <form id="post-create-form" onSubmit={handleCreatePost} className="space-y-10">
                   <div className="relative">
                      <textarea 
                        className="w-full bg-white border border-gray-100 rounded-[2rem] p-8 text-lg font-medium placeholder-gray-300 focus:ring-4 focus:ring-green-500/10 shadow-inner resize-none transition-all min-h-[180px]"
                        placeholder="Share your farm's story or ask for advice..."
                        required
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      />
                      <div className="absolute bottom-6 right-8 text-[10px] font-black text-gray-300 uppercase tracking-widest">Max 280 Chars</div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                     <div className="group">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 transition-colors group-focus-within:text-green-600">Crop Category</p>
                       <input 
                         type="text" 
                         placeholder="e.g. #Paddy, #Seedless"
                         className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-black tracking-widest uppercase focus:ring-4 focus:ring-green-500/10 transition-all border-dashed"
                         value={newPost.cropTag}
                         onChange={(e) => setNewPost({...newPost, cropTag: e.target.value.replace('#', '')})}
                       />
                     </div>
                     <div className="group">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 transition-colors group-focus-within:text-green-600">Current Location</p>
                       <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Current Hub"
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-6 py-4 text-xs font-black tracking-widest uppercase focus:ring-4 focus:ring-green-500/10 transition-all"
                            value={newPost.location}
                            onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                          />
                          <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                       </div>
                     </div>
                   </div>

                   {/* Image Upload Area */}
                   <div 
                     onClick={() => document.getElementById('post-image')?.click()}
                     className="relative group cursor-pointer border-4 border-dashed border-gray-100/50 rounded-[2.5rem] h-64 flex flex-col items-center justify-center hover:bg-gray-100/50 hover:border-green-500/20 transition-all bg-white shadow-inner"
                   >
                     {imagePreview ? (
                       <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[2.2rem]" />
                     ) : (
                       <div className="text-center group-hover:scale-110 transition-transform">
                          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 shadow-sm transition-all border border-green-100">
                             <Camera className="text-green-600" size={32} />
                          </div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Broadcast Farm Photograph</p>
                       </div>
                     )}
                     <input 
                       id="post-image" 
                       type="file" 
                       accept="image/*" 
                       className="hidden" 
                       onChange={handleImageChange}
                     />
                     {imagePreview && (
                       <button 
                         type="button"
                         onClick={(e) => { e.stopPropagation(); setImagePreview(null); setSelectedImage(null); }}
                         className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2.5 rounded-2xl hover:bg-black/80 transition-all border border-white/20"
                       >
                         <X size={16} strokeWidth={3} />
                       </button>
                     )}
                   </div>

                   <button 
                     disabled={isSubmitting}
                     className="w-full bg-green-600 text-white py-6 rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-2xl shadow-green-600/30 flex items-center justify-center gap-4 disabled:opacity-50 transition-all active:scale-95 uppercase"
                     type="submit"
                   >
                     {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                        <>
                          <Send size={24} strokeWidth={2.5} /> Publish to Community
                        </>
                     )}
                   </button>
                </form>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Community;
