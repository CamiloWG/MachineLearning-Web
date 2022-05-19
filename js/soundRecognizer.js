// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel

const DoBar = document.getElementById("DO");
const ReBar = document.getElementById("RE");
const MiBar = document.getElementById("MI");
const FaBar = document.getElementById("FA");
const SolBar = document.getElementById("SOL");
const LaBar = document.getElementById("LA");
const SiBar = document.getElementById("SI");
const NoiseBar = document.getElementById("Noise");


const button = document.getElementById("btnStart");

const URL = "https://camilowg.github.io/MachineLearning-Web/model/sound/";

async function createModel() {
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

button.addEventListener("click", () => {
    init();
});

async function init() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    // const labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < classLabels.length; i++) {
    //     labelContainer.appendChild(document.createElement("div"));
    // }

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        for (let i = 0; i < classLabels.length; i++) {
            let predictionAmount = result.scores[i].toFixed(2) * 100;
            switch (classLabels[i]) {
                case "DO":
                    DoBar.style.width = `${predictionAmount}%`;
                    break;
                
                case "RE":
                    ReBar.style.width = `${predictionAmount}%`;
                    break;
                
                case "MI":
                    MiBar.style.width = `${predictionAmount}%`;
                    break;
                
                case "FA":
                    FaBar.style.width = `${predictionAmount}%`;
                    break;
                
                case "SOL":
                    SolBar.style.width = `${predictionAmount}%`;
                    break;
                
                case "LA":
                    LaBar.style.width = `${predictionAmount}%`;
                    break;
                
                case "SI":
                    SiBar.style.width = `${predictionAmount}%`;
                    break;
                
                case "Ruido de fondo":
                    NoiseBar.style.width = `${predictionAmount}%`;
                    break;
                
            }
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);
}