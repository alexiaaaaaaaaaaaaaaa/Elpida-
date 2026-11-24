import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/** Título de página em "pílula" verde, como em "Ciclo da violência" no Figma. */
export const PageTitle: React.FC<{ children: React.ReactNode; back?: boolean | string }> = ({ children, back }) => {
  const navigate = useNavigate();
  return (
    <div className="elpida-page-title-row">
      {back && (
        <button
          type="button"
          className="elpida-page-title-row__back"
          aria-label="Voltar"
          onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))}
        >
          <ChevronLeft size={20} />
        </button>
      )}
      <h1 className="elpida-page-title">{children}</h1>
    </div>
  );
};

export default PageTitle;
