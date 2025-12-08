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
import cat from './assets/cat.png'
import evil_cat from './assets/evil_cat.gif'
import wassup from './assets/wassup.gif'
import connections from './assets/connections.ico'
import starfield from './assets/Starfield.ico'
import painting from './assets/Painting.ico'
import resume from './assets/resume.png'
import send from './assets/send.png'
import computer_1 from './assets/computer_1.png'
import computer_2 from './assets/computer-2.png'
import earth from './assets/earth.ico'



type HoroscopeData = {
    data: {
        date: string;
        horoscope_data: string;
    };
};

function Home() {
    const windowRef = useRef<HTMLDivElement | null>(null);
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

    const [clippyPosition, setClippyPosition] = useState({ x: 0, y: 0 });
    const [showClippyModal, setShowClippyModal] = useState(false);
    const [showClippyYesModal, setShowClippyYesModal] = useState(false);
    const [showClippyNoModal, setShowClippyNoModal] = useState(false);


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
            x: window.innerWidth - 80, // 100px from right edge
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


    // event handler functions
    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.blue-bar') && !(e.target as HTMLElement).closest('.x-button')) {
            const rect = windowRef.current?.getBoundingClientRect();
            if (!rect) return; // guard: abort if ref isn't set
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


    // toggle visibility
    const toggleWindow = () => setIsVisible(!isVisible);

    return (
        <>
            {/* cat icon */}
            <div className="desktop">
                {/* when you click the desktop icon, setShowModal is set to true */}
                <DesktopIcon
                    icon={cat}
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
                                    <img src={evil_cat} alt="evil_cat" />
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
                                    <img src={evil_cat}alt="evil_cat" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* scream icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/src/assets/scream.png"
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
                            <img src={wassup}className='wassupp' alt='wassup_gif'></img>
                        </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* horoscope icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/src/assets/scandique.jpg"
                    label="horoscope"
                    x={50}
                    y={300}
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







            {/* clippy */}
            <div className="desktop">
                {/* when you click the desktop icon, setShowModal is set to true */}
                <DesktopIcon
                    icon="/src/assets/mad_clippy.png"
                    label="click me"
                    x={clippyPosition.x}
                    y={clippyPosition.y}
                    onClick={() => setShowClippyModal(true)}
                    className='clippy'
                />
                {showClippyModal && (
                    <div className="modal-overlay" onClick={() => setShowClippyModal(false)}>{/* when the user clicks again, setShowModal is set to false (modal isn't shown) */}
                    {/* if you click inside the modal, then setShowModal ISN'T set to false */}
                    {/* onClick takes the event, and returns 'don't propogate this event' function */}
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Hi, I'm ANGRY CLIPPY</span>
                                <button className='x-button' onClick={() => setShowClippyModal(false)}>✕</button>
                            </div>
                            {/* body of modal */}
                            <div className="modal-body">Are you kidding me??</div>
                            {/* CHALLENGE: add two buttons to this modal, 'yes', and 'I love them!', and return a message to the user based on their selection */}
                            <div className='cat-buttons'>
                                <button 
                                className='cat-button'
                                onClick={() => {
                                    setShowClippyModal(false);
                                    setShowClippyYesModal(true);
                                }}
                                >
                                    Yes
                                </button>
                                <button 
                                    className='cat-button'
                                    onClick={() => {
                                        setShowClippyModal(false);
                                        setShowClippyNoModal(true);
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

                {/* define what showYesModal is */}
                {showClippyYesModal && (
                    <div className="modal-overlay" onClick={() => setShowClippyYesModal(false)}>
                        <div className="modal cat-response-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>WOWWWW</span>
                                <button className='x-button' onClick={() => setShowClippyYesModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="image-container">
                                    <img src={evil_cat}alt="evil_cat" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showClippyNoModal && (
                    <div className="modal-overlay" onClick={() => setShowClippyNoModal(false)}>
                        <div className="modal cat-response-modals" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>I feel like you ARE</span>
                                <button className='x-button' onClick={() => setShowClippyNoModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="image-container">
                                    <img src="/src/assets/evil_cat.gif" alt="evil_cat" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}



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
                            <img src={connections} className='icon' alt="icon"/>
                            <section className='blue-bar-text'>DevScape - Valentia Sedano</section>

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
                                        <img src={starfield} className='home-icon' alt='home'/>
                                        <p>Home</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/portfolio">
                                        <img src={painting}className='paint-icon' alt='portfolio'/>
                                        <p>Portfolio</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/resume">
                                        <img src={resume}className='resume-icon' alt='resume'></img>
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
                                        <img src={send}className='contact-icon' alt='contact'></img>
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
                    <div className='content'>
                        <div className='homepage-banners'>
                            <img className='computer' src={computer_1} alt="evil_cat" />
                            <div className='inner-banner-text'>
                                <p className='banner'>Valentia's Portolio</p>
                                <p className='banner-1'>Nostalgia Design Expert</p>
                            </div>
                            <img className='computer' src={computer_2}alt="evil_cat" />
                        </div>

                        <div className='bio-section'>

                            <div className='sub-bio-section'>
                                <p className='sub-bio-text'>Slow Tech Design</p>
                                <p className='sub-bio-p'>
                                    In an ever-changing world where users sense of safety is paramount, let's create environments that address their needs and provide a feeling of security to users via NOSTALGIA DESIGN
                                </p>
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