import Image from 'next/image';

export const ImageFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={500}
      height={300}
      onError={(e) => {
        e.currentTarget.src = '/placeholder.jpg'; // Ảnh mặc định khi load lỗi
      }}
    />
  );
};