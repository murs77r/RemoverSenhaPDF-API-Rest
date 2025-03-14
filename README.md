# 🔓 RemoverSenhaPDF - Aplicação Web com AWS Lambda 📄

Esta aplicação web permite aos usuários remover senhas de arquivos PDF criptografados de forma rápida e segura. O frontend se comunica com um serviço AWS Lambda para processar os arquivos PDF, removendo a proteção por senha.

## ✨ Funcionalidades Principais

* **Interface Amigável**: Design responsivo e intuitivo para fácil utilização
* **Processamento Seguro**: Todo processamento ocorre no backend via AWS Lambda
* **Privacidade**: Arquivos não são armazenados permanentemente nos servidores
* **Visualização em Tempo Real**: Informações do arquivo selecionado são exibidas instantaneamente
* **Feedback Visual**: Indicadores de progresso e mensagens de erro claras
* **Download Direto**: Arquivo processado é baixado diretamente no navegador

## 🚀 Como Utilizar

1. Acesse a aplicação web pelo navegador
2. Selecione o arquivo PDF protegido (máximo 3MB)
3. Digite a senha do PDF
4. Clique em "Remover Senha"
5. Aguarde o processamento (normalmente alguns segundos)
6. Faça o download do arquivo sem senha

## 🖥️ Frontend

### 📄 Componentes Principais

* **Seletor de Arquivo**: Permite escolher o PDF protegido com feedback de tamanho
* **Campo de Senha**: Input seguro com opção de mostrar/ocultar a senha
* **Barra de Progresso**: Indicação visual durante o processamento
* **Área de Resultado**: Exibição do status e link para download

### 🎨 Tecnologias Utilizadas

* **HTML5**: Estrutura semântica para melhor acessibilidade
* **CSS3/Bootstrap 5**: Estilização responsiva e moderna
* **JavaScript**: Manipulação do DOM e comunicação com API
* **Font Awesome**: Ícones intuitivos para melhor experiência do usuário

## 🔌 Integração com API

A aplicação se comunica com uma API REST hospedada no AWS Lambda.

## ⚙️ Configuração e Implantação

### Arquivos do Projeto
- `index.html`: Estrutura da aplicação web
- `styles.css`: Estilização da interface
- `script.js`: Lógica de interação e comunicação com API

### Personalização
- O limite de tamanho de arquivo pode ser ajustado na constante MAX_FILE_SIZE_MB em script.js
- As cores podem ser personalizadas no arquivo styles.css

## 🔒 Segurança

- **HTTPS**: Todas as comunicações com a API ocorrem via HTTPS
- **Validação**: Verificações de tamanho e tipo de arquivo no frontend
- **Proteção de Dados**: As senhas e conteúdo dos PDFs são transmitidos de forma segura
- **Feedback Limitado**: Mensagens de erro não expõem detalhes sensíveis da implementação

## 📝 Limitações Conhecidas

- O tamanho máximo do arquivo é limitado a 3MB
- Alguns PDFs com proteção avançada podem não ser compatíveis
- O processamento depende da complexidade do arquivo e da carga atual do servidor
