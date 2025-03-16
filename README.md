# 🔄 Ferramentas para PDF

Esta aplicação web oferece ferramentas úteis para manipulação de arquivos PDF de forma simples, segura e eficiente. Utilizando uma API REST, o serviço processa os documentos sem armazenar informações em servidores.

## ✨ Funcionalidades

1. **Remoção de Senha**:
   - Upload de PDF protegido (até 3MB)
   - Insira a senha atual do documento para removê-la
   - Download do PDF sem proteção imediatamente após o processamento
   
2. **Conversão de PDF para Imagem**:
   - Transforme páginas de PDF em imagens
   - Suporte a PDFs protegidos com senha (opcional)
   - Download das imagens em formato PNG ou arquivo ZIP com múltiplas páginas

3. **Interface Amigável**: Design intuitivo com suporte para dispositivos móveis e desktop.
4. **Segurança**: Os arquivos são processados temporariamente e não são armazenados.

## 🚀 Como Usar

### Para remover senha de um PDF:

1. Selecione a aba **Remover Senha**
2. Clique em **Selecione o arquivo PDF** para carregar seu documento
3. Digite a **senha atual** do PDF no campo indicado
4. Clique no botão **Remover Senha** para processar o arquivo
5. Após o processamento, clique em **Baixar PDF sem senha** para salvar o documento

### Para converter PDF em imagem:

1. Selecione a aba **PDF para Imagem**
2. Clique em **Selecione o arquivo PDF** para carregar seu documento
3. Se o PDF for protegido, digite a **senha** (opcional)
4. Clique no botão **Converter PDF** para processar o arquivo
5. Após a conversão, baixe a imagem ou arquivo ZIP com as imagens

## 🔧 Tecnologias Utilizadas

- **Frontend**:
  - HTML5: Estrutura da página
  - CSS3/Bootstrap 5: Estilização e responsividade
  - JavaScript: Interatividade e comunicação com a API
  - Font Awesome: Ícones e elementos visuais

- **Backend**:
  - API REST: Processamento dos PDFs na nuvem
  - Base64: Codificação segura para transferência de arquivos

## 🌐 Implantação

A aplicação está implantada no Cloudflare Pages, com utilização específica para a API disponível no seguinte respositório: [Github](https://github.com/murs77r/RemoverSenhaPDF-WebService).

## 📋 Limitações

- Tamanho máximo de arquivo: 3MB
- Compatível com PDFs protegidos por senha de acesso
- Para remoção de senha é necessário conhecer a senha atual do documento
- Conversão para imagem pode apresentar variações na qualidade dependendo da complexidade do PDF
