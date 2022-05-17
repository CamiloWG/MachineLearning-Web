// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel


const firstBar = document.getElementById("firstBar");
const secondBar = document.getElementById("secondBar");
const thirdBar = document.getElementById("thirdBar");
const fourthBar = document.getElementById("fourthBar");
const lastBar = document.getElementById("lastBar");


const URL = "./model/poses/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(720, 380, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    // labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < maxPredictions; i++) { // and class labels
    //     labelContainer.appendChild(document.createElement("div"));
    // }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        let predictionAmount = prediction[i].probability.toFixed(2) * 100;
        switch (prediction[i].className) {
            case "Valuwu":
                BarValu.style.width = `${predictionAmount}%`;
                break;
            
            case "Palis":
                BarPaula.style.width = `${predictionAmount}%`;
                break;
            
            case "Lauwu":
                BarLaura.style.width = `${predictionAmount}%`;
                break;
            
            case "Nicopro":
                BarNicolas.style.width = `${predictionAmount}%`;
                break;
            
            case "Camilin":
                BarCamilo.style.width = `${predictionAmount}%`;
                break;
            
        }
        console.log(prediction[i].className + ": " + prediction[i].probability.toFixed(2) * 100);
        console.log("Another Run: " + i);
        sleep(500)
        //labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
init()