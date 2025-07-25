import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import placeholderImage from "../../assets/placeholder.svg";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

const FallbackImage = ({
  src,
  alt = "",
  fallbackSrc = placeholderImage,
  className,
  style,
  onError,
  onLoad,
  lazy = false,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(lazy ? fallbackSrc : src || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(!lazy);
  const imgRef = useRef(null);

  const handleError = (event) => {
    // Chỉ fallback nếu chưa lỗi và đang không phải là fallback image
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }

    // Gọi onError callback nếu được truyền vào (chỉ cho ảnh gốc, không cho fallback)
    if (onError && imgSrc !== fallbackSrc) {
      onError(event);
    }
  };

  const handleLoad = (event) => {
    // Chỉ reset hasError nếu load thành công và đang là ảnh gốc
    if (imgSrc === src) {
      setHasError(false);
    }

    // Gọi onLoad callback nếu được truyền vào
    if (onLoad) {
      onLoad(event);
    }
  };

  // Lazy loading effect
  useEffect(() => {
    if (!lazy || !imgRef.current || isLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setImgSrc(src || fallbackSrc);
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazy, src, fallbackSrc, isLoaded]);

  // Reset imgSrc khi src prop thay đổi
  useEffect(() => {
    if (!lazy && src) {
      setImgSrc(src);
      setHasError(false);
    } else if (lazy && isLoaded && src) {
      setImgSrc(src);
      setHasError(false);
    } else if (!src) {
      setImgSrc(fallbackSrc);
      setHasError(false);
    }
  }, [src, fallbackSrc, lazy, isLoaded]);

  return (
    <img
      ref={imgRef}
      src={normalizeImageUrl(imgSrc)}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      loading={lazy ? "lazy" : "eager"}
      {...props}
    />
  );
};

FallbackImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  lazy: PropTypes.bool,
};

export default FallbackImage;
