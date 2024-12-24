import { KalmanFilter } from "kalman-filter";
import { id } from "../../../utils/utils.js";


//main loop

const handleGesturePrediction = (
  handLandmarkerRef,
  videoRef,
  bufferSize,
  animationFrameRef,
  hugger,
  customMode,
  availableGestures
) => {
  let lastVideoTime = -1;
  let mapping;
  let previousCorrectedX = null;
  let previousCorrectedY = null;

  if(!customMode){
    const kalmanX = new KalmanFilter({
      observation: 1,
      dynamic: {
        name: "constant-speed"
      }
    });

    const kalmanY = new KalmanFilter({
      observation: 1,
      dynamic: {
        name: "constant-speed"
      }
    });

    const predictWebcam = async () => {
      if (
        !handLandmarkerRef.current ||
        !videoRef.current ||
        videoRef.current.readyState !== 4
      ) {
        console.log("Error of handLandmarker or videoRef.");
        return;
      }

      const startTimeMs = performance.now();

      if (lastVideoTime !== videoRef.current.currentTime) {
        lastVideoTime = videoRef.current.currentTime;
        const newResults = await handLandmarkerRef.current.detectForVideo(
          videoRef.current,
          startTimeMs
        );

        if (newResults.landmarks.length > 0) {
          const indexTip = newResults.landmarks[0][id.INDEX_FINGER_TIP];

          const predictedX = kalmanX.predict({
            previousCorrected: previousCorrectedX
          });
          const correctedX = kalmanX.correct({
            predicted: predictedX,
            observation: [indexTip.x]
          });

          const predictedY = kalmanY.predict({
            previousCorrected: previousCorrectedY
          });
          const correctedY = kalmanY.correct({
            predicted: predictedY,
            observation: [indexTip.y]
          });

          previousCorrectedX = correctedX;
          previousCorrectedY = correctedY;

          const smoothed = {
            x: correctedX.mean[0],
            y: correctedY.mean[0]
          };

          await window.api.moveMouse(newResults.handedness, smoothed);

          if (newResults.landmarks.length > 1) {
            await Promise.all(
              Array.from(mapping.entries()).map(async ([gesture, control]) => {
                await window.api[control](gesture, newResults.landmarks[1]);
              })
            );
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(predictWebcam);
    };

    const initializePrediction = async () => {
      mapping = await window.api.loadMappings();
      console.log(mapping);
      predictWebcam();
    };

    initializePrediction();
  }
  else{
    const startTimeMs = performance.now();
    
    if (lastVideoTime !== videoRef.current.currentTime) {
      lastVideoTime = videoRef.current.currentTime;
      const newResults = handLandmarkerRef.current.detectForVideo(
        videoRef.current,
        startTimeMs
      );
    }
    //actualizat los hlm
    //proceso en el que obtenemos el gesto que esta realizando el usuario
    //
    let found = "";
    let i = 0;
    while(i < availableGestures.length){
      //encontramos un gesto que se parezca al gesto actual, si es que se puede
      if(newResults.handLandmarkerRef[0].handedness == 1){
        break;
      }
      //encontramos indice de parecido
      let currentGesture = availableGestures[i];
      //podemos descriibir el estado de mano como: izquierda o derecha, limit, [puntos de referencia], anchor
      let origin = newResults.landmarks[0];
      let scale = DistBetweenPoints(newResults.landmarks[4], origin);
      scale = currentGesture.scale / scale;
      let thumbx = (newResults.landmarks[currentGesture.fingerIndex[0]].x - origin.x) * scale;
      let thumby = (newResults.landmarks[currentGesture.fingerIndex[0]].y - origin.y) * scale;
      //high perturbation 1.2
      let perturbation = (thumbx - currentGesture.fingerLengthx[0]);
      perturbation += (thumby - currentGesture.fingerLengthy[0]);
      perturbation *= 1.2;
      let indexx = (newResults.landmarks[currentGesture.fingerIndex[1]].x - origin.x) * scale;
      let indexy = (newResults.landmarks[currentGesture.fingerIndex[1]].y - origin.y) * scale;
      perturbation += (indexx - currentGesture.fingerLengthx[1]);
      perturbation += (indexy - currentGesture.fingerLengthy[1]);
      let middlex = (newResults.landmarks[currentGesture.fingerIndex[2]].x - origin.x) * scale;
      let middley = (newResults.landmarks[currentGesture.fingerIndex[2]].y - origin.y) * scale;
      perturbation += (middlex - currentGesture.fingerLengthx[2]);
      perturbation += (middley - currentGesture.fingerLengthy[2]);
      //low perturbation *0.8
      let ringx = (newResults.landmarks[currentGesture.fingerIndex[3]].x - origin.x) * scale;
      let ringy = (newResults.landmarks[currentGesture.fingerIndex[3]].y - origin.y) * scale;

      let perturbationW = (ringx - currentGesture.fingerLengthx[2]);
      perturbationW += (ringy - currentGesture.fingerLengthy[2]);
      perturbationW *= 0.8;
      perturbation += perturbationW;
      let pinkiex = (newResults.landmarks[currentGesture.fingerIndex[4]].x - origin.x) * scale;
      let pinkiey = (newResults.landmarks[currentGesture.fingerIndex[4]].y - origin.y) * scale;
      perturbation += (pinkiex - currentGesture.fingerLengthx[2]);
      perturbation += (pinkiey - currentGesture.fingerLengthy[2]);
      if(perturbation <= currentGesture.limit){
        found = currentGesture.name;
        break;
      }
      i++;
    }
    if(!(found === hugger)){
      window.api.executeInVm(availableGestures[i].comando);//found es el nombre de la funcion
    }
  }
};
function DistBetweenPoints(a, b){
  let ax = a.x;
  let ay = a.y;
  let bx = b.x;
  let by = b.y;
  a = ax - bx;
  b = ay - by;
  return Math.sqrt(a*a + b*b);
}

export default handleGesturePrediction;
