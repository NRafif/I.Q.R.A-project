"""
I.Q.R.A Project - QR Code Generator

Generate QR codes untuk setiap pohon yang mengarah ke halaman detail website.

Security considerations:
- Input validation untuk tree data
- URL sanitization untuk mencegah injection
- Safe file path construction
- Error handling untuk graceful failures
"""

import qrcode
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

def validate_url(url):
    """
    Validasi URL untuk mencegah injection attacks.
    
    Mengapa validasi ini penting?
    - Mencegah javascript: atau data: URLs yang berbahaya
    - Memastikan hanya http/https yang digunakan
    - Mencegah URL manipulation attacks
    
    Args:
        url (str): URL yang akan divalidasi
        
    Returns:
        bool: True jika URL valid dan aman
    """
    try:
        parsed = urlparse(url)
        # Hanya izinkan http dan https protocol
        # Mencegah javascript:, data:, file: dan protocol berbahaya lainnya
        if parsed.scheme not in ['http', 'https']:
            return False
        return True
    except Exception:
        return False

def sanitize_filename(name):
    """
    Sanitize filename untuk mencegah path traversal dan invalid characters.
    
    Mengapa sanitization?
    - Mencegah path traversal dengan karakter seperti ../
    - Menghapus karakter yang tidak valid untuk filename
    - Memastikan filename aman untuk semua OS
    
    Args:
        name (str): Nama yang akan disanitize
        
    Returns:
        str: Nama yang sudah disanitize
    """
    # Remove atau replace karakter berbahaya
    # Mengganti space dengan underscore, slash dengan dash
    sanitized = re.sub(r'[^\w\-_\.]', '', name.replace(' ', '_').replace('/', '-'))
    # Limit panjang untuk mencegah DoS
    return sanitized[:100]

def generate_qr_codes():
    """
    Generate QR codes untuk semua pohon dalam database.
    
    Architecture:
    - Membaca data dari JSON file (single source of truth)
    - Generate QR code dengan URL yang valid
    - Save ke output directory dengan naming convention yang konsisten
    
    Error handling:
    - Graceful degradation jika file tidak ditemukan
    - Validation untuk setiap tree sebelum generate
    - Continue processing meski ada error pada satu tree
    """
    # Path setup dengan path.join untuk cross-platform compatibility
    script_dir = Path(__file__).parent
    
    # Data file priority: trees_update.json > trees.json
    # trees_update.json adalah source utama dengan konten lengkap
    data_file = script_dir / 'data' / 'trees_update.json'
    if not data_file.exists():
        data_file = script_dir / 'data' / 'trees.json'
    
    # Output directory untuk QR codes
    output_dir = script_dir / 'output'
    
    # Validasi bahwa data file exists
    if not data_file.exists():
        print("❌ Error: Data file tidak ditemukan!")
        print(f"   Mencari di: {data_file}")
        return
    
    # Baca data pohon dengan error handling
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            trees = json.load(f)
        
        # Validasi bahwa data adalah array
        if not isinstance(trees, list):
            print("❌ Error: Data format tidak valid (bukan array)")
            return
    except json.JSONDecodeError as e:
        print(f"❌ Error: JSON file corrupted - {e}")
        return
    except Exception as e:
        print(f"❌ Error membaca file: {e}")
        return
    
    # Buat folder output jika belum ada
    output_dir.mkdir(exist_ok=True)
    
    # Load environment variables untuk base URL
    # Mengapa dari .env? Untuk flexibility antara dev/staging/production
    env_path = script_dir.parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
    
    # Get base URL dari environment variable
    # Fallback ke default untuk development
    base_url = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://iqra-project.vercel.app')
    
    # URL validation dan sanitization
    if not validate_url(base_url):
        print(f"⚠️  Warning: Base URL tidak valid: {base_url}")
        print("   Menggunakan default URL")
        base_url = 'https://iqra-project.vercel.app'
    
    # Construct URL path dengan proper formatting
    # Memastikan trailing slash untuk consistency
    if not base_url.endswith('/'):
        base_url += '/'
    base_url += 'tree/'
    
    print("=" * 60)
    print("  I.Q.R.A - QR Code Generator")
    print("  Intelligent Quick-Response Arboretum")
    print("=" * 60)
    print(f"📊 Found {len(trees)} trees in database")
    print(f"🌐 Base URL: {base_url}")
    print()
    
    success_count = 0
    error_count = 0
    
    # Process setiap tree dengan error handling per item
    # Mengapa continue on error? Agar satu tree yang error tidak menghentikan seluruh proses
    for tree in trees:
        try:
            # Validasi required fields
            if 'id' not in tree or 'common_name' not in tree:
                print(f"⚠️  Skipping tree: missing required fields")
                error_count += 1
                continue
            
            tree_id = tree['id']
            tree_name = tree['common_name']
            scientific = tree.get('scientific_name', 'N/A')
            
            # Validasi ID adalah integer positif
            if not isinstance(tree_id, int) or tree_id <= 0:
                print(f"⚠️  Skipping tree: invalid ID ({tree_id})")
                error_count += 1
                continue
            
            # Construct URL dengan ID yang sudah divalidasi
            url = f"{base_url}{tree_id}"
            
            # Konfigurasi QR code
            # ERROR_CORRECT_H: High error correction untuk durability
            # Box size 10: Balance antara size dan scanability
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% error correction
                box_size=10,  # Pixel size per box
                border=4,  # Quiet zone untuk better scanning
            )
            qr.add_data(url)
            qr.make(fit=True)
            
            # Generate image dengan warna hijau (tema pohon)
            # Warna #1a5f2a dipilih untuk match dengan tema forest
            img = qr.make_image(fill_color="#1a5f2a", back_color="white")
            
            # Sanitize filename untuk security
            safe_name = sanitize_filename(tree_name)
            filename = f"{tree_id:02d}_{safe_name}.png"
            filepath = output_dir / filename
            
            # Save QR code image
            img.save(filepath)
            success_count += 1
            
            print(f"✓ [{tree_id:02d}] {tree_name}")
            print(f"       {scientific}")
            print(f"       -> {filename}")
            print()
            
        except KeyError as e:
            print(f"⚠️  Error: Missing field {e} for tree ID {tree.get('id', 'unknown')}")
            error_count += 1
        except Exception as e:
            print(f"❌ Error generating QR for tree ID {tree.get('id', 'unknown')}: {e}")
            error_count += 1
    
    # Summary
    print("=" * 60)
    print(f"✅ Successfully generated: {success_count} QR codes")
    if error_count > 0:
        print(f"⚠️  Errors: {error_count}")
    print(f"📁 Output folder: {output_dir}")
    print(f"📱 Scan QR untuk akses: {base_url}[ID]")
    print("=" * 60)

if __name__ == "__main__":
    generate_qr_codes()
