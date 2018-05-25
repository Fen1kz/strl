const {LinkType} = require('./MissionGraph');
const _ = require('lodash');

const {JSDOM} = require('jsdom');
const D3Node = require('d3-node');
const fsWriteFileSync = require('fs').writeFileSync;

const RADIUS = .35;
class LevelRenderer {
  constructor() {
    this.d3n = new D3Node();
    this.$svg = this.d3n.createSVG(0, 0)
    this.bounds = {x: 0, y: 0, w: 0, h: 0};
    
    this.$container = this.$svg.append('g')
  }
  
  render(graph, state) {
    const nodeX = (node) => state.nodes[node.id] ? state.nodes[node.id].x : null;
    const nodeY = (node) => state.nodes[node.id] ? state.nodes[node.id].y : null;
    
    const $linkEnter = this.$container
      .selectAll('g.links')
      .data(_.values(graph.nodes)).enter()
      .append('g').attr('class', (node) => 'links ' + node.id)
      .selectAll('line.link')
      .data(node => node.links.filter(({sourceId, targetId}) => (
        state.nodes[sourceId] && state.nodes[targetId]
      ))).enter();
      
    $linkEnter
        .append('line')
        .classed('link', true)
        .attr('x1', link => nodeX(graph.nodes[link.sourceId]))
        .attr('y1', link => nodeY(graph.nodes[link.sourceId]))
        .attr('x2', link => nodeX(graph.nodes[link.targetId]))
        .attr('y2', link => nodeY(graph.nodes[link.targetId]))
        .style('stroke', link => link.type !== LinkType.LOGIC ? 'black' : 'red')
        .style('stroke-width', .2)
        .style('stroke-opacity', .1)
    
    const $nodeEnter = this.$container.selectAll("g.node")
      .data(_.values(graph.nodes)
        .filter(node => state.nodes[node.id])
      )
      .enter()
      .append('g')
      .attr('class', (node) => 'node ' + node.id);
    
    $nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', RADIUS)
        .attr('cx', nodeX)
        .attr('cy', nodeY)
    
    $nodeEnter.append('text')
      .text(node => node.id + node.name)
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .style('font-size', `${RADIUS}px`)
      .style('font-family', 'monospace')
      .style('transform', 'translate(0, -50%)')
      .attr('text-anchor', 'middle')
      .attr('dy', '.4em')
      .attr('x', nodeX)
      .attr('y', nodeY)
      
    {
      const SCALE = 1;
      let xMin = 0, yMin = 0, xMax = 0, yMax = 0;
      _.forEach(graph.nodes, node => {
        if (nodeX(node) < xMin) xMin = nodeX(node);
        if (nodeX(node) > xMax) xMax = nodeX(node);
        if (nodeY(node) < yMin) yMin = nodeY(node);
        if (nodeY(node) > yMax) yMax = nodeY(node);
      })
      xMin--;xMax++;yMin--;yMax++;
      this.$svg
        .attr('viewBox', `${xMin*SCALE} ${yMin*SCALE}
          ${(xMax - xMin)*SCALE} ${(yMax - yMin)*SCALE}`)
        .attr('width', 300)
        .attr('height', 300);
    }
    
    fsWriteFileSync('test.svg', this.d3n.svgString());
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
