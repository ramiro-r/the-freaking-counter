import { createApp } from 'https://unpkg.com/petite-vue?module'

const WORDS = [ 'fuck', 'dog' ];
// const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + WORDS.join(' | ') + ' ;'
const SpeechRecognitionAPI = window.SpeechRecognition || webkitSpeechRecognition;
// const SpeechGrammarListAPI = window.SpeechGrammarList || webkitSpeechGrammarList;
// const SpeechRecognitionEventAPI = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

function Counter(props) {
  return {
    recognition: null,
    speechRecognitionList: null,
    count: props.initialCount,
    isListening: false,
    incrementCounter() {
      this.count++
    },
    mounted() { 
      this.recognition = new SpeechRecognitionAPI();
      // this.speechRecognitionList = new SpeechGrammarListAPI();
      // this.speechRecognitionList.addFromString(grammar, 1);
      // this.recognition.grammars = this.speechRecognitionList;
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 5;

      this.recognition.onresult = this.handleVoiceResults;
      this.recognition.onerror = this.handleVoiceError;
      this.recognition.onnomatch = this.handleNoMatch;
    },
    toggleListening() {
      if (this.isListening) {
        this.stopListening();
        return;
      }

      this.startListening();
    },
    startListening() {
      this.count = 0;
      this.isListening = true;
      this.recognition.start();
    },
    stopListening() {
      this.isListening = false;
      this.recognition.stop();
    },
    handleVoiceResults(event) {
      const badWord = event.results[0][0].transcript;
      console.log('Result received: ' + badWord + '.');
      if (WORDS.includes(badWord)) {
        this.incrementCounter();
      }
      console.log('Confidence: ' + event.results[0][0].confidence);
    },
    handleVoiceError(event) {
      console.log('Error occurred in recognition: ' + event.error);
    },
    handleNoMatch() {
      console.log('You didnt curse');
    }
  }
}

createApp({
  Counter,
}).mount()