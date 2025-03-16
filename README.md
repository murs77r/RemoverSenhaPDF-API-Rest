# 🔓 Removedor de Senhas de PDF

Esta aplicação web permite aos usuários remover senhas de proteção de arquivos PDF de forma simples, segura e eficiente. Utilizando uma API REST, o serviço processa os documentos sem armazenar informações em servidores.

## ✨ Funcionalidades

1. **Upload de PDF**: Selecione arquivos PDF protegidos (até 3MB).
2. **Remoção de Senha**: Insira a senha atual do documento para removê-la.
3. **Download Seguro**: Baixe o PDF sem proteção imediatamente após o processamento.
4. **Interface Amigável**: Design intuitivo com suporte para dispositivos móveis e desktop.
5. **Segurança**: Os arquivos são processados temporariamente e não são armazenados.

## 🚀 Como Usar

O processo é simples e rápido:

1. Clique em **Selecione o arquivo PDF** para carregar seu documento.
2. Digite a **senha atual** do PDF no campo indicado.
3. Clique no botão **Remover Senha** para processar o arquivo.
4. Após o processamento, clique em **Baixar PDF sem senha** para salvar o documento.

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

A aplicação está implantada na plataforma Koyeb, oferecendo:

- **Alta Disponibilidade**: Serviço disponível 24/7
- **Escalabilidade**: Recursos adaptados conforme a demanda
- **Segurança**: Conexões HTTPS e processamento seguro dos documentos

## ⚙️ API

O serviço utiliza a API em:
```
https://api.class-one.com.br/remove-pdf-password
```

A API aceita requisições POST com o seguinte formato:
```json
{
  "pdfBase64": "string_base64_do_arquivo",
  "password": "senha_do_pdf"
}
```

## 📋 Limitações

- Tamanho máximo de arquivo: 3MB
- Compatível com PDFs protegidos por senha de acesso
- Necessário conhecer a senha atual do documento
