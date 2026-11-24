import type { LucideIcon } from 'lucide-react';

interface Icon2DProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  title?: string;
}

/** Ícone único do app: 2D, simples, outline e com a mesma linguagem visual da barra inferior. */
const Icon2D: React.FC<Icon2DProps> = ({ icon: Icon, size = 22, className = '', title }) => (
  <Icon
    className={`elpida-icon-2d ${className}`}
    size={size}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    aria-label={title}
  />
);

export default Icon2D;
