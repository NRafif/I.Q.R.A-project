"""
I.Q.R.A Project - QR Code Generator
Generate QR codes untuk setiap pohon yang mengarah ke halaman detail website
"""

import qrcode
import json
from pathlib import Path

def generate_qr_codes():
    # Path setup
    script_dir = Path(__file__).parent
    data_file = script_dir / 'data' / 'trees.json'
    output_dir = script_dir / 'output'
    
    # Baca data pohon
    with open(data_file, 'r', encoding='utf-8') as f:
        trees = json.load(f)
    
    # Buat folder output
    output_dir.mkdir(exist_ok=True)
    
    # Base URL website - GANTI dengan URL Vercel kamu
    base_url = "https://iqra-project.vercel.app/tree/"
    
    print("=" * 60)
    print("  I.Q.R.A - QR Code Generator")
    print("  Intelligent Quick-Response Arboretum")
    print("=" * 60)
    
    for tree in trees:
        tree_id = tree['id']
        tree_name = tree['common_name']
        scientific = tree['scientific_name']
        url = f"{base_url}{tree_id}"
        
        # Konfigurasi QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        # Generate image dengan warna hijau (tema pohon)
        img = qr.make_image(fill_color="#1a5f2a", back_color="white")
        
        # Nama file: ID_NamaPohon.png
        safe_name = tree_name.replace(' ', '_').replace('/', '-')
        filename = f"{tree_id:02d}_{safe_name}.png"
        filepath = output_dir / filename
        
        img.save(filepath)
        print(f"✓ [{tree_id:02d}] {tree_name}")
        print(f"       {scientific}")
        print(f"       -> {filename}")
        print()
    
    print("=" * 60)
    print(f"✅ Generated {len(trees)} QR codes")
    print(f"📁 Output folder: {output_dir}")
    print(f"📱 Scan QR untuk akses: {base_url}[ID]")
    print("=" * 60)

if __name__ == "__main__":
    generate_qr_codes()
