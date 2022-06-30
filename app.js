import { createApp } from 'https://unpkg.com/petite-vue?module'

const WORDS = [ 'fuck', 'f***', 'shit', 'pussy', 'cunt', 'dick', 'asshole', 'fucker', 'f*****', 'motherfucker' ];
const SpeechRecognitionAPI = window.SpeechRecognition || webkitSpeechRecognition;
// const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + WORDS.join(' | ') + ' ;'
// const SpeechGrammarListAPI = window.SpeechGrammarList || webkitSpeechGrammarList;
// const SpeechRecognitionEventAPI = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

function Counter(props) {
  return {
    recognition: null,
    speechRecognitionList: null,
    count: props.initialCount,
    isListening: false,
    startMessage: 'I\'m ready to curse',
    stopMessage: 'Stop cursing',
    lastResult: '',
    incrementCounter() {
      this.count++
    },
    mounted() { 
      this.recognition = new SpeechRecognitionAPI();
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
      const phraseResult = event.results[0][0].transcript;
      console.log('Last Result WIthout replace: ' + this.lastResult)
      console.log('Result received: ' + phraseResult);
      if (this.lastResult && phraseResult.trim().includes(this.lastResult)) {
        this.lastResult = phraseResult.replace(this.lastResult, '');
        console.log('Last Result WITH replace: ' + this.lastResult)
      } else {
        this.lastResult = phraseResult
      }
      if (WORDS.some(w => this.lastResult.includes(w))) {
        this.incrementCounter();
      }
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