import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

import Taskbar from './components/Taskbar'
import './components/Taskbar.css'
import DesktopIcon from './components/DesktopIcon';
import './components/DesktopIcon.css'; // contains both icon + modal 

import send from './assets/send.png'
import earth from './assets/earth.ico'

type HoroscopeData = {
    data: {
        date: string;
        period: string;
        sign: string;
        horoscope: string;
    };
};


function Resume() {
    const windowRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();


    // modal ref
    const catModalRef = useRef<HTMLDivElement | null>(null);
    const screamModalRef = useRef<HTMLDivElement | null>(null);
    const horoscopeModalRef = useRef<HTMLDivElement | null>(null);
    const playModalRef = useRef<HTMLDivElement | null>(null);
    const yesModalRef = useRef<HTMLDivElement | null>(null);
    const loveModalRef = useRef<HTMLDivElement | null>(null);
    const popupModalRef = useRef<HTMLDivElement | null> (null);

    // STATES
    const [position, setPosition] = useState(() => {
        const saved = sessionStorage.getItem('windowPosition');
        return saved ? JSON.parse(saved) : { 
            x: Math.max(0, (window.innerWidth - 1000) / 2),
            y: Math.max(0, (window.innerHeight - 600) / 2)
        };
    });
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1450);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isVisible, setIsVisible] = useState(true);
    // drag window
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // ICON STATES
    const [showCatModal, setShowCatModal] = useState(false);
    const [showYesModal, setShowYesModal] = useState(false);
    const [showLoveModal, setShowLoveModal] = useState(false);
    const [isDraggingCat, setIsDraggingCat] = useState(false);
    const [catPosition, setCatPosition] = useState({ x: 200, y: 200 });
    const [catDragOffset, setCatDragOffset] = useState({ x: 0, y: 0 });
    // yes modal (for cat response)
    const [isDraggingYes, setIsDraggingYes] = useState(false);
    const [yesPosition, setYesPosition] = useState({ x: 250, y: 250 });
    const [yesDragOffset, setYesDragOffset] = useState({ x: 0, y: 0 });
    // love modal (for cat response)
    const [isDraggingLove, setIsDraggingLove] = useState(false);
    const [lovePosition, setLovePosition] = useState({ x: 300, y: 300 });
    const [loveDragOffset, setLoveDragOffset] = useState({ x: 0, y: 0 });

    // scream
    const [showScreamModal, setShowScreamModal] = useState(false);
    const [isDraggingScream, setIsDraggingScream] = useState(false);
    const [screamPosition, setScreamPosition] = useState({ x: 200, y: 200 });
    const [screamDragOffset, setScreamDragOffset] = useState({ x: 0, y: 0 });
    
    // horoscope API states
    const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
    const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sign, setSign] = useState('aries');
    const [isDraggingHoroscope, setIsDraggingHoroscope] = useState(false);
    const [horoscopePosition, setHoroscopePosition] = useState({ x: 200, y: 200 });
    const [horoscopeDragOffset, setHoroscopeDragOffset] = useState({ x: 0, y: 0 });

    // media player
    const [cdPlayerPosition, setCdPlayerPosition] = useState({ x: 0, y: 0 });
    const [showPlayModal, setShowPlayModal] = useState(false);
    const [isDraggingPlay, setIsDraggingPlay] = useState(false);
    const [playPosition, setPlayPosition] = useState({ x: 200, y: 200 });
    const [playDragOffset, setPlayDragOffset] = useState({ x: 0, y: 0 });

    // pop-up
    const [popupPosition, setpopupPosition] = useState({ x: 0, y: 0 });
    const [showPopUpModal, setshowPopUpModal] = useState(false);
    const [isDraggingPopup, setIsDraggingPopup] = useState(false);
    const [popupDragOffset, setPopupDragOffset] = useState({ x: 0, y: 0 });

    // const [clippyPosition, setClippyPosition] = useState({ x: 0, y: 0 });
    // const [showClippyModal, setShowClippyModal] = useState(false);


    // Add this audio state
    const [audioPlayer, setAudioPlayer] = useState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
    });

    // portfolio dropdown
    // const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);

    // fetch - VITE WAS BLOCKING THIS FROM WORKING, REMEMBER TO UPDATE VITE.CONFIG NEXT
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


    // USEEFFECTS FUNCTIONS
    // when the window is above 1445 setIsWideScreen is set
    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 1445);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // check window position
    useEffect(() => {
        sessionStorage.setItem('windowPosition', JSON.stringify(position));
    }, [position]);
    // clock
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup
    }, []);

    // cd player - sets position on page (top-right)
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
    // pop-up position useEffect
    useEffect(() => {
        const updatePopUpPosition = () => {
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
            setpopupPosition({
            x: window.innerWidth - 100, // 80px from right edge
            y: documentHeight - 150 // 120px from bottom
            });
        };
        // initial position
        updatePopUpPosition();
        // update on window resize and load
        window.addEventListener('resize', updatePopUpPosition);
        window.addEventListener('load', updatePopUpPosition);
        return () => {
            window.removeEventListener('resize', updatePopUpPosition);
            window.removeEventListener('load', updatePopUpPosition);
        };
    }, [location.pathname]);


    // MODAL: USEEFFECTS
    // cat modal
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingCat && catModalRef.current) {
                setCatPosition({
                    x: e.clientX - catDragOffset.x,
                    y: e.clientY - catDragOffset.y
                });
            }
        };
        const handleMouseUp = () => setIsDraggingCat(false);
        
        if (isDraggingCat) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingCat, catDragOffset]);
    // Yes modal drag
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingYes && yesModalRef.current) {
                setYesPosition({
                    x: e.clientX - yesDragOffset.x,
                    y: e.clientY - yesDragOffset.y
                });
            }
        };
        const handleMouseUp = () => setIsDraggingYes(false);
        
        if (isDraggingYes) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingYes, yesDragOffset]);

    // Love modal drag
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingLove && loveModalRef.current) {
                setLovePosition({
                    x: e.clientX - loveDragOffset.x,
                    y: e.clientY - loveDragOffset.y
                });
            }
        };
        const handleMouseUp = () => setIsDraggingLove(false);
        
        if (isDraggingLove) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingLove, loveDragOffset]);
    // scream modal
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingScream && screamModalRef.current) {
                setScreamPosition({
                    x: e.clientX - screamDragOffset.x,
                    y: e.clientY - screamDragOffset.y
                });
            }
        };
        const handleMouseUp = () => setIsDraggingScream(false);
        
        if (isDraggingScream) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingScream, screamDragOffset]);
    // scream modal
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingScream && screamModalRef.current) {
                setScreamPosition({
                    x: e.clientX - screamDragOffset.x,
                    y: e.clientY - screamDragOffset.y
                });
            }
        };
        const handleMouseUp = () => setIsDraggingScream(false);
        
        if (isDraggingScream) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingScream, screamDragOffset]);
    // horoscope
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingHoroscope && horoscopeModalRef.current) {
                setHoroscopePosition({
                    x: e.clientX - horoscopeDragOffset.x,
                    y: e.clientY - horoscopeDragOffset.y
                });
            }
        };
        const handleMouseUp = () => setIsDraggingHoroscope(false);
        
        if (isDraggingHoroscope) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingHoroscope, horoscopeDragOffset]);
    // play modal
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingPlay && playModalRef.current) {
                setPlayPosition({
                    x: e.clientX - playDragOffset.x,
                    y: e.clientY - playDragOffset.y
                });
            }
        };
        const handleMouseUp = () => setIsDraggingPlay(false);
        
        if (isDraggingPlay) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingPlay, playDragOffset]);
    // mystery popup
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingPlay && popupModalRef.current) {
                setpopupPosition({
                    x: e.clientX - popupDragOffset.x,
                    y: e.clientY - popupDragOffset.y
                });
            }
        };
        const handleMouseUp = () => setIsDraggingPopup(false);
        
        if (isDraggingPopup) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingPopup, popupDragOffset]);




    // HANDLERS
    // window dragging handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        // don't start dragging if clicking on dropdown or its children
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
    // window dragging useEffect
    useEffect(() => {
        document.addEventListener('mousemove', handleNativeMouseMove);
        document.addEventListener('mouseup', handleNativeMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleNativeMouseMove);
            document.removeEventListener('mouseup', handleNativeMouseUp);
        };
    }, [isDragging, dragOffset]);


    // media player
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
    // seek/media player
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audioElement = document.getElementById('audio-player') as HTMLAudioElement;
        const seekTime = parseFloat(e.target.value);
        if (audioElement) {
            audioElement.currentTime = seekTime;
            setAudioPlayer(prev => ({ ...prev, currentTime: seekTime }));
        }
    };
    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
        const audio = e.target as HTMLAudioElement;
        setAudioPlayer(prev => ({
            ...prev,
            currentTime: audio.currentTime,
            duration: audio.duration || 0
        }));
    };
    // format time (seconds to MM:SS)
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };



    // modal handlers for dragging
    const handleCatMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.modal-header') && 
            !(e.target as HTMLElement).closest('.x-button')) {
            const rect = catModalRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDraggingCat(true);
            setCatDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };
    // cat: yes modal
        const handleYesMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.modal-header') && 
            !(e.target as HTMLElement).closest('.x-button')) {
            const rect = yesModalRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDraggingYes(true);
            setYesDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };
    // cat: love modal
    const handleLoveMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.modal-header') && 
            !(e.target as HTMLElement).closest('.x-button')) {
            const rect = loveModalRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDraggingLove(true);
            setLoveDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };
    const handleScreamMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.modal-header') && 
            !(e.target as HTMLElement).closest('.x-button')) {
            const rect = screamModalRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDraggingScream(true);
            setScreamDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };
    const handleHoroscopeMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.modal-header') && 
            !(e.target as HTMLElement).closest('.x-button')) {
            const rect = horoscopeModalRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDraggingHoroscope(true);
            setHoroscopeDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };
    const handlePlayMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.modal-header') && 
            !(e.target as HTMLElement).closest('.x-button')) {
            const rect = playModalRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDraggingPlay(true);
            setPlayDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };
    const handlePopupMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.modal-header') && 
            !(e.target as HTMLElement).closest('.x-button')) {
            const rect = popupModalRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDraggingPopup(true);
            setPopupDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };


    // toggle content window visibility
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
                    <div className="modal-overlay" onClick={() => setShowCatModal(false)}>
                        
                        <div 
                            className="modal" 
                            ref={catModalRef}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'fixed',
                                left: `${catPosition.x}px`,
                                top: `${catPosition.y}px`,
                            }}
                        >
                            <div
                                className="modal-header"
                                onMouseDown={handleCatMouseDown}
                                style={{ cursor: 'grab'}}
                            >
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
                    <div 
                    className="modal cat-response-modal" 
                    onClick={(e) => e.stopPropagation()}
                    ref={yesModalRef}
                    style={{
                        position: 'fixed',
                        left: `${yesPosition.x}px`,
                        top: `${yesPosition.y}px`
                    }}
                >
                        <div 
                            className="modal-header"
                            onMouseDown={handleYesMouseDown}
                            style={{ cursor: 'grab'}}
                        >
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
                    <div 
                        className="modal cat-response-modals" 
                        onClick={(e) => e.stopPropagation()}
                        ref={loveModalRef}
                        style={{
                            position: 'fixed',
                            left: `${lovePosition.x}px`,
                            top: `${lovePosition.y}px`
                        }}
                    >
                        <div 
                            className="modal-header"
                            onMouseDown={handleLoveMouseDown}
                            style={{ cursor: 'grab'}}
                        >
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

                    <div 
                        className="modal" 
                        onClick={(e) => e.stopPropagation()}
                        ref={screamModalRef}
                        style={{
                            position: 'fixed',
                            left: `${screamPosition.x}px`,
                            top: `${screamPosition.y}px`
                        }}
                    >
                        <div 
                            className="modal-header"
                            onMouseDown={handleScreamMouseDown}    
                            style={{ cursor: 'grab'}}
                        >
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
                        <div 
                            className="modal horoscope-modal" 
                            onClick={(e) => e.stopPropagation()}
                            ref={horoscopeModalRef}
                            style={{
                                position: 'fixed',
                                left: `${horoscopePosition.x}px`,
                                top: `${horoscopePosition.y}px`
                            }}
                        >
                        <div 
                            className="modal-header"
                            onMouseDown={handleHoroscopeMouseDown}
                            style={{ cursor: 'grab'}}
                        >
                            <span>Your Horoscope</span>
                            <button className='x-button' onClick={() => setShowHoroscopeModal(false)}>✕</button>
                        </div>

                        {/* modal body */}
                        <div className="modal-body horoscope-modal-body">
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
                                    <p><strong>Date:</strong> {horoscopeData.data.date}</p>
                                    <p><strong>Horoscope:</strong> {horoscopeData.data.horoscope}</p> 
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
                        
                        <div 
                            className="modal media-modal" 
                            onClick={(e) => e.stopPropagation()}
                            ref={playModalRef}
                            style={{
                                position: 'fixed',
                                left: `${playPosition.x}px`,
                                top: `${playPosition.y}px`
                            }}
                        >
                            <div 
                                className="modal-header"
                                onMouseDown={handlePlayMouseDown}
                                style={{ cursor: 'grab'}}
                            >
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
                                            <img src='/images/miki.jpg' className='miki'></img>
                                        </div>
                                        
                                        {/* song progress */}
                                        <div className="progress-container">
                                            {/* play/pause button */}
                                            <button 
                                                className="play-button"
                                                onClick={handlePlayAudio}
                                            >
                                                {audioPlayer.isPlaying ? <img src='/images/pause.png' className='media-player-pause'></img> : <img src='/images/play.png' className='media-player-play'></img>}
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
                                            <span>
                                                <img src='/images/Volume.ico' className="volume-icon"></img>
                                            </span>
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
                                    <div className="track-artist">Artist: Miki Matsubara</div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>

            {/* mystery popup */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/dark_agent.ico"
                    label="don't click"
                    x={popupPosition.x}
                    y={popupPosition.y}
                    onClick={() => setshowPopUpModal(true)}
                />

                {showPopUpModal && (
                    <div className="modal-overlay" onClick={() => setshowPopUpModal(false)}>
                        <div 
                            className="modal" 
                            onClick={(e) => e.stopPropagation()}
                            ref={popupModalRef}
                        >
                            <div
                                className="modal-header"
                                onMouseDown={handlePopupMouseDown}
                                style={{ cursor: 'grab'}}
                            >   
                                <span className='scream-modal'>Hi</span>
                                <button className='x-button' onClick={() => setshowPopUpModal(false)}>✕</button>
                            </div>

                                <div className="modal-body">
                                    <img src="/images/wassup.gif" className='gif' alt="wazzuppp" />
                                </div>
                        </div>
                    </div>
                    )}
            </div>


            {/* clippy */}
            {/* <div className="desktop">
                <DesktopIcon
                    icon="/images/mad_clippy.png"
                    label="click me"
                    x={clippyPosition.x}
                    y={clippyPosition.y}
                    onClick={() => setShowCatModal(true)}
                    className='clippy'
                />
                {showClippyModal && (
                    <div className="modal-overlay" onClick={() => setShowClippyModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Hi, I'm ANGRY CLIPPY</span>
                                <button className='x-button' onClick={() => setShowClippyModal(false)}>✕</button>
                            </div>

                            <div className="modal-body">Are you kidding me??</div>

                            <div className='cat-buttons'>
                                <button 
                                className='cat-button'
                                onClick={() => {
                                    setShowClippyModal(false);
                                    setShowYesModal(true);
                                }}
                                >
                                    Yes
                                </button>
                                <button 
                                    className='cat-button'
                                    onClick={() => {
                                        setShowClippyModal(false);
                                        setShowLoveModal(true);
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div> */}


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
                    <section className='blue-bar-text'>DevScape - Valentia Sedano</section>

                    <div className="button-container">
                        <button className='x-button' onClick={toggleWindow}>✕</button>
                    </div>
                </section>


                {/* navbar */}
                <nav className='navbar'>
                    <ul>
                        <li className='button left-button'>
                            <Link to="/">
                                <img src="/images/Starfield.ico" className='home-icon' alt='home'/>
                                <p>Home</p>
                            </Link>
                        </li>

                        <li className='button'>
                            <Link to="/portfolio">
                                <img src="/images/Painting.ico" className='paint-icon' alt='portfolio'/>
                                <p>Portfolio</p>
                            </Link>
                        </li>

                        <li className={`button ${location.pathname === '/resume' ? 'active-resume' : ''}`}>
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
                            <div className='url-text'>http://www.geocities.com/valentia_is_best_dev</div>
                        </div>
                        <button className='url-dropdown-button'>▼</button>
                    </div>
                    <div className = 'url-bar-small-2'>Links</div>
                </div>
            </div>


            {/* window content */}
            <div className='resume-content'>
                <div className="resume-container">

                    <div className='resume-column-1'>
                        {/* widescreen version */}
                        {isWideScreen ? (
                            <>
                                <div className='top-resume-column-1'>
                                    <img src='/public/images/matrix.gif' className='gif' />
                                </div>
                                <div className='widescreen-middle-resume-column-1'>
                                    <div className='resume-about-section'>
                                        <p className='resume-about-title'>ABOUT</p>
                                        <p className='resume-about-text'>Passionate about both design and development, Valentia is someone who is able to inspire devs & clients alike.  You should probs hire her :) </p>
                                    </div>
                                </div>
                                
                                <div className='middle-resume-column-1'>
                                    <p className='resume-contact-title'>CONTACT</p>
                                    <div className='widescreen-contact'>
                                        <div className='stats-section-text'>
                                            <p className='resume-blue-text'>NAME:</p>
                                            <p className='resume-big-black-text'>Valentia Sedano</p>
                                        </div>
                                        <div className='stats-section-text'>
                                            <p className='resume-blue-text'>LOCATION:</p>
                                            <p className='resume-big-black-text'>Chicagoland, USA</p>
                                        </div>
                                        <div className='stats-section-text'>
                                            <p className='resume-blue-text'>EMAIL:</p>
                                            <p className='resume-big-black-text'>zvsedano@gmail.com</p>
                                        </div>
                                        <div className='stats-section-text'>
                                            <p className='resume-blue-text'>MOBILE:</p>
                                            <p className='resume-big-black-text'>+1 (224) 482-8189</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='widescreen-bottom-resume-column-1'>
                                    <p className='education-title'>EDUCATION</p>
                                    
                                    <div>
                                        <p className='education-title-text'><span className='job-title-underline'>Techtonica</span> | Engineering Certificate - 2021</p>
                                        <p className='education-title-text'><span className='job-title-underline'>Ole Miss</span> | B.A. in Psychology - 2011</p>
                                </div>
                                </div>
                            </>
                            ) : (
                            <>
                                {/* laptop & mobile version */}
                                <div className='top-resume-column-1'>
                                    <img src='/public/images/matrix.gif' className='gif'></img>
                                </div>

                                <div className='middle-resume-column-1'>
                                    <div className='resume-about-section'>
                                        <p className='resume-about-title'>ABOUT</p>
                                        <p className='resume-about-text'>Passionate about both design and development, Valentia is someone who is able to inspire devs & clients alike</p>
                                    </div>
                                </div>
                                <div className='bottom-resume-column-1'>
                                    <p className='resume-contact-title'>CONTACT</p>
                                    <div className='stats-section-text'>
                                        <p className='resume-blue-text'>NAME:</p>
                                        <p className='resume-big-black-text'>Valentia Sedano</p>
                                    </div>
                                    <div className='stats-section-text'>
                                        <p className='resume-blue-text'>EMAIL:</p>
                                        <p className='resume-big-black-text'>zvsedano@gmail.com</p>
                                    </div>
                                    <div className='stats-section-text'>
                                        <p className='resume-blue-text'>MOBILE:</p>
                                        <p className='resume-big-black-text'>+1 (224) 482-8189</p>
                                    </div>
                                </div>
                            
                            </>
                        )}
                    </div>
                    {/* end: resume-column-1 */}
                    
                    {/* NOT VISIBLE IN WIDESCREEN */}
                    <div className='resume-column-2'>
                        <p className='employment-title'>EMPLOYMENT HISTORY</p>

                        <p className='employment-job-title'><span className='job-title-underline'>Software Engineer I</span> - (2025-present)</p>
                        <p className='employment-job-location'>WebCraft Labs - Austin, TX</p>
                        <ul>
                            <li className='employment-job-description'>Craft seamless digital experiences that balance functionality with visual appeal. Manage all CI/CD, testing, and maintenance for primary web app.</li>
                        </ul>
                        <p className='employment-job-title'><span className='job-title-underline'>Associate Software Engineer</span> - (2021-2025)</p>
                        <p className='employment-job-location'>Sony PlayStation - San Francisco, CA</p>
                        <ul>
                            <li className='employment-job-description'>Contribute features, maintain, and test client-side web applications</li>
                            <li className='employment-job-description-1'>Identify test cases and testing strategies for the PS5 console using PyTest. Utilize technologies such as WebDrivers & XPATH to test the UI of the console.</li>
                        </ul>
                    </div>

                    <div className='resume-column-3'>
                        {/* widescreen version */}
                        {isWideScreen ? (
                            <>
                                <div className='widescreen-employment-section'>
                                    <p className='employment-title'>EMPLOYMENT HISTORY</p>

                                    <p className='employment-job-title'><span className='job-title-underline'>Software Engineer I</span> - (2025-present)</p>
                                    <p className='employment-job-location'>WebCraft Labs - Austin, TX</p>
                                    <ul>
                                        <li className='employment-job-description'>Craft seamless digital experiences that balance functionality with visual appeal. Manage all CI/CD, testing, and maintenance for primary web app.</li>
                                    </ul>
                                    <p className='employment-job-title'><span className='job-title-underline'>Associate Software Engineer</span> - (2021-2025)</p>
                                    <p className='employment-job-location'>Sony PlayStation - San Francisco, CA</p>
                                    <ul>
                                        <li className='employment-job-description'>Contribute features, maintain, and test client-side web applications</li>
                                        <li className='employment-job-description-1'>Identify test cases and testing strategies for the PS5 console using PyTest. Utilize technologies such as WebDrivers & XPATH to test the UI of the console.</li>
                                    </ul>
                                </div>

                                <div className='bottom-resume-column-3'>
                                    <div className='skills-section'>
                                        <div className='resume-about-section'>
                                            <p className='resume-about-title'>SKILLS</p>
                                            <div className='skills'>
                                                <ul className='unordered-list'>
                                                    <li>React.js</li>
                                                    <li>TypeScript</li>
                                                    <li>Jest</li>
                                                </ul>
                                                <ul className='unordered-list'>
                                                    <li>Redux.js</li>
                                                    <li>Python</li>
                                                    <li>PyTest</li>
                                                </ul>
                                                <ul className='unordered-list'>
                                                    <li>Git</li>
                                                    <li>SQL</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='image-section'>
                                        <div className='widescreen-image'>
                                            <img src='/public/images/world.gif' className='obra-dinn'></img>
                                        </div>
                                    </div>
                                </div>
                            </>
                            ) : (
                            <>
                            <div className='top-resume-column-3'>
                                <p className='education-title'>EDUCATION</p>
                                
                                <div>
                                    <p className='education-title-text'><span className='job-title-underline'>Techtonica</span> | Engineering Certificate - 2021</p>
                                    <p className='education-title-text'><span className='job-title-underline'>Ole Miss</span> | B.A. in Psychology - 2011</p>
                                </div>
                            </div>
                            <div className='middle-resume-column-3'>
                                <img src='/public/images/world.gif' className='obra-dinn'></img>
                            </div>
                            <div className='bottom-resume-column-3'>
                                <div className='resume-about-section'>
                                    <p className='resume-about-title'>SKILLS</p>
                                    <div className='skills'>
                                        <ul className='unordered-list'>
                                            <li>React.js</li>
                                            <li>TypeScript</li>
                                            <li>Jest</li>
                                        </ul>
                                        <ul className='unordered-list'>
                                            <li>Redux.js</li>
                                            <li>Python</li>
                                            <li>PyTest</li>
                                        </ul>
                                        <ul className='unordered-list'>
                                            <li>Git</li>
                                            <li>SQL</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
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
                        <img src={earth} className='content-footer-icon'></img>
                        <p className='footer-section-text'>Internet</p>
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

export default Resume;