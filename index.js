// select svg container
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600);

// deciding the actual height and width of the graph, on the svg
const margin = { top: 20, right: 20, bottom: 100, left: 100 }
const graphWidth = 600 - margin.left - margin.right
const graphHeight = 600 - margin.top - margin.bottom

// creating a group of the graph, for easier manipulations later
const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// creating x and y axis groups for the x-y axes and appending them to the graph
const xAxisGroup = graph.append('g')
    .attr('transform', `translate(${0}, ${graphHeight})`);
const yAxisGroup = graph.append('g');


// getting/reading the data, from a file or server
d3.json('menu.json').then((res) => {

    // create a linear scale for y direction
    const y = d3.scaleLinear()
        .domain([0, d3.max(res, d => d.orders)])
        .range([graphHeight, 0])

    // const max = d3.max(res, d => d.orders)
    // const min = d3.min(res, d => d.orders)
    // const extent = d3.extent(res, d => d.orders)

    // console.log(max, min, extent)

    //  creating a band scale for the width of the bar
    const x = d3.scaleBand()
        .domain(res.map((ele) => ele.name))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);


    // join the data to rects
    const rects = graph.selectAll('rect')
        .data(res)

    // update the rects in the DOM
    rects.attr('width', x.bandwidth)
        .attr('height', d => graphHeight - (y(d.orders)))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.orders))

    // append the enterSelection to the DOM 
    rects.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', d => graphHeight - (y(d.orders)))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.orders))

    // create and call axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => d + ' orders');

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
        .attr('fill', 'orange')
})











































// const svg = d3.select('svg');

// d3.json('planets.json').then((res) => {

//     // joining the data to circs
//     const circs = svg.selectAll('circle').data(res)

//     // add attrs to circs already in the DOM
//     circs.attr('cy', 200)
//         .attr('cx', d => d.distance)
//         .attr('r', d => d.radius)
//         .attr('fill', d => d.fill)

//     // append the enterSelection to the DOM
//     circs.enter()
//         .append('circle')
//         .attr('cy', 200)
//         .attr('cx', d => d.distance)
//         .attr('r', d => d.radius)
//         .attr('fill', d => d.fill)
// });











































// const data = [
//     { width: 200, height: 100, fill: 'purple' },
//     { width: 100, height: 60, fill: 'pink' },
//     { width: 60, height: 30, fill: 'red' }
// ]

// const svg = d3.select('svg');

// const rects = svg.selectAll('rect')
//     .data(data)

// // add attr to rects already in the DOM
// rects.attr('width', (d) => { return d.width })
//     .attr('height', (d) => { return d.height })
//     .attr('fill', (d) => { return d.fill })

// // append the enter selection DOM
// rects.enter()
//     .append('rect')
//     .attr('width', (d) => { return d.width })
//     .attr('height', (d) => { return d.height })
//     .attr('fill', (d) => { return d.fill })



// console.log(rects)











































// const canvas = d3.select(".canvas");

// const svg = canvas.append('svg')
//     .attr('width', 600)
//     .attr('height', 600);

// //  creating a group

// const group = svg.append('g')
//     .attr('transform', 'translate(100, 100)');

// // append shapes to svg container
// group.append('rect')
//     .attr('height', 100)
//     .attr('width', 200)
//     .attr('fill', 'blue')
//     .attr('x', 20)
//     .attr('y', 20);
// group.append('circle')
//     .attr('r', 50)
//     .attr('cx', 300)
//     .attr('cy', 70)
//     .attr('fill', 'pink');
// group.append('line')
//     .attr('x1', 370)
//     .attr('x2', 400)
//     .attr('y1', 20)
//     .attr('y2', 120)
//     .attr('stroke', 'red')
//     .attr('stroke-width', 5);

// svg.append('text')
//     .attr('x', 20)
//     .attr('y', 200)
//     .attr('fill', 'grey')
//     .text('Hello world!')
//     .style('font-family', 'arial')
