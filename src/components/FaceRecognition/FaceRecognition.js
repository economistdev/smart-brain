import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, box}) => {
    return (
        <div className='imageContainer'>
            <div className='absolute center mt2'>
                <img id="imageMain" alt="" src={ imageUrl } width="500px" height="auto"></img>
                <div className='bounding-box' style={{top: box.topRow, bottom: box.bottomRow, left: box.leftCol, right: box.rightCol}}></div>
            </div>
        </div>
    )
}

export default FaceRecognition