	//http://bl.ocks.org/tgk/6068367


var colors = {
	borough:"#4ff097",
	//neighborhood:"#67e9be",
	// zipcode:"ZIPCODE",
 
	policePrecinct:"#efbe6c",
	schoolDistrict:"#f069a6",
	//fireCompany:"#f36e5b",
 
	congressionalDistrict:"#4ae0ee",
	stateAssemblyDistrict:"#67e9be",
	stateSenate:"#89e58d",
 
	cityCouncil:"#b6e57b",
	municipalCourt:"#e6851f",		
	communityDistrict:"#e7de35"//"#68e957"

}

var layerLabel = {
	borough:"Borough",
	zipcode:"Zipcode",
	policePrecinct:"Police Precinct",
	congressionalDistrict:"Congressional District",
	stateAssemblyDistrict:"State Assembly District",
	stateSenate:"State Senate District",
	schoolDistrict:"School District",
	cityCouncil:"City Council District",
	//fireCompany:"Fire Company",
	neighborhood:"Neighborhood",
	communityDistrict:"Community District",
	municipalCourt:"Municiple Court District"
}


var radii = {
	borough:40,
	municipalCourt:10,
	communityDistrict:10,
	policePrecinct:10,
	congressionalDistrict:10,
	stateAssemblyDistrict:10,
	stateSenate:10,
	 tract:10,
	schoolDistrict:10,
	cityCouncil:10,
	fireCompany:10
}
	
var layersInUse = ["borough","congressionalDistrict"]//,"policePrecinct"]

var layers = Object.keys(colors)
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = window.innerWidth - margin.left - margin.right,
height = window.innerHeight - margin.top - margin.bottom;


Promise.all([d3.csv("buffered.csv")])
.then(function(data){
	//console.log(data[0])
	ready(data[0])
})

var simulation
var links
var nodes
var link
var node
var all
var nodeDict

var strokeWidth = 2

function ready(buffered){
	// console.log(data)
 	var bNodes = []
 	var bLinks = []
	nodeDict = {}
	var bNodesArray = []
	
 	for(var b in buffered){
 		var row = buffered[b]
 		var bSource = row.L1+"_"+row.ID1
 		var bTarget = row.L2+"_"+row.ID2
 		var bLink = {source:bSource,target:bTarget}
		bLinks.push(bLink)
		
		
		if(bNodesArray.indexOf(bTarget)==-1){
			bNodesArray.push(bTarget)
			bNodes.push({id:bTarget})
			
			nodeDict[bTarget]=[]
		}
		if(bNodesArray.indexOf(bSource)==-1){
			bNodesArray.push(bSource)
			bNodes.push({id:bSource})
			 nodeDict[bSource]=[]
		}
 	}
	for(var bl in bLinks){
		var source = bLinks[bl].source
		var target = bLinks[bl].target
		nodeDict[source].push(target)
		nodeDict[target].push(source)
	}
	var bData = {links:bLinks,nodes:bNodes}
	
 //	console.log(nodeDict)
	all = bData
	//nodeDict = byNode
	
	var svg = d3.select("#network").append("svg").attr("width",width).attr("height",height)
	drawKey(svg)
	//console.log(data)
	links = filterLinksByLayer(layersInUse,bData)
	nodes = filterNodesByLayer(layersInUse,bData)
	// console.log(nodes)
// 	console.log(links)

	// var a = {id: "a"},
	//     b = {id: "b"},
	//     c = {id: "c"},
	// 	d = {id: "d"}
	//nodes = [a, b, c,d],
   // links = [{source: a, target: b},{source: c, target: a}];

	

	 simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-200))
//  .force('center', d3.forceCenter(width / 2, height / 2))
      .force("link", d3.forceLink(links).id(d => d.id).distance(60))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
   .force('collision', d3.forceCollide().radius(function(d) {
      return 20
     }))	//
	     .alphaTarget(1)
	 .alphaDecay(.5)
	.velocityDecay(.95)
   //  .stop();//stop the simulation here
	 
	// for (var i = 0; i < 300; ++i) simulation.tick();
	 
    simulation.on("tick", function(){
	    // nodes[0].x = width / 2;
	    //    nodes[0].y = height / 2;
			draw()
	})
	 simulation.stop();
	//draw()

	var g = svg.append("g")//.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link")
	
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
	.attr("cursor","pointer")
	.attr("id",function(d){ return d+"_key"})
	.style("font-size","16px")
	.attr("class",function(d){return "keytext"})
	.text(function(d){return layerLabel[d]})
	.attr("x",function(d,i){return 20})
	.attr("y",function(d,i){return i*24+240})
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
			if(layersInUse.length>3){
				layersInUse.shift()
			}
			//console.log(layersInUse)
			d3.select(this).attr("opacity",1)
			//adding new array for layer
			links = filterLinksByLayer(layersInUse,all)
			 nodes = filterNodesByLayer(layersInUse,all)
			// nodes.concat(newNodes)
			
			//console.log(d3.selectAll(".keytext"))
			d3.selectAll(".keytext")
			.each(
				function(d,i){
					var tempL = d3.select(this).attr("id").split("_")[0]
					if(layersInUse.indexOf(tempL)==-1){
						d3.select(this).attr("opacity",.3)
					}
				}
			
			)
			
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
	//	console.log(["newlinks",newLinks])
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
  
  var strokeColor = "#fff"
 
 // node.call(d3.drag().on("drag", dragged));

  node.append("circle")
	  .attr("fill", function(d) { 
		  var layer = d.id.split("_")[0]
		  return colors[layer]
	   })
	.attr("id",function(d){
			return d.id.split(" ").join("X")//+"_text"
	})
	  .attr("stroke-opacity",1)
	  .attr("stroke-width",strokeWidth)
	  .attr("stroke",strokeColor)
	  .attr("r", function(d){
		  var layer = d.id.split("_")[0]
	  	return radii[layer]
	  })
	  .attr("class","nodeGroup")
	  
	  
	  
	   
    node.append('text')
		.attr("id",function(d){
			return d.id.split(" ").join("X")+"_text"
		})
		.text(function(d){
		return d.id.split("_")[1].split("X").join("-")
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
		.attr("class","nodeGroup")
		
		d3.selectAll(".nodeGroup")
		.style("cursor","pointer")
	   	.on("mouseover",function(event,d){
			//console.log(d)
			var x = event.clientX;     // Get the horizontal coordinate
			var y = event.clientY;     // Get the vertical coordinate
			var coor = "X coords: " + x + ", Y coords: " + y;
			// d3.select("#popup").html(d.id)
// 			.style("left",x+"px")
// 			.style("top",y+"px")
		//	console.log(d3.select(this).attr("id"))
		//	console.log("#"+d3.select(this).attr("id").replace("_text",""))
			
//	
			d3.selectAll("circle").attr("stroke","#444").attr("fill","#444")
			d3.selectAll("line").attr("stroke","#fff").attr("opacity",.1)
			var rolloverColor = "#888"
			var rolloverBorder = "#fff"
			formatRollover(d.id,nodeDict[d.id])
			
			//console.log(nodeDict[d.id.replace("_text","")])
			for(var j in nodeDict[d.id]){
				var id = nodeDict[d.id][j].split(" ").join("X")
				var layer = id.split("_")[0]
			
				d3.selectAll("#"+id).attr("stroke", rolloverBorder).attr("fill",colors[layer])// .attr("fill", rolloverColor )
				d3.selectAll("#"+id+"_text")//.attr("fill",colors[layer])
				
			}
			var thisId = d3.select(this).attr("id").replace("_text","")
			var thisLayer = thisId.split("_")[0]
			d3.selectAll("#"+thisId).attr("stroke", rolloverBorder).attr("fill",colors[thisLayer])//.attr("fill", rolloverColor)
			
			d3.selectAll("."+thisId+"_link").attr("stroke", rolloverBorder).attr("opacity",1)
						//
			// d3.selectAll("#"+thisId+"_text")
			// .attr("fill",colors[thisLayer])
			
		})
		.on("mouseout",function(event,d){

			d3.selectAll("circle").attr("stroke","#fff")
			.each(function(d){
				d3.select(this).attr("fill",colors[ d3.select(this).attr("id").split("_")[0]])
				//var l = d3.select(this).attr("id").split("_")[0]
				
			})
			d3.selectAll("line").attr("stroke","#fff").attr("opacity",1)
			d3.select("#rollover").html("Hover on circles to see detail for parts of graph")
			//d3.select("#popup").html("")
			 var layer = d.id.split("_")[0]
			d3.selectAll("#"+d3.select(this).attr("id").replace("_text","")).attr("fill",colors[layer])
			
			
			for(var j in nodeDict[d.id]){
				var id =  nodeDict[d.id][j].split(" ").join("X")
				d3.selectAll("#"+id).attr("fill",colors[id.split("_")[0]]).attr("stroke","#fff")
				d3.selectAll("#"+id+"_text").attr("fill","black")
			}
			
			var thisId = d3.select(this).attr("id").replace("_text","")
			var thisLayer = thisId.split("_")[0]
			d3.selectAll("#"+thisId).attr("fill",colors[thisLayer]).attr("stroke","#fff")
			d3.selectAll("."+thisId+"_link").attr("stroke","white")
			
			d3.selectAll("#"+thisId+"_text")
			.attr("fill","black")
			
		  //return colors[.split("_")[0]]
		})
	   
	   
  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();
  link = link.enter().append("line")
  .attr("stroke-opacity",.8)
  .attr("stroke-width",strokeWidth)
  .attr("stroke",strokeColor)
  .attr("class",function(d){
	  if(d.source.id!=undefined){
	  	return d.source.id.split(" ").join("X")+"_link"+" "+d.target.id.split(" ").join("X")+"_link"
	  }else{
  		  return d.source.split(" ").join("X")+"_link"+" "+d.target.split(" ").join("X")+"_link"
	  }
  })
.on("mouseover",function(e,d){
	//console.log(d)
})
  .merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}
	
function formatRollover(thisId,links){
	var thisLayer = layerLabel[thisId.split("_")[0]]
	var thisName = thisId.split("_")[1]
	var linksText = formatRolloverLinks(links)
	d3.select("#rollover").html("<span style=\"color:"+colors[thisId.split("_")[0]]+"; background-color:#000\">"+thisLayer+" "+thisName+"</span> intersects with: <br>"+linksText)
}

function formatRolloverLinks(links){
	var formatted = {}
	for(var i in links){
		var link = links[i]
		var gid = link.split("_")[1]
		var layer = link.split("_")[0]
		if(layersInUse.indexOf(layer)>-1){
			if(Object.keys(formatted).indexOf(layer)==-1){
				formatted[layer]=[]
				formatted[layer].push(gid)
			}else{
				formatted[layer].push(gid)
			}
		}
	}
	//console.log(formatted)
	var displayText = ""
	for(var f in formatted){
		displayText+="<span style=\"color:"+colors[f]+"; background-color:#000\">"+layerLabel[f]+": "+formatted[f].join(", ").split("X").join("-")+"</span><br>"
	}
	return displayText
//	return formatted
}

function filter(array, filterArray){
	
    var filtered = array.filter(function(value, index, arr){ 
           return filterArray.indexOf(value)==-1;
       });
	   
	   return filtered
}



function draw() {
var p = 50
node
	.attr("transform",
	function(d){
		 var dx = Math.max(p, Math.min(width - p, d.x+width/2));
 		var dy =  Math.max(p, Math.min(height - p, d.y+height/2))
		return "translate("+dx+","+dy+")"
	})

    link
        .attr("x1", function(d) { return Math.max(p, Math.min(width - p, d.source.x+width/2));  })
		.attr("y1", function(d) { return Math.max(p, Math.min(width - p, d.source.y+height/2));})
        .attr("x2", function(d) { return Math.max(p, Math.min(width - p, d.target.x+width/2));})
        .attr("y2", function(d) { return Math.max(p, Math.min(width - p, d.target.y+height/2));});

         // .attr("cx", function (d) { return d.x; })
//          .attr("cy", function(d) { return d.y; });
  }
 

  

  
