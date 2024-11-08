// Map language codes to readable language names for the heading
const languageMap = {
  kas_Arab: 'Kashmiri (Arabic)',
  pan_Guru: 'Punjabi',
  ben_Beng: 'Bengali',
  kas_Deva: 'Kashmiri (Devanagari)',
  san_Deva: 'Sanskrit',
  brx_Deva: 'Bodo',
  mai_Deva: 'Maithili',
  sat_Olck: 'Santali',
  doi_Deva: 'Dogri',
  mal_Mlym: 'Malayalam',
  snd_Arab: 'Sindhi (Arabic)',
  eng_Latn: 'English',
  mar_Deva: 'Marathi',
  snd_Deva: 'Sindhi (Devanagari)',
  gom_Deva: 'Konkani',
  mni_Beng: 'Manipuri (Bengali)',
  tam_Taml: 'Tamil',
  guj_Gujr: 'Gujarati',
  mni_Mtei: 'Manipuri (Meitei)',
  tel_Telu: 'Telugu',
  hin_Deva: 'Hindi',
  npi_Deva: 'Nepali',
  urd_Arab: 'Urdu',
  kan_Knda: 'Kannada',
  ory_Orya: 'Odia'
}
const langSpeechSynthesisMap = {
  'kas_Arab': 'ks',
  'pan_Guru': 'pa-IN',
  'ben_Beng': 'bn-IN',
  'kas_Deva': 'ks',
  'san_Deva': 'sa-IN',
  'brx_Deva': 'brx',
  'mai_Deva': 'mai-IN',
  'sat_Olck': 'sat',
  'doi_Deva': 'doi-IN',
  'mal_Mlym': 'ml-IN',
  'snd_Arab': 'sd-IN',
  'eng_Latn': 'en-US',
  'mar_Deva': 'mr-IN',
  'snd_Deva': 'sd-IN',
  'gom_Deva': 'gom',
  'mni_Beng': 'mni',
  'tam_Taml': 'ta-IN',
  'guj_Gujr': 'gu-IN',
  'mni_Mtei': 'mni',
  'tel_Telu': 'te-IN',
  'hin_Deva': 'hi-IN',
  'npi_Deva': 'ne-NP',
  'urd_Arab': 'ur-IN',
  'kan_Knda': 'kn-IN',
  'ory_Orya': 'or-IN'
};

// Update the heading when the language is changed
document.getElementById('languageSelect').addEventListener('change', function () {
  const selectedLanguage = this.value;
  const translatorTitle = document.getElementById('translatorTitle');
 
  // Set the heading text based on the selected language
  translatorTitle.innerText = `English to ${languageMap[selectedLanguage]} Translator`;
});

// Event listener for the translate button
document.getElementById('translateButton').addEventListener('click', async () => {
  const inputText = document.getElementById('inputText').value;
  const selectedLanguage = document.getElementById('languageSelect').value;
  const ttsButton = document.getElementById('textToSpeech');

  if (inputText.trim() === '') {
    document.getElementById('result').innerText = 'Please enter some text';
    ttsButton.classList.add('hidden');
    return;
  }

  try {
    const response = await fetch('https://translate-api-tan.vercel.app/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: inputText,
        src_language: "eng_Latn",   
        tgt_language: selectedLanguage,
        model: "krutrim-translate-v1.0"
      })
    });

    const data = await response.json();
    
    // Display the translated text or show an error message
    if (data.data.translated_text) {
      document.getElementById('result').innerText = data.data.translated_text;
      ttsButton.classList.remove('hidden'); // Show the TTS button after successful translation

      // Add click listener for TTS functionality
      ttsButton.onclick = async () => {
        speechSynthesis.cancel();      // Cancel any previous speech before starting a new one
        const langCode = langSpeechSynthesisMap[selectedLanguage];
        const voice = await getVoiceForLanguage(langCode);

        if (voice) {
          speak(data.data.translated_text, voice);  
        } else {
          console.warn(`No voice available for language: ${langCode}`);
          speak(data.data.translated_text);
        }
      };
    } else {
      document.getElementById('result').innerText = 'Translation failed';
      ttsButton.classList.add('hidden'); // Hide the TTS button if translation fails
    }
  } catch (error) {
    document.getElementById('result').innerText = 'Error: ' + error.message;
    ttsButton.classList.add('hidden');
  }
});

function speak(text, voice) {
  const utterance = new SpeechSynthesisUtterance(text);

  if (voice) {
    utterance.voice = voice;
  }

  speechSynthesis.speak(utterance);
}

function getTTSVoices() {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices());
      };
    }
  });
}

// Get the voice for the selected language code
async function getVoiceForLanguage(langCode) {
  const voices = await getTTSVoices();
  
  // Filter voices based on the language code
  return voices.find(voice => voice.lang.startsWith(langCode));
}