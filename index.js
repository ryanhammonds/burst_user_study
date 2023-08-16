



// Load signals
async function loadJson() {

    fetch("./signals.json").then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        // Load
        let ys = res.data;
        let sampling_rate = 500;
        // Time vector
        var x = [];
        for (i=0; i<1000; i++){
            x.push(i/sampling_rate);
        };
        // Graph divs
        var graphDivs = [];
        for (i=0; i<48; i++){
            // Create div for each simulation
            let graphDiv = document.createElement("div");
            graphDiv.id = "graphDiv" + i;
            // Append the div to a centered div
            centerDiv.appendChild(graphDiv);
            // Create plots
            Plotly.newPlot(graphDiv, [
                // Signal
                {
                    mode: 'lines',
                    x: x,
                    y: ys["sig_" + i],
                    xaxis: 'x',
                    yaxis: 'y',
                    name: 'Signal',
                    line: {
                        color: 'black'
                    }
                },{
                    // Burst
                    mode: 'lines',
                    x: [],
                    y: [],
                    xaxis: 'x',
                    yaxis: 'y',
                    name: 'Burst',
                    line: {
                        color: 'red'
                    }
                }], {
                    // Layout
                    dragmode: 'select',
                    selectdirection: "h",
                    xaxis: {zeroline: false},
                    showlegend: true,
                    width: 1000,
                    height: 150,
                    margin: {
                        l: 25,
                        r: 25,
                        b: 25,
                        t: 25,
                        pad: 5
                }}
            );
            graphDivs.push(graphDiv);
        };
        console.log(graphDivs);
        console.log(graphDivs.length);
        // Selection callback
        let gi = 1;
        for (gi=0; gi<48; gi++){
        let gDiv = graphDivs[gi]
        gDiv.on('plotly_selected', function(eventData) {
            // Get lower and upper bounds of selected bursts
            let xselect = [eventData.range.x[0], eventData.range.x[1]];
            let xburst = [];
            let yburst = [];
            for (xi=0; xi<x.length; xi++){
                if (gDiv.data[0]['x'][xi] >= xselect[0] && gDiv.data[0]['x'][xi] <= xselect[1]){
                    xburst.push(gDiv.data[0]['x'][xi]);
                    yburst.push(gDiv.data[0]['y'][xi]);
                }
            };
            // Update red burst signal
            gDiv.data[1]['x'] = xburst;
            gDiv.data[1]['y'] = yburst;
            // Replot updated bursts
            var replot = () => {
                // Bug in plotly that sometimes leads to infinite
                //   recursion. Timing out to fix.
                setTimeout(() => {
                    Plotly.redraw(gDiv, [1]);
                }, 200);
            }
            replot();
            });
        };
    }));


};

loadJson();