
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

const knowledgeBase = {
  "how do i connect to wifi": "To connect to a WLAN, go to Settings > Network, select your WLAN, and tap Connect.",
  "how do i use bluetooth": "To use Bluetooth, enable it in Settings and pair with your device.",
  "how do i clean the tablet": "Use a soft, lint-free cloth moistened with alcohol-free cleaner to clean the tablet.",
  "how do i reset the tablet": "To reset, go to Settings > Recovery and choose Reset this PC.",
  "how do i use the webcam": "To use the webcam, open the Camera app from the Start screen."
};

chatForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const question = userInput.value.trim().toLowerCase();
  if (!question) return;
  appendMessage('You', question);
  const answer = knowledgeBase[question] || "I'm sorry, I don't have an answer for that.";
  appendMessage('Sara', answer);
  userInput.value = '';
});

function appendMessage(sender, message) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = `${sender}: ${message}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
