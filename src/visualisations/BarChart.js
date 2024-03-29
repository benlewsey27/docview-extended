import { useEffect } from 'react';
import { draw } from './helpers/BarChartD3';

/**
 * React container component used to handle the Stacked Bar Chart visualisation.
 * Renders the visualisation container and calls d3 graph operations.
 */
const BarChart = (props) => {
  /**
   * React callback hook. Formats the document data and calls the d3 graph operations.
   *
   * Formats the data to retrieve the number of labelled and unlabelled documents per label.
   */
  useEffect(() => {
    const { labelledDocs, predictions, labels } = props.data;

    const userLabels = labelledDocs ? labelledDocs.map((dp) => dp.label) : [];
    const predictedLabels = predictions
      ? predictions.map((dp) => dp.label)
      : [];

    const userLabelsCount = [];
    if (labels) {
      labels.forEach((label) => {
        const count = userLabels.reduce(
          (n, currentLabel) => n + (currentLabel === label),
          0,
        );

        userLabelsCount.push({
          label,
          count,
        });
      });
    }

    const predictedLabelsCount = [];
    if (labels) {
      labels.forEach((label) => {
        const count = predictedLabels.reduce(
          (n, currentLabel) => n + (currentLabel === label),
          0,
        );

        predictedLabelsCount.push({
          label,
          count,
        });
      });
    }

    const data = [];
    if (labels) {
      for (let i = 0; i < labels.length; i += 1) {
        const label = labels[i];
        const labelledCount = userLabelsCount[i].count;
        const unlabelledCount = predictedLabelsCount[i].count;

        data.push({
          label,
          labelled: labelledCount,
          unlabelled: unlabelledCount,
        });
      }
    }

    let maxCount = 0;
    data.forEach((label) => {
      if (label.labelled > maxCount) {
        maxCount = label.labelled;
      }

      if (label.unlabelled > maxCount) {
        maxCount = label.unlabelled;
      }
    });

    data.sort((a, b) => {
      const aTotal = a.labelled + a.unlabelled;
      const bTotal = b.labelled + b.unlabelled;

      if (aTotal > bTotal) return -1;
      if (aTotal < bTotal) return 1;
      return 0;
    });

    draw(props, data, maxCount);
  }, [props]);

  /**
   * Renders a <div> element to mount the SVG from d3.
   */
  return <div className={`div_${props.id}`} />;
};

export default BarChart;
