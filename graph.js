const dimentions = { height: 500, width: window.innerWidth };

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dimentions.width)
    .attr('height', dimentions.height + 100)

const graph = svg.append('g')
    .attr('transform', 'translate(-10, 50)')

// data stratify i.e. data modifications for hierarchial format
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent);

// tree generator, and setting the size for actual diagram
const tree = d3.tree()
    .size([dimentions.width, dimentions.height])
    // .nodeSize([500, 500])
    .separation(function separation(a, b) { return a.parent !== b.parent ? 3 : 3; });

// zoom implementation
const zoom = d3.zoom()
    .on('zoom', handleZoom)
    .scaleExtent([0.5, 2])
// .translateExtent([[0, 0], [dimentions.width, dimentions.height]]);

function handleZoom(e) {
    d3.select('svg g')
        .attr('transform', e.transform);
}

function initZoom() {
    console.log('zoom')
    d3.select('svg')
        .call(zoom)
}

// update function
const update = (data) => {

    // remove current nodes
    graph.selectAll('.node').remove();
    graph.selectAll('.link').remove();

    // getting data ready for to pass into tree function
    const rootNode = stratify(data);

    const treeData = tree(rootNode)

    // get nodes selection and join data
    // we use descendants coz the data to be joined has to be in array format
    // whereas the tree function returns data in object format
    const nodes = graph.selectAll('.node')
        .data(treeData.descendants())

    // get link selection and join data
    const links = graph.selectAll('.link')
        .data(treeData.links())
    // console.log(treeData.links())

    // enter nre links
    links.enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

    //  create enter selection node groups
    const enterNodes = nodes.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)

    // append rect to enter nodes
    enterNodes.append('rect')
        .attr('fill', '#aaa')
        .attr('stroke', '#555')
        .attr('stroke-width', 2)
        .attr('height', 50)
        .attr('width', d => d.data.name.length * 15)
        .attr('transform', d => {
            let x = d.data.name.length + 70
            return `translate(${-x}, -30)`
        })

    // append name text
    enterNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.data.name)
}


// data and firebase
let data = [];
db.collection('employees').onSnapshot(res => {
    res.docChanges().forEach(change => {
        const doc = { ...change.doc.data(), id: change.doc.id };

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
    });
    initZoom();
    update(data);
})