# TensorFlow.js Examples

## XOR vanilla neural network

## Doodle Classifier
This repo is experimental and in progress. It is an "MNIST"-style classification example using the [Google QuickDraw dataset](https://quickdraw.withgoogle.com/data), [p5js](https://p5js.org/), and [tensorflow.js](https://js.tensorflow.org). It is loosely based on the [tfjs MNIST example](https://github.com/tensorflow/tfjs-examples/tree/master/mnist).

### Reference
* [JS Doodle Classifier video tutorials](https://www.youtube.com/watch?v=pqY_Tn2SIVA&list=PLRqwX-V7Uu6Zs14zKVuTuit6jApJgoYZQ)
* [ml4a ofx Doodle Classifier](https://ml4a.github.io/guides/DoodleClassifier/)

### RoadMap
* [ ] Simplify model removing convolutional layers. The idea is for this to be a dropdead simple example that I can use to explain tensorflow.js and the layers API. I'd like to cover convolutional neural networks as a secondary example.
* [ ] Incorporate testing data. At the moment [no any validation / testing data](https://github.com/shiffman/Tensorflow-JS-Doodle-Classifier/blob/master/classifier.js#L53) is included during training. For clarity of the example I might like to run the testing as a separate function. What do the results mean me if I give it `null` data?
* [ ] Guess user drawings in real-time.
* [ ] Train with a much larger dataset.
* [ ] Save model using local storage or to JSON file.
* [ ] Bring the idea of a higher level `Classifier` class that wraps keras layers into [ml5](https://ml5js.github.io/).

### Neuro-Evolution
* [Flappy Bird Demo: Learning](https://shiffman.github.io/Tensorflow-JS-Examples/04_neuro_evolution_flappy/) 
* [Flappy Bird Demo: Loading Saved Model](https://shiffman.github.io/Tensorflow-JS-Examples/04_neuro_load_flappy/) 
* [Steering Ecosystem Simulation Demo](https://shiffman.github.io/Tensorflow-JS-Examples/04_neuro_evolution_steering/) 