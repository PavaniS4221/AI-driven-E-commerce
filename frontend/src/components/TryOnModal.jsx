import React, { useEffect, useRef } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

const TryOnModal = ({ productImage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const clothImgRef = useRef(new Image());

  /* ================= BACKGROUND REMOVAL ================= */
  const removeBackground = async (imageUrl) => {
    const blob = await fetch(imageUrl).then((res) => res.blob());

    const formData = new FormData();
    formData.append("image", blob);

    const res = await fetch("http://localhost:5000/remove-bg", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return `data:image/png;base64,${data.image}`;
  };

  /* ================= INIT ================= */
  useEffect(() => {
    let camera;

    const init = async () => {
     
      const transparentImg = await removeBackground(productImage);
      clothImgRef.current.src = transparentImg;

      const pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(onResults);

      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480
      });

      camera.start();
    };

    init();

    return () => {
      if (camera) camera.stop();
    };
  }, [productImage]);

  /* ================= DRAW ================= */
  const onResults = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw webcam
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (!results.poseLandmarks) return;

    // 🔹 Shoulder landmarks
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];

    if (!leftShoulder || !rightShoulder) return;

    const shoulderWidth =
      Math.abs(rightShoulder.x - leftShoulder.x) * canvas.width;

    // 🔹 Auto scaling
    const clothWidth = shoulderWidth * 1.5;
    const clothHeight = clothWidth * 1.3;

    const centerX =
      ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
    const centerY =
      ((leftShoulder.y + rightShoulder.y) / 2) * canvas.height;

    ctx.drawImage(
      clothImgRef.current,
      centerX - clothWidth / 2,
      centerY - clothHeight / 4,
      clothWidth,
      clothHeight
    );
  };

  /* ================= UI ================= */
  return (
    <div className="flex justify-center gap-6">
      {/* Hidden video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none" }}
      />

      {/* Output canvas */}
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default TryOnModal;
