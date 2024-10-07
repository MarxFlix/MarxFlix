fetch('data.json')
.then(response => response.json())
.then(entries => populateCarousels(entries))
.catch(error => console.error('ERR DATA LOAD:', error));

function getOffWhite() {
    const whites = [
        "#FFF5E1",
	"#FFE1E1",
	"#E1F5FE",
	"#E1F7E1",
	"#F1E1F7",
	"#FFFFE1",
	"#F5F5FF",
	"#FFE8D1",
	"#E1FFFA",
	"#FFE1E1"
    ];
    const randomNum = Math.floor(Math.random() * whites.length);
    return whites[randomNum];
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

function labelTone(level) {
	let output = '';
	
	if (level === 1) {
		output = "Minimal";
	}
	else if (level === 2) {
		output = "Light";
	}
	else if (level === 3) {
		output = "Mild";
	}
	else if (level === 4) {
		output = "Substantial";
	}
	else if (level === 5) {
		output = "Heavy";
	}
	else {
		output = "ERR INVALID VALUE";
	}
	
	return output;
}

function matchServices(url) {
	const services = {
		'youtube.com': {
		logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/YouTube_social_red_squircle_%282017%29.svg/300px-YouTube_social_red_squircle_%282017%29.svg.png'
		},
		'nebula.tv': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Nebula_Logo.png'
		},
		'means.tv': {
		logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Means.tv_wordmark.jpg'
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
				const labelledTone = labelTone(tone);
				const docElement = document.createElement('div');
				docElement.className = 'doc-item';
				docElement.style.backgroundColor = getOffWhite();
				docElement.innerHTML = `
    				<div class="emoji-background">${emojis}</div>
				<h3>${doc.title} ${emojis}</h3>
				<p>${doc.description}</p>
				<p><b>Duration: ${formattedDuration}</b></p>
				<div class="tone">
					<span>${labelledTone} Academic Density</span>
					<div class="tone-container">
					<div class="tone-bar" style="width: ${(tone / 5) * 100}%"></div>
					</div>
				</div>
				<div class="links">
					${doc.links.map(link => {
					const { logo } = matchServices(link);
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

function goToIndex() {
    window.location.href = 'index.html';
}
