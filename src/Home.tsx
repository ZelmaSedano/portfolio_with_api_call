import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

// hi justine, feel free to look at the comments in the modal section to learn more about how to render modals.  the component is in DesktopIcon.tsx :)

// component imports
import Taskbar from './components/Taskbar'
import './components/Taskbar.css'
import DesktopIcon from './components/DesktopIcon';
import './components/DesktopIcon.css'; // contains both icon + modal styles

// import images
// don't remove thesend one lol 
import send from './assets/send.png'
import earth from './assets/earth.ico'

type HoroscopeData = {
    data: {
        date: string;
        horoscope_data: string;
    };
};

function Home() {
    // portfolio dropdown
    const portfolioRef = useRef<HTMLLIElement>(null);
    // dragging feature
    const windowRef = useRef<HTMLDivElement | null>(null);
    // clock
    const location = useLocation();

    // STATES
    const [position, setPosition] = useState(() => {
        const saved = sessionStorage.getItem('windowPosition');
        // if there isn't a saved position, center the window on default load
        return saved ? JSON.parse(saved) : { 
            x: Math.max(0, (window.innerWidth - 1000) / 2),
            y: Math.max(0, (window.innerHeight - 600) / 2)
        };
    });
    // taskbar clock
    const [currentTime, setCurrentTime] = useState(new Date());
    // window visibility
    const [isVisible, setIsVisible] = useState(true);
    // drag the content window
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // icons
    const [showCatModal, setShowCatModal] = useState(false);
    const [showYesModal, setShowYesModal] = useState(false);
    const [showLoveModal, setShowLoveModal] = useState(false);

    const [showScreamModal, setShowScreamModal] = useState(false);

    // horoscope API states
    const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
    const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sign, setSign] = useState('aries'); // Default sign

    const [cdPlayerPosition, setCdPlayerPosition] = useState({ x: 0, y: 0 });

    const [clippyPosition, setClippyPosition] = useState({ x: 0, y: 0 });
    const [showClippyModal, setShowClippyModal] = useState(false);
    const [chatbotInput, setChatbotInput] = useState('');
    const [chatHistory, setChatHistory] = useState<Array<{sender: string, message: string}>>([]);
    const [shouldShake, setShouldShake] = useState(false);

        // Add this to your existing states
    const [showPlayModal, setShowPlayModal] = useState(false);

    // Add this audio state
    const [audioPlayer, setAudioPlayer] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    });

    // portfolio dropdown
    const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);

    // API fetches
    const fetchHoroscope = async (sign: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/horoscope?sign=${sign.toLowerCase()}`); // <-- No full URL needed
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setHoroscopeData(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch horoscope";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const handleGetHoroscope = () => {
    fetchHoroscope(sign);
    };

    // getters
    const getChatbotResponse = async (input: string): Promise<string> => {
        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.message;
            } catch (error) {
                console.error('Chatbot error:', error);
                return "Sorry, I'm having trouble responding right now!";
            }
    };
    const handleChatbotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatbotInput.trim()) return;

        // Add user message
        const userMessage = chatbotInput;
        setChatHistory(prev => [...prev, { 
            sender: 'user',
            message: userMessage
        }]);
        setChatbotInput('');

        // Get bot response from server
        const botMessage = await getChatbotResponse(userMessage);
        
        // Add bot message
        setChatHistory(prev => [...prev, { 
            sender: 'bot', 
            message: botMessage 
        }]);
    };


    // useEffects
    // save the position of the window to session storage
    useEffect(() => {
        sessionStorage.setItem('windowPosition', JSON.stringify(position));
    }, [position]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup
    }, []);
    
    // cd player
    // cd player
    useEffect(() => {
        const updateCDPosition = () => {
            // Top-right corner of viewport (not document)
            setCdPlayerPosition({
                x: window.innerWidth - 100, // 100px from right edge
                y: 20 // 20px from top edge (adjust as needed)
            });
        };
        
        // initial position
        updateCDPosition();
        
        // update on window resize
        window.addEventListener('resize', updateCDPosition);
        
        return () => {
            window.removeEventListener('resize', updateCDPosition);
        };
    }, [location.pathname]);

    // CLIPPY
    // clippy useEffect, keeps him stuck to the bottom-right
    useEffect(() => {
        const updateClippyPosition = () => {
            // get document height
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            );
            
            // bottom-right corner of document
            setClippyPosition({
            x: window.innerWidth - 100, // 80px from right edge
            y: documentHeight - 150 // 120px from bottom
            });
        };
        // initial position
        updateClippyPosition();
        // update on window resize and load
        window.addEventListener('resize', updateClippyPosition);
        window.addEventListener('load', updateClippyPosition);
        return () => {
            window.removeEventListener('resize', updateClippyPosition);
            window.removeEventListener('load', updateClippyPosition);
        };
    }, [location.pathname]);

    
    // clippy shake on initial page load
    useEffect(() => {
        // Check if shake has already been shown in this session
        const hasShaken = sessionStorage.getItem('clippyShaken');
        
        if (!hasShaken) {
            // Trigger the shake
            setShouldShake(true);
            // Mark as shaken for this session
            sessionStorage.setItem('clippyShaken', 'true');
            
            // Reset after animation completes (adjust time to match your CSS animation duration)
            const shakeTimer = setTimeout(() => {
                setShouldShake(false);
            }, 1000); // Adjust this time to match your animation duration
            
            return () => clearTimeout(shakeTimer);
        }
    }, []);
    // clippy shakes on page reload, not just first visit
    useEffect(() => {
        return () => {
            // Reset on page unload if you want it to shake on next visit
            sessionStorage.removeItem('clippyShaken');
        };
    }, []);

    // handlers
    // window dragging effect
    const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on dropdown or its children
        if (
            (e.target as HTMLElement).closest('.blue-bar') && 
            !(e.target as HTMLElement).closest('.x-button') &&
            !(e.target as HTMLElement).closest('.portfolio-dropdown') &&
            !(e.target as HTMLElement).closest('.portfolio-link-wrapper')
        ) {
            const rect = windowRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDragging(true);
            setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
            });
        }
    };
    // native DOM event handlers (used with addEventListener)
    const handleNativeMouseMove = (e: MouseEvent) => {
        if (isDragging && windowRef.current) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            const { offsetWidth, offsetHeight } = windowRef.current;
            
            setPosition({
                x: Math.max(0, Math.min(newX, window.innerWidth - offsetWidth)),
                y: Math.max(0, Math.min(newY, window.innerHeight - offsetHeight))
            });
        }
    };
    const handleNativeMouseUp = () => setIsDragging(false);
    useEffect(() => {
        document.addEventListener('mousemove', handleNativeMouseMove);
        document.addEventListener('mouseup', handleNativeMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleNativeMouseMove);
            document.removeEventListener('mouseup', handleNativeMouseUp);
        };
    }, [isDragging, dragOffset]);

    // Add this function after your other functions
    const handlePlayAudio = () => {
        const audioElement = document.getElementById('audio-player')  as HTMLAudioElement;
        if (audioElement) {
            if (audioPlayer.isPlaying) {
            audioElement.pause();
            } else {
            audioElement.play();
            }
            setAudioPlayer(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
        }
    };

    // Add this function to handle time updates
    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
        const audio = e.target as HTMLAudioElement;
        setAudioPlayer(prev => ({
            ...prev,
            currentTime: audio.currentTime,
            duration: audio.duration || 0
        }));
    };

    // Function to handle seeking
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audioElement = document.getElementById('audio-player') as HTMLAudioElement;
        const seekTime = parseFloat(e.target.value);
        if (audioElement) {
            audioElement.currentTime = seekTime;
            setAudioPlayer(prev => ({ ...prev, currentTime: seekTime }));
        }
    };

    // Function to format time (seconds to MM:SS)
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // portfolio dropdown
    const handlePortfolioClick = (e: React.MouseEvent) => {
        // fixes window drag breaking, if you don't include this the blue-bar drag 
        e.stopPropagation();
        setIsPortfolioDropdownOpen(!isPortfolioDropdownOpen);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (portfolioRef.current && !portfolioRef.current.contains(event.target as Node)) {
            setIsPortfolioDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // toggle visibility
    const toggleWindow = () => setIsVisible(!isVisible);

    return (
        <>
            {/* cat icon */}
            <div className="desktop">
                {/* when you click the desktop icon, setShowModal is set to true */}
                <DesktopIcon
                    icon="images/cat.png"
                    label="meowdy"
                    x={50}
                    y={35}
                    onClick={() => setShowCatModal(true)}
                />

                {showCatModal && (
                    <div className="modal-overlay" onClick={() => setShowCatModal(false)}>{/* when the user clicks again, setShowModal is set to false (modal isn't shown) */}
                    {/* if you click inside the modal, then setShowModal ISN'T set to false */}
                    {/* onClick takes the event, and returns 'don't propogate this event' function */}
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Question...</span>
                                <button className='x-button' onClick={() => setShowCatModal(false)}>✕</button>
                            </div>
                            {/* body of modal */}
                            <div className="modal-body">Do you like cats?</div>
                            {/* CHALLENGE: add two buttons to this modal, 'yes', and 'I love them!', and return a message to the user based on their selection */}
                            <div className='cat-buttons'>
                                <button 
                                className='cat-button'
                                onClick={() => {
                                    setShowCatModal(false);
                                    setShowYesModal(true);
                                }}
                                >
                                    Yes
                                </button>
                                <button 
                                    className='cat-button'
                                    onClick={() => {
                                        setShowCatModal(false);
                                        setShowLoveModal(true);
                                    }}
                                >
                                    Yes, I do 
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

                {/* define what showYesModal is */}
                {showYesModal && (
                    <div className="modal-overlay" onClick={() => setShowYesModal(false)}>
                        <div className="modal cat-response-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Smart Answer</span>
                                <button className='x-button' onClick={() => setShowYesModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="image-container">
                                    <img src="/images/evil_cat.gif" alt="evil_cat" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showLoveModal && (
                    <div className="modal-overlay" onClick={() => setShowLoveModal(false)}>
                        <div className="modal cat-response-modals" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>That's right, MINION</span>
                                <button className='x-button' onClick={() => setShowLoveModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="image-container">
                                    <img src="/images/evil_cat.gif" alt="evil_cat" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* scream icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/scream_2.png"
                    label="RING RING"
                    x={50}
                    y={145}
                    onClick={() => setShowScreamModal(true)}
                />

                {showScreamModal && (
                    <div className="modal-overlay" onClick={() => setShowScreamModal(false)}>

                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className='scream-modal'>I know what you did last summer</span>
                            <button className='x-button' onClick={() => setShowScreamModal(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <img src="/images/wassup.gif" className='gif' alt="evil_cat" />
                        </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* horoscope icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/scandique.jpg"
                    label="horoscope"
                    x={50}
                    y={255}
                    onClick={() => setShowHoroscopeModal(true)}
                    className=''
                    imgClassName='horoscope-icon'
                />

                {showHoroscopeModal && (
                    <div className="modal-overlay" onClick={() => setShowHoroscopeModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span>Your Horoscope</span>
                            <button className='x-button' onClick={() => setShowHoroscopeModal(false)}>✕</button>
                        </div>

                        {/* modal body */}
                        <div className="modal-body">
                            <div className="horoscope-controls">
                            <select 
                                value={sign} 
                                onChange={(e) => setSign(e.target.value)}
                                className="horoscope-select"
                            >
                                {["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].map((sign) => (
                                <option key={sign} value={sign}>
                                    {sign.charAt(0).toUpperCase() + sign.slice(1)}
                                </option>
                                ))}
                            </select>
                            
                            <button 
                                onClick={handleGetHoroscope}
                                className="horoscope-button"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Get Horoscope"}
                            </button>
                            </div>

                            {error && <div className="error">{error}</div>}

                            {horoscopeData && (
                            <div className="horoscope-results">
                                <h3>{sign.charAt(0).toUpperCase() + sign.slice(1)}</h3>
                                <p><strong>Date:</strong> {horoscopeData.data.date}</p>
                                <p><strong>Horoscope Data:</strong> {horoscopeData.data.horoscope_data}</p>
                            </div>
                            )}
                        </div>
                        </div>
                    </div>
                    )}
            </div>

            {/* media player */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/play.ico"
                    label="play"
                    x={cdPlayerPosition.x}
                    y={cdPlayerPosition.y}
                    onClick={() => setShowPlayModal(true)}
                />

                {showPlayModal && (
                    <div className="modal-overlay" onClick={() => setShowPlayModal(false)}>
                        <div className="modal media-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Media Player</span>
                                <button className='x-button' onClick={() => {
                                    setShowPlayModal(false);
                                    const audioElement = document.getElementById('audio-player') as HTMLAudioElement;
                                    if (audioElement) {
                                    audioElement.pause();
                                    setAudioPlayer({ isPlaying: false, currentTime: 0, duration: 0 });
                                    }
                                    }}>✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="media-player-container">
                                    {/* Audio element - hidden but controls playback */}
                                    <audio
                                        id="audio-player"
                                        src="/public/Miki_Matsubara_-_Stay_With_Me_(mp3.pm).mp3"
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={(e) => {
                                            const audioElement = e.currentTarget as HTMLAudioElement;
                                            setAudioPlayer(prev => ({ ...prev, duration: audioElement.duration }));
                                        }}
                                        onEnded={() => {
                                            setAudioPlayer(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
                                        }}
                                    />
                                    
                                    {/* player controls */}
                                    <div className="media-controls">
                                        <div className='media-player-image'>
                                            <img src='/public/images/miki.jpg' className='miki'></img>
                                        </div>
                                        
                                        {/* song progress */}
                                        <div className="progress-container">
                                            {/* play/pause button */}
                                            <button 
                                                className="play-button"
                                                onClick={handlePlayAudio}
                                            >
                                                {audioPlayer.isPlaying ? '⏸️' : '▶️'}
                                            </button>
                                            <span className="time-display current-time">
                                                {formatTime(audioPlayer.currentTime)}
                                            </span>
                                            
                                            <input
                                                type="range"
                                                className="progress-bar"
                                                min="0"
                                                max={audioPlayer.duration || 100}
                                                value={audioPlayer.currentTime}
                                                onChange={handleSeek}
                                                step="0.1"
                                            />
                                            
                                            <span className="time-display total-time">
                                                {formatTime(audioPlayer.duration)}
                                            </span>
                                        </div>
                                        
                                        <div className="volume-controls">
                                            <span className="volume-icon">🔊</span>
                                            <input
                                                type="range"
                                                className="volume-bar"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                defaultValue="1"
                                                onChange={(e) => {
                                                    const audioElement = document.getElementById('audio-player') as HTMLAudioElement;
                                                    if (audioElement) {
                                                    audioElement.volume = parseFloat(e.target.value);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                
                                {/* Track info */}
                                <div className="track-info">
                                <div className="track-title">Now Playing: "Stay with Me"</div>
                                <div className="track-artist">Artist Name: Miki Matsubara</div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>


            {/* clippy */}
            <div className="desktop">
                {/* when you click the desktop icon, setShowModal is set to true */}
                <DesktopIcon
                    icon="/images/mad_clippy.png"
                    label="Hello???"
                    x={clippyPosition.x}
                    y={clippyPosition.y}
                    onClick={() => setShowClippyModal(true)}
                    className={`clippy ${shouldShake ? 'shake-animation' : ''}`}
                />
                {showClippyModal && (
                    <div className="modal-overlay" onClick={() => setShowClippyModal(false)}>
                        <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
                        <div className='chatbot-modal-header'>
                            <span>ClipBot Messenger</span>
                            <button className='x-button clippy-x' onClick={() => setShowClippyModal(false)}>✕</button>
                        </div>
                        
                        <div className="chatbot-body">
                            <div className="chat-history">
                                {chatHistory.map((chat, index) => (
                                    <div key={index} className={`chat-message ${chat.sender}`}>
                                        <div className="message-header">
                                            <span className="message-sender">
                                                {chat.sender === 'user' ? 'You:' : 'Clippy:'}
                                            </span>
                                        </div>
                                        <div className="message-content">
                                            {chat.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Chat input */}
                            <form onSubmit={handleChatbotSubmit} className="chat-input-form">
                            <input
                                type="text"
                                value={chatbotInput}
                                onChange={(e) => setChatbotInput(e.target.value)}
                                placeholder="Type your message..."
                                className="chat-input"
                            />
                            <button type="submit" className="end-button">
                                <img src={send} alt="Send" className="send-icon" />
                            </button>
                            </form>
                        </div>
                        </div>
                    </div>
                    )}
        </div>


        {/* content window - draggable */}
            {/* if isVisible is true, */}
            {isVisible && (
                <div 
                    className={`window ${isVisible ? 'visible' : ''}`}
                    ref={windowRef}
                    style={{
                        position: 'absolute',
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        cursor: isDragging ? 'grabbing' : 'default'
                    }}
                    onMouseDown={handleMouseDown}
                >
                    {/* header */}
                    <header>
                        <section className='blue-bar'>
                            <img src="/images/connections.ico" className='icon' alt="icon"/>
                            <section className='blue-bar-text'>DevScape - Val Sedano</section>

                            <div className="button-container">
                                <button className='x-button' onClick={toggleWindow}>✕</button>
                            </div>
                        </section>


                        {/* *************************** NAVBAR ************************/}
                        <nav className='navbar'>
                            <ul>
                                {/* allows you to style the Home button when it's the router path */}
                                <li className={`button left-button ${location.pathname === '/' ? 'active-home' : ''}`}>
                                    <Link to="/">
                                        <img src="/images/Starfield.ico" className='home-icon' alt='home'/>
                                        <p>Home</p>
                                    </Link>
                                </li>


                                {/* portfolio navbar button*/}
                                <li 
                                    ref={portfolioRef}
                                    className={`button portfolio-dropdown-container ${isPortfolioDropdownOpen ? 'active-portfolio' : ''}`}
                                >
                                    <div 
                                    className="portfolio-link-wrapper"
                                    onClick={handlePortfolioClick}
                                    >
                                        <img src="/images/Painting.ico" className='paint-icon' alt='portfolio'/>
                                        <p>Portfolio</p>
                                        <div className="dropdown-arrow">
                                            <img src="/images/downward-arrow.png" className='caret-down' alt='portfolio'/>
                                        </div>
                                    </div>

                                    {isPortfolioDropdownOpen && (
                                    
                                        <div 
                                            className="portfolio-dropdown"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Link 
                                                to="/portfolio" 
                                                className="dropdown-item"
                                                onClick={() => setIsPortfolioDropdownOpen(false)}
                                            >
                                                <span className="dropdown-icon">📁</span>
                                                <span>All Projects</span>
                                            </Link>
                                            <Link 
                                                to="/webcraft"
                                                className="dropdown-item"
                                                onClick={() => setIsPortfolioDropdownOpen(false)}
                                            >
                                                <span className="dropdown-icon">🌐</span>
                                                <span>WebCraft</span>
                                            </Link>
                                            <Link 
                                                to="/personal"
                                                className="dropdown-item"
                                                onClick={() => setIsPortfolioDropdownOpen(false)}
                                            >
                                                <span className="dropdown-icon">🎨</span>
                                                <span>Personal</span>
                                            </Link>
                                            <Link 
                                                to="/ux"
                                                className="dropdown-item"
                                                onClick={() => setIsPortfolioDropdownOpen(false)}
                                            >
                                                <span className="dropdown-icon">🎮</span>
                                                <span>UX/UI Design</span>
                                            </Link>
                                            <Link 
                                                to="/ai"
                                                className="dropdown-item"
                                                onClick={() => setIsPortfolioDropdownOpen(false)}
                                            >
                                                <span className="dropdown-icon">🕐</span>
                                                <span>AI & Python</span>
                                            </Link>
                                        </div>
                                    )}
                                </li>

                                {/* <li className='button'>
                                    <Link to="/portfolio">
                                        <img src="/images/Painting.ico" className='paint-icon' alt='portfolio'/>
                                        <p>Portfolio</p>
                                    </Link>
                                </li> */}






                                <li className='button'>
                                    <Link to="/resume">
                                        <img src="/images/resume.png"className='resume-icon' alt='resume'></img>
                                        <p>Resume</p>
                                    </Link>
                                </li>
                                {/* <li className='button'>
                                    <Link to="/about">
                                        <img src="/src/assets/resume.png" className='resume-icon' alt='about'></img>
                                        <p>About</p>
                                    </Link>
                                </li> */}
                                <li className='button'>
                                    <Link to="/contact">
                                        <img src={send} className='contact-icon' alt='contact'></img>
                                        <p>Contact</p>
                                    </Link>
                                </li>   
                            </ul>
                        </nav>
                    </header>

                    {/* URL bar */}
                    <div className='url-container'>
                        <div className = 'url-bar'>
                            <div className = 'url-bar-small-1'>Address</div>
                            <div className = 'url-bar-large'>
                                <div className='dropdown-container'>
                                    <div className='url-text'>http://www.geocities.com/val_is_best_dev</div>
                                </div>
                                <button className='url-dropdown-button'>▼</button>
                            </div>
                            <div className = 'url-bar-small-2'>Links</div>
                        </div>
                    </div>

                    {/* window content */}
                    <div className='content'>
                        <div className='homepage-banners'>
                            <img className='computer' src="/images/computer_1.png" alt="computer_1" />
                            <div className='inner-banner-text'>
                                <p className='banner'>-- Val Sedano --</p>
                                <p className='banner-1'>Fully Immersive Nostalgia Expert</p>
                            </div>
                            <img className='computer' src="/images/computer-2.png" alt="computer_2" />
                        </div>

                        <div className='bio-section'>
                            <div className='sub-bio-section'>
                                <img src='/images/webcraft_1.png' className='homepage-pic' />
                                <div className='bio-container'>
                                    <p className='sub-bio-text'>Slow Tech Design</p>
                                    <p className='sub-bio-p'>
                                        In an ever-changing world where users sense of safety is paramount, let's create environments that address their need for comfort
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* content footer */}
                        <div className="footer">
                            <div className='footer-section footer-large'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className='footer-section footer-medium'>
                                <img src={earth} className='content-footer-icon' alt='content_footer'></img>
                                <p className='footer-section-text'>Internet</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* taskbar */}
            <Taskbar
                isVisible={isVisible} 
                toggleWindow={toggleWindow}
                currentTime={currentTime}
            />
        </>
    );
}

export default Home;