import { useState } from 'react'
import './ImageWithLoadBg.scss';

interface ImageWithLoadBgProps {
    src: any;
    aspectRatio: number;
    alt: string;
}

const ImageWithLoadBg = (props: ImageWithLoadBgProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const { src, aspectRatio, alt } = props;
    const onImageLoad = () => {
        setImageLoaded(true)
    }
    return (
        <div
            style={{
                paddingTop: `${(1 / aspectRatio) * 100}%`,
                backgroundColor: imageLoaded ? 'transparent' : '#2C3037'
            }}
            className="image-with-Bg"
        >
            <div className="image">
                {src !== undefined &&
                    <img onLoad={onImageLoad} src={src} alt={alt} />
                }
            </div>
        </div>
    )
}

export default ImageWithLoadBg;