/** Logo oficial fornecido pelo usuário, recortado para não carregar as margens vazias da arte original. */
const Logo: React.FC<{ size?: number; showText?: boolean; className?: string }> = ({
  size = 112,
  className,
}) => (
  <img
    className={`elpida-logo-image ${className ?? ''}`}
    src="/assets/logo-elpida.png"
    alt="Elpida Protegida"
    style={{ height: size, width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
  />
);

export default Logo;
