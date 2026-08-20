
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

type Props = {
  src: string;
  fallback: string;
  ariaLabel?: string;
};

export default function HeroBackground({ src, fallback, ariaLabel }: Props) {
  const media = src || fallback;
  const isVideo = VIDEO_EXT.test(media);

  if (isVideo) {
    return (
      <video
        key={media}
        src={media}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label={ariaLabel}
        className="block h-screen w-full object-cover"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={media}
      src={media}
      alt={ariaLabel ?? ""}
      className="block h-screen w-full object-cover"
    />
  );
}
