const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройки для загрузки файлов
const upload = multer({
  dest: path.join(__dirname, 'public/uploads/')
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Открываем базу
const db = new sqlite3.Database('./mydatabase.db');

// Получить список продуктов
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// Добавить продукт с загрузкой картинки
app.post('/api/products', upload.single('image'), (req, res) => {
  const description = req.body.description || '';
  if (!req.file) return res.status(400).json({error: 'Картинка обязательна'});

  const image_path = 'uploads/' + req.file.filename; // путь для хранения в базе
  db.run(`INSERT INTO products (image_path, description) VALUES (?, ?)`, [image_path, description], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID, image_path, description});
  });
});

// Удалить продукт и файл
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT image_path FROM products WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).json({error: 'Не найдено'});
    
    const filePath = path.join(__dirname, 'public', row.image_path);
    fs.unlink(filePath, (err) => {
      if (err) console.warn('Не удалось удалить файл:', err.message);
      db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({message: 'Удалено'});
      });
    });
  });
});

// Аналогичные маршруты для фоновых изображений (backgrounds)

// Получить фоны
app.get('/api/backgrounds', (req, res) => {
  db.all('SELECT * FROM backgrounds', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// Добавить фон с загрузкой картинки
app.post('/api/backgrounds', upload.single('image'), (req, res) => {
  const description = req.body.description || '';
  if (!req.file) return res.status(400).json({error: 'Картинка обязательна'});

  const image_path = 'uploads/' + req.file.filename;
  db.run(`INSERT INTO backgrounds (image_path, description) VALUES (?, ?)`, [image_path, description], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID, image_path, description});
  });
});

// Удалить фон
app.delete('/api/backgrounds/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT image_path FROM backgrounds WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).json({error: 'Не найдено'});
    
    const filePath = path.join(__dirname, 'public', row.image_path);
    fs.unlink(filePath, (err) => {
      if (err) console.warn('Не удалось удалить файл:', err.message);
      db.run('DELETE FROM backgrounds WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({message: 'Удалено'});
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
