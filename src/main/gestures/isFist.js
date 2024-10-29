export function isFist(landmarks) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];

  const isClose = (p1, p2) => {
    const dist = Math.sqrt(
      Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2)
    );
    return dist < 0.05;
  };

  return isClose(thumbTip, indexTip) && isClose(thumbTip, middleTip);
}