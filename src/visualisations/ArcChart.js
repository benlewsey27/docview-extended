import { useEffect } from 'react';
import { draw } from './helpers/ArcChartD3';

/**
 * React container component used to handle the Label's Average Strength visualisation.
 * Renders the visualisation container and calls d3 graph operations.
 */
const ArcChart = (props) => {
  /**
   * React callback hook. Formats the document data and calls the d3 graph operations.
   *
   * Formats the data to retrieve the average probability for a specific label rounded
   * to 2 decimal places.
   */
  useEffect(() => {
    const predictions = props.data.predictions.filter(
      (dp) => dp.label === props.filter,
    );

    let avgProbability;
    if (predictions.length) {
      avgProbability =
        predictions.reduce((i, data) => i + data.probability, 0) /
        predictions.length;
    } else {
      avgProbability = 1;
    }

    draw(props, avgProbability);
  }, [props]);

  /**
   * Renders a <div> element to mount the SVG from d3.
   */
  return <div className={`div_${props.id}`} />;
};

export default ArcChart;
