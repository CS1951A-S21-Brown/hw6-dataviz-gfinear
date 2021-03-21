// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2), graph_1_height = 550;
let graph_2_width = (MAX_WIDTH / 2), graph_2_height = 950;
let graph_3_width = (MAX_WIDTH / 2), graph_3_height = 550;
let graph_map_width = (MAX_WIDTH / 2), graph_map_height = 550

let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let tooltip = d3.select("#graph1")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Set up reference to count SVG group
let countRef = svg.append("g");

d3.csv("../data/netflix.csv").then(function(data) {
    let width = graph_1_width
    let height = graph_1_height
    data = cleanDataGraph1(data, function(x,y){
        return y.count - x.count
    })
    console.log(data)


    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
            return d.count
        })])
        .range([0, width - margin.left - margin.right]);

    let y = d3.scaleBand()
        .domain(data.map(function(d){return d.genre}))
        .range([0, height - margin.top - margin.bottom])
        .padding(0.3);

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["genre"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), data.length));
    
    let mouseover = function(d) {
        let color_span = `<span style="color: ${color(d.genre)};">`
        let html = `${color_span}Genre:</span><br/>
             ${d.genre}<br/><br/>
            ${color_span}Example Titles:</span><br/> 
            ${d.title[0]}<br/>
            ${d.title[1]}<br/>
            ${d.title[2]}<br/>`; 

        // Show the tooltip and set the position relative to the event X and Y location
        tooltip.html(html)
            .style("left", `${(d3.event.pageX) + 40}px`)
            .style("top", `${(d3.event.pageY) - 70}px`)
            .style("box-fill", `2px 2px 5px ${color(d.genre)}`)
            .transition()
            .duration(200)
            .style("opacity", 0.9)
    };

    // Mouseout function to hide the tool on exit
    let mouseout = function(d) {
        // Set opacity back to 0 to hide
        tooltip.transition()
            .duration(200)
            .style("opacity", 0);
    };
    
    let bars = svg.selectAll("rect").data(data);

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['genre']) })
        .attr("x", x(0))
        .attr("y", function(d){
            return y(d['genre'])
        })               
        .attr("width", function(d){
            return x(d.count)
        })
        .attr("height",  y.bandwidth())
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    let counts = countRef.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d){
            return (10 + x(d.count))
        })
        .attr("y", function(d){
            return (10 + y(d.genre))
        })
        .style("text-anchor", "start")
        .text(function(d){
            return d.count
        });

    // TODO: Add x-axis label
    svg.append("text")
        .attr("transform", `translate(${(width- margin.left - margin.right - 90)/2}, ${height - margin.bottom - margin.top + 10 })`)
        .style("text-anchor", "middle")
        .text("Count");

    // TODO: Add y-axis label
    svg.append("text")
        .attr("transform", `translate(${-125}, ${(height-margin.top-margin.bottom)/2 }) rotate(${-90})`)
        .style("text-anchor", "middle")
        .text("Genre");

    // TODO: Add chart title
    svg.append("text")
        .attr("transform", `translate(${(width - margin.left - margin.right)/2}, ${margin.top - margin.bottom - 10})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Number of Title per Genre");

    

});

function cleanDataGraph1(data, comparator) {
    //changes data to just be genere and count (count = # of listings in that genre)
    data = data.map(function(d){return [d["listed_in"].split(","),d["title"]]})
    genre_count = {}    
    for(i in data){
        title = data[i][1]
        for (genre in data[i][0]){
            genre = data[i][0][genre].trim()
            if(genre in genre_count){
                genre_count[genre]["count"] = genre_count[genre]["count"] + 1
            }
            else{
                genre_count[genre] = {"genre": genre, "count": 1, "title": []}
            }
        }
        
        if(genre_count[genre]["title"].length < 3){
            genre_count[genre]["title"] = genre_count[genre]["title"].concat([title])
        }
    }
    data = Object.values(genre_count)
    data = data.sort(comparator)
    return data
}

// !!!!!!!!!!!!!!!!!!!!!
//!!!GRAPH 2 BEGINS !!!!
// !!!!!!!!!!!!!!!!!!!!!

//SET UP BAR PLOT
let svg_bar = d3.select("#bargraph")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top+30})`);

let y_axis_label_graph__bar = svg_bar.append("g");

let y_axis_bar = d3.scaleLinear()
    .range([graph_2_height- margin.top - margin.bottom - 50, 0]);

let title_graph_bar = svg_bar.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, ${margin.top - margin.bottom -30})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

// END BAR PLOT SET UP

let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set up reference to count SVG group
let countRef2 = svg2.append("g");

let y_axis_label_graph_2 = svg2.append("g");

let x2 = d3.scaleLinear()
    .range([0, graph_2_width - margin.left - margin.right]);

// Create a scale band for the y axis (artist)
let y2 = d3.scaleBand()
    .range([0, graph_2_height - margin.top - margin.bottom])
    .padding(0.3);

let x_axis_text_graph2 = svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, ${graph_2_height - margin.bottom - margin.top + 10 })`)
    .style("text-anchor", "middle")


// Add y-axis label
let y_axis_text_graph2 = svg2.append("text")
    .attr("transform", `translate(${-100}, ${(graph_2_height-margin.top-margin.bottom)/2})`)
    .style("text-anchor", "middle");

// Add chart title
let title_graph2 = svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, ${margin.top - margin.bottom})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData(type){
    d3.csv("../data/netflix.csv").then(function(data) {
        svg_bar.selectAll("rect").remove()
        svg_bar.selectAll("circle").remove()
        svg_bar.selectAll("line").remove()
        let width = graph_2_width - margin.left - margin.right
        let height = graph_2_height - margin.top - margin.bottom

        data = cleanDataGraph2(data, function(x,y){
            return y.release_year- x.release_year
        }, type)
        
        console.log(data)

        x2.domain([0, d3.max(data, function(d){
            return d.avg
        })])

        y2.domain(data.map(function(d){return d["release_year"]}))

        y_axis_label_graph_2
        .call(d3.axisLeft(y2).tickSize(0).tickPadding(10));

        let bars = svg2.selectAll("rect").data(data);

        let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["release_year"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), data.length));

        bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['realse_year']) })
        .attr("x", x2(0))
        .attr("y", function(d){
            return y2(d["release_year"])
        })             
        .attr("width", function(d){
            return x2(d.avg);
        })
        .attr("height",  y2.bandwidth());   

        let counts = countRef2.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d){
                return (10 + x2(d.avg))
            })
            .attr("y", function(d){
                return (10 + y2(d["release_year"]))
            })
            .style("text-anchor", "start")
            .text(function(d){
                return d.avg
            });
        
        x_axis_text_graph2.text("Average " + type + " Duration")
        y_axis_text_graph2.text("Release Year");
        title_graph2.text("Top " + type + " in Billboard 100 Charts");
        
        bars.exit().remove();
        counts.exit().remove();

        //Make bar graph

        bar_data = data.map(function(d){return d["avg"]})
        bar_data = bar_data.sort(d3.ascending)
        
        y_axis_bar
            .domain([0,d3.max(bar_data, function(d){
                return d
        })]);
        
        y_axis_label_graph__bar.call(d3.axisLeft(y_axis_bar));

        let q1 = d3.quantile(bar_data, .25)
        let median = d3.quantile(bar_data, .5)
        let q3 = d3.quantile(bar_data, .75)
        let low_out = q1 - 1.5 * (q3 - q1)
        let upper_out = q3 + 1.5 * (q3 - q1)

        outlier_data = []
        for( i in bar_data){
            j = bar_data[i]
            if( j < low_out || j > upper_out){
                outlier_data.push(j)
                delete bar_data[i]
            }
        }

        let min = d3.min(bar_data, function(d){return d})
        let max = d3.max(bar_data, function(d){return d})

        
        title_graph_bar.text(type + " Duration Data Distribution");
        
        let center = 200;
        let width_bar = 100;

        let line = svg_bar;
        line
            .append("line")
            .attr("x1", center)
            .attr("x2", center)
            .attr("y1", y_axis_bar(min))
            .attr("y2", y_axis_bar(max))
            .attr("stroke", "black");
        
        let rectangle = svg_bar;
        rectangle
            .append("rect")
            .attr("x", center - width_bar/2)
            .attr("y", y_axis_bar(q3) )
            .attr("height", (y_axis_bar(q1)-y_axis_bar(q3)) )
            .attr("width", width_bar )
            .attr("stroke", "black")
            .attr("fill", "#69b3a2");

        let toto = svg_bar.selectAll("toto").data([min, median, max]);
        toto.enter()
            .append("line")
            .attr("x1", center-width_bar/2)
            .attr("x2", center+width_bar/2)
            .attr("y1", function(d){ return(y_axis_bar(d))} )
            .attr("y2", function(d){ return(y_axis_bar(d))} )
            .attr("stroke", "black");
        
        let circle = svg_bar.selectAll("circle").data(outlier_data);

        circle.enter()
            .append("circle")
            .attr("r", 2.5)
            .attr("cx", center)
            .attr("cy", function(d){ return(y_axis_bar(d))} )
            .attr("fill", "black");
    
    });
}

function cleanDataGraph2(data, comparator, type) {
    //changes data to just be genere and count (count = # of listings in that genre)
    data = data.map(function(d){return [d["release_year"], d["duration"], d["type"]]})

    avg_movie = {}
    avg_tv = {}
    for(item in data){
        item = data[item]
        year = parseInt(item[0])
        time = parseInt(item[1].split(" ")[0])
        typ = item[2]

        if (typ.localeCompare("Movie") == 0){
            if (year in avg_movie){
                avg_movie[year]["avg"] = avg_movie[year]["avg"] + time
                avg_movie[year]["count"] = avg_movie[year]["count"] + 1
            }
            else{
                avg_movie[year] = {"release_year": year, "avg": time, "count": 1, "type": "Movie"}
            }
        }
        else{
            if (year in avg_tv){
                avg_tv[year]["avg"] = avg_tv[year]["avg"] + time
                avg_tv[year]["count"] = avg_tv[year]["count"] + 1
            }
            else{
                avg_tv[year] = {"release_year": year, "avg": time, "count": 1, "type": "TV"}
            }
        }
    }
    for(item in avg_movie){
        avg_movie[item]["avg"] = avg_movie[item]["avg"]/avg_movie[item]["count"]
        delete avg_movie[item]["count"]
    }
    for(item in avg_tv){
        avg_tv[item]["avg"] = avg_tv[item]["avg"]/avg_tv[item]["count"]
        delete avg_tv[item]["count"]
    }
    data_movie = Object.values(avg_movie)
    data_tv = Object.values(avg_tv)

    if (type.localeCompare("Movie") == 0){
        data_movie = data_movie.sort(comparator)
        return data_movie
    }
    else{
        data_tv = data_tv.sort(comparator)
        return data_tv
    }
}


//!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!GRAPH 3 BEGINS !!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!

let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)     // HINT: width
    .attr("height", graph_3_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set up reference to count SVG group
let countRef3 = svg3.append("g");


d3.csv("../data/netflix.csv").then(function(data) {
    let width = graph_3_width
    let height = graph_3_height

    data = cleanDataGraph3(data, function(x,y){
        return y.count- x.count
    })

    console.log(data)

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
            return parseInt(d.count,10)
        })])
        .range([0, width - margin.left - margin.right]);
    
    let y = d3.scaleBand()
        .domain(data.map(function(d){return [d.director, d.actor]}))
        .range([0, height - margin.top - margin.bottom])
        .padding(0.1);

    svg3.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg3.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["actor"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 30));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['actor']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x(0))
        .attr("y", function(d){
            return y([d.director, d.actor])
        })               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d){
            return x(d.count);
        })
        .attr("height",  y.bandwidth()); 

    let counts = countRef3.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d){
            return (10 + x(d.count))
        }) 
        .attr("y", function(d){
            return (10 + y([d.director, d.actor]))
        }) 
        .style("text-anchor", "start")
        .text(function(d){
            return d.count
        });

    
    svg3.append("text")
        .attr("transform", `translate(${(width - margin.left - margin.right)/2}, ${height - margin.bottom - margin.top + 20 })`)
        .style("text-anchor", "middle")
        .text("Number of Movies or TV Shows Made");

    svg3.append("text")
        .attr("transform", `translate(${-160}, ${(height-margin.top-margin.bottom)/2}) rotate(${-90})`)
        .style("text-anchor", "middle")
        .text("(Director, Actor)");

    svg3.append("text")
        .attr("transform", `translate(${(width - margin.left - margin.right)/2}, ${margin.top - margin.bottom})`)
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 30 Director and Actor Pairs");
});

function cleanDataGraph3(data, comparator) {
    data = data.map(function(d){return [d['director'].split(","), d['cast'].split(",")]})

    pair = []

    for(i in data){
        directors = data[i][0]
        actors = data[i][1]

        for(j in directors){
            director = directors[j].trim()
            if(!director.localeCompare("")){
                break
            }
            for(k in actors){
                actor = actors[k].trim()
                if(!actor.localeCompare("")){
                    break
                }
                group = [director, actor]
                if(group in pair){
                    pair[group]["count"] = pair[group]["count"] + 1
                }
                else{
                    pair[group] = {"director": director, "actor": actor, "count": 1}
                }
                
            }
        }
    }
    data_pairs = Object.values(pair)
    data_pairs = data_pairs.sort(comparator)
    data_pairs = data_pairs.slice(0,30)
    return data_pairs
}




//!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!Graph Flow Start !!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!

let svgflow = d3.select("#graphflow")
    .append("svg")
    .attr("width", graph_map_width) 
    .attr("height", graph_map_height) 
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let tooltip2 = d3.select("#graphflow")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("../data/netflix.csv").then(function(data) {
    let width = graph_map_width
    let height = graph_map_height

    data = cleanDataGraphFlow(data)
    console.log(data)

    let data_nodes = data[0]["nodes"]
    let data_links = data[0]["links"]

    let force = d3.forceSimulation(data_nodes)
    .force("link", d3.forceLink()
            .id(function(d) { return d.id; })
            .links(data_links)
            .distance(300)
    )
    //.force("charge", d3.forceManyBody().strength(-80))
    .force("center", d3.forceCenter(width, height)) 
    .force("collide", d3.forceCollide().strength(.1).radius(30).iterations(1))
    //.force("x", d3.forceX().strength())
    //.force("y", d3.forceY().strength())

    let link = svgflow.append("g")
        .selectAll("links")
        .data(data_links)
        .enter()
        .append("line")
        .style("stroke", "#aaa")
        .attr("class", "link")
    
    console.log(data_links)
    let mouseover = function(d) {
        shared = new Set()
        data_links.map((function(d2){
            if(d2.source.id == d.id){
                shared.add(d2.target.country)
            }
            if(d2.target.id == d.id){
                shared.add(d2.source.country)
            }
        }))
        let share = []
        shared.forEach(v => share.push(v));
        let color_span = `<span style="color: #69b3a2;">`
        let html = `${color_span}Country:</span><br/>
                ${d.country}<br/><br/>
            ${color_span}Countries With Shared Titles:</span><br/>
            ${share} 
            `; 

        // Show the tooltip and set the position relative to the event X and Y location
        tooltip2.html(html)
            .style("left", `${(d3.event.pageX) + 40}px`)
            .style("top", `${(d3.event.pageY) - 70}px`)
            .style("box-fill", `2px 2px 5px #69b3a2`)
            .transition()
            .duration(200)
            .style("opacity", 0.9)
    };

    // Mouseout function to hide the tool on exit
    let mouseout = function(d) {
        // Set opacity back to 0 to hide
        tooltip2.transition()
            .duration(200)
            .style("opacity", 0);
    };

    let node = svgflow.append("g")
        .selectAll("nodes")
        .data(data_nodes)
        .enter()
        .append("g")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .call(d3.drag() 
         .on("start", dragstarted)
         .on("drag", dragged)
         .on("end", dragended));
        
    
    let cirlces = node.append("circle")
        .attr("r", 5)
        .style("fill", "#69b3a2")
    
    force.on("tick", function(){
        //Set X and Y of node
        scale = .5
        // node
        // .attr("cx", function(d){ return d.x*scale; })
        // .attr("cy", function(d){ return d.y*scale; });
        //Set X, Y of link
        link.attr("x1", function(d){ return d.source.x*scale; })            
        link.attr("y1", function(d){ return d.source.y*scale; })
        link.attr("x2", function(d){ return d.target.x*scale; })
        link.attr("y2", function(d){ return d.target.y*scale; });
        //Shift node a little
        node.attr("transform", function(d) { return `translate(${d.x*scale}, ${d.y*scale})`; });

    });

    function dragstarted(d) {
        if (!d3.event.active) force.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      function dragended(d) {
        if (!d3.event.active) force.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
      }
    
    svgflow.append("text")
    .attr("transform", `translate(${(width - margin.left - margin.right)/2 + 125}, ${margin.top - margin.bottom})`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Countries that Stream the Same Netflix Titles");

});

function cleanDataGraphFlow(data) {
    data = data.map(function(d){return d['country'].split(",")})
    data = data.slice(0, 300)

    ids = {}
    num = 1
    for (cast in data){
        cast = data[cast]
        for(person in cast){
            act = cast[person].trim()
            if(!act.localeCompare("")){
                break
            }
            if(!(act in ids)){
                ids[act] = {"id": num, "country": act}
                num += 1
            }
        }
    }
    connect = []
    threshold = 0
    for (cast in data){
        cast = data[cast]
        for(person in cast){
            act = cast[person].trim()
            if(!act.localeCompare("")){
                break
            }
            act = ids[act]["id"]
            for(person2 in cast){
                act2 = cast[person2].trim()
                if(!act2.localeCompare("")){
                    break
                }
                act2 = ids[act2]["id"]
                if (act < act2){
                    connect.push({"source": act, "target": act2})
                }
            }
        }
    }

    ids = Object.values(ids)
    connect = Object.values(connect)
    total = {}
    total[0] = {"nodes" : ids, "links": connect}

    data = Object.values(total)

    return data
}