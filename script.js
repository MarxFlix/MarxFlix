fetch('data.json')
    .then(response => response.json())
    .then(documentaries => populateCarousels(documentaries))
    .catch(error => console.error('Err data load:', error));

function getServiceAndLogo(url) {
    const services = {
        'youtube.com': {
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/512px-YouTube_Logo_2017.svg.png'
        },
	'nebula.tv': {
            logo: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Nebula_Logo.png'
        },
	'means.tv': {
            logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Means.tv_wordmark.jpg'
        },
        'vimeo.com': {
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Vimeo_Logo.svg/70px-Vimeo_Logo.svg.png'
        }
    };

    for (const [key, value] of Object.entries(services)) {
        if (url.includes(key)) {
            return value;
        }
    }
    
    return { logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/F1_red_flag.svg/1280px-F1_red_flag.svg.png' };
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


function formatDuration(duration) {
    let hours = 0;
    let minutes = 0;
    let output = '';

    if (duration.includes(':')) {
        const parts = duration.split(':');
        hours = parseInt(parts[0], 10);
        minutes = parseInt(parts[1], 10);

        output += `⏳ ${hours} 🕒 ${minutes}\n`;
        
        output += `${hours} Hour(s) and ${minutes} Minute(s)\n`;
        output += `[${'#'.repeat(hours)}]    [${'#'.repeat(Math.floor(minutes / 2))}]\n`;
    } else {
        minutes = parseInt(duration, 10);

        output += `🕒 ${minutes}\n`;

        output += `${minutes} Minute(s)\n`;
        output += `[${'#'.repeat(Math.floor(minutes / 2))}]\n`;
    }

    return output;
}

const toneDiv = document.querySelector('.tone');
const tonePopup = document.querySelector('.tone-popup');

toneDiv.addEventListener('mouseenter', () => {
    tonePopup.style.display = 'block';
});

toneDiv.addEventListener('mouseleave', () => {
    tonePopup.style.display = 'none';
});

function updateBackgroundEmoji(carouselElement) {
    const bgEmojis = carouselElement.getAttribute('data-bg');
    carouselElement.style.setProperty('--bg-emoji', `"${bgEmojis}"`);
}
