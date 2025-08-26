async function loadIndex() {
  const response = await fetch('search_index.json');
  return await response.json();
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

function vectorize(text, vocab) {
  const words = text.toLowerCase().split(/\W+/);
  const vec = new Array(Object.keys(vocab).length).fill(0);
  words.forEach(word => {
    if (word in vocab) vec[vocab[word]] += 1;
  });
  return vec;
}

function findBestMatch(query, index) {
  const queryVec = vectorize(query, index.vocabulary);
  let bestScore = -1;
  let bestChunk = "I'm sorry, I don't have an answer for that.";
  index.chunks.forEach(chunk => {
    const chunkVec = vectorize(chunk, index.vocabulary);
    const score = cosineSimilarity(queryVec, chunkVec);
    if (score > bestScore) {
      bestScore = score;
      bestChunk = chunk;
    }
  });
  return bestChunk;
}

loadIndex().then(index => {
  const input = document.getElementById('userInput');
  const messages = document.getElementById('messages');
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const userText = input.value;
      messages.innerHTML += `<div class='message user'>${userText}</div>`;
      const reply = findBestMatch(userText, index);
      messages.innerHTML += `<div class='message bot'>${reply}</div>`;
      input.value = '';
    }
  });
});
