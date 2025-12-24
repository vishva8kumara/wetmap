
const timeSlider = q('#timeSlider')[0];
const controlBar = q('#controlBar')[0];
const map = q('#mapOverlay')[0];
let data = {};
let keys = [];
let prvIndx = 0, zoomFact = 1;

setTimeout(async function(){
	//const response = await fetch((location.protocol === 'https:' ? 'https' : 'http')+'://wet.info.lk/data/ow/jsx/api.php');
	const response = await fetch('https://wet.info.lk/data/ow/jsx/api.php');
	data = await response.json();
	keys = Object.keys(data.data);
	controlBar.style.display = 'block';
	timeSlider.onchange = timeSlider.onscroll = updateDateTime;
	timeSlider.value = 0;
	timeSlider.focus();
	chkUpdateTimer = setTimeout(chkUpdate, 1);
}, 1);

let chkUpdateTimer;
function chkUpdate() {
	const i = (timeSlider.value || 0) * 1 + 2;
	if (prvIndx != i) {
		updateDateTime();
	}
	prvIndx = i;
	chkUpdateTimer = setTimeout(chkUpdate, 240);
}

function updateDateTime() {
	const i = (timeSlider.value || 0) * 1 + 2;
	const now = new Date( keys[i] * 1000 );
	prvIndx = i;

	const dateStr = now.toLocaleDateString(undefined, {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

	const timeStr = now.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});

	document.getElementById("date").textContent = dateStr;
	document.getElementById("time").textContent = timeStr;

	const weather = data.data[ keys[i] ];
	const cids = Object.keys(weather);

	/*const hour = now.getHours() + now.getMinutes() / 60;
	const lightFactor = Math.max(0, Math.sin(Math.PI * (hour - 6) / 12));
	const grayHex = '#' + ((v = Math.round(lightFactor * 255)).toString(16).padStart(2, '0')).repeat(3);
	map.style.backgroundColor = grayHex+((1 - lightFactor) * 128).toString(16);//+'08';*/

	const existing = Object.fromEntries([...map.childNodes].filter(el => el.id).map(el => [el.id, el]));
	for (let j of cids) {
		const city = data.cities[ j ];
		const x = zoomFact * (city.pos.lon - 78.95);
		const y = zoomFact * (10.3 - city.pos.lat);
		const position = 'top: '+y+'px; left: '+x+'px;';
		const title = city.city +' - '+weather[j].sky+
			'\nRain Risk: '+ weather[j].rainrsk+' ('+weather[j].rain+')'+
			'\nWind Speed: '+weather[j].wndspd+' m/s'+
			'\nTemperature: '+weather[j].temp+' C';
		//
		const rainrsk = Math.log2(weather[j].rainrsk) * 7.5;
		const wndspd = weather[j].wndspd / 5;
		const tempColor = (70 - weather[j].temp) * 4 ;
		const cludCover = (weather[j].cldins + 100) / 5 ;
		const rainOpacity = Math.min(75, weather[j].rain * 50 + 25);
		//
		const rainStyle = position+' height: '+rainrsk+'px; width: '+rainrsk+'px; '+
				'background-color: hsl('+tempColor+'deg 75% '+cludCover+'%'+
				' / '+rainOpacity+'%)';
		let rainb = map.q('#rainb-'+j)[0];
		if (rainb) {
			rainb.style = rainStyle;
			rainb.title = title;
			delete existing[ 'rainb-'+j ];
		}
		else
			rainb = map.appendChild(arc.elem('div', null, {
				style: rainStyle, class: 'rainb', title: title, id: 'rainb-'+j
			}));
		//
		const windStyle = position+' transform: translate(-50%, -50%) rotate('+(weather[j].wnddir)+'deg) scale('+wndspd+');';
		let windo = map.q('#windo-'+j)[0];
		if (windo) {
			windo.style = windStyle;
			windo.title = title;
			delete existing[ 'windo-'+j ];
		}
		else
			windo = map.appendChild(arc.elem('div', null, {
				style: windStyle,
				class: 'windo', title: title, id: 'windo-'+j
			}));
		//
	}
	/*for (let r of Object.values(existing)) {
		map.removeChild(r);
	}*/
}

window.onresize = function() {
	const heightConst = window.innerHeight / 1413;
	const widthConst = window.innerWidth / 1013;
	const constraint = (heightConst > widthConst) ? 'width' : 'height';
	//
	if (constraint == 'width') {
		map.style.width = window.innerWidth + 'px';
		map.style.height = (1413 * window.innerWidth / 1013) + 'px';
	}
	else {
		map.style.width = (1013 * window.innerHeight / 1413) + 'px';
		map.style.height = window.innerHeight + 'px';
	}
	//
	zoomFact = 298 * Math.min(widthConst, heightConst);
}
window.onresize();

let playTimer;
const playButton = q('button#playPause')[0];
playButton.onclick = function() {
	if (this.className == 'playing') {
		this.className = 'paused';
		this.innerHTML = '►';
		clearTimeout(playTimer);
		chkUpdateTimer = setTimeout(chkUpdate, 1);
	}
	else {
		this.className = 'playing';
		this.innerHTML = '⏸';
		clearTimeout(chkUpdateTimer);
		playTimer = setTimeout(progress, 1);
		
	}
};
function progress() {
	if (timeSlider.value == timeSlider.max) {
		timeSlider.value = 0;
	}
	else {
		timeSlider.value = 1*timeSlider.value + 1;
	}
	updateDateTime();
	playTimer = setTimeout(progress, 800);
}

const infoPanel = q('.info-panel')[0];
const legend = infoPanel.q('.legend')[0];
let legendHeight = false;
infoPanel.onclick = async function() {
	if (legendHeight == false) {
		legend.style.height = 'auto';
		legendHeight = legend.offsetHeight;
		legend.style.height = legendHeight + 'px';
		await sleep(1);
	}
	//
	if (infoPanel.className.indexOf('hide-legend') > -1) {
		infoPanel.removeClass('hide-legend');
		legend.style.height = legendHeight + 'px';
	}
	else {
		infoPanel.addClass('hide-legend');
		legend.style.height = '0px';
	}
};
infoPanel.onclick();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
