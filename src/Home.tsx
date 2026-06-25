import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

// hi justine, feel free to look at the comments in the modal section to learn more about how to render modals.  the component is in DesktopIcon.tsx :)

// component imports
import Taskbar from './components/Taskbar'
import './components/Taskbar.css'
import DesktopIcon from './components/DesktopIcon';
import './components/DesktopIcon.css';

// import images
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

function Home() {
    // dragging feature
    const windowRef = useRef<HTMLDivElement | null>(null);
    // clock
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

    // ICON/MODALS
    // cat
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

    const [popupCount, setPopupCount] = useState(0);
    const [popups, setPopups] = useState<Array<{id: number, x: number, y: number}>>([]);
    const [showFinalPopup, setShowFinalPopup] = useState(false);
    const [isPopupSpamActive, setIsPopupSpamActive] = useState(false);



    // media player state
    const [audioPlayer, setAudioPlayer] = useState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
    });

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

    // MYSTERY POPUPS
    // pop-ups - generate random position of pop-ups on page
    const getRandomPosition = () => {
        return {
            x: Math.random() * (window.innerWidth - 320),
            y: Math.random() * (window.innerHeight - 200)
        };
    };
    // handle the mystery popup click
    const handleMysteryPopupClick = () => {
        setshowPopUpModal(false);
        setIsPopupSpamActive(true);
        setPopupCount(0);
        setPopups([]);
        setShowFinalPopup(false);
        
        // Create 25 popups with slight delays for dramatic effect
        let count = 0;
        const interval = setInterval(() => {
            if (count < 25) {
                const pos = getRandomPosition();
                setPopups(prev => [...prev, { 
                    id: Date.now() + count, 
                    x: pos.x, 
                    y: pos.y 
                }]);
                setPopupCount(prev => prev + 1);
                count++;
            } else {
                clearInterval(interval);
                // Show final popup after all 25 are created
                setTimeout(() => {
                    setShowFinalPopup(true);
                }, 300);
            }
        }, 100); // Create a new popup every 100ms
    };
    // close all popups
    const closeAllPopups = () => {
        setPopups([]);
        setShowFinalPopup(false);
        setIsPopupSpamActive(false);
        setPopupCount(0);
    };


    // USEEFFECTS
    // save the position of the window to session storage
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
    // pop-up useEffect
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

    // USEEFFECTS MODALS
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
    // yes modal drag
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
    // love modal drag
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

    // dragging window
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


    // commented out code: user for later? 
    
    // portfolio dropdown:

    // const portfolioRef = useRef<HTMLLIElement>(null);

    // const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);


    // const handlePortfolioClick = (e: React.MouseEvent) => {
    //     // fixes window drag breaking, if you don't include this the blue-bar drag 
    //     e.stopPropagation();
    //     setIsPortfolioDropdownOpen(!isPortfolioDropdownOpen);
    // };
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (portfolioRef.current && !portfolioRef.current.contains(event.target as Node)) {
    //         setIsPortfolioDropdownOpen(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //         return () => {
    //             document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);


    // CLIPPY STUFF, DO NOT NEED FOR NOW

    // const [clippyPosition, setClippyPosition] = useState({ x: 0, y: 0 });
    // const [showClippyModal, setShowClippyModal] = useState(false);
    // const [chatbotInput, setChatbotInput] = useState('');
    // const [chatHistory, setChatHistory] = useState<Array<{sender: string, message: string}>>([]);
    // const [shouldShake, setShouldShake] = useState(false);

    // GETTERS
    // const getChatbotResponse = async (input: string): Promise<string> => {
    //     try {
    //         const response = await fetch('/api/chatbot', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ message: input })
    //         });
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         return data.message;
    //         } catch (error) {
    //             console.error('Chatbot error:', error);
    //             return "Sorry, I'm having trouble responding right now!";
    //         }
    // };
    // const handleChatbotSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!chatbotInput.trim()) return;
    //     // Add user message
    //     const userMessage = chatbotInput;
    //     setChatHistory(prev => [...prev, { 
    //         sender: 'user',
    //         message: userMessage
    //     }]);
    //     setChatbotInput('');
    //     // Get bot response from server
    //     const botMessage = await getChatbotResponse(userMessage);
    //     // Add bot message
    //     setChatHistory(prev => [...prev, { 
    //         sender: 'bot', 
    //         message: botMessage 
    //     }]);
    // };
    // useEffect(() => {
    //     const updateClippyPosition = () => {
    //         const documentHeight = Math.max(
    //             document.body.scrollHeight,
    //             document.documentElement.scrollHeight,
    //             document.body.offsetHeight,
    //             document.documentElement.offsetHeight,
    //             document.body.clientHeight,
    //             document.documentElement.clientHeight
    //         );
            
    //         setClippyPosition({
    //         x: window.innerWidth - 100,
    //         y: documentHeight - 150
    //         });
    //     };

    //     updateClippyPosition();

    //     window.addEventListener('resize', updateClippyPosition);
    //     window.addEventListener('load', updateClippyPosition);
    //     return () => {
    //         window.removeEventListener('resize', updateClippyPosition);
    //         window.removeEventListener('load', updateClippyPosition);
    //     };
    // }, [location.pathname]);




    // clippy shake on initial page load
    // useEffect(() => {

    //     const hasShaken = sessionStorage.getItem('clippyShaken');
        
    //     if (!hasShaken) {

    //         setShouldShake(true);

    //         sessionStorage.setItem('clippyShaken', 'true');
            
    //         const shakeTimer = setTimeout(() => {
    //             setShouldShake(false);
    //         }, 1000);
            
    //         return () => clearTimeout(shakeTimer);
    //     }
    // }, []);

    // clippy shakes on page reload, not just first visit
    // useEffect(() => {
    //     return () => {
    //         // Reset on page unload if you want it to shake on next visit
    //         sessionStorage.removeItem('clippyShaken');
    //     };
    // }, []);

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
                    onClick = {handleMysteryPopupClick}
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
                    label="Hello?"
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
        </div> */}


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
                                <li className='button'>
                                    <Link to="/portfolio">
                                        <img src="/images/Painting.ico" className='paint-icon' alt='portfolio'/>
                                        <p>Portfolio</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/resume">
                                        <img src="/images/resume.png"className='resume-icon' alt='resume'></img>
                                        <p>Resume</p>
                                    </Link>
                                </li>
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
                                <img src='/images/webcraft.png' className='homepage-pic' />
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

            {/* popup spam section */}
            {isPopupSpamActive && (
                <>
                    {popups.map((popup) => (
                        <div 
                            key={popup.id}
                            className="spam-popup"
                            style={{
                                left: `${popup.x}px`,
                                top: `${popup.y}px`,
                            }}
                        >
                            <div className="modal">
                                <div className="modal-header">
                                    <span>🚨 LUL</span>
                                </div>
                                <div className="popup-modal-body modal-body" style={{ padding: '20px' }}>
                                    <img 
                                        src="/images/wassup.gif" 
                                        className='gif' 
                                        alt="wazzuppp" 
                                        style={{ width: '100%' }}
                                    />
                                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
                                        WAZZZZUPPPPP 😈
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Final popup to close all */}
                    {showFinalPopup && (
                        <div 
                            className="spam-popup"
                            style={{
                                left: `${window.innerWidth / 2 - 230}px`,
                                top: `${window.innerHeight / 2 - 100}px`,
                            }}
                        >
                            <div className="final-spam-popup modal">
                                <div className="modal-header">
                                    <span>⚠️ SYSTEM OVERLOAD</span>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        Click the button below to close all popups and restore your sanity!
                                    </p>
                                    <button
                                        onClick={closeAllPopups}
                                        onMouseDown={(e) => e.currentTarget.style.borderStyle = 'inset'}
                                        onMouseUp={(e) => e.currentTarget.style.borderStyle = 'outset'}
                                    >
                                        🔥 CLOSE ALL POPUPS 🔥
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
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