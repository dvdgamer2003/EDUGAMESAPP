import os
import base64

# A simple 1x1 transparent PNG
# Source: https://en.wikipedia.org/wiki/Portable_Network_Graphics#File_header
valid_png_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
png_data = base64.b64decode(valid_png_b64)

# List of files to replace
files_to_fix = [
    r"c:\Users\divye\OneDrive\Desktop\Ged1\Ged\rural-learning-app\frontend\assets\images\organs\stomach.png",
    r"c:\Users\divye\OneDrive\Desktop\Ged1\Ged\rural-learning-app\frontend\assets\images\organs\human_body.png",
    r"c:\Users\divye\OneDrive\Desktop\Ged1\Ged\rural-learning-app\frontend\assets\images\organs\liver.png",
    r"c:\Users\divye\OneDrive\Desktop\Ged1\Ged\rural-learning-app\frontend\assets\images\organs\brain.png",
    r"c:\Users\divye\OneDrive\Desktop\Ged1\Ged\rural-learning-app\frontend\assets\images\organs\heart.png",
    r"c:\Users\divye\OneDrive\Desktop\Ged1\Ged\rural-learning-app\frontend\assets\images\organs\lungs.png",
    r"c:\Users\divye\OneDrive\Desktop\Ged1\Ged\rural-learning-app\frontend\assets\images\onboarding\learn.png",
    r"c:\Users\divye\OneDrive\Desktop\Ged1\Ged\rural-learning-app\frontend\assets\images\onboarding\compete.png"
]

for file_path in files_to_fix:
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Write valid PNG data
        with open(file_path, "wb") as f:
            f.write(png_data)
        print(f"Fixed: {file_path}")
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
