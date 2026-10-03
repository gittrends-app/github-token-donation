import type { Dictionary } from "./en";

export const ptBR: Dictionary = {
  app: {
    name: "GitHub Token Donation",
    description:
      "Fazemos milhares de requisições à API do GitHub para manter nossos conjuntos de dados de pesquisa atualizados. Cada token doado nos ajuda a coletar dados mais rápido.",
  },
  nav: {
    home: "Início",
    admin: "Admin",
    logout: "Sair",
    openMenu: "Abrir menu",
    language: "Idioma",
  },
  home: {
    title: "Doe um token de acesso do GitHub",
    donate: "Doar com o GitHub",
    update: "Atualizar doação",
    updateHint: (login) =>
      `Você já doou como @${login}. Doe novamente para renovar seu token ou conceder permissões atualizadas.`,
    accessTitle: "O que poderemos acessar",
    revokeNote:
      "Os tokens são usados apenas para coleta de dados de pesquisa e nunca são compartilhados. Você pode revogar o acesso a qualquer momento nas suas",
    revokeLink: "configurações do GitHub",
    imageAlt: "Octocat cientista",
  },
  scopes: {
    public_repo: "Acessar repositórios públicos (apenas lemos dados, nunca enviamos código)",
    repo: "Acessar repositórios públicos e privados",
    "read:org": "Ler participação em organizações e times",
    "read:user": "Ler as informações públicas do seu perfil",
    "user:email": "Ler seus endereços de e-mail",
  },
  alerts: {
    thanksTitle: (name) => (name ? `Obrigado, ${name}!` : "Obrigado!"),
    thanksMessage: "Seu token foi doado com sucesso.",
    updatedMessage: "Sua doação foi atualizada com um novo token.",
    errorTitle: "Erro",
    errors: {
      github: "Erro ao acessar o GitHub. Tente novamente.",
      database: "Não foi possível salvar seu token. Tente novamente mais tarde.",
      state: "A solicitação de autorização expirou ou é inválida. Tente novamente.",
      unexpected: "Algo inesperado aconteceu, tente novamente mais tarde.",
    },
  },
  login: {
    title: "Admin",
    user: "Usuário",
    password: "Senha",
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",
    submit: "Entrar",
    invalid: "Usuário ou senha inválidos",
  },
  admin: {
    title: "Tokens doados",
    received: (count) => `${count} token${count === 1 ? " recebido" : "s recebidos"}`,
    loading: "Carregando…",
    copyAll: "Copiar todos",
    copiedAll: (count) => `${count} token${count === 1 ? " copiado" : "s copiados"}`,
    copied: "Token copiado",
    refresh: "Atualizar",
    loadError: (message) => `Não foi possível carregar os tokens: ${message}`,
    search: "Buscar por login, nome ou id",
    columns: { user: "Usuário", scopes: "Escopos", donatedAt: "Doado em", token: "Token" },
    noResults: "Nenhum resultado para a busca",
    empty: "Nenhum token doado ainda",
    show: "Mostrar",
    hide: "Ocultar",
    copy: "Copiar",
  },
  email: {
    subject: (login) => `Novo token doado por ${login}`,
    subjectUpdated: (login) => `Doação de token atualizada por ${login}`,
    heading: (id, login, name) => `Novo token recebido de: ${id} - ${login} (${name})`,
    scopes: "Escopos",
  },
};
