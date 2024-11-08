
  // Event listener for the translate button
  document.getElementById('summarizeButton').addEventListener('click', async () => {
    const inputText = document.getElementById('summarizeText').value;
    const selectedLanguage = document.getElementById('summarizeLanguageSelect').value;
  
    if (inputText.trim() === '') {
      document.getElementById('summaryResult').innerText = 'Please enter some text';
      return;
    }
  
    try {
      const response = await fetch('https://translate-api-tan.vercel.app/api/summarization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText,   
          input_language: selectedLanguage,
          summary_size: '20'
        })
      });
  
      const data = await response.json();
      
      // Display the translated text or show an error message
      if (data.data.summaryText) {
        document.getElementById('summaryResult').innerText = data.data.summaryText;
     
      } else {
        document.getElementById('summaryResult').innerText = 'Translation failed';
      }
    } catch (error) {
      document.getElementById('summaryResult').innerText = 'Error: ' + error.message;
    
    }
  });
  