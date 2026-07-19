import cv2
import numpy as np


def load_binary_image(image_path):
    """Loads an image and converts it to strict binary (0 and 255)."""
    # Load in grayscale
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise FileNotFoundError(f"Could not load image from {image_path}")

    # Threshold to ensure it is strictly binary
    _, binary_img = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
    return binary_img


def apply_bit_flip_noise(image, corruption_rate=0.05):
    """Randomly flips pixels (0 to 255, 255 to 0) based on a percentage rate."""
    corrupted = image.copy()
    # Create a mask of pixels to flip
    mask = np.random.rand(*corrupted.shape) < corruption_rate

    # Flip the pixels where mask is True (255 becomes 0, 0 becomes 255)
    corrupted[mask] = 255 - corrupted[mask]
    return corrupted


def apply_block_corruption(image, num_blocks=5, block_size=20):
    """Corrupts contiguous regions by placing solid black or white squares."""
    corrupted = image.copy()
    h, w = corrupted.shape

    for _ in range(num_blocks):
        # Random top-left coordinate for the block
        y = np.random.randint(0, max(1, h - block_size))
        x = np.random.randint(0, max(1, w - block_size))

        # Randomly choose to fill with black (0) or white (255)
        fill_color = np.random.choice([0, 255])

        # Apply block
        corrupted[y : y + block_size, x : x + block_size] = fill_color

    return corrupted


# --- Example Usage ---
if __name__ == "__main__":
    # Replace with your image path
    input_path = "input_binary.png"

    try:
        # 1. Load original binary image
        original = load_binary_image(input_path)

        # 2. Apply 8% random pixel flipping
        bit_flipped = apply_bit_flip_noise(original, corruption_rate=0.08)

        # 3. Apply structural block loss
        block_corrupted = apply_block_corruption(
            original, num_blocks=4, block_size=30
        )

        # Save the results
        cv2.imwrite("corrupted_bit_flip.png", bit_flipped)
        cv2.imwrite("corrupted_blocks.png", block_corrupted)
        print("Corrupted images saved successfully.")

    except Exception as e:
        print(f"Error: {e}")
