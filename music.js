//global variables
var inclination = 'minor'
var both_notes = []
var above_notes = []
var last_note = ''

function up_or_down(start, target) {
	scale = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
	start_location = scale.indexOf(start)
	end_location = scale.indexOf(target)

	if (end_location > start_location) {
		
		if (end_location - start_location > (scale.length - end_location) + start_location) {
			return 'down'
		}
		else {
			return 'up'
		}
	}
	else {
		if (start_location - end_location > (scale.length - start_location) + end_location) {
			return 'up'
		}
		else {
			return 'down'
		}
	}
}
function establish_note_rules(key) {
	scale = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
	
	index = key
	last_note = scale[key]
	while (true) {
		if (index >= scale.length) {
			index-=scale.length
		}
		if (both_notes.includes(scale[index]) || above_notes.includes(scale[index])) {
			break
		}
		if ([1,2,3,4].includes(index-key)) {
			above_notes.push(scale[index])
		}
		else {
			both_notes.push(scale[index])
		}

		index++
		
	}
		
}
function get_legal_notes(key) {
	//key is the number of half steps up from C
	
	//notes are mesured in half steps
	if (inclination==='major') {
		key_notes = [0, 2, 2, 1, 2, 2, 2]
	}
	else {
		key_notes = [0, 2, 1, 2, 2, 1, 3]
	}

	notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

	legal_notes = []
	count = 0
	for (x in key_notes){
		count += key_notes[x]
		if (count+key >= notes.length) {
			count-= notes.length
		}
		//console.log(key+count)
		legal_notes.push(notes[key+count])
	}
	return legal_notes
	
}

//sequence of chords for each phrase
function chord_progression(key, begin_phrase=false) {

	//key is the number of half steps up from C
	
	if (inclination==='major') {
		key_notes = [0, 2, 2, 1, 2, 2, 2]
	}
	else {
		key_notes = [0, 2, 1, 2, 2, 1, 3]
	}

	notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
	
	//chords are denoted by the number of IN KEY notes ABOVE the base note. Start with the bass
	if (begin_phrase === true) {
		chords = [0]
	}
	else {
		chords = []
	}
	/*
	while (chords.length < 4) {
		interval = Math.floor(Math.random()*6.99999999999)
		//console.log(interval)
		if (chords.includes(interval)) {
			continue
		}
		else{
			chords.push(interval)
		}
		
		
	}
 */
	while (chords.length < 4) {
		interval = choice([0,1,3,4,5,6])
		//console.log(interval)
		if (chords.includes(interval)) {
			continue
		}
		else{
			chords.push(interval)
		}
		
		
	}
	//console.log(chords)

	legal_notes = get_legal_notes(key)
	full_notation = []

	chord = []
	for (i in chords) {

		console.log(chords[i])
		//add up all the half steps leading up to a note in a scale
		pos = key+key_notes.slice(0,chords[i]+1).reduce((partialSum, a) => partialSum + a, 0)
		
		//console.log(notes[pos])
		
		chord.push(notes[pos])
		
		//the note 2 notes up the scale from the base (middel of the chord)
		if (chords[i]+1+2 >= key_notes.length) {
			pos = 12+key+key_notes.slice(0,chords[i]+1+2-key_notes.length).reduce((partialSum, a) => partialSum + a, 0)
		}
		else {
			pos = key+key_notes.slice(0,chords[i]+1+2).reduce((partialSum, a) => partialSum + a, 0)
		}
		
		if (pos>= notes.length) {
			pos-=notes.length
		}

		while(legal_notes.includes(notes[pos]) === false) {
			pos++
			if (pos>= notes.length) {
				pos-=notes.length
			}
		}
		
		chord.push(notes[pos])

		//the note 4 notes up the scale from the base
		if (chords[i]+1+2 >= key_notes.length) {
			pos = 12+key+key_notes.slice(0,chords[i]+1+4-key_notes.length).reduce((partialSum, a) => partialSum + a, 0)
		}
		else {
			pos = key+key_notes.slice(0,chords[i]+1+4).reduce((partialSum, a) => partialSum + a, 0)
		}
		
		if (pos>= notes.length) {
			pos-=notes.length
		}
		while(legal_notes.includes(notes[pos]) === false) {
			pos++
			if (pos>= notes.length) {
				pos-=notes.length
			}
		}
		chord.push(notes[pos])

		
		//console.log(i,pos,chord,x)
		/*
		while (chord.length < 3) {
			if (x >= notes.length){
				x -= notes.length
			}
			//console.log(notes[x])
			if (legal_notes.includes(notes[x]) === true) {
				chord.push(notes[x])
				x+=3
			}
			else{
				x+=1
			}
			
			
		}
  */
		console.log('chord: '+chord)
		full_notation.push(chord)
		chord = []
	}
	
	return full_notation
	
}


//main melody line based off of each chord
function melody(progression,key,mesurelen){
	//alert('genorating melody')
	//music is a 'dictionary' of the note and its length
	music = []
	in_key_notes = get_legal_notes(key)
	console.log('in key notes: '+in_key_notes)
	for (i in progression) {
		//alert(String(i)+'/'+progression.length)
		//console.log(progression[i])
		chord_key = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'].indexOf(String(progression[i][0]))
		
		chord_key_notes = String(get_legal_notes(chord_key)).slice(0,this.length - 1).split(',')

		console.log(chord_key_notes)
		//alert('finished chord notes')
		//alert(chord_key_notes)
		options = []
		for (x in in_key_notes) {
			
			if (chord_key_notes.includes(in_key_notes[x]) && options.includes(in_key_notes[x]) === false) {
				options.push(in_key_notes[x])
			}
		}
		
		
		//alert('finished options')
		
		lens = []
		len = 0
		total = 0
		//values = [1/16,3/32,1/8,3/16,1/4,3/8,1/2,3/4]
		values = [1/4,1/2]
		while (total < 1) {
			
			len = choice(values)
			if (len+total > 1) {
				if (total >= 31/32) {
					lens.push((1/32)*mesurelen)
					break
			}
				else {
					continue
				}
			}
			else {
				if (len === 3/4) {
					if (Math.random() < 0.8) {
						continue
					}
				}
				lens.push(len*mesurelen)
				total+=len
				////alert(lens)
			}
			
			
			
		}
		//alert('finished lens')

		lens = shuffle(lens)
		//alert('lens: '+String(lens))
		console.log('options: '+options)
		for (x in lens) {
			//alert(x,lens[x])
			//thingy = String(choice(options))+';'+String(lens[x])
			thingy = [String(choice(options)),lens[x]]
			console.log(thingy)
			music.push(thingy)
			
		}
		//alert(music)
		
	}

	return music
}

async function play_phrase(key,mesurelen,is_new_phrase) {
	if (is_new_phrase) {
		console.log('new phrase started')
	}
	timer = performance.now()
	const chord1 = new Tone.Synth().toDestination();
	const chord2 = new Tone.Synth().toDestination();
	const chord3 = new Tone.Synth().toDestination();
	const piano = new Tone.Synth().toDestination();
	
	progression = chord_progression(key,is_new_phrase)
	//alert('progression: '+String(progression))
	notes = melody(progression,key,mesurelen)
	//alert('notes: ' + String(notes))
	//console.log(notes.length,notes.length / 16)
	console.log('Mesure made in: ' + (performance.now() - timer))
	count = 0
	for (i in progression) {
		leftover=performance.now()
		//console.log(i)
		//console.log(progression[i])
		//play the chord
		chord1.triggerAttackRelease(String(progression[i][0])+'4', mesurelen/1000);
		chord2.triggerAttackRelease(String(progression[i][1])+'4', mesurelen/1000);
		chord3.triggerAttackRelease(String(progression[i][2])+'4', mesurelen/1000);
		
		//play the melody for this chord
		len = 0
		//alert('chord worked')
		
		while (len<mesurelen && count<notes.length) {
			next = performance.now()+(notes[count][1])
			//note = notes[count].split(';')
			
			//console.log('count: '+count)
			//console.log('note: '+note)
			//val = parseFloat(note[1])
			note = notes[count]
			val = note[1]
			if (above_notes.includes(note[0])) {
				piano.triggerAttackRelease(String(note[0])+'5', val/1000)

			}
			else {
				direction = up_or_down(last_note, note[0])
				if (direction === 'up') {
					piano.triggerAttackRelease(String(note[0])+'5', val/1000)
					
				}
				else {
					piano.triggerAttackRelease(String(note[0])+'4', val/1000)

				}
			}

			last_note = note[0]
			
			len+=val
			count++
			//console.log('note played: '+note)
			
			while (performance.now()-next < 0) {
				continue
			}
			//console.log('finished waiting')
			//console.log('len: '+len)
			//console.log('val: '+ val)
			//await sleep(Math.max(0, val - (performance.now() - adjustment) ))
			
			//alert(note)
		}
		//console.log('finished mesure')
		
		await sleep(Math.max(0,mesurelen-(performance.now()-leftover)))
		
		
	}
	
}


x = 0
//key = Math.floor(Math.random()*7.99999999999)
key = 0
//console.log(key)
/*
mesure = 0
while (mesure<20) {
	mesure++
	play_phrase(key,1600)
}
*/


establish_note_rules(key)

var mes_count = 0
tempo = 400
waiter = performance.now()
function startInterval() {
	setTimeout(async () => {
		waiter=performance.now()
		if (mes_count > 3) {
			mes_count = 0
		}
		
		await play_phrase(key,tempo,mes_count===0);
		mes_count++
		startInterval();
	}, Math.max(0,tempo-(performance.now()-waiter)));
}
startInterval();
/*
test = 0
while (test<12) {
	progression = chord_progression(test,true)
	for (n in progression) {
		//console.log(progression[n][0])
	}
	test++
}
*/
