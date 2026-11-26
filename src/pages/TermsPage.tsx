import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/** E-mail de contato exibido nos termos. Troque aqui se a equipe usar outro endereço. */
const CONTATO_EMAIL = 'elpidaprotegida@gmail.com';
const ULTIMA_ATUALIZACAO = '25 de novembro de 2026';

interface Section {
  title: string;
  paragraphs: string[];
}

const SECTIONS: Section[] = [
  {
    title: '1. Aceitação dos termos',
    paragraphs: [
      'Ao criar uma conta ou usar o Elpida, você declara que leu e concorda com estes Termos e Condições de Uso. Se não concordar, não utilize o aplicativo.',
    ],
  },
  {
    title: '2. O que é o Elpida',
    paragraphs: [
      'O Elpida é um aplicativo educativo sobre educação sexual, autodefesa e prevenção da violência contra a mulher, desenvolvido como projeto de Trabalho de Conclusão de Curso (TCC). Ele reúne videoaulas, livros, artigos e um mapa com serviços da rede de apoio.',
      'Todo o conteúdo tem caráter exclusivamente informativo e educativo. O Elpida não substitui atendimento policial, jurídico, médico ou psicológico profissional.',
      'Em caso de risco imediato, ligue 190 (Polícia Militar). Para orientação e denúncia, ligue 180 (Central de Atendimento à Mulher), gratuito e disponível 24 horas.',
    ],
  },
  {
    title: '3. Cadastro e conta',
    paragraphs: [
      'Para usar o aplicativo é necessário criar uma conta com e-mail e senha ou com sua conta Google. Você se compromete a fornecer informações verdadeiras e a manter seus dados atualizados.',
      'Você é responsável por guardar sua senha e por tudo o que for feito na sua conta. Se perceber uso indevido, altere a senha e avise a equipe.',
      'O Elpida é destinado a pessoas a partir de 13 anos. Pessoas menores de 18 anos devem usar o aplicativo com o conhecimento de um responsável.',
    ],
  },
  {
    title: '4. Uso adequado',
    paragraphs: [
      'Ao usar o Elpida, você concorda em não:',
      '• publicar conteúdo ofensivo, discriminatório, violento, ilegal ou que exponha outras pessoas;',
      '• assediar, ameaçar ou constranger outros usuários;',
      '• tentar acessar áreas restritas, contas de outras pessoas ou comprometer a segurança do aplicativo;',
      '• usar o aplicativo para fins ilícitos ou para obter vantagem indevida.',
      'Contas que violarem estas regras poderão ser suspensas ou excluídas pela equipe.',
    ],
  },
  {
    title: '5. Conteúdos do aplicativo',
    paragraphs: [
      'As videoaulas são cadastradas exclusivamente pela administração do Elpida. Os livros apresentados (títulos, sinopses e capas) pertencem aos seus respectivos autores e editoras e são exibidos com fins informativos.',
      'Você não deve copiar, redistribuir ou usar comercialmente os conteúdos do aplicativo sem autorização dos titulares dos direitos.',
    ],
  },
  {
    title: '6. Comentários e moderação',
    paragraphs: [
      'Os comentários enviados passam por moderação da equipe antes de serem exibidos publicamente e podem ser recusados ou removidos quando descumprirem estes termos.',
    ],
  },
  {
    title: '7. Dados pessoais e privacidade (LGPD)',
    paragraphs: [
      'O Elpida trata seus dados de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
      'Dados que coletamos: e-mail, nome, gênero, idade ou data de nascimento, foto de perfil (opcionais, conforme preenchidos por você) e suas interações no aplicativo, como curtidas, itens salvos, livros favoritos e comentários.',
      'Para que usamos: criar e manter sua conta, personalizar o aplicativo (por exemplo, a saudação), guardar seus itens favoritos e salvos e moderar os comentários.',
      'Onde ficam: os dados da conta são armazenados em serviço de banco de dados e autenticação (Supabase). Algumas informações, como localização, guardiões e publicações pessoais, ficam apenas no seu aparelho e não são enviadas ao nosso banco de dados.',
      'Não vendemos seus dados e não os compartilhamos com terceiros para fins de publicidade.',
      'Seus direitos: você pode acessar e corrigir seus dados em Perfil > Editar perfil e excluir sua conta a qualquer momento em Perfil ou Configurações. Ao excluir a conta, seus dados cadastrais e suas interações são removidos. Para outros pedidos relacionados à LGPD, entre em contato pelo e-mail indicado abaixo.',
    ],
  },
  {
    title: '8. Localização e serviços de apoio',
    paragraphs: [
      'O mapa usa a localização do seu aparelho, somente se você permitir, para mostrar delegacias, hospitais e outros serviços próximos. As informações do mapa vêm do OpenStreetMap e podem estar incompletas ou desatualizadas. Confirme sempre o endereço e o funcionamento antes de se deslocar.',
    ],
  },
  {
    title: '9. Disponibilidade e responsabilidade',
    paragraphs: [
      'O Elpida é um projeto acadêmico e pode ficar indisponível, mudar ou ser encerrado sem aviso prévio. Nos esforçamos para manter as informações corretas, mas não garantimos que estejam sempre completas ou atualizadas.',
      'A equipe não se responsabiliza por decisões tomadas com base apenas no conteúdo do aplicativo nem por danos decorrentes do uso indevido da conta por terceiros.',
    ],
  },
  {
    title: '10. Alterações destes termos',
    paragraphs: [
      'Estes termos podem ser atualizados. A data da última atualização aparece no início desta página. O uso do aplicativo após a mudança indica que você concorda com a nova versão.',
    ],
  },
  {
    title: '11. Contato e legislação',
    paragraphs: [
      `Dúvidas, pedidos sobre seus dados ou denúncias de uso indevido: ${CONTATO_EMAIL}.`,
      'Estes termos são regidos pelas leis da República Federativa do Brasil.',
    ],
  },
];

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/cadastro');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--elpida-bg)', padding: '0 24px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 0 8px' }}>
        <button
          type="button"
          onClick={goBack}
          aria-label="Voltar"
          style={{
            background: 'none',
            border: 0,
            padding: 4,
            cursor: 'pointer',
            color: 'var(--elpida-purple)',
            display: 'flex',
          }}
        >
          <ChevronLeft size={26} />
        </button>
      </div>

      <h1 style={{ margin: '0 0 4px', fontSize: 24, color: 'var(--elpida-purple)' }}>Termos e Condições de Uso</h1>
      <p style={{ margin: '0 0 20px', fontSize: 12, color: '#666' }}>Última atualização: {ULTIMA_ATUALIZACAO}</p>

      {SECTIONS.map((section) => (
        <section key={section.title} style={{ marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 16, color: 'var(--elpida-purple)' }}>{section.title}</h2>
          {section.paragraphs.map((p, i) => (
            <p key={i} style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.55, color: 'var(--elpida-text)' }}>
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
};

export default TermsPage;
