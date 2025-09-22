````md
# Prova de Programação – Avaliação Prática

**Duração:** 3 aulas
**Pontuação:** 10 pontos
**Atenção ao tempo:** a gestão do tempo será parte da avaliação.
**Leia cuidadosamente todos os requisitos antes de começar.**
**Boa sorte!**

---

## Contexto do Projeto
Uma biblioteca pública deseja modernizar seu sistema de **empréstimo de livros**, oferecendo aos usuários uma plataforma simples para consultar títulos disponíveis e realizar reservas online. O objetivo é tornar o processo mais ágil e transparente, garantindo que cada usuário possa reservar apenas um exemplar de cada vez.

Como desenvolvedor(a), sua missão é **construir o backend desse sistema**, garantindo o controle dos empréstimos e a integridade dos dados.

---

## Requisitos do Sistema
O sistema de empréstimos deverá incluir as seguintes funcionalidades principais:

- **Listagem dos livros disponíveis:** Mostrar todos os livros cadastrados com título, autor e quantidade de exemplares disponíveis.
- **Reserva de livro:** O usuário poderá reservar apenas um exemplar por vez. A quantidade disponível do livro deve ser reduzida em 1 após cada reserva válida.
- **Exibição do livro mais reservado:** O sistema deve permitir consultar, a qualquer momento, qual livro é o mais solicitado.

---

## Estrutura do Banco de Dados MySQL
(**É obrigatório utilizar a estrutura abaixo**)

**Nome do banco de dados:** `biblioteca`

```sql
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    exemplares INT DEFAULT 1,
    reservas INT DEFAULT 0
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO livros (titulo, autor, exemplares, reservas) VALUES
('Dom Casmurro', 'Machado de Assis', 3, 0),
('A Hora da Estrela', 'Clarice Lispector', 2, 0),
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 5, 0);

INSERT INTO usuarios (email) VALUES
('joao@example.com'),
('maria@example.com'),
('ana@example.com');
````

## Requisitos Técnicos

  - O servidor deve rodar na porta 40 + dois últimos números do seu CP.
  - Para cada reserva, armazene o e-mail do usuário na tabela `usuarios`.

### Regras de Reserva:

  - Cada e-mail só pode reservar um único livro por vez.
  - Se o usuário tentar reservar outro livro sem devolver o primeiro, exibir uma mensagem de erro.
  - Após uma reserva válida, exibir uma mensagem confirmando a operação e informando o título do livro reservado.

### Tratamento de Erros:

  - Implementar tratamento de erros para falhas no processo (ex.: livro sem exemplares, tentativa de duplicação).

-----

## Entrega

  - Compacte todos os arquivos do projeto (exceto `node_modules`).
  - O arquivo compactado deve ter o seu nome completo.
  - Ao concluir, chame o professor para apresentar o sistema.

-----

## Tela Inicial (Design esperado)

Um menu simples com as opções:

  - Listar livros disponíveis
  - Reservar um livro
  - Consultar livro mais reservado

-----

## Critérios de Avaliação

| Critério | Pontuação |
| :--- | :--- |
| Listagem dos livros e exemplares | 2 |
| Reserva de livro por usuário | 5 |
| Exibição do livro mais reservado | 2 |
| Tratamento de erros | 1 |

```
```