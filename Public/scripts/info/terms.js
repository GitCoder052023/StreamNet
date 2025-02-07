const renderMarkdown = (markdownText) => {
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        sanitize: false
    });

    document.getElementById("rendered-markdown").innerHTML = marked.parse(markdownText);
};

const handleError = (error) => {
    console.error('License load error:', error);
    document.getElementById("rendered-markdown").innerHTML =
        "<p class='text-red-600'>Error loading license file. Please try again later.</p>";
};

const backendHost = document.querySelector('meta[name="backend-host"]').content;

fetch(`https://${backendHost}:3000/license`, {
    headers: {
        'Accept': 'text/plain'
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load license file');
        }
        return response.text();
    })
    .then(renderMarkdown)
    .catch(handleError);
