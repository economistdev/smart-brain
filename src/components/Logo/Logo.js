import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './Brain.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='br2 shadow-1 Tilt'>
                <div>
                    <h1>SmartBrain</h1>
                    <img alt='Logo' src={brain}></img>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;