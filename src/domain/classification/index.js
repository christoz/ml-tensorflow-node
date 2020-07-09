/* eslint-disable class-methods-use-this */
import {promises as fs, readdirSync, statSync} from 'fs';
import * as tf from '@tensorflow/tfjs-node';
import glob from 'glob';
import path from 'path';

import loadPretrainedModel from './loadPretrainedModel';
import create3dTensor from './create3dTensor';
import * as label from './labels';
import getModel from './getModel';

class Classifier {
  constructor(subject) {
    this.SUBJECT = subject;
  }

  setTrainingData() {
    this.images = glob.sync(path.resolve(__dirname, `data/${this.SUBJECT}/training/**/**/*.*`));
    this.labels = this.images.map((file) => path.basename(path.dirname(file)));
  }

  setValidationData() {
    const src = path.resolve(__dirname, `data/${this.SUBJECT}/validation`);

    this.validationLabels = readdirSync(src).filter((file) => {
      if (!file.includes('.DS_Store')) {
        return statSync(`${src}/${file}`).isDirectory();
      }

      return false;
    });
  }

  async init() {
    this.setTrainingData();
    this.setValidationData();

    if (!this.images) {
      throw new Error('You must supply images');
    }
    if (!this.labels) {
      throw new Error('You must supply labels');
    }

    if (this.images.length !== this.labels.length) {
      throw new Error('Class mismatch between labels and images');
    }

    this.pretrainedModel = await loadPretrainedModel();

    if (!this.pretrainedModel) {
      throw new Error('A pretrained model is required');
    }

    const xs = await this.loadImages();
    const ys = label.add(this.labels);

    this.model = getModel(this.validationLabels.length);

    // y = f(x)
    await this.model.fit(xs, ys, {
      epochs: 20,
      shuffle: true,
    });

    const results = await this.initPredict();
    const savedModel = await this.model.save(`file://./ml-models/${this.SUBJECT}-model`, {
      includeOptimizer: true,
    });

    return {
      savedModel,
      results,
    };
  }

  initPredict() {
    const predictProcess = this.validationLabels.map(async (validationDir, expectedLabel) => {
      const src = path.resolve(__dirname, `data/${this.SUBJECT}/validation/${validationDir}`);
      const validationFiles = await fs.readdir(src);
      const predictedFiles = await this.predict(validationFiles, src, expectedLabel);

      return predictedFiles;
    });

    return Promise.all(predictProcess);
  }

  predict(validationFiles, src, expectedLabel) {
    const files = validationFiles.reduce((acc, file) => {
      if (!file.includes('.DS_Store')) {
        acc.push(this.makePrediction(`${src}/${file}`, expectedLabel.toString()));
      }

      return acc;
    }, []);

    return Promise.all(files);
  }

  async makePrediction(validationImage, expectedLabel) {
    return fs
      .readFile(validationImage)
      .then((loadedImage) => {
        return create3dTensor(loadedImage);
      })
      .then((loadedImage) => {
        const activatedImage = this.pretrainedModel.predict(loadedImage);
        loadedImage.dispose();

        return activatedImage;
      })
      .then(async (activatedImage) => {
        const prediction = this.model.predict(activatedImage);
        // Logs for validation image in src/domain/classification/data/food/validation/Gado-gado/5491061_683737fc-ab29-4409-83cd-8fb1974036cd.jpg
        if (validationImage.includes('5491061_683737fc-ab29-4409-83cd-8fb1974036cd')) {
          console.log(validationImage);
          console.log('prediction.dataSync()', prediction.dataSync());
        }
        const predictionLabel = prediction.as1D().argMax().dataSync()[0];
        const labelsBlob = await fs.readFile(
          path.resolve(__dirname, `${this.SUBJECT}-labels.json`),
          'utf8'
        );

        const humanLabels = JSON.parse(labelsBlob);
        const result = {
          filename: validationImage,
          index: expectedLabel,
          expected: humanLabels[expectedLabel],
          predicted: humanLabels[predictionLabel],
        };

        prediction.dispose();
        activatedImage.dispose();

        return result;
      });
  }

  loadImages() {
    let promise = Promise.resolve();
    this.images.forEach((image) => {
      promise = promise.then((data) => {
        return fs.readFile(image).then((loadedImage) => {
          // Handling memory management with the use of `tf.tidy` and `.dispose()`.
          return tf.tidy(() => {
            const processedImage = create3dTensor(loadedImage);
            const prediction = this.pretrainedModel.predict(processedImage);

            if (data) {
              const newData = data.concat(prediction);
              data.dispose();
              return newData;
            }

            return tf.keep(prediction);
          });
        });
      });
    });

    return promise;
  }
}

export default Classifier;
