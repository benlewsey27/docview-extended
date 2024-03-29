import * as d3 from 'd3';

/**
 * Generates a SVG element, displaying the visualisaion by using D3.js.
 *
 * @param {Object} props - The SVG details passed down from the parent component.
 * @param {Number} data - The pre-processed data from the parent component.
 * @param {Number} maxCount - The largest count from the data. Used to generate the y axis.
 */
export const draw = async (props, data, maxCount) => {
  const divClass = `.div_${props.id}`;
  const svgId = `svg_${props.id}`;

  const margin = { top: 20, right: 0, bottom: 0, left: 40 };
  const width = Number(props.width);
  const height = Number(props.height);

  d3.select(`${divClass} > *`).remove();

  const svg = d3
    .select(divClass)
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.right)
    .attr('id', svgId);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([margin.left, width - margin.right])
    .padding([0.5]);

  const y = d3
    .scaleLinear()
    .domain([0, maxCount + 20])
    .range([height - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

  const yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0));

  svg.append('g').call(xAxis);
  svg.append('g').call(yAxis);

  const color = d3
    .scaleOrdinal()
    .domain(['labelled', 'unlabelled'])
    .range(['steelblue', 'lightgrey']);

  const stackGenerator = d3.stack().keys(['labelled', 'unlabelled']);

  svg
    .append('g')
    .selectAll('g')
    .data(stackGenerator(data))
    .enter()
    .append('g')
    .attr('fill', (d) => color(d.key))
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.data.label))
    .attr('y', (d) => y(d[1]))
    .attr('height', (d) => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth());

  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('Number Of Documents Per Label');
};
