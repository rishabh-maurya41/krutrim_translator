
  // Event listener for the translate button
  document.getElementById('analyzeSentimentButton').addEventListener('click', async () => {
    const inputText = document.getElementById('sentimentText').value;
    const selectedLanguage = document.getElementById('sentimentLanguageSelect').value;
  
    if (inputText.trim() === '') {
      document.getElementById('sentimentResult').innerText = 'Please enter some text';
      return;
    }
  
    try {
      const response = await fetch('https://translate-api-tan.vercel.app/api/sentiment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText,   
          lang_from: selectedLanguage,
        })
      });
  
      const data = await response.json();
      
      // Display the translated text or show an error message
      if (Array.isArray(data.Sentiment)) {
        const sentimentValues = data.Sentiment.map(item => item.value.join(', ')).join(' | ');
        document.getElementById('sentimentResult').innerText = sentimentValues;
      } else {
        document.getElementById('sentimentResult').innerText = 'Sentiment analysis failed';
      }
    } catch (error) {
      document.getElementById('sentimentResult').innerText = 'Error: ' + error.message;
    }
  });
  