/*
 * dados.js — conteúdo das trilhas do GPC (trilhas > módulos > nós > questões).
 *
 * Cada questão é corrigida no próprio navegador. Para aceitar variações de escrita,
 * a resposta é normalizada (minúsculas, sem acentos, sem espaços repetidos) e comparada com:
 *   - chaves:  lista de grupos; a resposta vale se contiver TODAS as palavras de algum grupo
 *   - padroes: lista de expressões regulares (texto) testadas na resposta normalizada
 * `esperada` é a resposta mostrada ao aluno e também é usada para testar a correção.
 */
(function (global) {
  // Módulo de Git compartilhado pelas duas trilhas
  const gitNos = () => [
    {
      titulo: 'Controle de Versão com Git',
      conteudo: [
        'Git é um sistema de controle de versão: ele registra o histórico do projeto, permite voltar no tempo e facilita o trabalho em equipe.',
        'O fluxo básico é: modificar arquivos, adicioná-los à área de preparação (add) e registrar um retrato do projeto (commit).',
        { codigo: 'git init\ngit add .\ngit commit -m "Primeira versão"' },
      ],
      questoes: [
        { enunciado: 'Qual comando cria um repositório Git na pasta atual?', dificuldade: 'FÁCIL', esperada: 'git init', chaves: [['git init']], explicacao: 'git init cria a pasta oculta .git e transforma o diretório em um repositório.' },
        { enunciado: 'Qual comando registra no histórico as alterações que já foram preparadas?', dificuldade: 'FÁCIL', esperada: 'git commit', chaves: [['commit']], explicacao: 'git commit grava um retrato (snapshot) das alterações preparadas, com uma mensagem.' },
        { enunciado: 'Qual comando prepara os arquivos alterados para o próximo commit?', dificuldade: 'MÉDIA', esperada: 'git add', chaves: [['add']], explicacao: 'git add move as alterações para a área de preparação (staging).' },
      ],
    },
    {
      titulo: 'Branches e GitHub',
      conteudo: [
        'Uma branch (ramificação) permite desenvolver uma funcionalidade sem mexer na linha principal do projeto. Quando termina, você junta as mudanças com um merge.',
        'O GitHub hospeda repositórios na nuvem: com push você envia seus commits e, com um pull request, propõe a união de uma branch à principal.',
        { codigo: 'git checkout -b minha-feature\ngit push origin minha-feature' },
      ],
      questoes: [
        { enunciado: 'Qual comando envia seus commits para o repositório remoto?', dificuldade: 'MÉDIA', esperada: 'git push', chaves: [['push']], explicacao: 'git push envia os commits locais para o repositório remoto, como o GitHub.' },
        { enunciado: 'Como se chama a ação de juntar as mudanças de uma branch em outra?', dificuldade: 'MÉDIA', esperada: 'merge', chaves: [['merge'], ['mescl']], explicacao: 'O merge incorpora o histórico de uma branch em outra.' },
        { enunciado: 'Qual comando cria e muda para uma nova branch em uma única linha?', dificuldade: 'DIFÍCIL', esperada: 'git checkout -b nome', chaves: [['checkout', '-b'], ['switch', '-c']], explicacao: 'git checkout -b nome (ou git switch -c nome) cria a branch e já troca para ela.' },
      ],
    },
  ];

  const trilhas = [
    /* ------------------------------------------------------------------ BACKEND */
    {
      id: 'backend',
      titulo: 'Desenvolvimento Backend',
      descricao: 'Aprenda a construir a lógica, as APIs e os bancos de dados por trás de aplicações modernas.',
      modulos: [
        {
          titulo: 'Lógica de Programação',
          nos: [
            {
              titulo: 'Variáveis e Operadores',
              conteudo: [
                'Uma variável é um espaço na memória, com um nome, que guarda um valor que pode mudar durante a execução do programa.',
                'Operadores aritméticos: + - * / e % (resto da divisão). Operadores de comparação: ==, !=, <, >, <=, >=. Operadores lógicos: && (E), || (OU) e ! (NÃO).',
                { codigo: 'idade = 17\nmaiorDeIdade = idade >= 18   // falso\nresto = 10 % 3               // 1' },
              ],
              questoes: [
                { enunciado: 'Qual operador retorna o resto de uma divisão?', dificuldade: 'FÁCIL', esperada: '%', chaves: [['%'], ['modulo']], explicacao: 'O operador % (módulo) devolve o resto da divisão inteira.' },
                { enunciado: 'Qual é o valor de 10 % 3?', dificuldade: 'FÁCIL', esperada: '1', padroes: ['^(1|um)$'], explicacao: '10 dividido por 3 dá 3 e sobra 1, então 10 % 3 = 1.' },
                { enunciado: 'Qual operador lógico inverte o valor de uma condição (NÃO)?', dificuldade: 'MÉDIA', esperada: '!', padroes: ['(^|\\s)!($|\\s)', '^(nao|not)$'], explicacao: 'O operador ! transforma verdadeiro em falso e vice-versa.' },
              ],
            },
            {
              titulo: 'Estruturas Condicionais',
              conteudo: [
                'Estruturas condicionais permitem que o programa tome decisões: um bloco só executa quando a condição é verdadeira. A forma mais comum é o if / else (se / senão).',
                'Para testar várias possibilidades em sequência use else if. Para escolher entre vários valores específicos existe o switch (escolha).',
                { codigo: 'se (nota >= 60)\n    escreva("Aprovado")\nsenão\n    escreva("Tente novamente")' },
              ],
              questoes: [
                { enunciado: 'Qual palavra-chave define o bloco executado quando a condição do if é falsa?', dificuldade: 'FÁCIL', esperada: 'else', padroes: ['\\b(else|senao)\\b'], explicacao: 'O else (senão) executa quando a condição do if não é verdadeira.' },
                { enunciado: 'Qual operador lógico só dá verdadeiro quando as duas condições são verdadeiras: E ou OU?', dificuldade: 'MÉDIA', esperada: 'E', padroes: ['^(o )?(operador )?(e|and|&&)$'], explicacao: 'Com o operador E (&&), as duas condições precisam ser verdadeiras.' },
                { enunciado: 'Qual estrutura escolhe entre vários valores específicos de uma mesma variável (por exemplo, o dia da semana)?', dificuldade: 'DIFÍCIL', esperada: 'switch', chaves: [['switch'], ['escolha']], explicacao: 'O switch compara uma variável com vários casos (case) e executa o correspondente.' },
              ],
            },
          ],
        },
        {
          titulo: 'Java Básico',
          nos: [
            {
              titulo: 'Configuração de Ambiente e Sintaxe Java',
              conteudo: [
                'Para programar em Java você instala o JDK (Java Development Kit), que traz o compilador (javac) e a JVM (Java Virtual Machine), responsável por executar o código.',
                'Todo programa Java começa a execução pelo método main, dentro de uma classe.',
                { codigo: 'public class Ola {\n    public static void main(String[] args) {\n        System.out.println("Olá, GPC!");\n    }\n}' },
              ],
              questoes: [
                { enunciado: 'Qual a assinatura correta do método principal de uma aplicação Java?', dificuldade: 'MÉDIA', esperada: 'public static void main(String[] args)', chaves: [['public', 'static', 'void', 'main', 'string']], explicacao: 'A JVM procura exatamente por public static void main(String[] args) para iniciar o programa.' },
                { enunciado: 'Qual comando imprime um texto no console em Java?', dificuldade: 'FÁCIL', esperada: 'System.out.println', chaves: [['system.out.print']], explicacao: 'System.out.println escreve o texto no console e pula uma linha.' },
                { enunciado: 'O que significa a sigla JVM?', dificuldade: 'FÁCIL', esperada: 'Java Virtual Machine', chaves: [['java', 'virtual', 'machine'], ['maquina', 'virtual']], explicacao: 'A JVM (Java Virtual Machine, ou Máquina Virtual Java) executa o bytecode gerado pelo compilador.' },
              ],
            },
            {
              titulo: 'Estruturas de Repetição em Java',
              conteudo: [
                'Laços repetem um bloco de código. O for é ideal quando você sabe quantas vezes repetir; o while repete enquanto uma condição for verdadeira; o do-while executa o bloco ao menos uma vez antes de testar a condição.',
                { codigo: 'for (int i = 1; i <= 3; i++) {\n    System.out.println("Volta " + i);\n}' },
              ],
              questoes: [
                { enunciado: 'Qual laço executa o bloco pelo menos uma vez, antes de testar a condição?', dificuldade: 'FÁCIL', esperada: 'do-while', padroes: ['^(o )?(laco )?do(-| )?while$', '^do$'], explicacao: 'No do-while a condição é testada só no final, então o bloco roda ao menos uma vez.' },
                { enunciado: 'Quantas vezes o código do exemplo imprime "Volta"?', dificuldade: 'MÉDIA', esperada: '3', padroes: ['^(3|tres)( vezes?)?$'], explicacao: 'O i vai de 1 até 3, então o laço executa 3 vezes.' },
                { enunciado: 'No exemplo, qual operador soma 1 à variável i a cada volta?', dificuldade: 'MÉDIA', esperada: 'i++', chaves: [['++']], explicacao: 'O operador ++ incrementa a variável em 1.' },
              ],
            },
          ],
        },
        {
          titulo: 'Programação Orientada a Objetos',
          nos: [
            {
              titulo: 'Classes e Instâncias',
              conteudo: [
                'Uma classe é o molde (a receita) que define atributos (dados) e métodos (comportamentos). Uma instância, ou objeto, é uma unidade criada a partir desse molde com a palavra-chave new.',
                { codigo: 'public class Aluno {\n    String nome;\n    void estudar() { System.out.println(nome + " está estudando"); }\n}\n\nAluno ana = new Aluno();\nana.nome = "Ana";' },
              ],
              questoes: [
                { enunciado: 'Qual palavra-chave cria um novo objeto em Java?', dificuldade: 'FÁCIL', esperada: 'new', padroes: ['^new$'], explicacao: 'new aloca o objeto e chama o construtor da classe.' },
                { enunciado: 'Como se chama o "molde" que define atributos e métodos de um objeto?', dificuldade: 'FÁCIL', esperada: 'classe', chaves: [['classe'], ['class']], explicacao: 'A classe descreve como os objetos são; cada objeto é uma instância dela.' },
                { enunciado: 'Como se chamam as ações (comportamentos) que um objeto pode executar?', dificuldade: 'MÉDIA', esperada: 'métodos', chaves: [['metodo']], explicacao: 'Métodos são as funções de uma classe, como estudar() no exemplo.' },
              ],
            },
            {
              titulo: 'Encapsulamento e Modificadores',
              conteudo: [
                'Encapsulamento protege os dados de um objeto: os atributos ficam private e o acesso acontece por métodos públicos, os getters e setters.',
                'Modificadores de acesso: public (qualquer classe acessa), private (só a própria classe) e protected (a classe, suas subclasses e o mesmo pacote).',
                { codigo: 'private double saldo;\n\npublic double getSaldo() { return saldo; }\npublic void setSaldo(double saldo) { this.saldo = saldo; }' },
              ],
              questoes: [
                { enunciado: 'Qual modificador de acesso restringe um atributo à própria classe?', dificuldade: 'FÁCIL', esperada: 'private', chaves: [['private'], ['privado']], explicacao: 'Com private, só código dentro da própria classe enxerga o atributo.' },
                { enunciado: 'Que métodos são usados para ler e alterar atributos privados?', dificuldade: 'MÉDIA', esperada: 'getters e setters', chaves: [['getter', 'setter'], ['get', 'set']], explicacao: 'Getters leem o valor e setters alteram, permitindo validar os dados.' },
                { enunciado: 'Qual modificador de acesso permite que qualquer classe acesse o membro?', dificuldade: 'DIFÍCIL', esperada: 'public', chaves: [['public'], ['publico']], explicacao: 'public não impõe restrição de acesso.' },
              ],
            },
          ],
        },
        {
          titulo: 'Git e GitHub',
          nos: gitNos(),
        },
        {
          titulo: 'Banco de Dados e SQL',
          nos: [
            {
              titulo: 'Modelagem e Consultas SELECT',
              conteudo: [
                'Um banco de dados relacional organiza as informações em tabelas, com linhas (registros) e colunas (campos). A linguagem SQL é usada para consultar e alterar esses dados.',
                'O SELECT escolhe as colunas, o FROM indica a tabela e o WHERE filtra as linhas.',
                { codigo: "SELECT nome, email\nFROM usuarios\nWHERE status = 'ATIVA';" },
              ],
              questoes: [
                { enunciado: 'Qual comando SQL é usado para consultar dados de uma tabela?', dificuldade: 'FÁCIL', esperada: 'SELECT', chaves: [['select']], explicacao: 'SELECT busca dados; é o comando de consulta do SQL.' },
                { enunciado: 'Qual cláusula filtra as linhas retornadas por uma consulta?', dificuldade: 'MÉDIA', esperada: 'WHERE', chaves: [['where']], explicacao: 'WHERE mantém só as linhas que atendem à condição.' },
                { enunciado: 'O que significa a sigla SQL?', dificuldade: 'MÉDIA', esperada: 'Structured Query Language', chaves: [['structured', 'query', 'language'], ['linguagem', 'consulta', 'estruturada']], explicacao: 'SQL é a Structured Query Language, ou Linguagem de Consulta Estruturada.' },
              ],
            },
            {
              titulo: 'Inserção, Atualização e Chaves',
              conteudo: [
                'INSERT INTO adiciona registros, UPDATE altera e DELETE remove. Atenção: UPDATE e DELETE quase sempre precisam de WHERE, senão afetam a tabela inteira!',
                'A chave primária (PRIMARY KEY) identifica cada linha de forma única; a chave estrangeira (FOREIGN KEY) liga uma tabela a outra.',
                { codigo: "UPDATE usuarios SET status = 'INATIVA' WHERE id = 5;" },
              ],
              questoes: [
                { enunciado: 'O que identifica cada linha de uma tabela de forma única?', dificuldade: 'MÉDIA', esperada: 'chave primária', chaves: [['chave', 'primaria'], ['primary', 'key']], explicacao: 'A chave primária não se repete e não pode ser nula.' },
                { enunciado: 'O que acontece se você executar um UPDATE sem a cláusula WHERE?', dificuldade: 'DIFÍCIL', esperada: 'Todas as linhas da tabela são alteradas', chaves: [['todas'], ['todos'], ['inteira'], ['toda']], explicacao: 'Sem WHERE, o UPDATE atinge todas as linhas da tabela.' },
                { enunciado: 'Qual comando SQL remove registros de uma tabela?', dificuldade: 'MÉDIA', esperada: 'DELETE', chaves: [['delete']], explicacao: 'DELETE FROM tabela WHERE ... remove as linhas que atendem à condição.' },
              ],
            },
          ],
        },
        {
          titulo: 'Spring Boot e API REST',
          nos: [
            {
              titulo: 'Conceitos de API REST',
              conteudo: [
                'Uma API REST expõe recursos por URLs e usa os métodos HTTP para indicar a ação: GET (consultar), POST (criar), PUT (atualizar) e DELETE (remover). Os dados costumam trafegar em JSON.',
                'O código de status informa o resultado: 200 OK, 201 Created, 404 Not Found.',
                { codigo: 'GET    /api/usuarios      → lista usuários\nPOST   /api/usuarios      → cria um usuário\nDELETE /api/usuarios/5    → remove o usuário 5' },
              ],
              questoes: [
                { enunciado: 'Qual método HTTP é usado para criar um recurso?', dificuldade: 'FÁCIL', esperada: 'POST', chaves: [['post']], explicacao: 'POST envia dados ao servidor para criar um novo recurso.' },
                { enunciado: 'Qual formato de dados é o mais usado nas respostas de uma API REST?', dificuldade: 'FÁCIL', esperada: 'JSON', chaves: [['json']], explicacao: 'JSON é leve, legível e entendido por praticamente todas as linguagens.' },
                { enunciado: 'Qual código de status HTTP significa "não encontrado"?', dificuldade: 'MÉDIA', esperada: '404', chaves: [['404']], explicacao: 'O status 404 (Not Found) indica que o recurso pedido não existe.' },
              ],
            },
            {
              titulo: 'Spring Boot na Prática',
              conteudo: [
                'Spring Boot é um framework Java que simplifica a criação de aplicações, com configuração automática e servidor embutido.',
                'Um controller é uma classe anotada com @RestController; cada método mapeia uma rota, por exemplo com @GetMapping.',
                { codigo: '@RestController\n@RequestMapping("/api/ola")\npublic class OlaController {\n    @GetMapping\n    public String ola() { return "Olá, GPC!"; }\n}' },
              ],
              questoes: [
                { enunciado: 'Qual anotação marca uma classe como controller de uma API REST?', dificuldade: 'MÉDIA', esperada: '@RestController', chaves: [['restcontroller']], explicacao: '@RestController registra a classe como controller e converte o retorno dos métodos em JSON.' },
                { enunciado: 'Qual anotação mapeia um método para requisições HTTP GET?', dificuldade: 'MÉDIA', esperada: '@GetMapping', chaves: [['getmapping']], explicacao: '@GetMapping liga o método a uma rota que responde a GET.' },
                { enunciado: 'Qual anotação mapeia um método para requisições HTTP POST?', dificuldade: 'MÉDIA', esperada: '@PostMapping', chaves: [['postmapping']], explicacao: '@PostMapping liga o método a uma rota que responde a POST.' },
              ],
            },
          ],
        },
      ],
    },

    /* ----------------------------------------------------------------- FRONTEND */
    {
      id: 'frontend',
      titulo: 'Desenvolvimento Frontend',
      descricao: 'Crie interfaces acessíveis e experiências que conectam pessoas aos produtos digitais.',
      modulos: [
        {
          titulo: 'Lógica de Programação',
          nos: [
            {
              titulo: 'Variáveis e Tipos de Dados',
              conteudo: [
                'Variáveis guardam valores. Os tipos mais comuns são número (10, 3.14), texto, também chamado de string ("olá"), e booleano (verdadeiro ou falso). Dar nomes claros às variáveis deixa o código mais legível.',
                'O operador % devolve o resto de uma divisão: 7 % 2 é 1.',
                { codigo: 'nome = "Ana"\nidade = 17\nehEstudante = verdadeiro' },
              ],
              questoes: [
                { enunciado: 'Qual tipo de dado guarda apenas verdadeiro ou falso?', dificuldade: 'FÁCIL', esperada: 'booleano', chaves: [['boolean'], ['booleano'], ['logico']], explicacao: 'O tipo booleano só admite dois valores: verdadeiro ou falso.' },
                { enunciado: 'Qual tipo de dado representa um texto?', dificuldade: 'FÁCIL', esperada: 'string', chaves: [['string'], ['texto'], ['cadeia']], explicacao: 'Strings guardam sequências de caracteres, como nomes e frases.' },
                { enunciado: 'Qual é o resultado de 7 % 2?', dificuldade: 'MÉDIA', esperada: '1', padroes: ['^(1|um)$'], explicacao: '7 dividido por 2 dá 3 e sobra 1.' },
              ],
            },
            {
              titulo: 'Condições e Laços',
              conteudo: [
                'Condições (if/else) escolhem caminhos; laços (for, while) repetem tarefas. Juntos, eles resolvem problemas como "percorrer uma lista e mostrar só os números pares".',
                { codigo: 'para cada numero em lista:\n    se numero % 2 == 0:\n        escreva(numero)' },
              ],
              questoes: [
                { enunciado: 'Que estrutura você usa para repetir um bloco várias vezes?', dificuldade: 'MÉDIA', esperada: 'laço (for ou while)', padroes: ['\\b(laco|lacos|loop|repeticao|for|while|enquanto)\\b'], explicacao: 'Laços de repetição, como for e while, executam o bloco várias vezes.' },
                { enunciado: 'Qual palavra-chave define o caminho executado quando a condição do if é falsa?', dificuldade: 'FÁCIL', esperada: 'else', padroes: ['\\b(else|senao)\\b'], explicacao: 'O else (senão) cobre o caso em que a condição é falsa.' },
                { enunciado: 'Qual operador retorna o resto da divisão?', dificuldade: 'FÁCIL', esperada: '%', chaves: [['%'], ['modulo']], explicacao: 'O operador % (módulo) devolve o resto da divisão.' },
              ],
            },
          ],
        },
        {
          titulo: 'HTML',
          nos: [
            {
              titulo: 'Estrutura de uma Página HTML',
              conteudo: [
                'HTML (HyperText Markup Language) define a estrutura de uma página usando tags. Todo documento tem <!DOCTYPE html>, o elemento <html>, o <head> (informações da página, como o título) e o <body> (o conteúdo visível).',
                { codigo: '<!DOCTYPE html>\n<html lang="pt-br">\n  <head><title>Minha página</title></head>\n  <body><h1>Olá!</h1></body>\n</html>' },
              ],
              questoes: [
                { enunciado: 'Qual tag contém todo o conteúdo visível da página?', dificuldade: 'FÁCIL', esperada: '<body>', padroes: ['\\bbody\\b'], explicacao: 'Tudo o que aparece na tela fica dentro do <body>.' },
                { enunciado: 'Qual tag define o título principal (nível 1) de uma página?', dificuldade: 'FÁCIL', esperada: '<h1>', padroes: ['\\bh1\\b'], explicacao: 'As tags h1 a h6 definem títulos; h1 é o mais importante.' },
                { enunciado: 'Qual tag guarda informações da página, como o título da aba, que não aparecem no conteúdo?', dificuldade: 'MÉDIA', esperada: '<head>', padroes: ['\\bhead\\b'], explicacao: 'O <head> guarda metadados, como título, ícone e links para o CSS.' },
              ],
            },
            {
              titulo: 'Links, Imagens e Formulários',
              conteudo: [
                'O link usa a tag <a> com o atributo href. Imagens usam <img> com src e alt (texto alternativo, importante para acessibilidade). Formulários usam <form>, <label> e <input>.',
                { codigo: '<a href="https://github.com">GitHub</a>\n<img src="logo.png" alt="Logo do GPC">\n<input type="email" id="email">' },
              ],
              questoes: [
                { enunciado: 'Qual atributo da tag <a> define o endereço de destino do link?', dificuldade: 'FÁCIL', esperada: 'href', padroes: ['\\bhref\\b'], explicacao: 'O href guarda o endereço para onde o link leva.' },
                { enunciado: 'Qual atributo da tag <img> descreve a imagem para leitores de tela?', dificuldade: 'MÉDIA', esperada: 'alt', padroes: ['\\balt\\b'], explicacao: 'O alt é lido por leitores de tela e aparece se a imagem não carregar.' },
                { enunciado: 'Qual tag cria um campo de entrada de dados em um formulário?', dificuldade: 'DIFÍCIL', esperada: '<input>', padroes: ['\\binput\\b'], explicacao: 'A tag <input>, combinada com o atributo type, cria campos de texto, e-mail, senha e outros.' },
              ],
            },
          ],
        },
        {
          titulo: 'CSS',
          nos: [
            {
              titulo: 'Seletores e Propriedades',
              conteudo: [
                'CSS (Cascading Style Sheets) cuida da aparência da página. Uma regra tem um seletor e declarações (propriedade: valor).',
                'Tipos de seletor: de tag (p), de classe, que começa com ponto (.destaque), e de id, que começa com # (#topo).',
                { codigo: '.destaque {\n  color: #017b70;\n  font-size: 18px;\n}' },
              ],
              questoes: [
                { enunciado: 'Qual seletor CSS aplica estilo a todos os elementos com class="destaque"?', dificuldade: 'MÉDIA', esperada: '.destaque', chaves: [['.destaque']], explicacao: 'Seletores de classe começam com ponto.' },
                { enunciado: 'Qual propriedade CSS muda a cor do texto?', dificuldade: 'FÁCIL', esperada: 'color', padroes: ['(^|[^-a-z])color($|[^-a-z])'], explicacao: 'color define a cor do texto; background-color define a cor de fundo.' },
                { enunciado: 'Qual símbolo inicia o seletor de um id?', dificuldade: 'MÉDIA', esperada: '#', padroes: ['(^|\\s)#', 'cerquilha|hashtag|jogo da velha'], explicacao: 'Seletores de id começam com #, como #topo.' },
              ],
            },
            {
              titulo: 'Box Model e Flexbox',
              conteudo: [
                'Todo elemento é uma caixa formada por content (conteúdo), padding (espaço interno), border (borda) e margin (espaço externo).',
                'O Flexbox alinha e distribui elementos: display: flex no contêiner; justify-content alinha no eixo principal e align-items no eixo transversal.',
                { codigo: '.menu {\n  display: flex;\n  gap: 20px;\n  justify-content: space-between;\n}' },
              ],
              questoes: [
                { enunciado: 'Qual propriedade cria o espaço interno entre o conteúdo e a borda de um elemento?', dificuldade: 'MÉDIA', esperada: 'padding', chaves: [['padding']], explicacao: 'padding é o espaço interno; margin é o espaço externo.' },
                { enunciado: 'Qual valor de display ativa o Flexbox?', dificuldade: 'MÉDIA', esperada: 'flex', chaves: [['flex']], explicacao: 'display: flex transforma o elemento em um contêiner flexível.' },
                { enunciado: 'Qual propriedade do Flexbox alinha os itens no eixo transversal?', dificuldade: 'DIFÍCIL', esperada: 'align-items', chaves: [['align-items']], explicacao: 'align-items alinha no eixo transversal; justify-content, no eixo principal.' },
              ],
            },
          ],
        },
        {
          titulo: 'JavaScript',
          nos: [
            {
              titulo: 'Variáveis, Funções e Condições',
              conteudo: [
                'JavaScript dá comportamento à página. Declare variáveis com let (valor que muda) e const (valor que não muda). Funções agrupam instruções reutilizáveis.',
                'Prefira === a == nas comparações: ele compara valor e tipo.',
                { codigo: 'const nome = "Ana";\nlet pontos = 0;\nfunction somar(a, b) { return a + b; }\nconsole.log(somar(2, 3)); // 5' },
              ],
              questoes: [
                { enunciado: 'Qual palavra-chave declara uma constante em JavaScript?', dificuldade: 'FÁCIL', esperada: 'const', chaves: [['const']], explicacao: 'const cria uma variável que não pode ser reatribuída.' },
                { enunciado: 'Qual operador compara valor e tipo (igualdade estrita) em JavaScript?', dificuldade: 'MÉDIA', esperada: '===', chaves: [['===']], explicacao: '=== só é verdadeiro se valor e tipo forem iguais.' },
                { enunciado: 'Qual comando exibe uma mensagem no console do navegador?', dificuldade: 'FÁCIL', esperada: 'console.log', chaves: [['console.log']], explicacao: 'console.log escreve no console, útil para testar o código.' },
              ],
            },
            {
              titulo: 'DOM e Eventos',
              conteudo: [
                'O DOM (Document Object Model) representa a página como uma árvore de elementos que o JavaScript pode ler e alterar. Com document.querySelector você seleciona um elemento e, com addEventListener, reage a eventos como o clique.',
                { codigo: 'const botao = document.querySelector("#salvar");\nbotao.addEventListener("click", () => {\n  botao.textContent = "Salvo!";\n});' },
              ],
              questoes: [
                { enunciado: 'Que método seleciona um elemento da página usando um seletor CSS?', dificuldade: 'MÉDIA', esperada: 'document.querySelector', chaves: [['queryselector']], explicacao: 'querySelector devolve o primeiro elemento que casa com o seletor.' },
                { enunciado: 'Qual método registra uma função para reagir a um evento, como o clique?', dificuldade: 'MÉDIA', esperada: 'addEventListener', chaves: [['addeventlistener']], explicacao: 'addEventListener liga uma função a um evento do elemento.' },
                { enunciado: 'Qual propriedade altera o texto de um elemento pelo DOM?', dificuldade: 'DIFÍCIL', esperada: 'textContent', chaves: [['textcontent'], ['innertext'], ['innerhtml']], explicacao: 'textContent (ou innerText) lê e altera o texto do elemento.' },
              ],
            },
          ],
        },
        {
          titulo: 'Git e GitHub',
          nos: gitNos(),
        },
        {
          titulo: 'APIs e Frameworks',
          nos: [
            {
              titulo: 'Consumindo APIs com fetch',
              conteudo: [
                'Uma API devolve dados, em geral JSON, que a página pode consumir. O fetch faz requisições HTTP e devolve uma Promise; com async/await esperamos a resposta de forma simples.',
                { codigo: 'async function carregar() {\n  const resposta = await fetch("https://api.exemplo.com/dados");\n  const dados = await resposta.json();\n  console.log(dados);\n}' },
              ],
              questoes: [
                { enunciado: 'Qual função do navegador faz requisições HTTP a uma API?', dificuldade: 'FÁCIL', esperada: 'fetch', chaves: [['fetch']], explicacao: 'fetch(url) envia a requisição e devolve uma Promise.' },
                { enunciado: 'Qual palavra-chave faz o código esperar o resultado de uma Promise?', dificuldade: 'MÉDIA', esperada: 'await', chaves: [['await']], explicacao: 'await pausa a função async até a Promise ser resolvida.' },
                { enunciado: 'Qual método da resposta do fetch converte o corpo em objeto JavaScript?', dificuldade: 'MÉDIA', esperada: 'json()', chaves: [['json']], explicacao: 'resposta.json() lê o corpo e o transforma em objeto.' },
              ],
            },
            {
              titulo: 'Introdução a Frameworks Front-end',
              conteudo: [
                'Frameworks e bibliotecas, como React, Vue e Angular, ajudam a construir interfaces grandes dividindo a tela em componentes reutilizáveis. O estado (state) guarda os dados que, ao mudarem, atualizam a tela automaticamente.',
                { codigo: 'function Contador() {\n  const [n, setN] = React.useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}' },
              ],
              questoes: [
                { enunciado: 'Cite um framework ou biblioteca front-end popular.', dificuldade: 'FÁCIL', esperada: 'React', chaves: [['react'], ['vue'], ['angular'], ['svelte'], ['next'], ['nuxt']], explicacao: 'React, Vue e Angular estão entre os mais usados.' },
                { enunciado: 'Como se chamam os blocos reutilizáveis que compõem a interface nesses frameworks?', dificuldade: 'MÉDIA', esperada: 'componentes', chaves: [['componente'], ['component']], explicacao: 'Componentes encapsulam uma parte da interface e podem ser reaproveitados.' },
                { enunciado: 'Como se chama o recurso que guarda dados que, ao mudarem, atualizam a tela?', dificuldade: 'DIFÍCIL', esperada: 'estado (state)', chaves: [['estado'], ['state']], explicacao: 'O estado (state) dispara uma nova renderização quando muda.' },
              ],
            },
          ],
        },
      ],
    },
  ];

  // Gera os ids (ex.: backend-m2-n1) para que o progresso possa ser salvo por nó
  trilhas.forEach((t) => {
    t.modulos.forEach((m, mi) => {
      m.id = `${t.id}-m${mi + 1}`;
      m.ordem = mi + 1;
      m.nos.forEach((n, ni) => {
        n.id = `${m.id}-n${ni + 1}`;
        n.ordem = ni + 1;
      });
    });
  });

  global.GPC_TRILHAS = trilhas;
})(window);
