let chunks = [];
let vocabulary = {};
let vectorizer = null;

async function loadIndex() {
  const res = await fetch('search_index.json');
  const data = await res.json();
  chunks = data.chunks;
  vocabulary = data.vocabulary;
}

function tokenize(text) {
  return text.toLowerCase().match(/\b\w+\b/g) || [];
}

function vectorize(text) {
  const tokens = tokenize(text);
  const vec = new Array(Object.keys(vocabulary).length).fill(0);
  tokens.forEach(token => {
    if (token in vocabulary) {
      vec[vocabulary[token]] += 1;
    }
  });
  return vec;
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

function findBestAnswer(query) {
  const queryVec = vectorize(query);
  let bestScore = 0;
  let bestChunk = "I'm sorry, I don't have an answer for that.";
  chunks.forEach(chunk => {
    const chunkVec = vectorize(chunk);
    const score = cosineSimilarity(queryVec, chunkVec);
    if (score > bestScore) {
      bestScore = score;
      bestChunk = chunk;
    }
  });
  return bestChunk;
}

function addMessage(text, sender) {
  const chatBox = document.getElementById('chat-box');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + sender;
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const question = input.value.trim();
  if (!question) return;
  addMessage(question, 'user');
  input.value = '';
  const answer = findBestAnswer(question);
  addMessage(answer, 'bot');
});

loadIndex();
