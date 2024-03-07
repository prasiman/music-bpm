## Description

Typescript library for finding out tempo (BPM) of a song and beat tracking. It uses an algorithm ["Beatroot"](http://www.eecs.qmul.ac.uk/~simond/pub/2001/jnmr.pdf) authored by [Simon Dixon](http://www.eecs.qmul.ac.uk/~simond/)

## Instalation

Using npm:

```sh
npm i music-bpm
```

In a browser

```html
<script src="music-bpm.min.js"></script>
```

## Usage

Pass to the constructor MusicTempo the buffer that contains data in the following format: non-interleaved IEEE754 32-bit linear PCM with a nominal range between -1 and +1, that is, 32bits floating point buffer, with each samples between -1.0 and 1.0. This format is used in the [AudioBuffer](https://developer.mozilla.org/en/docs/Web/API/AudioBuffer) interface of [Web Audio API](https://developer.mozilla.org/en/docs/Web/API/Web_Audio_API). The object returned by the constructor contain properties `tempo` - tempo value in beats per minute and `beats` - array with beat times in seconds.

### React.js

```javascript
import { useState, useRef, useEffect } from "react";
import { extractTempo } from "music-bpm";

const context = new AudioContext({ sampleRate: 44100 });
const GetBPM = () => {
  const ref = useRef(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const calcTempo = function (buffer) {
      let audioData = [];
      // Take the average of the two channels
      if (buffer.numberOfChannels == 2) {
        const channel1Data = buffer.getChannelData(0);
        const channel2Data = buffer.getChannelData(1);
        const length = channel1Data.length;
        for (let i = 0; i < length; i++) {
          audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
        }
      } else {
        audioData = buffer.getChannelData(0);
      }
      const musicTempo = extractTempo(audioData);

      setResult(musicTempo);
    };

    ref.current.onchange = function () {
      const files = ref.current.files;

      if (files.length == 0) return;

      const reader = new FileReader();

      reader.onload = function (fileEvent) {
        context.decodeAudioData(fileEvent.target.result, calcTempo);
      };

      reader.readAsArrayBuffer(files[0]);
    };
  }, []);

  return <input ref={ref} type="file" accept="audio/*" />;
};
```

### Node.js

In Node.js environment can be used [node-web-audio-api library](https://github.com/sebpiq/node-web-audio-api)

```javascript
const AudioContext = require("web-audio-api").AudioContext;
const MusicTempo = require("music-bpm");
const fs = require("fs");

const calcTempo = function (buffer) {
  let audioData = [];
  // Take the average of the two channels
  if (buffer.numberOfChannels == 2) {
    const channel1Data = buffer.getChannelData(0);
    const channel2Data = buffer.getChannelData(1);
    const length = channel1Data.length;
    for (let i = 0; i < length; i++) {
      audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
    }
  } else {
    audioData = buffer.getChannelData(0);
  }
  const mt = extractTempo(audioData);

  console.log(mt.tempo);
  console.log(mt.beats);
};

const data = fs.readFileSync("songname.mp3");

const context = new AudioContext();
context.decodeAudioData(data, calcTempo);
```

## Optional parameters

You can pass object with parameters as second argument to the constructor:

```javascript
const result = extractTempo(audioData, {
  expiryTime: 30,
  maxBeatInterval: 1.5,
});
```

Most useful are `maxBeatInterval`/`minBeatInterval` and `expiryTime`. First two used for setting up maximum and minimum BPM. Default value for `maxBeatInterval` is 1 which means that minimum BPM is 60 (60 / 1 = 60). Default value for `minBeatInterval` is 0.3 which means that maximum BPM is 200 (60 / 0.3 = 200). Be careful, the more value of maximum BPM, the more probability of 2x-BPM errors (e.g. if max BPM = 210 and real tempo of a song 102 BPM, in the end you can get 204 BPM).
`expiryTime` can be used if audio file have periods of silence or almost silence and because of that beat tracking is failing.

## Other

### Dependencies

dependencies can be found on the `package.json` file and they can be installed using `npm install` or your favorite package manager.

### Tests

```shell
npm test
```

### Build

```shell
npm run build
```

## License

[MIT License](LICENSE)
