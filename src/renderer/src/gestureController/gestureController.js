import { KalmanFilter } from "kalman-filter";
import { id } from "../../../utils/utils.js";

// const [formData, setFormData] = useState({
  //         gestureName: "",
  //         command: "",
  //         limit: 0.5,
  //         handness: 0,
  //         scale: 0,
  //         pulgar: 4,
  //         indice: 8,
  //         medio: 12,
  //         anular: 16,
  //         menique: 20,
  //         landmarks: []
  //     });
//main loop
// const customBucle = (
//   handLandmarkerRef,
//   videoRef,
//   bufferSize,
//   animationFrameRef,
//   hugger,
//   customGestures
// ) =>{
//   const startTimeMs = performance.now();
    
//     if (lastVideoTime !== videoRef.current.currentTime) {
//       lastVideoTime = videoRef.current.currentTime;
//       const newResults = handLandmarkerRef.current.detectForVideo(
//         videoRef.current,
//         startTimeMs
//       );
//     if(newResults.landmarks.length == 0) {
//       return;
//     }
//     //actualizat los hlm
//     //proceso en el que obtenemos el gesto que esta realizando el usuario
//     //
//     let found = "";
//     let keys = Object.keys(customGestures);
    
//     let i = 0;
//     while(i < keys.length){
//       //encontramos un gesto que se parezca al gesto actual, si es que se puede
//       let currentGesture = customGestures[keys[i]];
//       if(newResults.handLandmarkerRef[0].handedness == 1){
//         i++;
//         break;
//       }
//       //encontramos indice de parecido
//       //podemos descriibir el estado de mano como: izquierda o derecha, limit, [puntos de referencia], anchor
//       let origin = newResults.landmarks[0];
//       let scale = DistBetweenPoints(newResults.landmarks[4], origin);
//       scale = currentGesture.scale / scale;
//       let thumbx = (newResults.landmarks[currentGesture.fingerIndex[0]].x - origin.x) * scale;
//       let thumby = (newResults.landmarks[currentGesture.fingerIndex[0]].y - origin.y) * scale;
//       //high perturbation 1.2
//       let perturbation = (thumbx - currentGesture.fingerLengthx[0]);
//       perturbation += (thumby - currentGesture.fingerLengthy[0]);
//       perturbation *= 1.2;
//       let indexx = (newResults.landmarks[currentGesture.fingerIndex[1]].x - origin.x) * scale;
//       let indexy = (newResults.landmarks[currentGesture.fingerIndex[1]].y - origin.y) * scale;
//       perturbation += (indexx - currentGesture.fingerLengthx[1]);
//       perturbation += (indexy - currentGesture.fingerLengthy[1]);
//       let middlex = (newResults.landmarks[currentGesture.fingerIndex[2]].x - origin.x) * scale;
//       let middley = (newResults.landmarks[currentGesture.fingerIndex[2]].y - origin.y) * scale;
//       perturbation += (middlex - currentGesture.fingerLengthx[2]);
//       perturbation += (middley - currentGesture.fingerLengthy[2]);
//       //low perturbation *0.8
//       let ringx = (newResults.landmarks[currentGesture.fingerIndex[3]].x - origin.x) * scale;
//       let ringy = (newResults.landmarks[currentGesture.fingerIndex[3]].y - origin.y) * scale;
//       let perturbationW = (ringx - currentGesture.fingerLengthx[2]);
//       perturbationW += (ringy - currentGesture.fingerLengthy[2]);
//       perturbationW *= 0.8;
//       perturbation += perturbationW;
//       let pinkiex = (newResults.landmarks[currentGesture.fingerIndex[4]].x - origin.x) * scale;
//       let pinkiey = (newResults.landmarks[currentGesture.fingerIndex[4]].y - origin.y) * scale;
//       perturbation += (pinkiex - currentGesture.fingerLengthx[2]);
//       perturbation += (pinkiey - currentGesture.fingerLengthy[2]);
//       if(perturbation <= currentGesture.limit){
//         found = currentGesture.gestureName;
//         break;
//       }
//       i++;
//     }
//     if(!(found === hugger)){
//       window.api.executeInVm(customGestures[found].command);//found es el nombre de la funcion
//       hugger = found;
//     }
//     animationFrameRef.current = requestAnimationFrame(customBucle(handLandmarkerRef,
//       videoRef,
//       bufferSize,
//       animationFrameRef,
//       hugger,

//     ));
//   }
// }

const handleGesturePrediction = (
  handLandmarkerRef,
  videoRef,
  bufferSize,
  animationFrameRef,
  customMode
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
    //console.log("Modo Custom engaged")
    let customGestures;
    let hugger = "";
    const customPrediction = async () =>{
      customGestures = await window.api.loadCustom();
      console.log(customGestures);
      customBucle();
    }
    
    const customBucle = async () =>{
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
          
          //actualizat los hlm
          //proceso en el que obtenemos el gesto que esta realizando el usuario
          //
          let found = "";
          let keys = Object.keys(customGestures);
          console.log(customGestures);
          console.log(keys);
          let i = 0;
          while(i < keys.length){
            //encontramos un gesto que se parezca al gesto actual, si es que se puede
            let currentGesture = customGestures[keys[i]];
            console.log("Empezando rutina para enconrtar el gesto que se parezca al actual")
            console.log(currentGesture);
            if( (newResults.handedness[0][0] == currentGesture.handedness)){
              i++;
              console.log("mano equivocada");
              continue;
            }
            //encontramos indice de parecido
            //podemos descriibir el estado de mano como: izquierda o derecha, limit, [puntos de referencia], anchor
            
            let origin = newResults.landmarks[0][0];
            let scale = DistBetweenPoints(newResults.landmarks[0][4], origin);
            
            scale = currentGesture.scale / scale;
            let thumbx = (newResults.landmarks[0][currentGesture.pulgar].x - origin.x) * scale;
            let thumby = (newResults.landmarks[0][currentGesture.pulgar].y - origin.y) * scale;
            //high perturbation 1.2
            let perturbation = Math.abs(thumbx - currentGesture.fingerLengthx[0]);
            perturbation += Math.abs(thumby - currentGesture.fingerLengthy[0]);
            perturbation *= 1.2;
            let indexx = (newResults.landmarks[0][currentGesture.indice].x - origin.x) * scale;
            let indexy = (newResults.landmarks[0][currentGesture.indice].y - origin.y) * scale;
            perturbation += Math.abs(indexx - currentGesture.fingerLengthx[1]);
            perturbation += Math.abs(indexy - currentGesture.fingerLengthy[1]);
            let middlex = (newResults.landmarks[0][currentGesture.medio].x - origin.x) * scale;
            let middley = (newResults.landmarks[0][currentGesture.medio].y - origin.y) * scale;
            perturbation += Math.abs(middlex - currentGesture.fingerLengthx[2]);
            perturbation += Math.abs(middley - currentGesture.fingerLengthy[2]);
            //low perturbation *0.8
            let ringx = (newResults.landmarks[0][currentGesture.anular].x - origin.x) * scale;
            let ringy = (newResults.landmarks[0][currentGesture.anular].y - origin.y) * scale;
            let perturbationW = Math.abs(ringx - currentGesture.fingerLengthx[3]);
            perturbationW += Math.abs(ringy - currentGesture.fingerLengthy[3]);
            perturbationW *= 0.8;
            perturbation += perturbationW;
            let pinkiex = (newResults.landmarks[0][currentGesture.menique].x - origin.x) * scale;
            let pinkiey = (newResults.landmarks[0][currentGesture.menique].y - origin.y) * scale;
            perturbation += Math.abs(pinkiex - currentGesture.fingerLengthx[4]);
            perturbation += Math.abs(pinkiey - currentGesture.fingerLengthy[4]);
            if(perturbation <= currentGesture.limit && !(currentGesture.gestureName === hugger)){
              found = currentGesture.gestureName;
              hugger = currentGesture.gestureName;
              //found = currentGesture.gestureName;
              console.log("ENCONTRADO ", found);
              window.api.executeInVm(customGestures[found].command);//found es el nombre de la funcion
              break;
            }
            i++;
          }
          // if(!(found === hugger)){
          //   window.api.executeInVm(customGestures[found].command);//found es el nombre de la funcion
          //   hugger = found;
          // }
        }
      }
      animationFrameRef.current = requestAnimationFrame(customBucle);
    };
    
    customPrediction()
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


//  d
//  u
//cit
