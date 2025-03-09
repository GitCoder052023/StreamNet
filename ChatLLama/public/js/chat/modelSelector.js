export async function initializeModelSelector(BACKEND_URL) {
  const modelButton = document.getElementById('model-button');
  const selectedModelSpan = document.getElementById('selected-model');
  const modelOptionsDiv = document.getElementById('model-options');
  const chatInput = document.getElementById('chat-input');

  try {
    const response = await fetch(`${BACKEND_URL}/api/models`);
    const data = await response.json();
    if (data.success) {
      const models = data.models;
      modelOptionsDiv.innerHTML = '';
      models.forEach((model) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'cursor-pointer px-4 py-2 hover:bg-gray-100';
        optionDiv.textContent = model.name;
        optionDiv.addEventListener('click', () => {
          selectedModelSpan.textContent = model.name;
          chatInput.placeholder = `Ask ${model.name}...`;
          modelOptionsDiv.classList.add('hidden');
        });
        modelOptionsDiv.appendChild(optionDiv);
      });
      if (models.length > 0) {
        selectedModelSpan.textContent = models[0].name;
        chatInput.placeholder = `Ask ${models[0].name}...`;
      }
    }
  } catch (error) {
    console.error('Error fetching models:', error);
    selectedModelSpan.textContent = 'deepseek-r1:1.5b';
    chatInput.placeholder = 'Ask deepseek-r1:1.5b...';
  }

  modelButton.addEventListener('click', (e) => {
    e.stopPropagation();
    modelOptionsDiv.classList.toggle('hidden');
  });

  document.addEventListener('click', (event) => {
    if (!modelButton.contains(event.target) && !modelOptionsDiv.contains(event.target)) {
      modelOptionsDiv.classList.add('hidden');
    }
  });
}