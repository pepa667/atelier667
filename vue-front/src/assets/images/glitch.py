#!/usr/bin/env python3
import argparse
import os
import sys
import numpy as np

try:
    import cv2
except ImportError:
    print("Erro: A biblioteca 'opencv-python' não está instalada.")
    print("Execute o comando abaixo no terminal para instalar:")
    print("pip3 install opencv-python")
    sys.exit(1)


def load_binary_image(image_path):
    """Carrega uma imagem e a força a ser estritamente binária (0 ou 255)."""
    if not os.path.exists(image_path):
        print(f"Erro: O arquivo '{image_path}' não foi encontrado.")
        sys.exit(1)

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(f"Erro: Não foi possível ler o arquivo '{image_path}'.")
        sys.exit(1)

    _, binary_img = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
    return binary_img


def apply_bit_flip(image, rate):
    """Inverte pixels aleatoriamente baseado em uma taxa (0.0 a 1.0)."""
    corrupted = image.copy()
    mask = np.random.rand(*corrupted.shape) < rate
    corrupted[mask] = 255 - corrupted[mask]
    return corrupted


def apply_block_corruption(image, num_blocks, block_size):
    """Aplica blocos sólidos para simular perda de dados na imagem."""
    corrupted = image.copy()
    h, w = corrupted.shape

    for _ in range(num_blocks):
        y = np.random.randint(0, max(1, h - block_size))
        x = np.random.randint(0, max(1, w - block_size))
        fill_color = np.random.choice([0, 255])
        corrupted[y : y + block_size, x : x + block_size] = fill_color

    return corrupted


def main():
    # Configura os argumentos de linha de comando para facilitar o uso
    parser = argparse.ArgumentParser(
        description="Script Avançado para Corrupção de Imagens Binárias"
    )
    parser.add_argument(
        "--image", required=True, help="Caminho da imagem de entrada"
    )
    parser.add_argument(
        "--type",
        required=True,
        choices=["bit-flip", "blocks", "both"],
        help="Tipo de corrupção",
    )
    parser.add_argument(
        "--rate",
        type=float,
        default=0.05,
        help="Taxa de bit-flip (ex: 0.05 para 5%%) [Padrão: 0.05]",
    )
    parser.add_argument(
        "--blocks",
        type=int,
        default=5,
        help="Quantidade de blocos para o modo 'blocks' [Padrão: 5]",
    )
    parser.add_argument(
        "--size",
        type=int,
        default=20,
        help="Tamanho dos blocos em pixels [Padrão: 20]",
    )
    parser.add_argument(
        "--output", default="corrupted_output.png", help="Nome do arquivo de saída"
    )

    args = parser.parse_args()

    # Processamento
    print(f"-> Carregando imagem: {args.image}")
    img = load_binary_image(args.image)

    if args.type == "bit-flip":
        print(f"-> Aplicando Bit-Flip (Taxa: {args.rate*100}%%)...")
        result = apply_bit_flip(img, args.rate)
    elif args.type == "blocks":
        print(f"-> Aplicando {args.blocks} Blocos de tamanho {args.size}px...")
        result = apply_block_corruption(img, args.blocks, args.size)
    elif args.type == "both":
        print("-> Aplicando ambos os métodos de corrupção...")
        temp = apply_bit_flip(img, args.rate)
        result = apply_block_corruption(temp, args.blocks, args.size)

    # Salvando resultado
    cv2.imwrite(args.output, result)
    print(f"🎉 Sucesso! Imagem corrompida salva como: {args.output}")


if __name__ == "__main__":
    main()
