import * as d3 from 'd3';

let activeNode = null;
let setActiveLabel = null;

function wordWrapper(selection) {
  selection.each(function(d) {
    const node = d3.select(this);

    const x = node.attr('x');
    const y = node.attr('y');

    const x0 = d.x0;
    const y0 = d.y0;

    const word = node.text();
    const rectWidth = node.attr('data-width');

    let tspan = node.text('').append('tspan').attr('x', x).attr('y', y).text(word);

    const wordWidth = tspan.node().getComputedTextLength();

    if (wordWidth > rectWidth) {
      tspan.attr('y', -(x0 + 5))
      tspan.attr('x', y0 + 5)
      node.attr('transform', 'rotate(90)')
    }
  })
}

function changeColor(d, i) {
  const node = d3.select(this);

  if (activeNode) {
    activeNode.style('fill', 'white');

    if (activeNode.attr('id') === node.attr('id')) {
      setActiveLabel(null);
      return;
    }
  } 

  activeNode = node;
  activeNode.style('fill', 'lightgrey');
  setActiveLabel(activeNode.attr('id'));
}

export const draw = async (props, data) => {
  const div_class = `.div_${props.id}`;
  const svg_id = `svg_${props.id}`;

  setActiveLabel = props.setActiveLabel;

  const margin = {top: 10, right: 40, bottom: 0, left: 10};
  const width = Number(props.width);
  const height = Number(props.height);

  d3.select(`${div_class} > *`).remove();

  const svg = d3.select(div_class)
    .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.right)
      .attr('id', svg_id)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const rootGenerator = d3.stratify()
    .id(d => d.label)
    .parentId(d => d.parent)

  const root = rootGenerator(data);
  root.sum(d => +d.count);

  d3.treemap()
    .size([width, height])
    .padding(5)
    (root)

  svg.selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('id', d => d.data.label)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .style("stroke", "black")
      .style("fill", d => d.data.label === props.activeLabel ? 'lightgrey' : 'white')
      .on('click', changeColor);
  
  svg.selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", d => d.x0 + 5)
      .attr("y", d => d.y0 + 15)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .attr('data-width', (d) => d.x1 - d.x0)
      .text(d => `${d.data.label} (${d.data.count})`)
      .call(wordWrapper)
}