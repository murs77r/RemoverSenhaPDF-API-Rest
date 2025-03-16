document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const API_ENDPOINTS = {
        removePassword: 'https://api.class-one.com.br/remove-pdf-password',
        pdfToImage: 'https://api.class-one.com.br/pdf-to-image'
    };
    const MAX_FILE_SIZE_MB = 3;
    
    // Elementos do DOM comuns
    const progressContainer = document.getElementById('progressContainer');
    const resultContainer = document.getElementById('resultContainer');
    const resultMessage = document.getElementById('resultMessage');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadBtnText = document.getElementById('downloadBtnText');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const currentYear = document.getElementById('currentYear');
    
    // Elementos para remover senha
    const pdfForm = document.getElementById('pdfForm');
    const pdfFileInput = document.getElementById('pdfFile');
    const pdfPasswordInput = document.getElementById('pdfPassword');
    const fileInfoContainer = document.getElementById('fileInfo');
    const fileInfoBadge = fileInfoContainer.querySelector('.badge');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    
    // Elementos para converter PDF para imagem
    const convertForm = document.getElementById('convertForm');
    const convertFileInput = document.getElementById('convertFile');
    const convertPasswordInput = document.getElementById('convertPassword');
    const convertFileInfoContainer = document.getElementById('convertFileInfo');
    const convertFileInfoBadge = convertFileInfoContainer?.querySelector('.badge');
    const toggleConvertPasswordBtn = document.getElementById('toggleConvertPassword');
    const convertBtn = document.getElementById('convertBtn');
    
    // Definir o ano atual no rodapé
    currentYear.textContent = new Date().getFullYear();
    
    // Funções para alternar visibilidade de senha
    function setupPasswordToggle(inputElement, toggleButton) {
        toggleButton.addEventListener('click', function() {
            const type = inputElement.type === 'password' ? 'text' : 'password';
            inputElement.type = type;
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
    
    // Configurar alternância de senha para ambos os inputs
    setupPasswordToggle(pdfPasswordInput, togglePasswordBtn);
    setupPasswordToggle(convertPasswordInput, toggleConvertPasswordBtn);
    
    // Função para lidar com mudança de arquivo
    function handleFileChange(fileInput, infoContainer, infoBadge) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const file = this.files[0];
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                
                infoBadge.textContent = `${file.name} (${fileSizeMB} MB)`;
                infoContainer.classList.remove('d-none');
                
                // Verificar se o tamanho do arquivo é maior que o permitido
                if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                    showError(`O arquivo excede o tamanho máximo de ${MAX_FILE_SIZE_MB}MB`);
                    fileInput.value = '';
                    infoContainer.classList.add('d-none');
                } else {
                    hideError();
                }
            } else {
                infoContainer.classList.add('d-none');
            }
        });
    }
    
    // Configurar manipuladores de mudança de arquivo
    handleFileChange(pdfFileInput, fileInfoContainer, fileInfoBadge);
    handleFileChange(convertFileInput, convertFileInfoContainer, convertFileInfoBadge);
    
    // Manipular envio do formulário para remover senha
    pdfForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Ocultar mensagens anteriores
        hideError();
        resultContainer.classList.add('d-none');
        
        const file = pdfFileInput.files[0];
        const password = pdfPasswordInput.value;
        
        if (!file) {
            showError('Por favor, selecione um arquivo PDF');
            return;
        }
        
        if (!password) {
            showError('Por favor, informe a senha do PDF');
            return;
        }
        
        try {
            // Mostrar progresso
            submitBtn.disabled = true;
            progressContainer.classList.remove('d-none');
            
            // Converter o arquivo para Base64
            const fileBase64 = await convertFileToBase64(file);
            
            // Preparar os dados para enviar
            const requestData = {
                pdfBase64: fileBase64,
                password: password
            };
            
            // Enviar para a API
            const response = await fetch(API_ENDPOINTS.removePassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            // Processar resposta
            const responseData = await response.json();
            
            if (response.ok) {
                // Sucesso
                const pdfData = responseData.pdf_base64;
                const downloadUrl = `data:application/pdf;base64,${pdfData}`;
                
                // Configurar botão de download
                downloadBtn.href = downloadUrl;
                downloadBtn.download = getOutputFilename(file.name, '-sem-senha');
                downloadBtnText.textContent = "Baixar PDF sem senha";
                
                // Configurar mensagem
                resultMessage.textContent = "PDF processado com sucesso!";
                
                // Mostrar container de resultado
                showDownloadModal(downloadUrl, getOutputFilename(file.name, ' - SEM SENHA'), "PDF processado com sucesso!");
            } else {
                // Erro retornado pela API
                showError(responseData.error || responseData.message || 'Erro ao processar o PDF');
            }
        } catch (error) {
            showError('Ocorreu um erro ao se comunicar com o servidor');
            console.error('Erro:', error);
        } finally {
            // Ocultar progresso e reabilitar botão
            progressContainer.classList.add('d-none');
            submitBtn.disabled = false;
        }
    });
    
    // Manipular envio do formulário para converter PDF para imagem
    convertForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Ocultar mensagens anteriores
        hideError();
        resultContainer.classList.add('d-none');
        
        const file = convertFileInput.files[0];
        const password = convertPasswordInput.value;
        
        if (!file) {
            showError('Por favor, selecione um arquivo PDF');
            return;
        }
        
        try {
            // Mostrar progresso
            convertBtn.disabled = true;
            progressContainer.classList.remove('d-none');
            
            // Converter o arquivo para Base64
            const fileBase64 = await convertFileToBase64(file);
            
            // Preparar os dados para enviar
            const requestData = {
                pdfBase64: fileBase64
            };
            
            // Adicionar senha apenas se tiver sido fornecida
            if (password) {
                requestData.password = password;
            }
            
            // Enviar para a API
            const response = await fetch(API_ENDPOINTS.pdfToImage, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            // Processar resposta
            const responseData = await response.json();
            
            if (response.ok) {
                let downloadUrl, fileExtension, downloadText;
                
                // Verificar se há dados de imagem na resposta
                if (responseData.image_base64) {
                    const content = responseData.image_base64.content;
                    const type = responseData.image_base64.type;
                    
                    if (type === 'image') {
                        // Se for uma imagem
                        downloadUrl = `data:image/png;base64,${content}`;
                        fileExtension = '.png';
                        downloadText = "Baixar Imagem";
                    } else if (type === 'zip') {
                        // Se for um arquivo ZIP
                        downloadUrl = `data:application/zip;base64,${content}`;
                        fileExtension = '.zip';
                        downloadText = "Baixar Arquivo ZIP";
                    } else {
                        throw new Error("Tipo de resposta não reconhecido");
                    }
                    
                    // Configurar botão de download
                    downloadBtn.href = downloadUrl;
                    downloadBtn.download = getOutputFilename(file.name, '-convertido', fileExtension);
                    downloadBtnText.textContent = downloadText;
                    
                    // Configurar mensagem
                    resultMessage.textContent = "PDF convertido com sucesso!";
                    
                    // Mostrar container de resultado
                    showDownloadModal(downloadUrl, getOutputFilename(file.name, ' - CONVERTIDO', fileExtension), "PDF convertido com sucesso!");
                } else {
                    showError('Formato de resposta inválido');
                }
            } else {
                // Erro retornado pela API
                showError(responseData.error || responseData.message || 'Erro ao converter o PDF');
            }
        } catch (error) {
            showError('Ocorreu um erro ao se comunicar com o servidor');
            console.error('Erro:', error);
        } finally {
            // Ocultar progresso e reabilitar botão
            progressContainer.classList.add('d-none');
            convertBtn.disabled = false;
        }
    });
    
    // Função para converter arquivo para Base64
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remover o prefixo "data:application/pdf;base64," do resultado
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    }
    
    // Função para gerar o nome do arquivo de saída
    function getOutputFilename(originalName, suffix, newExtension) {
        const nameParts = originalName.split('.');
        const extension = newExtension || '.' + nameParts.pop();
        const baseName = nameParts.join('.');
        return `${baseName}${suffix}${extension}`;
    }
    
    // Função para mostrar erro
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('d-none');
    }
    
    // Função para ocultar erro
    function hideError() {
        errorContainer.classList.add('d-none');
    }

    // Função para mostrar o download no modal em vez do container de resultado
    function showDownloadModal(downloadUrl, fileName, message) {
        // Apenas atualizar o título do modal de acordo com a operação
        document.getElementById('downloadModalLabel').textContent = message || 'PDF processado com sucesso!';
        
        const downloadBtn = document.getElementById('modalDownloadBtn');
        downloadBtn.href = downloadUrl;
        downloadBtn.download = fileName;
        // Usar texto fixo para o botão de download
        document.getElementById('modalDownloadBtnText').textContent = "Clique aqui para baixar o arquivo!";
        
        // Exibir o modal
        var downloadModal = new bootstrap.Modal(document.getElementById('downloadModal'));
        downloadModal.show();
        
        // Esconder o indicador de progresso
        document.getElementById('progressContainer').classList.add('d-none');
    }
});
