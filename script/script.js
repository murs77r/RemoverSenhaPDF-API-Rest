document.addEventListener('DOMContentLoaded', function() {
    const API_ENDPOINTS = {
        removePassword: 'https://api.class-one.com.br/remove-pdf-password',
        pdfToImage: 'https://api.class-one.com.br/pdf-to-image'
    };
    const MAX_FILE_SIZE_MB = 3;
    
    const progressContainer = document.getElementById('progressContainer');
    const resultContainer = document.getElementById('resultContainer');
    const resultMessage = document.getElementById('resultMessage');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadBtnText = document.getElementById('downloadBtnText');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const currentYear = document.getElementById('currentYear');
    
    const pdfForm = document.getElementById('pdfForm');
    const pdfFileInput = document.getElementById('pdfFile');
    const pdfPasswordInput = document.getElementById('pdfPassword');
    const fileInfoContainer = document.getElementById('fileInfo');
    const fileInfoBadge = fileInfoContainer.querySelector('.badge');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    
    const convertForm = document.getElementById('convertForm');
    const convertFileInput = document.getElementById('convertFile');
    const convertPasswordInput = document.getElementById('convertPassword');
    const convertFileInfoContainer = document.getElementById('convertFileInfo');
    const convertFileInfoBadge = convertFileInfoContainer?.querySelector('.badge');
    const toggleConvertPasswordBtn = document.getElementById('toggleConvertPassword');
    const convertBtn = document.getElementById('convertBtn');
    
    currentYear.textContent = new Date().getFullYear();
    
    function setupPasswordToggle(inputElement, toggleButton) {
        toggleButton.addEventListener('click', function() {
            const type = inputElement.type === 'password' ? 'text' : 'password';
            inputElement.type = type;
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
    
    setupPasswordToggle(pdfPasswordInput, togglePasswordBtn);
    setupPasswordToggle(convertPasswordInput, toggleConvertPasswordBtn);
    
    function handleFileChange(fileInput, infoContainer, infoBadge) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const file = this.files[0];
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                
                infoBadge.textContent = `${file.name} (${fileSizeMB} MB)`;
                infoContainer.classList.remove('d-none');
                
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
    
    handleFileChange(pdfFileInput, fileInfoContainer, fileInfoBadge);
    handleFileChange(convertFileInput, convertFileInfoContainer, convertFileInfoBadge);
    
    pdfForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
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
            submitBtn.disabled = true;
            progressContainer.classList.remove('d-none');
            
            const fileBase64 = await convertFileToBase64(file);
            
            const requestData = {
                pdfBase64: fileBase64,
                password: password
            };
            
            const response = await fetch(API_ENDPOINTS.removePassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                const pdfData = responseData.pdf_base64;
                const downloadUrl = `data:application/pdf;base64,${pdfData}`;
                
                downloadBtn.href = downloadUrl;
                downloadBtn.download = getOutputFilename(file.name, '-sem-senha');
                downloadBtnText.textContent = "Baixar PDF sem senha";
                
                resultMessage.textContent = "PDF processado com sucesso!";
                
                showDownloadModal(downloadUrl, getOutputFilename(file.name, ' - SEM SENHA'), "PDF processado com sucesso!");
            } else {
                showError(responseData.error || responseData.message || 'Erro ao processar o PDF');
            }
        } catch (error) {
            showError('Ocorreu um erro ao se comunicar com o servidor');
            console.error('Erro:', error);
        } finally {
            progressContainer.classList.add('d-none');
            submitBtn.disabled = false;
        }
    });
    
    convertForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        hideError();
        resultContainer.classList.add('d-none');
        
        const file = convertFileInput.files[0];
        const password = convertPasswordInput.value;
        
        if (!file) {
            showError('Por favor, selecione um arquivo PDF');
            return;
        }
        
        try {
            convertBtn.disabled = true;
            progressContainer.classList.remove('d-none');
            
            const fileBase64 = await convertFileToBase64(file);
            
            const requestData = {
                pdfBase64: fileBase64
            };
            
            if (password) {
                requestData.password = password;
            }
            
            const response = await fetch(API_ENDPOINTS.pdfToImage, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                let downloadUrl, fileExtension, downloadText;
                
                if (responseData.image_base64) {
                    const content = responseData.image_base64.content;
                    const type = responseData.image_base64.type;
                    
                    if (type === 'image') {
                        downloadUrl = `data:image/png;base64,${content}`;
                        fileExtension = '.png';
                        downloadText = "Baixar Imagem";
                    } else if (type === 'zip') {
                        downloadUrl = `data:application/zip;base64,${content}`;
                        fileExtension = '.zip';
                        downloadText = "Baixar Arquivo ZIP";
                    } else {
                        throw new Error("Tipo de resposta não reconhecido");
                    }
                    
                    downloadBtn.href = downloadUrl;
                    downloadBtn.download = getOutputFilename(file.name, '-convertido', fileExtension);
                    downloadBtnText.textContent = downloadText;
                    
                    resultMessage.textContent = "PDF convertido com sucesso!";
                    
                    showDownloadModal(downloadUrl, getOutputFilename(file.name, ' - CONVERTIDO', fileExtension), "PDF convertido com sucesso!");
                } else {
                    showError('Formato de resposta inválido');
                }
            } else {
                showError(responseData.error || responseData.message || 'Erro ao converter o PDF');
            }
        } catch (error) {
            showError('Ocorreu um erro ao se comunicar com o servidor');
            console.error('Erro:', error);
        } finally {
            progressContainer.classList.add('d-none');
            convertBtn.disabled = false;
        }
    });
    
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    }
    
    function getOutputFilename(originalName, suffix, newExtension) {
        const nameParts = originalName.split('.');
        const extension = newExtension || '.' + nameParts.pop();
        const baseName = nameParts.join('.');
        return `${baseName}${suffix}${extension}`;
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('d-none');
    }
    
    function hideError() {
        errorContainer.classList.add('d-none');
    }

    function showDownloadModal(downloadUrl, fileName, message) {
        document.getElementById('downloadModalLabel').textContent = message || 'PDF processado com sucesso!';
        
        const downloadBtn = document.getElementById('modalDownloadBtn');
        downloadBtn.href = downloadUrl;
        downloadBtn.download = fileName;
        document.getElementById('modalDownloadBtnText').textContent = "Clique aqui para baixar o arquivo!";
        
        var downloadModal = new bootstrap.Modal(document.getElementById('downloadModal'));
        downloadModal.show();
        
        document.getElementById('progressContainer').classList.add('d-none');
    }
});
