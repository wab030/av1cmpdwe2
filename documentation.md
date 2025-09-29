Geral

Esse repositório está preparado para ser clonado, uma prova ser desenvolvida no folder src, push e a correção é automatizada. 
Os principais arquivos são:

1..github/workflows/test.yml tem todo o pipeline que será executado pelo github.
1.1 scripts ai_review.js contem uma script para fazer análise do código com inteligência artificial do Gemini. 
2.scripts/init.sql. Esse arquivo tem todo o schema do banco de dados a ser utilizado. Ele pode ser apagado e substituído mas o nome precisa ser mantido. 
3. O arquivo de teste livro.test.js tem os testes automatizados a serem executados no código. Ele também pode ser apagado, mas os testes precisam ser recolocados. 


A prova deve ser desenvolvida no folder src. A prova inteira deve ser desenvolvida nesse folder. 


Como utilizar o repositório

Entre no seu github. 
Crie um fork do repositório https://github.com/wab030/av1cmpdwe2.git
Clone o seu fork.

Desenvolva a prova dentro do folder src. 
***ATENÇÃO*** NÃO ALTERE NENHUM FOLDER A NÃO SER O SRC. 

Observação importante: Crie dois arquivos na raiz do seu projeto

server.js: Conterá todas a configuração do servidor, mas sem o app.listen. Esse arquivo deve exportar a varíavel app. 
app.js: Importa o app e coloca o servidor no ar com o comando app.listen. Isso é fundamental para os testes automatizados funcionar. 


Suba os arquivos para o seu fork no github. 

Análise o relatório do actions. Se quiser algo mais detalhado você precisa inserir um segredo para que a IA rode no seu repositório. 

Quando estiver de acordo com o conteúdo da sua prova crie um pull request para o repositório original. 

Crie um Pull Request com o seu nome e prontuário no nome do Pull Request. 