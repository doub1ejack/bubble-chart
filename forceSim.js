function bubbleChart() {
    var width = 960,
        height = 960,
        maxRadius = 6,
        columnForColors = "category",
        columnForRadius = "views";

    function chart(selection) {
        var data = selection.datum();
        var div = selection;
        var svg = div.selectAll('svg');

        // set chart width/height
        svg.attr('width', width).attr('height', height);

        // var tooltip = selection
        //     .append("div")
        //     .style("position", "absolute")
        //     .style("visibility", "hidden")
        //     .style("color", "white")
        //     .style("padding", "8px")
        //     .style("background-color", "#626D71")
        //     .style("border-radius", "6px")
        //     .style("text-align", "center")
        //     .style("font-family", "monospace")
        //     .style("width", "400px")
        //     .text("");



        var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);  //schemeCategory20c
        var scaleRadius = d3.scaleLinear()
            .domain(
                [
                    d3.min(data, function(d) {
                        return +d[columnForRadius];
                    }), 
                    d3.max(data, function(d) {
                        return +d[columnForRadius];
                    })
                ]
            )
            .range([30, 75])

        
        //Filter for the outside glow for selected circles
        var defs = svg.append("defs");  //Container for the gradients
        var filter = defs.append("filter")
            .attr("id","glow");
        filter.append("feGaussianBlur")
            .attr("stdDeviation","4.5")
            .attr("result","coloredBlur");
        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in","coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in","SourceGraphic")

        // Define gravitational forces 
        var simulation = d3.forceSimulation(data)
            .force('collision', d3.forceCollide().radius(function(d) {
                return scaleRadius(d[columnForRadius])
            }))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);

        function ticked(e) {
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };

        var node = svg.selectAll("circle")
            .data(data)
            .enter()
                .append("circle")
                    .attr('r', d => scaleRadius(d[columnForRadius]))
                    .style("fill", d => colorCircles(d[columnForColors]))
                    .style("stroke", "white")
                    .style("stroke-width", 1)
                    .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
                    .on("mouseover", function(d) {
                        d3.select(this)
                            .moveToFront()
                            .style("stroke", "white")
                            .style("stroke-width", 4)
                            .style("filter", "url(#glow)")
                            .transition()
                            .duration(1000)
                            .attr("r", 100)
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .style("stroke-width", 1)
                            .style("filter", null)
                            .transition()
                            .duration(1000)
                            .attr("r", function(d) {
                                return scaleRadius(d[columnForRadius])
                            });
                    })

                
            // .on("mouseover", function(d) {
            //     tooltip.html(d[columnForColors] + "<br>" + d.title + "<br>" + d[columnForRadius] + " hearts");
            //     return tooltip.style("visibility", "visible");
            // })
            // .on("mousemove", function() {
            //     return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            // })
            // .on("mouseout", function() {
            //     return tooltip.style("visibility", "hidden");
            // })
            ;
    }

    chart.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };


    chart.columnForColors = function(value) {
        if (!arguments.columnForColors) {
            return columnForColors;
        }
        columnForColors = value;
        return chart;
    };

    chart.columnForRadius = function(value) {
        if (!arguments.columnForRadius) {
            return columnForRadius;
        }
        columnForRadius = value;
        return chart;
    };

    return chart;
}