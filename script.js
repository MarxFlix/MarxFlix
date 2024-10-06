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
				const emojis = stringifyEmojis(doc.bg);
				const duration = doc.duration || '0';
				const formattedDuration = formatDuration(duration);
				const tone = doc.tone || '69';
				const labelledTone = toneLabel(tone);
				const docElement = document.createElement('div');
				docElement.className = 'doc-item';
				docElement.innerHTML = `
    				<div class="emoji-background">${emojis}</div>
				<h3>${doc.title}</h3>
				<p>${doc.description}</p>
				<p><b>Duration: ${formattedDuration}</b></p>
				<div class="tone">
					<span>Tone: ${labelledTone}</span>
					<div class="tone-container">
					<div class="tone-bar" style="width: ${(tone / 5) * 100}%"></div>
					</div>
				</div>
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
				carouselContent.appendChild(docElement);
			}
		});
	});
}

function stringifyEmojis(emojis){
	let output = emojis ? emojis.join('') : "⬜ ⬜";
	return output;
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

function toneLabel(level) {
	let output = '';
	
	if (level === 1) {
		output = "Casual Entertainment";
	}
	else if (level === 2) {
		output = "Primarily Entertainment";
	}
	else if (level === 3) {
		output = "Insightful Edutainment";
	}
	else if (level === 4) {
		output = "Primarily Informational";
	}
	else if (level === 5) {
		output = "Strictly Informational";
	}
	else {
		output = "ERR: INVALID VALUE";
	}
	
	return output;
}
