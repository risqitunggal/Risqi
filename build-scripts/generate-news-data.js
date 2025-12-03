// ROOT/build-scripts/generate-news-data.js

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // Digunakan untuk membaca metadata YAML dari file MD

const NEWS_DIR = path.join(__dirname, '..', '_berita'); // Folder sumber konten
const OUTPUT_FILE = path.join(__dirname, '..', 'news-data.json'); // File tujuan JSON

// Fungsi utama untuk menggenerasi file JSON
function generateNewsData() {
  console.log('Starting news data generation...');
  const newsList = [];

  try {
    // 1. Baca semua file di folder _berita
    const files = fs.readdirSync(NEWS_DIR).filter(file => file.endsWith('.md'));

    files.forEach(file => {
      const fullPath = path.join(NEWS_DIR, file);
      // 2. Baca konten file
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 3. Gunakan gray-matter untuk memisahkan metadata (frontmatter) dari body
      const { data, content } = matter(fileContents);
      
      // 4. Tambahkan ke array
      newsList.push({
        file: file, // Nama file untuk dipakai di URL detail
        ...data, // Metadata: title, date, image, summary, dll.
        body: content.substring(0, 500) // Ambil 500 karakter pertama dari body untuk ringkasan
      });
    });

    // 5. Urutkan berdasarkan tanggal terbaru
    newsList.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 6. Tulis array ke file news-data.json
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(newsList, null, 2));

    console.log(`Successfully generated ${newsList.length} news items to news-data.json`);

  } catch (error) {
    console.error('Error generating news data:', error);
    // Jika folder _berita kosong atau tidak ada, buat file JSON kosong
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
  }
}

generateNewsData();