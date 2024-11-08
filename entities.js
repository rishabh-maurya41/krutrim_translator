const options = [
    { value: 'pii', label: 'Personal Identifiable Information (PII)' },
    { value: 'ner', label: 'Named Entity Recognition (NER)' },
    { value: 'keywords', label: 'Keywords' },
    { value: 'profanity', label: 'Profanity' }
];

const multiSelect = document.getElementById('multiSelect');
const multiSelectOptions = document.getElementById('multiSelectOptions');
let selectedOptions = [];

function renderOptions() {
    multiSelectOptions.innerHTML = '';
    options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'p-2 hover:bg-gray-100 cursor-pointer';
        if (selectedOptions.includes(option.value)) {
            div.classList.add('bg-blue-50');
        }
        div.textContent = option.label;
        div.onclick = () => toggleOption(option);
        multiSelectOptions.appendChild(div);
    });
}

function renderTags() {
    const tags = selectedOptions.map(value => {
        const option = options.find(o => o.value === value);
        return `<span class="custom-select-tag">${option.label}<span class="custom-select-tag-remove" data-value="${value}">&times;</span></span>`;
    }).join('');
    multiSelect.innerHTML = tags || '<span class="text-gray-500">Select parameters</span>';
}

function toggleOption(option) {
    const index = selectedOptions.indexOf(option.value);
    if (index > -1) {
        selectedOptions.splice(index, 1);
    } else {
        selectedOptions.push(option.value);
    }
    renderTags();
    renderOptions();
}

multiSelect.onclick = (e) => {
    e.stopPropagation();
    multiSelectOptions.classList.toggle('hidden');
};

document.addEventListener('click', () => {
    multiSelectOptions.classList.add('hidden');
});

multiSelect.addEventListener('click', (e) => {
    if (e.target.classList.contains('custom-select-tag-remove')) {
        const value = e.target.getAttribute('data-value');
        selectedOptions = selectedOptions.filter(v => v !== value);
        renderTags();
        renderOptions();
    }
});

async function callEntityExtractionAPI() {
    const text = document.getElementById('entityText').value;
    const lang_from = document.getElementById('entitytLanguageSelect').value;

    try {
        const response = await fetch('https://translate-api-tan.vercel.app/api/entity-extraction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                param_list: selectedOptions, 
                lang_from: lang_from  
            }),
        });
        const data = await response.json();
        if (data && data.data) {
            displayEntityExtractionResult(data.data);
        } else {
            console.error('API call failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during API call:', error);
    }
}

// Display the result of the entity extraction
function displayEntityExtractionResult(data) {
    const resultContainer = document.getElementById('entityResult');
    resultContainer.value = '';  // Clear previous results

    let resultText = '';
    data.forEach(item => {
        resultText += `${item.title}:\n`;
        item.data.forEach(d => {
            resultText += `- ${d.label}: ${d.value}\n`;
        });
        resultText += '\n';
    });
    
    resultContainer.value = resultText;
}

// Trigger the API call on button click
document.getElementById('extractEntitiesButton').addEventListener('click', () => {
    if (selectedOptions.length === 0) {
        alert('Please select at least one parameter.');
        return;
    }
    
    callEntityExtractionAPI();
});

renderOptions();