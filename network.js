	//http://bl.ocks.org/tgk/6068367
var colors = {
		borough:"#bb7051",
		congressionalDistrict:"#c163b9",
		policePrecinct:"#78b642",
		stateAssemblyDistrict:"#50b189",
		stateSenate:"#d24c3c",
		fireDivision:"#73843b",
		 // tract:"#688dcd",
		schoolDistrict:"#cd9c3f",
		cityCouncil:"#c85782",
		zipcode:"#7b62cc"
}

var layerLabel = {
	borough:"Borough",
	zipcode:"Zipcode",
	policePrecinct:"Police Precinct",
	congressionalDistrict:"Congressional District",
	stateAssemblyDistrict:"State Assemmbly District",
	stateSenate:"State Senate District",
	tract:"Census Tract",
	schoolDistrict:"School District",
	cityCouncil:"City Council District",
	fireDivision:"Fire Division"
}

var radii = {
	borough:35,
	zipcode:10,
	policePrecinct:10,
	congressionalDistrict:10,
	stateAssemblyDistrict:10,
	stateSenate:10,
	 tract:10,
	schoolDistrict:10,
	cityCouncil:10,
	fireDivision:10
}
	
var layersInUse = ["borough","congressionalDistrict"]//,"policePrecinct"]

var layers = Object.keys(colors)
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 1200 - margin.left - margin.right,
height = 1000 - margin.top - margin.bottom;


Promise.all([d3.json("network_notracts.json"),d3.json("node_dictionary.json")])
.then(function(data){
	//console.log(data[0])
	ready(data[0],data[1])
})

var simulation
var links
var nodes
var link
var node
var all
var nodeDict

function ready(data,byNode){
	 console.log(data)
// 	console.log(byNode)
	all = data
	nodeDict = byNode
	
	var svg = d3.select("#network").append("svg").attr("width",1000).attr("height",1200)
	drawKey(svg)
	//console.log(data)
	links = filterLinksByLayer(layersInUse,data)
	nodes = filterNodesByLayer(layersInUse,data)
	// console.log(nodes)
// 	console.log(links)

	// var a = {id: "a"},
	//     b = {id: "b"},
	//     c = {id: "c"},
	// 	d = {id: "d"}
	//nodes = [a, b, c,d],
   // links = [{source: a, target: b},{source: c, target: a}];

	

	 simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-70))
   
      .force("link", d3.forceLink(links).id(d => d.id).distance(30))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
   .force('collision', d3.forceCollide().radius(function(d) {
      return 30
     }))
    .alphaTarget(1)
	.alphaDecay(.5)
	.velocityDecay(.95)
    .on("tick", ticked);
	

	var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
    node = g.append("g")
	.attr("stroke", "#000")
	.attr("stroke-width", 1.5)
	.attr("opacity",1)
	.selectAll(".node");
	
	restart();
	//simulation.stop()

}

function drawKey(svg){
	var key = svg.append("g").attr("id","key")

	key.selectAll('text')
	.data(Object.keys(colors))
	.enter()
	.append("text")
	.text(function(d){return layerLabel[d]})
	.attr("x",function(d,i){return 50})
	.attr("y",function(d,i){return i*24+20})
	.attr("fill",function(d){return colors[d]})
	.attr("opacity",function(d){
		if(layersInUse.indexOf(d)==-1){
			return .3
		}else{
			return 1
		}
	})
	.on("click",function(event,d){
		if(layersInUse.indexOf(d)==-1){
			layersInUse.push(d)
			d3.select(this).attr("opacity",1)
			//adding new array for layer
			links = filterLinksByLayer(layersInUse,all)
			 nodes = filterNodesByLayer(layersInUse,all)
			// nodes.concat(newNodes)
			
			restart()
			
		}else{
			var index = layersInUse.indexOf(d)
			layersInUse.splice(index,1)
			d3.select(this).attr("opacity",.3)
			links = filterLinksByLayer(layersInUse,all)
			 nodes = filterNodesByLayer(layersInUse,all)
			// nodes.concat(newNodes)
			
			restart()
			
		}
	})
}
	
	
function filterLinksByLayer(layerFilter,unfiltered){	
	// console.log(unfiltered)
// 	console.log(links)
		var newLinks = []
		//console.log(data.links)
		var test = []
		for(var j in unfiltered.links){
				var tLayer = unfiltered.links[j].target.split("_")[0]
				var sLayer = unfiltered.links[j].source.split("_")[0]
				var s = unfiltered.links[j].source
				var t = unfiltered.links[j].target
			
			if(layerFilter.indexOf(sLayer)>-1&&layerFilter.indexOf(tLayer)>-1){
				var newLink ={source:s,target:t}
				newLinks.push(newLink)
				
			}
		}
		//console.log(["newlinks",newLinks])
		return newLinks
}
	
function filterNodesByLayer(layerFilter,data){
		var newNodes = []
		 for(i in data.nodes){
	 		var layer = data.nodes[i].id.split("_")[0]
	 		if(layerFilter.indexOf(layer)>-1){
	 			newNodes.push(data.nodes[i])
	 		}
	 	}
		//console.log(newNodes)
		return newNodes
}
	
function restart() {

  // Apply the general update pattern to the nodes.
  node = node.data(nodes, function(d) { return d.id;});
  node.exit().remove();
  
  
  node = node.enter()
  // .append("text")
  // .text("test")
  // .attr("stroke","b")
  // .merge(node)
  
  .append("g")
.attr("id",function(d){
  	return d.id
  })
  .attr("class","node")
  .merge(node);
  
  
 
  
  node.append("circle")
	  .attr("fill", function(d) { 
		  var layer = d.id.split("_")[0]
		  return colors[layer]
	   })
	.attr("id",function(d){
		return d.id
	})
	  .attr("stroke-opacity",.3)
	  //.attr("stroke","black")
	  .attr("r", function(d){
		  var layer = d.id.split("_")[0]
	  	return radii[layer]
	  })
   	.on("mouseover",function(event,d){
		console.log(d)
		var x = event.clientX;     // Get the horizontal coordinate
		var y = event.clientY;     // Get the vertical coordinate
		var coor = "X coords: " + x + ", Y coords: " + y;
		d3.select("#popup").html(d.id)
		.style("left",x+"px")
		.style("top",y+"px")
		
		console.log(nodeDict[d.id])
		for(var j in nodeDict[d.id]){
			var id = nodeDict[d.id][j]
			d3.selectAll("#"+id).attr("fill","red")
		}
		
	})
	.on("mouseout",function(event,d){
		d3.select("#popup").html("")
		d3.selectAll("circle").attr("fill", function(d) { 
		  var layer = d.id.split("_")[0]
		  return colors[layer]
	   })
	})
	   
    node.append('text')
		.attr("id",function(d){
			return d.id+"_text"
		})
		.text(function(d){
		return d.id.split("_")[1]
		})
		.attr("font-size","11px")
		.attr("fill", function(d) { 
			return "black"
		var layer = d.id.split("_")[0]
		return colors[layer]
		})
		.attr("stroke","none")
		.attr("text-anchor","middle")
		.attr("x",function(d){
		  var layer = d.id.split("_")[0]
	  		return 0//-radii[layer]/2
		})
		.attr("y",function(d){
		  var layer = d.id.split("_")[0]
	  		return 5//radii[layer]/2
		})
	   	.on("mouseover",function(event,d){
			console.log(d)
			var x = event.clientX;     // Get the horizontal coordinate
			var y = event.clientY;     // Get the vertical coordinate
			var coor = "X coords: " + x + ", Y coords: " + y;
			d3.select("#popup").html(d.id)
			.style("left",x+"px")
			.style("top",y+"px")
			
			console.log(nodeDict[d.id.replace("_text","")])
			for(var j in nodeDict[d.id]){
				var id = nodeDict[d.id][j]
				d3.selectAll("#"+id).attr("fill","red")
			}
		})
		.on("mouseout",function(event,d){
			d3.select("#popup").html("")
		  var layer = d.id.split("_")[0]
		  return colors[layer]
		})
	   
  // Apply the general update pattern to the links.
  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();
  link = link.enter().append("line")
//  .attr("stroke-opacity",.3)
  .attr("stroke-width",.5)
//  .attr("stroke","black")
  .merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}
	

function filter(array, filterArray){
	
    var filtered = array.filter(function(value, index, arr){ 
           return filterArray.indexOf(value)==-1;
       });
	   
	   return filtered
}



function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
		.attr("transform",
		function(d){
			return "translate("+d.x+","+d.y+")"
		})
         // .attr("cx", function (d) { return d.x; })
//          .attr("cy", function(d) { return d.y; });
  }
 

  

  

