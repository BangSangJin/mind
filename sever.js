const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const port = 3000;

app.use(cors());
app.set('view engine', 'ejs');
app.set('public', './public');
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/hong3.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hong3.html'));
});

app.get('/index5.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index5.html'));
});

app.get('/letters', (req, res) => {
  const letters = loadLetters().map(letter => ({ ...letter, date: new Date().toLocaleString() }));
  res.json(letters);
});

app.post('/letters', (req, res) => {
  const newLetter = req.body;
  newLetter.date = new Date().toLocaleString(); // 현재 날짜 및 시간을 문자열로 저장
  const letters = loadLetters();
  letters.push(newLetter);
  saveLetters(letters);
  res.json({ message: '편지가 등록되었습니다.' });
});

app.delete('/letters/:id', (req, res) => {
  const letterId = req.params.id;
  const letters = loadLetters();
  const updatedLetters = letters.filter(letter => letter.id !== letterId);
  saveLetters(updatedLetters);
  res.json({ message: '편지가 삭제되었습니다.' });
});

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. http://localhost:${port}`);
});

function loadLetters() {
  try {
    const lettersData = fs.readFileSync('letters.json', 'utf8');
    return JSON.parse(lettersData);
  } catch (error) {
    console.error('Error loading letters:', error);
    return [];
  }
}

function saveLetters(letters) {
  // 각 편지에 id 부여
  const lettersWithId = letters.map((letter, index) => ({
    ...letter,
    id: index.toString(), // 간단하게 index를 사용 (실제로는 더 안전한 방법을 사용해야 함)
  }));
  
  const lettersData = JSON.stringify(lettersWithId, null, 2);
  fs.writeFileSync('letters.json', lettersData, 'utf8');
}