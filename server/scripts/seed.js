const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const sampleCategories = [
  {
    name: 'Elektronik',
    slug: 'elektronik',
    description: 'Elektronik ürünler, bilgisayar, telefon ve aksesuarlar',
    imageUrl: 'https://via.placeholder.com/300x200/1e40af/ffffff?text=Elektronik',
    sortOrder: 1
  },
  {
    name: 'Giyim',
    slug: 'giyim',
    description: 'Erkek, kadın ve çocuk giyim ürünleri',
    imageUrl: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Giyim',
    sortOrder: 2
  },
  {
    name: 'Ev & Yaşam',
    slug: 'ev-yasam',
    description: 'Ev dekorasyonu, mobilya ve yaşam ürünleri',
    imageUrl: 'https://via.placeholder.com/300x200/059669/ffffff?text=Ev+%26+Ya%C5%9Fam',
    sortOrder: 3
  },
  {
    name: 'Spor & Outdoor',
    slug: 'spor-outdoor',
    description: 'Spor giyim, ekipman ve outdoor ürünleri',
    imageUrl: 'https://via.placeholder.com/300x200/ea580c/ffffff?text=Spor+%26+Outdoor',
    sortOrder: 4
  },
  {
    name: 'Kitap & Hobi',
    slug: 'kitap-hobi',
    description: 'Kitaplar, oyun ve hobi ürünleri',
    imageUrl: 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=Kitap+%26+Hobi',
    sortOrder: 5
  }
];

const sampleProducts = [
  // Elektronik ürünler
  {
    name: 'iPhone 15 Pro 128GB',
    description: 'Apple iPhone 15 Pro 128GB Titanyum Doğal renk. A17 Pro çip, ProRAW fotoğraf çekimi, 5G desteği.',
    shortDescription: 'Apple iPhone 15 Pro 128GB Titanyum Doğal',
    sku: 'IPH15PRO128',
    price: 45999.99,
    comparePrice: 49999.99,
    stockQuantity: 25,
    images: ['https://via.placeholder.com/500x500/1e40af/ffffff?text=iPhone+15+Pro'],
    isFeatured: true,
    category: 'elektronik',
    tags: ['apple', 'iphone', 'smartphone', 'pro']
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung Galaxy S24 Ultra 256GB. S Pen desteği, 200MP kamera, 5000mAh batarya.',
    shortDescription: 'Samsung Galaxy S24 Ultra 256GB',
    sku: 'SAMS24ULTRA',
    price: 42999.99,
    stockQuantity: 18,
    images: ['https://via.placeholder.com/500x500/1e40af/ffffff?text=Galaxy+S24'],
    isFeatured: true,
    category: 'elektronik',
    tags: ['samsung', 'galaxy', 'android', 'ultra']
  },
  {
    name: 'MacBook Air M3 13"',
    description: 'Apple MacBook Air 13" M3 çip, 8GB RAM, 256GB SSD, Gece Yarısı rengi.',
    shortDescription: 'Apple MacBook Air M3 13" 256GB',
    sku: 'MBAIRM3-13',
    price: 34999.99,
    stockQuantity: 12,
    images: ['https://via.placeholder.com/500x500/1e40af/ffffff?text=MacBook+Air'],
    isFeatured: true,
    category: 'elektronik',
    tags: ['apple', 'macbook', 'laptop', 'm3']
  },
  
  // Giyim ürünleri
  {
    name: 'Erkek Slim Fit Jean',
    description: 'Yüksek kaliteli denim kumaş, slim fit kesim, koyu mavi renk. Günlük kullanım için ideal.',
    shortDescription: 'Erkek Slim Fit Koyu Mavi Jean',
    sku: 'JEAN-SLIM-M',
    price: 299.99,
    comparePrice: 399.99,
    stockQuantity: 45,
    images: ['https://via.placeholder.com/500x500/dc2626/ffffff?text=Slim+Jean'],
    category: 'giyim',
    tags: ['erkek', 'jean', 'slim', 'denim']
  },
  {
    name: 'Kadın Elbise Midi',
    description: 'Şık midi elbise, çiçek desenli, yaz koleksiyonu. %100 viskon kumaş.',
    shortDescription: 'Kadın Çiçek Desenli Midi Elbise',
    sku: 'DRESS-MIDI-W',
    price: 449.99,
    stockQuantity: 32,
    images: ['https://via.placeholder.com/500x500/dc2626/ffffff?text=Midi+Elbise'],
    isFeatured: true,
    category: 'giyim',
    tags: ['kadın', 'elbise', 'midi', 'çiçek']
  },
  
  // Ev & Yaşam ürünleri
  {
    name: 'Modern Koltuk Takımı',
    description: 'Üçlü modern koltuk takımı, gri renk, yüksek kalite kumaş kaplama.',
    shortDescription: 'Modern Üçlü Koltuk Takımı Gri',
    sku: 'SOFA-3SEAT',
    price: 4999.99,
    stockQuantity: 8,
    images: ['https://via.placeholder.com/500x500/059669/ffffff?text=Koltuk+Tak%C4%B1m%C4%B1'],
    category: 'ev-yasam',
    tags: ['koltuk', 'mobilya', 'modern', 'gri']
  },
  {
    name: 'Mutfak Robot Seti',
    description: 'Çok fonksiyonlu mutfak robotu, blender, doğrayıcı ve karıştırıcı özellikleri.',
    shortDescription: 'Çok Fonksiyonlu Mutfak Robotu',
    sku: 'KITCHEN-ROBOT',
    price: 1299.99,
    stockQuantity: 15,
    images: ['https://via.placeholder.com/500x500/059669/ffffff?text=Mutfak+Robot'],
    isFeatured: true,
    category: 'ev-yasam',
    tags: ['mutfak', 'robot', 'blender', 'ev']
  },
  
  // Spor & Outdoor
  {
    name: 'Koşu Ayakkabısı',
    description: 'Profesyonel koşu ayakkabısı, nefes alan kumaş, hafif taban teknolojisi.',
    shortDescription: 'Profesyonel Koşu Ayakkabısı',
    sku: 'RUN-SHOES-01',
    price: 899.99,
    stockQuantity: 28,
    images: ['https://via.placeholder.com/500x500/ea580c/ffffff?text=Ko%C5%9Fu+Ayakkab%C4%B1s%C4%B1'],
    category: 'spor-outdoor',
    tags: ['koşu', 'ayakkabı', 'spor', 'running']
  },
  
  // Kitap & Hobi
  {
    name: 'Programlama Kitapları Seti',
    description: 'JavaScript, Python ve React programlama kitapları 3\'lü set.',
    shortDescription: 'Programlama Kitapları 3\'lü Set',
    sku: 'BOOK-PROG-SET',
    price: 299.99,
    stockQuantity: 22,
    images: ['https://via.placeholder.com/500x500/7c3aed/ffffff?text=Programlama+Kitap'],
    category: 'kitap-hobi',
    tags: ['kitap', 'programlama', 'javascript', 'python']
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    const existingAdmin = await query('SELECT id FROM users WHERE email = $1', ['admin@atezsoftware.com']);
    
    if (existingAdmin.rows.length === 0) {
      await query(`
        INSERT INTO users (username, email, password_hash, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['admin', 'admin@atezsoftware.com', adminPassword, 'Admin', 'User', 'admin']);
      console.log('Admin user created (admin@atezsoftware.com / admin123)');
    } else {
      console.log('Admin user already exists');
    }

    // Seed categories
    console.log('Seeding categories...');
    const categoryMap = {};
    
    for (const categoryData of sampleCategories) {
      const existing = await query('SELECT id FROM categories WHERE slug = $1', [categoryData.slug]);
      
      if (existing.rows.length === 0) {
        const result = await query(`
          INSERT INTO categories (name, slug, description, image_url, sort_order)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, slug
        `, [categoryData.name, categoryData.slug, categoryData.description, categoryData.imageUrl, categoryData.sortOrder]);
        
        categoryMap[categoryData.slug] = result.rows[0].id;
        console.log(`Category created: ${categoryData.name}`);
      } else {
        categoryMap[categoryData.slug] = existing.rows[0].id;
        console.log(`Category already exists: ${categoryData.name}`);
      }
    }

    // Seed products
    console.log('Seeding products...');
    
    for (const productData of sampleProducts) {
      const existing = await query('SELECT id FROM products WHERE sku = $1', [productData.sku]);
      
      if (existing.rows.length === 0) {
        const categoryId = categoryMap[productData.category];
        const slug = productData.name
          .toLowerCase()
          .replace(/[çğıöşü]/g, (match) => {
            const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };
            return map[match];
          })
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');

        await query(`
          INSERT INTO products (
            name, slug, description, short_description, sku, price, compare_price,
            stock_quantity, category_id, images, is_featured, tags
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          productData.name,
          slug,
          productData.description,
          productData.shortDescription,
          productData.sku,
          productData.price,
          productData.comparePrice || null,
          productData.stockQuantity,
          categoryId,
          productData.images,
          productData.isFeatured || false,
          productData.tags
        ]);
        
        console.log(`Product created: ${productData.name}`);
      } else {
        console.log(`Product already exists: ${productData.name}`);
      }
    }

    console.log('Database seeding completed successfully!');
    console.log(`
Seeded Data Summary:
- Categories: ${sampleCategories.length}
- Products: ${sampleProducts.length}
- Admin User: admin@atezsoftware.com (password: admin123)

You can now start the application and begin testing!
    `);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = seedDatabase; 