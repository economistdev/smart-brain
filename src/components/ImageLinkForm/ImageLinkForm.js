import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <div className='form center'>
                <p className='f4'>The Magic Brain will detect faces in your images. Give it a try!</p>
            </div>
            <div className='form bg-sq center pa4 br3 shadow-5'>
                <input className='w-70 f4 pv3 center' type={Text} onChange={onInputChange}/>
                <button 
                    className='w-20 f4 grow link br2 pv3 white bg-dark-blue' 
                    onClick={onButtonSubmit}
                >DETECT</button>
            </div>
        </div>
    );
}

export default ImageLinkForm;