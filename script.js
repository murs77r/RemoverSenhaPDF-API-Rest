document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const API_ENDPOINT = AWSLAMBDA;
    const MAX_FILE_SIZE_MB = 3;
    
    // Elementos do DOM
    const pdfForm = document.getElementById('pdfForm');
    const pdfFileInput = document.getElementById('pdfFile');
    const pdfPasswordInput = document.getElementById('pdfPassword');
    const fileInfoContainer = document.getElementById('fileInfo');
    const fileInfoBadge = fileInfoContainer.querySelector('.badge');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    const progressContainer = document.getElementById('progressContainer');
    const resultContainer = document.getElementById('resultContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const currentYear = document.getElementById('currentYear');
    
    // Definir o ano atual no rodapé
    currentYear.textContent = new Date().getFullYear();
    
    // Mostrar informações do arquivo quando selecionado
    pdfFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            
            fileInfoBadge.textContent = `${file.name} (${fileSizeMB} MB)`;
            fileInfoContainer.classList.remove('d-none');
            
            // Verificar se o tamanho do arquivo é maior que o permitido
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                showError(`O arquivo excede o tamanho máximo de ${MAX_FILE_SIZE_MB}MB`);
                pdfFileInput.value = '';
                fileInfoContainer.classList.add('d-none');
            } else {
                hideError();
            }
        } else {
            fileInfoContainer.classList.add('d-none');
        }
    });
    
    // Alternar visibilidade da senha
    togglePasswordBtn.addEventListener('click', function() {
        const type = pdfPasswordInput.type === 'password' ? 'text' : 'password';
        pdfPasswordInput.type = type;
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
    
    // Manipular envio do formulário
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
            const response = await fetch(API_ENDPOINT, {
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
                const pdfData = responseData.pdfBase64;
                const downloadUrl = `data:application/pdf;base64,${pdfData}`;
                
                // Configurar botão de download
                downloadBtn.href = downloadUrl;
                downloadBtn.download = getOutputFilename(file.name);
                
                // Mostrar container de resultado
                resultContainer.classList.remove('d-none');
            } else {
                // Erro retornado pela API
                showError(responseData.message || 'Erro ao processar o PDF');
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
    function getOutputFilename(originalName) {
        const nameParts = originalName.split('.');
        const extension = nameParts.pop();
        const baseName = nameParts.join('.');
        return `${baseName}-sem-senha.${extension}`;
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
});
