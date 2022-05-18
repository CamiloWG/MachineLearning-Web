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
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 600;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size; 
    canvas.height = size;
    ctx = canvas.getContext("2d");
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);
    for (let i = 0; i < maxPredictions; i++) {
        let predictionAmount = prediction[i].probability.toFixed(2) * 100;
        switch (prediction[i].className) {
            case "Pose 1 ":
                firstBar.style.width = `${predictionAmount}%`;
                break;
            
            case "Pose 2 ":
                secondBar.style.width = `${predictionAmount}%`;
                break;
            
            case "Pose 3":
                thirdBar.style.width = `${predictionAmount}%`;
                break;
            
            case "Pose 4":
                fourthBar.style.width = `${predictionAmount}%`;
                break;
            
            case "Pose 5 ":
                lastBar.style.width = `${predictionAmount}%`;
                break;
            
        }
        console.log(prediction[i].className + ": " + prediction[i].probability.toFixed(2) * 100);
        console.log("Another Run: " + i);
        drawPose(pose);
        //labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

init()