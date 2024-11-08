const tldLocales = {
  'translateToHindi': { locale: 'Hindi', tgt: 'hin_Deva' },
  'translateToMarathi': { locale: 'Marathi', tgt: 'mar_Deva' },
  'translateToMalayalam': { locale: 'Malayalam', tgt: 'mal_Mlym' },
  'translateToTamil': { locale: 'Tamil', tgt: 'tam_Taml' },
  'translateToGujarati': { locale: 'Gujarati', tgt: 'guj_Gujr' },
  'translateToTelugu': { locale: 'Telugu', tgt: 'tel_Telu' },
  'translateToKannada': { locale: 'Kannada', tgt: 'kan_Knda' },
};

const summarizeLocals = {
  'summarizeToEnglish': { locale: 'English', tgt: 'eng' },
  'summarizeToHindi': { locale: 'Hindi', tgt: 'hin' },
  'summarizeToMarathi': { locale: 'Marathi', tgt: 'mar' },
  'summarizeToMalayalam': { locale: 'Malayalam', tgt: 'mal' },
  'summarizeToTamil': { locale: 'Tamil', tgt: 'tam' },
  'summarizeToGujarati': { locale: 'Gujarati', tgt: 'guj' },
  'summarizeToTelugu': { locale: 'Telugu', tgt: 'tel' },
  'summarizeToKannada': { locale: 'Kannada', tgt: 'kan' },
};

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

chrome.runtime.onInstalled.addListener(async () => {
   // Create the parent "Translate" menu item
   chrome.contextMenus.create({
    id: 'translate',
    title: 'Translate',
    contexts: ['selection'],
  });

  // Create sub-menu items under "Translate" for each language
  for (let [tld, localeInfo] of Object.entries(tldLocales)) {
    chrome.contextMenus.create({
      id: tld,
      parentId: 'translate', // Associate the sub-menu with the "Translate" parent
      title: `Translate to ${localeInfo.locale}`,
      contexts: ['selection'],
    });
  }

  // Create the "Summarize" menu item
  chrome.contextMenus.create({
    id: 'summarize',
    title: 'Summarize',
    contexts: ['selection'],
  });
   // Create sub-menu items under "Translate" for each language
   for (let [tld, localeInfo] of Object.entries(summarizeLocals)) {
    chrome.contextMenus.create({
      id: tld,
      parentId: 'summarize', // Associate the sub-menu with the "Translate" parent
      title: `summarize to ${localeInfo.locale}`,
      contexts: ['selection'],
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId && tldLocales[info.menuItemId]) {
    const selectedText = info.selectionText;
    const { tgt } = tldLocales[info.menuItemId];
    translateText(selectedText, tab, tgt);
  }else if (info.menuItemId && summarizeLocals[info.menuItemId]) {
    const selectedText = info.selectionText;
    const { tgt } = summarizeLocals[info.menuItemId];
    summarizeText(selectedText, tab, tgt);
  }
});

async function translateText(text, tab, tgt) {
  const apiUrl = "https://translate-api-tan.vercel.app/api/translate";
  const requestBody = {
    text: text,
    src_language: "eng_Latn", // Source language is always English
    tgt_language: tgt, // Target language is Hindi
    model: "krutrim-translate-v1.0"
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    const translatedText = data.data && data.data.translated_text ? data.data.translated_text : 'Translation failed';
    console.log("translatedText", translatedText);
    if (translatedText) {
      console.log("translatedText", translatedText);
      showPopup(translatedText, tab, tgt);
    } else {
      console.error("No translated text found in the response.");
    }
  } catch (error) {
    console.error("Error translating text:", error);
  }
}

async function summarizeText(text, tab, tgt) {
  console.log('summarize' ,text)
  try {
    const response = await fetch('https://translate-api-tan.vercel.app/api/summarization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        input_language: tgt,
        summary_size: '20'
      })
    });

    const data = await response.json();

    // Display the summarized text or show an error message
    if (data.data && data.data.summaryText) {
      showPopup(data.data.summaryText, tab, tgt); // Assuming showPopup can handle summary text
    } else {
      console.error('Summary failed:', data);
    }
  } catch (error) {
    console.error('Error summarizing text:', error);
  }
}

function showPopup(translatedText, tab, tgt) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (translatedText) => {
      const popup = document.createElement('div');
      popup.id = 'krutrim-translation-popup';
      popup.style.position = 'fixed';
      popup.style.top = '50px';
      popup.style.right = '50px';
      popup.style.width = '500px';
      popup.style.backgroundColor = '#fff';
      popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      popup.style.borderRadius = '8px';
      popup.style.overflow = 'hidden';
      popup.style.zIndex = '10000';
      popup.style.fontFamily = 'Arial, sans-serif';

      const header = document.createElement('div');
      header.style.backgroundColor = '#009933';
      header.style.color = '#fff';
      header.style.padding = '10px 15px';
      header.style.fontWeight = 'bold';
      header.style.fontSize = '16px';
      header.style.display = 'flex';
      header.style.alignItems = 'center';

      const logo = document.createElement('img');
      logo.src = 'https://cloud.olakrutrim.com/MenuIcons/kru_logo.svg';
      logo.style.height = '20px';
      logo.style.marginRight = '10px';

      const headerText = document.createElement('span');
      headerText.innerText = 'Krutrim Translator';

      header.appendChild(logo);
      header.appendChild(headerText);

      const content = document.createElement('div');
      content.style.padding = '15px';
      content.style.maxHeight = '500px';
      content.style.overflowY = 'auto';
      content.style.fontSize = '14px';
      content.style.lineHeight = '1.4';
      content.innerText = translatedText;

      const closeButton = document.createElement('button');
      closeButton.innerText = '×';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '5px';
      closeButton.style.right = '10px';
      closeButton.style.backgroundColor = 'transparent';
      closeButton.style.border = 'none';
      closeButton.style.color = '#fff';
      closeButton.style.fontSize = '20px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => document.body.removeChild(popup);

      // Audio button (Text-to-Speech button)
      const ttsButton = document.createElement('button');
      ttsButton.innerText = '';
      ttsButton.style.position = 'absolute';
      ttsButton.style.top = '5px';
      ttsButton.style.right = '40px';  // Placed next to the close button
      ttsButton.style.backgroundColor = 'transparent';
      ttsButton.style.border = 'none';
      ttsButton.style.color = '#fff';
      ttsButton.style.fontSize = '20px';
      ttsButton.style.cursor = 'pointer';
      ttsButton.style.zIndex = '99999';

      ttsButton.onclick = async () => {
        console.log("TTS button clicked"); // Debugging
        speechSynthesis.cancel();      // Cancel any previous speech before starting a new one
        const langCode = langSpeechSynthesisMap[tgt];
        const voice = await getVoiceForLanguage(langCode);

        if (voice) {
          console.log(`Selected voice: ${voice.name} for language: ${langCode}`);
          speak(translatedText, voice);
        } else {
          console.warn(`No voice available for language: ${langCode}`);
          speak(translatedText); // Fallback to default voice
        }
      };

      popup.appendChild(header);
      popup.appendChild(content);
      popup.appendChild(closeButton);
      popup.appendChild(ttsButton);  // Append the TTS button

      document.body.appendChild(popup);

      // Close the popup after 10 seconds
      setTimeout(() => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
      }, 20000);
    },
    args: [translatedText]
  }).then(() => {
    console.log("Script injected successfully.");
  }).catch((error) => {
    console.error("Script injection error:", error);
  });
}

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
    console.log("Available voices:", voices);  // Add this to log available voices
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
  // Check if langCode exactly matches or starts with the same language
  return voices.find(voice => voice.lang === langCode || voice.lang.startsWith(langCode));
}


