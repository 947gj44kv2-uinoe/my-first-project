import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Download, 
  Check, 
  Zap, 
  Search, 
  Library, 
  Compass, 
  MoreVertical,
  Volume2,
  Heart,
  ChevronDown
} from "lucide-react";
import { INITIAL_TRACKS } from "./constants";
import { Track, Recommendation } from "./types";
import { getElectronicRecommendations } from "./services/geminiService";

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [activeTab, setActiveTab] = useState<"discover" | "library" | "search">("discover");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchRecommendations("Energetic");
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const fetchRecommendations = async (mood: string) => {
    setIsSyncing(true);
    const result = await getElectronicRecommendations(mood);
    setRecommendations(result);
    setIsSyncing(false);
  };

  const handleDownload = (id: string) => {
    setTracks(tracks.map(t => 
      t.id === id ? { ...t, isDownloaded: !t.isDownloaded } : t
    ));
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-vibrant-bg text-vibrant-text font-sans">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden neon-glow-purple">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vibrant-purple/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-vibrant-green/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32 pt-12 px-6 relative z-10 scroll-smooth no-scrollbar">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase vibrant-gradient-text">
              {activeTab === "discover" ? "Pulse Hi" : activeTab === "library" ? "Tu Pulso" : "Buscar"}
            </h1>
            <p className="text-vibrant-muted text-[10px] font-bold tracking-widest uppercase mt-1">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-vibrant-card border border-white/10 flex items-center justify-center overflow-hidden">
             <img src="https://picsum.photos/seed/user/100/100" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "discover" ? (
            <motion.div 
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Featured Section */}
              <section>
                <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] p-1 bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-2xl">
                  <div className="aspect-[16/10] overflow-hidden rounded-[2.2rem]">
                    <img 
                      src="https://picsum.photos/seed/cyber/800/500" 
                      alt="Featured" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-vibrant-bg via-transparent to-transparent rounded-[2.2rem]" />
                  <div className="absolute top-0 right-0 p-10 opacity-40">
                    <div className="w-24 h-24 bg-vibrant-green blur-[60px] rounded-full" />
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-vibrant-green text-[10px] font-black uppercase tracking-[0.2em] mb-2 inline-block">EXCLUSIVO</span>
                    <h2 className="text-3xl font-black text-white mb-1 leading-tight tracking-tighter">Cyber Drift</h2>
                    <p className="text-vibrant-muted text-sm font-medium">X-Treme • 24-bit Lossless</p>
                  </div>
                </div>
              </section>

              {/* AI Recommendations */}
              <section className="space-y-6">
                <div className="flex justify-between items-end px-2">
                  <h3 className="text-lg font-bold tracking-tight uppercase flex items-center gap-2">
                    Descargas Recientes
                  </h3>
                  <button 
                    onClick={() => fetchRecommendations("Dark & Atmospheric")}
                    className="text-vibrant-green text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
                  >
                    Ver Todo
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {isSyncing ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="h-24 rounded-3xl bg-vibrant-card animate-pulse border border-white/5" />
                    ))
                  ) : (
                    recommendations.slice(0, 3).map((rec, i) => (
                      <motion.div 
                        key={rec.artist}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-3xl vibrant-glass flex items-center gap-4 transition-all hover:bg-white/5 active:scale-[0.98] group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-vibrant-bg flex-shrink-0 flex items-center justify-center border border-white/5 group-hover:border-vibrant-green/30 transition-colors">
                           <div className="text-[10px] font-black text-vibrant-muted uppercase tracking-tighter">MIX</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm tracking-tight text-white truncate">{rec.artist}</h4>
                            <span className="text-[8px] bg-vibrant-green text-black px-1.5 py-0.5 rounded-sm font-black uppercase tracking-tighter">HI-RES</span>
                          </div>
                          <p className="text-vibrant-muted text-[11px] truncate mt-0.5">{rec.description}</p>
                        </div>
                        <button className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-vibrant-muted group-hover:text-vibrant-green transition-colors">
                           <Download className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </section>

              {/* High Quality Tracks */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-tight px-2">Experiencia HD</h3>
                <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
                  {tracks.filter(t => t.isHighQuality).map(track => (
                    <motion.div 
                      key={track.id} 
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => playTrack(track)}
                      className="flex-shrink-0 w-36 space-y-3 cursor-pointer"
                    >
                      <div className="relative aspect-square rounded-[1.8rem] overflow-hidden bg-vibrant-card p-0.5 border border-white/5 shadow-lg group">
                        <img 
                          src={track.coverUrl} 
                          alt={track.title} 
                          className="w-full h-full object-cover rounded-[1.6rem] transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-white" />
                         </div>
                         <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-vibrant-green text-black text-[7px] font-black rounded-sm uppercase">HD</div>
                      </div>
                      <div className="px-1">
                        <h4 className="font-bold text-xs truncate text-white uppercase tracking-tighter">{track.title}</h4>
                        <p className="text-vibrant-muted text-[10px] font-bold uppercase tracking-tight truncate">{track.artist}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : activeTab === "library" ? (
            <motion.div 
              key="library"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
               <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-[2.5rem] border border-white/5 mb-8 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-vibrant-purple/10 blur-3xl rounded-full" />
                  <span className="text-vibrant-purple text-[8px] font-black uppercase tracking-[0.3em] mb-2 block">DISPONIBLE OFFLINE</span>
                  <h3 className="text-2xl font-black mb-1 leading-tight tracking-tighter">Tu Pulso</h3>
                  <p className="text-vibrant-muted text-xs font-semibold mb-6">Escucha {tracks.filter(t => t.isDownloaded).length} pistas en alta fidelidad sin datos.</p>
                  <div className="w-full h-1 bg-vibrant-bg/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(tracks.filter(t => t.isDownloaded).length / tracks.length) * 100}%` }}
                      className="h-full bg-vibrant-green neon-glow-green" 
                    />
                  </div>
               </div>

               <div className="space-y-2">
                 {tracks.map(track => (
                    <div 
                      key={track.id} 
                      className="flex items-center gap-4 group hover:bg-vibrant-card p-3 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/5"
                      onClick={() => playTrack(track)}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-vibrant-bg flex-shrink-0 border border-white/5">
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm tracking-tight text-white truncate">{track.title}</h4>
                        <p className="text-vibrant-muted text-[10px] font-bold uppercase truncate">{track.artist}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleDownload(track.id); }}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${track.isDownloaded ? 'border-vibrant-green text-vibrant-green bg-vibrant-green/10' : 'border-zinc-800 text-zinc-600 hover:text-vibrant-muted'}`}
                         >
                            {track.isDownloaded ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                         </button>
                      </div>
                    </div>
                 ))}
               </div>
            </motion.div>
          ) : (
            <motion.div 
               key="search"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-6"
            >
               <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-vibrant-muted rounded-full opacity-50" />
                  <input 
                    type="text" 
                    placeholder="Búsqueda de alta fidelidad..."
                    className="w-full h-16 pl-12 pr-4 bg-vibrant-card rounded-[1.5rem] border border-white/10 focus:border-vibrant-green outline-none transition-all placeholder:text-vibrant-muted text-sm font-bold uppercase tracking-tight"
                  />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  {["Techno", "House", "Ambient", "Electro", "Trance", "D&B"].map(genre => (
                    <div key={genre} className="aspect-video rounded-[1.5rem] bg-vibrant-card border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer group p-1">
                       <span className="font-black text-vibrant-muted uppercase tracking-[0.2em] text-[10px] group-hover:text-vibrant-green transition-colors">{genre}</span>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Indicators (Theme Specific) */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-[55] pointer-events-none">
        <div className={`h-1 rounded-full transition-all duration-300 ${activeTab === 'discover' ? 'w-4 bg-vibrant-green' : 'w-1 bg-vibrant-muted'}`} />
        <div className={`h-1 rounded-full transition-all duration-300 ${activeTab === 'search' ? 'w-4 bg-vibrant-green' : 'w-1 bg-vibrant-muted'}`} />
        <div className={`h-1 rounded-full transition-all duration-300 ${activeTab === 'library' ? 'w-4 bg-vibrant-green' : 'w-1 bg-vibrant-muted'}`} />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-vibrant-bg/95 backdrop-blur-3xl border-t border-white/10 flex items-start justify-center pt-2 px-8 z-50">
        <div className="flex justify-around items-center w-full max-w-lg">
          <button 
            onClick={() => setActiveTab("discover")}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === "discover" ? "text-vibrant-green" : "text-vibrant-muted"}`}
          >
            <div className={`w-6 h-6 rounded-full border-2 transition-colors ${activeTab === "discover" ? "border-vibrant-green bg-vibrant-green" : "border-vibrant-muted opacity-40"}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Hi</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("search")}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === "search" ? "text-vibrant-green" : "text-vibrant-muted"}`}
          >
            <Search className={`w-6 h-6 active:scale-95 transition-transform ${activeTab === "search" ? "opacity-100" : "opacity-40"}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Search</span>
          </button>

          <button 
            onClick={() => setActiveTab("library")}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === "library" ? "text-vibrant-green" : "text-vibrant-muted"}`}
          >
            <div className={`w-6 h-6 rounded-sm border-2 transition-colors ${activeTab === "library" ? "border-vibrant-green bg-vibrant-green" : "border-vibrant-muted opacity-40"}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Lib</span>
          </button>
        </div>
      </nav>

      {/* Mini Player */}
      <AnimatePresence>
        {currentTrack && !showFullPlayer && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setShowFullPlayer(true)}
            className="fixed bottom-24 left-4 right-4 h-18 bg-vibrant-card/95 backdrop-blur-xl rounded-[1.2rem] border border-white/10 flex items-center px-4 gap-4 cursor-pointer z-40 group shadow-2xl"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 shadow-lg">
               <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                 <h4 className="text-xs font-black truncate text-white uppercase tracking-tight">{currentTrack.title}</h4>
                 <span className="text-[7px] text-vibrant-green border border-vibrant-green/30 px-1 rounded-sm font-black">HD</span>
               </div>
               <p className="text-[9px] font-bold text-vibrant-muted truncate uppercase tracking-tighter">REPRODUCIENDO EN ALTA FIDELIDAD</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay}
                className="w-9 h-9 bg-vibrant-text rounded-full flex items-center justify-center text-vibrant-bg hover:scale-105 active:scale-90 transition-all shadow-lg"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
            </div>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-vibrant-bg rounded-t-full overflow-hidden">
               <motion.div className="h-full bg-vibrant-green" style={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Player Overlay */}
      <AnimatePresence>
        {showFullPlayer && currentTrack && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="fixed inset-0 bg-vibrant-bg z-[60] flex flex-col p-8 overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none opacity-40">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-vibrant-purple/20 via-transparent to-transparent" />
               <div 
                 className="absolute inset-0 opacity-20 blur-3xl scale-150 animate-pulse duration-[10s]"
                 style={{ backgroundColor: isPlaying ? 'rgba(204,255,0,0.4)' : 'rgba(191,0,255,0.4)' }}
               />
            </div>

            <header className="flex justify-between items-center relative z-10 mb-8 sm:mb-12">
              <button onClick={() => setShowFullPlayer(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors backdrop-blur-xl border border-white/5">
                 <ChevronDown className="w-6 h-6 text-vibrant-green" />
              </button>
              <div className="text-center">
                <span className="text-[10px] font-black text-vibrant-muted uppercase tracking-[0.3em] block mb-1">PULSE HI-RES</span>
                <p className="text-xs font-black text-white tracking-[0.1em] uppercase">{currentTrack.genre}</p>
              </div>
              <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors backdrop-blur-xl border border-white/5">
                 <MoreVertical className="w-6 h-6 text-vibrant-muted" />
              </button>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-8 sm:gap-14 max-w-md mx-auto w-full">
               <motion.div 
                 animate={{ 
                   rotate: isPlaying ? 360 : 0, 
                   scale: isPlaying ? 1.05 : 1,
                   boxShadow: isPlaying ? "0 0 80px rgba(204,255,0,0.1)" : "0 0 40px rgba(0,0,0,0.5)"
                 }}
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                 className="w-full aspect-square rounded-[3rem] overflow-hidden bg-vibrant-card relative p-1.5 border border-white/10"
               >
                 <img 
                    src={currentTrack.coverUrl} 
                    alt={currentTrack.title} 
                    className="w-full h-full object-cover rounded-[2.8rem]"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
               </motion.div>

               <div className="w-full space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="min-w-0 flex-1">
                      <motion.h2 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="text-4xl font-black truncate tracking-tighter leading-none mb-1"
                      >
                        {currentTrack.title}
                      </motion.h2>
                      <p className="text-vibrant-green text-sm font-black uppercase tracking-[0.1em]">{currentTrack.artist}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-[8px] px-2 py-1 bg-vibrant-green text-black font-black rounded-sm">HI-RES AUDIO</span>
                       <Heart className="w-6 h-6 text-vibrant-muted hover:text-vibrant-purple transition-colors cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-6">
                    <div className="w-full h-1.5 bg-white/10 rounded-full relative group cursor-pointer overflow-hidden">
                       <motion.div 
                         className="absolute inset-y-0 left-0 bg-vibrant-green vibrant-gradient-green shadow-[0_0_10px_#CCFF00]"
                         style={{ width: `${progress}%` }}
                       />
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-vibrant-muted uppercase tracking-widest">
                      <span>0:{Math.floor((progress/100) * 240).toString().padStart(2, '0')}</span>
                      <span>{currentTrack.duration}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="h-44 flex flex-col items-center justify-center relative z-10 gap-8">
               <div className="flex items-center justify-center gap-8 sm:gap-14">
                 <button className="text-vibrant-muted hover:text-white transition-all active:scale-90">
                   <SkipBack className="w-10 h-10 fill-current" />
                 </button>
                 <button 
                   onClick={togglePlay}
                   className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-vibrant-bg shadow-2xl active:scale-95 transition-all hover:bg-vibrant-green"
                 >
                   {isPlaying ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-1.5" />}
                 </button>
                 <button className="text-vibrant-muted hover:text-white transition-all active:scale-90">
                   <SkipForward className="w-10 h-10 fill-current" />
                 </button>
               </div>

               <div className="w-full max-w-sm flex items-center justify-between text-vibrant-muted px-4">
                  <div className="flex items-center gap-3 group flex-1">
                    <Volume2 className="w-4 h-4 group-hover:text-vibrant-green transition-colors" />
                    <div className="h-1 bg-white/10 rounded-full flex-1 max-w-[120px] overflow-hidden">
                       <div className="h-full bg-vibrant-green w-2/3" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => handleDownload(currentTrack.id)}
                      className={`transition-all ${currentTrack.isDownloaded ? 'text-vibrant-green' : 'hover:text-white'}`}
                    >
                      {currentTrack.isDownloaded ? <Check className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                    </button>
                    <div className="p-2 border border-white/10 rounded-lg">
                      <Zap 
                        className={`w-6 h-6 ${currentTrack.isHighQuality ? 'text-vibrant-green fill-vibrant-green shadow-glow' : ''}`} 
                      />
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
