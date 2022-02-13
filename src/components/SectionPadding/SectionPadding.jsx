import React from 'react'
import './SectionPadding.scss';

const SectionPadding = props =>{
    return(
        <div className = {`section-padding ${props.className || ""}`}>
            {props.children}
        </div>
    )
}

export default SectionPadding;