import * as d3 from 'd3';

/**
 * Generates a SVG element, displaying the visualisaion by using D3.js.
 *
 * @param {Object} props - The SVG details passed down from the parent component.
 * @param {Number} avgProb - The average probability for a specific label.
 */
export const draw = async (props, avgProb) => {
  const divClass = `.div_${props.id}`;
  const svgId = `svg_${props.id}`;

  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = Number(props.width);
  const height = Number(props.height);

  d3.select(`${divClass} > *`).remove();

  const svg = d3
    .select(divClass)
    .append('svg')
    .attr('height', height + margin.bottom)
    .attr('width', width)
    .attr('id', svgId)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 1.2})`);

  const arcGenerator = d3
    .arc()
    .innerRadius(height / 3)
    .outerRadius(height / 2);

  const pieGenerator = d3
    .pie()
    .value((d) => d)
    .sort(null)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2);

  const colors = ['steelblue', 'lightgrey'];

  svg
    .selectAll('path')
    .data(pieGenerator([avgProb, 1 - avgProb]))
    .enter()
    .append('path')
    .attr('fill', (d, i) => colors[i])
    .attr('d', arcGenerator);

  svg
    .append('text')
    .attr('x', 0)
    .attr('y', -height / 1.5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('Strength Of Predictions');

  svg
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text(`${Math.floor(avgProb * 100)}%`);
};
