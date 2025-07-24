import '../assets/styles/components/_banner.scss';

const Banner = ({ imgSrc, alt = "Banner", className = '', title, content}) => (
    <div className='banner'>
        <img
            src={imgSrc}
            alt={alt}
            className={`${className}`}
        ></img>
        <div className='banner-mask'></div>
        <div className='banner-text'>
            {title && <h2>{title}</h2>}
            {content && <p>{content}</p>}
        </div>
    </div>
);

export default Banner;