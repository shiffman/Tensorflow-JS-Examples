# tensorflow.js Doodle Classifer example

This repo is experimental and in progress. It is an "MNIST"-style classification example using the [Google QuickDraw dataset](https://quickdraw.withgoogle.com/data), [p5js](https://p5js.org/), and [tensorflow.js](https://js.tensorflow.org). It is loosely based on the [tfjs MNIST example](https://github.com/tensorflow/tfjs-examples/tree/master/mnist).

## RoadMap

* [ ] Simplify model removing convolutional layers. The idea is for this to be a dropdead simple example that I can use to explain tensorflow.js. I'd like to cover convolutional neural networks as a secondary example.
* [ ] Incorporate testing data. At the moment [no any validation / testing data](https://github.com/shiffman/Tensorflow-JS-Doodle-Classifier/blob/master/classifier.js#L53) is included during training. For clarity of the example I might like to run the testing as a separate function. What do the results mean me if I give it `null` data?
* [ ] Guess user drawings in real-time.
* [ ] Train with a much larger dataset.
* [ ] Save model using local storage or to JSON file.
* [ ] Bring the idea of a higher level `Classifier` class that wraps keras layers into [ml5](https://ml5js.github.io/).

