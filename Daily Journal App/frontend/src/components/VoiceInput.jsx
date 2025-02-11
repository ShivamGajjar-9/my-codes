import { useState } from "react";

const VoiceInput = ({ setContent }) => {
  const [isListening, setIsListening] = useState(false);
  const recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
      ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  }

  const handleStartListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <div className="flex items-center space-x-4 mt-4">
      <button
        onClick={isListening ? handleStopListening : handleStartListening}
        className={`p-2 rounded-full text-white ${
          isListening ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
    </div>
  );
};

export default VoiceInput;


