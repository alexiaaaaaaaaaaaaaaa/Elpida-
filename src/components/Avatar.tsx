interface AvatarProps {
  src?: string;
  initials: string;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, initials, size = 52, className }) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    objectFit: 'cover',
  };

  if (src) {
    return <img src={src} alt="Foto de perfil" style={style} className={className} />;
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        background: '#cfc3e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--elpida-purple)',
        fontWeight: 800,
        fontSize: size * 0.28,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
