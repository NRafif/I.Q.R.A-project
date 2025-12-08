from rembg import remove
from PIL import Image
import io

def hapus_background(input_path, output_path):
    """
    Menghapus background dari gambar
    
    Args:
        input_path: Path file gambar input
        output_path: Path untuk menyimpan hasil
    """
    try:
        # Baca gambar input
        with open(input_path, 'rb') as f:
            input_data = f.read()
        
        # Hapus background
        output_data = remove(input_data)
        
        # Simpan hasil
        with open(output_path, 'wb') as f:
            f.write(output_data)
        
        print(f"✓ Background berhasil dihapus!")
        print(f"✓ Hasil disimpan di: {output_path}")
        
    except FileNotFoundError:
        print(f"✗ Error: File '{input_path}' tidak ditemukan")
    except Exception as e:
        print(f"✗ Error: {str(e)}")

def hapus_background_pil(input_path, output_path):
    """
    Alternatif menggunakan PIL Image object
    
    Args:
        input_path: Path file gambar input
        output_path: Path untuk menyimpan hasil
    """
    try:
        # Buka gambar
        img = Image.open(input_path)
        
        # Hapus background
        output = remove(img)
        
        # Simpan hasil
        output.save(output_path)
        
        print(f"✓ Background berhasil dihapus!")
        print(f"✓ Hasil disimpan di: {output_path}")
        
    except FileNotFoundError:
        print(f"✗ Error: File '{input_path}' tidak ditemukan")
    except Exception as e:
        print(f"✗ Error: {str(e)}")

# Contoh penggunaan
if __name__ == "__main__":
    # Ganti dengan path file Anda
    input_file = "batang2.png"
    output_file = "batang2-nobg.png"
    
    print("Menghapus background...")
    hapus_background(input_file, output_file)
    
    # Atau gunakan versi PIL:
    # hapus_background_pil(input_file, output_file)