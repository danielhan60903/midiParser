const { detect } = require('@tonaljs/chord-detect')
const { Pcset, Tonal } = require('@tonaljs/tonal')
const MidiConvert = require('midiconvert')
const { Progression } = require('@tonaljs/tonal')
//const { Midi, Key, Scale } = require('@tonaljs/tonal')
const { Midi, Key, Scale } = require('@tonaljs/tonal')

//sample data for testing
var key = 'C'
var mode = 'Major'
var genre = 'Rock'

/*
let fs = require('fs')
function readMidi(fileName) {
  fs.readFile(fileName, 'binary', function (err, midiBlob) {
    if (!err) {
      let midi = MidiConvert.parse(midiBlob)
      let notes = getFirstChannel(midi.tracks)
      let bpm = midi.header.bpm
      let timeSignature = midi.header.timeSignature
      let meausureDuration = (240 / bpm) * (timeSignature[0] / timeSignature[1])
      let bars = parseBars(notes, meausureDuration)
      let notesInBar = noteDictionary(bars)
      console.log(meausureDuration)
      //console.log(numberToNoteNames(notes))

      return midiInfo
    } else {
      console.log('error')
    }
  })
}
*/
// returns array of notes in given key
function notesInKey(key) {
  return Scale.get(key).notes
}

// given array of note objects, return array of corresponding note names based on midi numbers
function numberToNoteNames(noteArray) {
  const notes = []
  for (var i = 0; i < noteArray.length; i++) {
    const noteName = Midi.midiToNoteName(noteArray[i].midi)
    notes.push(noteName)
  }
  //console.log(notes)
  //console.log(detect(notes))
  return notes
}

// creates a dictionary of barDuration number corresponding to note names in that barDuration
function noteDictionary(bars) {
  let dict = new Object()
  for (const [key, value] of Object.entries(bars)) {
    dict[key] = numberToNoteNames(value)
    //console.log(key, dict[key])
  }
  return dict
}

// given array of note objects, and duration, note objects are put into a dictionary, with barDuration number as key
function parseBars(noteArray, duration) {
  let dict =[]
  let barDuration = duration
  let bar = 0
  let currBar = []

  for (var i = 0; i < noteArray.length; i++) {
    if (noteArray[i].time < barDuration && !withinRange(noteArray[i].time,barDuration,.0001)) {
      currBar.push(noteArray[i])
      if (noteArray[i].time + noteArray[i].duration > barDuration) {
        dict[bar] = currBar
        currBar = []
        bar++
        currBar.push(noteArray[i])
        barDuration += duration
      }
    } else {
      dict[bar] = currBar
      currBar = []
      bar++
      currBar.push(noteArray[i])
      barDuration += duration
    }
  }
  dict[bar] = currBar

  return dict
}

// returns array of chords in the key
function getChords(key, mode) {
  if (mode.toLowerCase() == 'major') {
    let chords = Key.majorKey(key).chords
    //console.log('major', chords)
    return chords
  }
  //minor function not working
  if (mode.toLowerCase() == 'minor') {
    let minorChords = Key.minorKey('C').chords
    //console.log('minor', minorChords)
    return minorChords
  }
}

//returns first channel with midi information
function getFirstChannel(tracks) {
  for (var i = 0; i < tracks.length; i++) {
    if (tracks[i].notes.length != 0) {
      return tracks[i].notes
    }
  }
}

function beatHelper(meausureDuration, noteDuration) {
  let beatArray = [1, 2, 3, 4, 8, 16, 32, 64]
  let closestBeat = findClosest(meausureDuration / noteDuration, beatArray)

  switch (closestBeat) {
    case 1:
      return '1n'
    case 2:
      return '2n'
    case 3:
      return '3n'
    case 4:
      return '4n'
    case 8:
      return '8n'
    case 16:
      return '16n'
    case 32:
      return '32n'
    case 64:
      return '64n'
  }
}

function nearest16th(measureDuration, startTime) {
  let timeStamps = getTimeStamps(measureDuration)

  let index = timeStamps.indexOf(findClosest(startTime, timeStamps))
  console.log(startTime, index, findClosest(startTime, timeStamps))

  return index
}

function getTimeStamps(measureDuration) {
  let sixteenthNote = measureDuration / 16
  let timeStamps = [0]
  for (var i = 1; i < 17; i++) {
    timeStamps.push(sixteenthNote * i)
  }
  return timeStamps
}

function getNoteData(duration, bars) {
  let noteData = []

  for (var i = 0; i < bars.length; i++) {
    for (var j = 0; j < bars[i].length; j++) {
      let sixteenth = nearest16th(duration, bars[i][j].time % duration)
      let quarter = Math.floor(sixteenth / 4) % 4
      let remainder = sixteenth % 4

      let timeString = '' + i + ':' + quarter + ':' + remainder
      noteData.push([
        timeString,
        bars[i][j].midi,
        beatHelper(duration, bars[i][j].duration),
      ])
    }
  }
  return noteData
}

function findClosest(target, array) {
  return array.reduce((a, b) => {
    let aDiff = Math.abs(a - target)
    let bDiff = Math.abs(b - target)

    if (aDiff == bDiff) {
      return a > b ? a : b
    } else {
      return bDiff < aDiff ? b : a
    }
  })
}

function withinRange(input1, input2, deviation) {
  return Math.abs(input1 - input2) <= deviation
}

//const file = fs.createReadStream('midiparser-backend/Chords.csv')
/*
var csvData = []
Papa.parse(file, {
  header: true,
  step: function (result) {
    csvData.push(result.data)
  },
  complete: function (results, file) {
    console.log('Complete', csvData.length, 'records.')
    for (var i = 0; i < csvData.length; i++) {
      let chords = csvData[i].chords.split(',')
      let tonality = csvData[i].tonality
      if (tonality != '') {
        //console.log(tonality, chords)
        console.log(tonality, Progression.toRomanNumerals(tonality, chords))
      }
    }
  },
})

getChords(key, mode)
//console.log(readMidi('testmid.mid'))

console.log(Progression.toRomanNumerals('D', ['D']))
*/
export {
  parseBars,
  getFirstChannel,
  getNoteData
}