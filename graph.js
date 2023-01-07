const dimentions = { height: 300, width: 300, radius: 150 };
const centr = { x: (dimentions.width / 2 + 5), y: (dimentions.height / 2 + 5) };

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dimentions.width + 150)
    .attr('height', dimentions.height + 150)

const graph = svg.append('g')
    .attr('transform', `translate(${centr.x}, ${centr.y})`);

// returns angles based on the values supplied
const pie = d3.pie()
    .sort(null)
    .value(d => d.cost)
// the value we are evaluating to create the pie angles


// arc takes in the output given by d3.pie and returns the path for svg to draw
const arcPath = d3.arc()
    .outerRadius(dimentions.radius)
    .innerRadius(dimentions.radius / 2)

// create an ordinal scale 
const color = d3.scaleOrdinal(d3['schemeSet3'])

// legend setup
const legendGroup = svg.append('g')
    .attr('transform', `translate(${dimentions.width + 40}, 10)`)

const legend = d3.legendColor()
    .shape('circle')
    .shapePadding(10)
    .scale(color);

// update functoin

const update = (data) => {

    // update color scale domain
    color.domain(data.map(item => item.name))

    // update and call legend
    legendGroup.call(legend)
    legendGroup.selectAll('text')
        .attr('fill', 'white')


    // join pie data to path elements
    const paths = graph.selectAll('path')
        .data(pie(data))

    // exit selection
    paths.exit()
        .transition().duration(750)
        .attrTween('d', arcTweenExit)
        .remove();

    // handling the current DOM path updates
    paths.attr('d', arcPath)
        .transition().duration(750)
        .attrTween('d', arcUpdateTween)

    paths.enter()
        .append('path')
        .attr('class', 'arc')
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .attr('fill', d => color(d.data.name))
        .each(function (d) { this._current = d })
        .transition().duration(750)
        .attrTween('d', arcTweenEnter)

    // add event listeners
    graph.selectAll('path')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleMouseClick)

}

// data array and firestore
let data = [];

db.collection('expenses').onSnapshot(res => {

    res.docChanges().forEach(change => {

        const doc = { ...change.doc.data(), id: change.doc.id }

        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id)
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }
    })

    update(data);
})


const arcTweenEnter = (d) => {
    let i = d3.interpolate(d.endAngle, d.startAngle)

    return function (t) {
        d.startAngle = i(t);
        return arcPath(d)
    }
}

const arcTweenExit = (d) => {
    let i = d3.interpolate(d.startAngle, d.endAngle)

    return function (t) {
        d.startAngle = i(t);
        return arcPath(d)
    }
}

// function is not with => coz we need to access 'this', 
// and _current stores the old values,
// coz 'd' brings the values that are modified.
function arcUpdateTween(d) {

    // interpolating between the old and new values of the start and end angles
    let i = d3.interpolate(this._current, d);
    // update the current prop with new data
    this._current = i(1);

    return function (t) {
        return arcPath(i(t))
    }

}

// event handlers
function handleMouseOver() {
    d3.select(this)
        .transition('changeSliceFill').duration(300)
        .attr('fill', 'white')
}

function handleMouseOut(event, i) {
    d3.select(this)
        .transition('changeSliceFill').duration(300)
        .attr('fill', color(i.data.name))
}

function handleMouseClick(event, i) {
    const id = i.data.id;
    db.collection('expenses').doc(id).delete();
}