
const webcam = document.getElementById("video_frame")

const constraints = {
    audio: false,
    video: {
        width: 640, height: 350
    }
};


async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

// En caso de que el acceso sea correcto, cargamos la webcam
async function handleSuccess(stream) {
    window.stream = stream;
    webcam.srcObject = stream;
}

init()