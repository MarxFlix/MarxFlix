function goToIndex() {
    window.location.href = 'index.html';
}

fetch('data.json')
.then(response => response.json())
.then(entries => populateCarousels(entries))
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
	}

	for (const [key, value] of Object.entries(services)) {
		if (url.includes(key)) {
			return value;
		}
	}
	
	return { logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/F1_red_flag.svg/1280px-F1_red_flag.svg.png' };
}

function populateCarousels(entries) {
	entries.forEach(doc => {
		doc.topic.forEach(topic => {
			const carouselContent = document.getElementById(`${topic.toLowerCase()}-content`);
			if (carouselContent) {
				const duration = doc.duration || '0';
				const formattedDuration = formatDuration(duration);
				const docElement = document.createElement('div');
				docElement.className = 'doc-item';
				docElement.innerHTML = `
				<h3>${doc.title}</h3>
				<p>${doc.description}</p>
				<p><b>Duration: ${formattedDuration}</b></p>
				<div class="tone">
					<span>Tone:</span>
					<div class="tone-container">
					<div class="tone-bar" style="width: ${(doc.tone / 5) * 100}%"></div>
					</div>
				</div>
				<div class="tone-popup">Approximates the tone to be between casual and strictly informational.</div>
				<div class="links">
					${doc.links.map(link => {
					const { logo } = getServiceAndLogo(link);
					return `
					<a href="${link}" target="_blank">
					<img src="${logo}" style="width: 50px; height: auto; vertical-align: middle;">
					</a>
					`;
					}).join('')}
				</div>
    				`;
				updateBackgroundEmoji(docElement, doc);
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
		output = `⏳ ${hours} 🕒 ${minutes}`;
	} else {
		minutes = parseInt(duration, 10);
		output = `🕒 ${minutes}`;
	}
	
	return output;
}

document.addEventListener('DOMContentLoaded', () => {
    const toneDivs = document.querySelectorAll('.tone'); // Get all tone divs
    const tonePopups = document.querySelectorAll('.tone-popup'); // Get all tone popups

    toneDivs.forEach((toneDiv, index) => {
        toneDiv.addEventListener('mouseenter', () => {
            const popup = tonePopups[index];
            popup.style.display = 'block';

            const rect = toneDiv.getBoundingClientRect();
            popup.style.left = `${rect.left}px`;
            popup.style.top = `${rect.bottom}px`;
        });

        toneDiv.addEventListener('mouseleave', () => {
            tonePopups[index].style.display = 'none';
        });

        toneDiv.addEventListener('click', () => {
            const popup = tonePopups[index];
            const isVisible = popup.style.display === 'block';

            tonePopups.forEach(p => p.style.display = 'none');
            popup.style.display = isVisible ? 'none' : 'block';

            if (!isVisible) {
                const rect = toneDiv.getBoundingClientRect();
                popup.style.left = `${rect.left}px`;
                popup.style.top = `${rect.bottom}px`;
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.tone')) {
            tonePopups.forEach(p => p.style.display = 'none');
        }
    });
});

function updateBackgroundEmoji(element, doc) {
	let emojis = doc.bg ? doc.bg.join(' ') : "⬜ ⬜ ⬜";
	element.style.setProperty('--bg-emoji', `'${emojis}'`);
}
