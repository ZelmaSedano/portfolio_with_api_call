import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

import Taskbar from './components/Taskbar'
import './components/Taskbar.css'
import DesktopIcon from './components/DesktopIcon';
import './components/DesktopIcon.css'; // contains both icon + modal 

import send from './assets/send.png'

function Resume() {
    const windowRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    // states
    const [position, setPosition] = useState(() => {
        const saved = sessionStorage.getItem('windowPosition');
        return saved ? JSON.parse(saved) : { 
            x: Math.max(0, (window.innerWidth - 1000) / 2),
            y: Math.max(0, (window.innerHeight - 600) / 2)
        };
    });
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1445);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isVisible, setIsVisible] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    const [showCatModal, setShowCatModal] = useState(false);
    const [showYesModal, setShowYesModal] = useState(false);
    const [showLoveModal, setShowLoveModal] = useState(false);

    const [showScreamModal, setShowScreamModal] = useState(false);
    
    const [clippyPosition, setClippyPosition] = useState({ x: 0, y: 0 });
    const [showClippyModal, setShowClippyModal] = useState(false);

    // save state to session storage
    useEffect(() => {
        sessionStorage.setItem('windowPosition', JSON.stringify(position));
    }, [position]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup
    }, []);

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



    // when the window is above 1445 setIsWideScreen is set
    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 1445);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
    }, []);

    // toggle content window visibility
    const toggleWindow = () => setIsVisible(!isVisible);



    // RENDERED PART
    return (
        <>

        {/* cat icon */}
        <div className="desktop">
            {/* when you click the desktop icon, setShowModal is set to true */}
            <DesktopIcon
                icon="/images/cat.png"
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
                        {/* modal header text */}
                        <span>Question...</span>
                        {/* 'x' close button */}
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
        {/* depending on which answer you click, a diff popup will occur - jk, they're the same popup lul */}
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
                        <span>I know what you did last summer</span>
                        <button className='x-button' onClick={() => setShowScreamModal(false)}>✕</button>
                    </div>

                    <div className="modal-body">
                        <img src="/images/wassup.gif" className='gif' alt="evil_cat" />
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
                    label="click me"
                    x={clippyPosition.x}
                    y={clippyPosition.y}
                    onClick={() => setShowCatModal(true)}
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
            </div>


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
                                    <img src='/images/matrix.gif' className='gif' />
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
                                    <img src='/images/matrix.gif' className='gif'></img>
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
                                            <img src='/src/assets/world.gif' className='obra-dinn'></img>
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
                                <img src='/src/assets/world.gif' className='obra-dinn'></img>
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
                        <img src="/src/assets/earth.ico" className='content-footer-icon'></img>
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