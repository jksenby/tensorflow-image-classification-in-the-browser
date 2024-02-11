let model = null;

async function load() {
  model = await tf.loadLayersModel("model.json");
  console.log("Model successfully loaded:", model);
}
load();

async function predict() {
  if (!model) {
    console.error("Model is not loaded yet.");
    return;
  }

  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files[0]) {
    console.error("No file selected.");
    return;
  }

  const image = new Image();

  image.src = URL.createObjectURL(fileInput.files[0]);

  image.onload = async () => {
    const tensor = tf.browser
      .fromPixels(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()
      .div(255.0);

    const predictions = await model.predict(tensor).data();
    console.log(predictions);
    document.querySelector("#predictList").innerHTML += /*html*/ `
      <li style="display: flex; border: 2px solid;">
        <img src="${image.src}" alt="file" style="height: 150px; width: 75px">
        <div>
          <h3>Predictions:</h3>
          <p>Baiterek: ${+predictions[0] * 100}%</p>
          <p>Chair: ${+predictions[1] * 100}%</p>
          <p>Table: ${+predictions[2] * 100}%</p>
        </div>
      </li>
    `;

    tensor.dispose();
  };
}

document.querySelector("#Predict").addEventListener("click", () => {
  predict();
});
