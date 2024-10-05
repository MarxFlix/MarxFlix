// Fetch the documentary data from the local JSON file
fetch('data.json')
    .then(response => response.json())
    .then(documentaries => populateCarousels(documentaries))
    .catch(error => console.error('Error loading the data:', error));

// Function to detect service based on URL
function getServiceAndLogo(url) {
    const services = {
        'youtube.com': {
            logo: 'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png'
        },
        'vimeo.com': {
            logo: 'https://upload.wikimedia.org/vimeo-logo.png'
        }
        // Add more services as needed
    };

    for (const [key, value] of Object.entries(services)) {
        if (url.includes(key)) {
            return value;
        }
    }
    
    // Default service logo if no match found
    return { logo: 'https://via.placeholder.com/50' };
}

function populateCarousels(documentaries) {
    documentaries.forEach(doc => {
        doc.topic.forEach(topic => {
            const carouselContent = document.getElementById(`${topic.toLowerCase()}-content`);
            if (carouselContent) {
                const docElement = document.createElement('div');
                docElement.className = 'doc-item';
                docElement.innerHTML = `
                    <h3>${doc.title}</h3>
                    <p>${doc.description}</p>
                    <p><b>Runtime: ${doc.runtime}</b></p>
                    <div class="intensity">
                        <span>Intensity:</span>
                        <div class="intensity-container">
                            <div class="intensity-bar" style="width: ${(doc.intensity / 3) * 100}%"></div>
                        </div>
                    </div>
                    <div class="links">
                        ${doc.links.map(link => {
                            const { logo } = getServiceAndLogo(link);
                            return `
                                <a href="${link}" target="_blank">
                                    <img src="${logo}" alt="Service logo" style="width: 50px; height: auto; vertical-align: middle;">
                                </a>
                            `;
                        }).join('')}
                    </div>
                `;
                carouselContent.appendChild(docElement);
            }
        });
    });
}

function goToMain() {
    window.location.href = 'main.html';
}
