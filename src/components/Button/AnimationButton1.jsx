import React from 'react';

const AnimationButton1 = ({
    text = 'dark css',
    baseColor = 'rgb(40, 72, 94)',
    hoverColor = '#00c3ff',
    fontSize = '2rem',
    onClick = () => { },
    className = ''
}) => {
    const buttonStyle = {
        position: 'relative',
        border: 0,
        outline: 'none',
        background: 'none',
        color: baseColor,
        textTransform: 'uppercase',
        fontSize: fontSize,
        letterSpacing: '2px',
        fontWeight: '800',
        cursor: 'pointer',
        fontFamily: "'Poppins', sans-serif"
    };

    const hoverTextStyle = {
        position: 'absolute',
        color: hoverColor,
        width: '0%',
        inset: 0,
        overflow: 'hidden',
        borderRight: `6px solid ${hoverColor}`,
        transition: 'width 0.4s ease'
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            className={`animation-button ${className}`}
            onMouseEnter={(e) => {
                const hoverText = e.currentTarget.querySelector('.hover-text');
                if (hoverText) {
                    hoverText.style.width = '100%';
                    hoverText.style.filter = `drop-shadow(0 0 23px ${hoverColor})`;
                }
            }}
            onMouseLeave={(e) => {
                const hoverText = e.currentTarget.querySelector('.hover-text');
                if (hoverText) {
                    hoverText.style.width = '0%';
                    hoverText.style.filter = 'none';
                }
            }}
        >
            <span style={{ display: 'inline-block', position: 'relative' }}>
                <span>{text}</span>
                <span className="hover-text" style={hoverTextStyle} aria-hidden="true">
                    {text}
                </span>
            </span>
        </button>
    );
};

export default AnimationButton1;