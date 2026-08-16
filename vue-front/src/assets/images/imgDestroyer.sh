#!/bin/bash

# --- FUNÇÕES ---

# Função para exibir instruções de uso
exibir_ajuda() {
    echo "Uso: $0 <caminho_da_imagem> [intensidade]"
    echo "Exemplos:"
    echo "  $0 ~/Imagens/foto.jpg"
    echo "  $0 /var/www/projeto/assets/banner.jpeg 15"
    echo ""
    echo "Parâmetros:"
    echo "  <caminho_da_imagem> : O endereço do arquivo que você quer destruir."
    echo "  [intensidade]       : (Opcional) Número de injeções de erro. Padrão: 8."
    exit 1
}

# Função principal que executa a corrupção binária
corromper_imagem() {
    local arquivo_original="$1"
    local intensidade="${2:-8}" # Se não for passada, o padrão é 8
    
    # Extrai o diretório, o nome e a extensão do arquivo original
    local diretorio=$(dirname "$arquivo_original")
    local nome_base=$(basename "$arquivo_original")
    local nome_sem_extensao="${nome_base%.*}"
    local extensao="${nome_base##*.}"
    
    # Define o arquivo de saída na mesma pasta do original
    local arquivo_saida="${diretorio}/${nome_sem_extensao}_glitched.${extensao}"

    # 1. Cria a cópia de segurança para ser destruída
    cp "$arquivo_original" "$arquivo_saida"

    # 2. Mede o tamanho do arquivo em bytes
    local tamanho_arquivo=$(wc -c < "$arquivo_saida")

    # 3. Calcula a zona de segurança do cabeçalho (Header)
    local seguranca_header=1024
    local zona_segura=$((tamanho_arquivo - seguranca_header))

    if [ $zona_segura -le 0 ]; then
        echo "❌ Erro: O arquivo é pequeno demais para ser corrompido com segurança."
        exit 1
    fi

    echo "⚡ Iniciando corrupção binária em: $nome_base"
    echo "🔥 Nível de destruição definido: $intensidade"

    # 4. Loop de injeção de bytes maliciosos usando as variáveis locais
    for ((i=1; i<=intensidade; i++)); do
        # Gera uma posição aleatória dentro da zona de dados do arquivo
        local offset_aleatorio=$(( (RANDOM % zona_segura) + seguranca_header ))
        
        # Injeta uma string hexadecimal destrutiva (\x7F\xFF\x00\xAA)
        printf '\x7F\xFF\x00\xAA' | dd of="$arquivo_saida" bs=1 seek=$offset_aleatorio conv=notrunc 2>/dev/null
        
        echo " -> Payload de artefato injetado no offset: $offset_aleatorio"
    done

    echo "✅ Concluído! Imagem destruída salva em: $arquivo_saida"
}

# --- FLUXO PRINCIPAL ---

# Se o usuário não passou nenhum argumento, mostra como usar
if [ -z "$1" ]; then
    exibir_ajuda
fi

 ARQUIVO_ALVO="$1"
 INTENSIDADE_ALVO="$2"

# Validação: Verifica se o endereço digitado realmente aponta para um arquivo existente
if [ ! -f "$ARQUIVO_ALVO" ]; then
    echo "❌ Erro: O arquivo '$ARQUIVO_ALVO' não foi encontrado."
    echo "Certifique-se de digitar o caminho correto (ex: /home/usuario/imagem.jpg)."
    exit 1
fi

# Executa a função principal passando os dados validados
corromper_imagem "$ARQUIVO_ALVO" "$INTENSIDADE_ALVO"
