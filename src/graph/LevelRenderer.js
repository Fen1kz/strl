const {LinkType} = require('./MissionGraph');
const _ = require('lodash');

const {JSDOM} = require('jsdom');
const D3Node = require('d3-node');
const fsWriteFileSync = require('fs').writeFileSync;

class LevelRenderer {
  constructor() {
    this.d3n = new D3Node();
    this.$svg = this.d3n.createSVG(0, 0)
    this.bounds = {x: 0, y: 0, w: 0, h: 0};
    
    this.$container = this.$svg.append('g')
  }
  
  render(graph) {
    const l2g = (xy) => xy;
    const l2gX = (node) => l2g(node.data.x);
    const l2gY = (node) => l2g(node.data.y);
    
    const $nodeEnter = this.$container.selectAll("g.node")
      .data(_.values(graph.nodes))
      .enter()
      .append('g')
      .attr('class', 'node');
    
    $nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', .3)
        .attr('cx', l2gX)
        .attr('cy', l2gY)
      
    const $linkEnter = $nodeEnter
      .selectAll('line.link')
      .data(node => node.links)
      .enter();
      
    $linkEnter
        .append('line')
        .classed('link', true)
        .attr('x1', link => l2gX(graph.nodes[link.sourceId]))
        .attr('y1', link => l2gY(graph.nodes[link.sourceId]))
        .attr('x2', link => l2gX(graph.nodes[link.targetId]))
        .attr('y2', link => l2gY(graph.nodes[link.targetId]))
        .style('stroke', 'black')
        .style('stroke-width', .1)
    
    $nodeEnter.append('text')
      .text(node => node.id + node.name)
      .style('fill', 'red')
      .style('font-size', '.5px')
      .style('font-family', 'monospace')
      .attr('text-anchor', 'middle')
      .attr('x', l2gX)
      .attr('y', l2gY)
      
    this.adjustSvgSize(graph);
    
    fsWriteFileSync('test.svg', this.d3n.svgString());
  }
  
  adjustSvgSize(graph) {
    const SCALE = 1;
    let xMin = 0, yMin = 0, xMax = 0, yMax = 0;
    _.forEach(graph.nodes, node => {
      if (node.data.x < xMin) xMin = node.data.x;
      if (node.data.x > xMax) xMax = node.data.x;
      if (node.data.y < yMin) yMin = node.data.y;
      if (node.data.y > yMax) yMax = node.data.y;
    })
    xMin--;xMax++;yMin--;yMax++;
    this.$svg
      .attr('viewBox', `${xMin*SCALE} ${yMin*SCALE}
        ${(xMax - xMin)*SCALE} ${(yMax - yMin)*SCALE}`)
      .attr('width', 300)
      .attr('height', 300);
  }
  
  grid() {        
    // const gridContainer = container
    //   .append('g').attr('class', 'gridContainer')
    // gridContainer
    //   .selectAll('.gridRow')
    //   .data(gridData)
    //     .enter()
    //     .append('g').attr('class', 'gridRow')
    //     .selectAll('.gridCell')
    //     .data(d => d)      
    //       .enter()
    //       .append("rect").attr("class", "gridCell")
    //       .attr("x", d => d.x * GRID)
    //       .attr("y", d => d.y * GRID)
    //       .attr("width", GRID)
    //       .attr("height", GRID)
    //       .style("fill", '#fff')
    //       .style("stroke", "#aaa");
  }
}

module.exports = {LevelRenderer}
