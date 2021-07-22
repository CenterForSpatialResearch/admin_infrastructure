//TODO
//XXXexport and upload new layers
//XXXconnect new data 
//XXXfix upper/lower case issues

//Change fire division to fire company
//add hover popup on map- query filtered visible layers - add popup to show district numbers for each
//fix municiple court same code in multiple boroughs
//get second clicks working
//redo text
//get colors working - in groups or sections?
//do a show all option? - offset lines?
var map;
var currentBorough;
var highlightColor = "#fa6614"
var clicked = false
var currentAdmins = {}
// var files = [// "block.geojson",
//  "cityCouncil.geojson",
//   "congressionalDistricts.geojson",
//   // "electionDistricts.geojson",
//  "policePrecincts.geojson",
//   "stateAssemblyDistricts.geojson",
//   "stateSenate.geojson",
//   "tracts.geojson",
//  "zipcode.geojson",
// "borough.geojson"
// ]
var boroughDictionary = {1:"Manhattan",
			"2":"Bronx",
			"3":"Brooklyn",
			"4":"Queens",
			"5":"Staten Island",
				}	
	var root = "geoData/"
	var layers = [
		"borough",
		//"zipcode",
		"congressionalDistrict",
		"stateSenate",
		"stateAssemblyDistrict",
		
		"cityCouncil",
		"municipalCourt",
		"communityDistrict",//,
		
		"policePrecinct",
		"fireCompany",
		"schoolDistrict"

		//"neighborhood",
	
	]
	var layersHover = []
	for(var l in layers){
		var layer = layers[l]
		var layerHover = layer+"_hover"
		layersHover.push(layerHover)
		
	}
	
	var layerUniqueIds = {
		borough:"BoroName",
		zipcode:"ZIPCODE",
		policePrecinct:"Precinct",
		congressionalDistrict:"CongDist",
		stateAssemblyDistrict:"AssemDist",
		stateSenate:"StSenDist",
		tract:"BoroCT2010",
		schoolDistrict:"SchoolDist",
		cityCouncil:"CounDist",
		fireCompany:"UniqueId",

		municipalCourt:"UniqueId",
		neighborhood:"NTAName",
		communityDistrict:"BoroCD"
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
		fireCompany:"Fire Company",
		neighborhood:"Neighborhood",
		communityDistrict:"Community District",
		municipalCourt:"Municiple Court District"
	}
	
	// var promises = []
//     for(var i in layers){
//     	promises.push(d3.json(root+layers[i]+".geojson"))
//     }
var showAll = true	
 var colors = {
		borough:"#4ff097",
		neighborhood:"#67e9be",
		// zipcode:"ZIPCODE",
	 
		policePrecinct:"#efbe6c",
		schoolDistrict:"#f069a6",
		fireCompany:"#f36e5b",
	 
		congressionalDistrict:"#4ae0ee",
		stateAssemblyDistrict:"#67e9be",
		stateSenate:"#89e58d",
	 
		cityCouncil:"#b6e57b",
		municipalCourt:"#e6851f",		
		communityDistrict:"#e7de35"//"#68e957"

 }
var layerSizes = {}
var onOpacity = .8
var offOpacity = .05
	
//	console.log(window.innerWidth)
	d3.select("#map").style("width",(window.innerWidth-270)+"px")
Promise.all([
			d3.csv("temp.csv")])
 .then(function(data){
	 //console.log(data)
	   var map = drawMap(data[0])
})
//click layer
//show a layer
//


function drawMap(newInter){
	
	//console.log(intersections)
	
	// for(var j in intersections){
	// //	console.log(intersections[j])
	// 	layerSizes[j]=Object.keys(intersections[j]).length
	// }
//	console.log(layerSizes)
	//console.log("map")
	//console.log(newInter)
	
	var links = []
	var dict = {}
	for(var i in newInter){
		if(newInter[i]["L1"]!=undefined){
			
		//var layerNames = newInter[i]["fileName"].replace(".geojson","")
		var l1 = newInter[i].L1
		var l2 = newInter[i].L2
		var id1 = newInter[i].ID1
		var id2 = newInter[i].ID2
		if(Object.keys(dict).indexOf(l1+"_"+id1)==-1){
			dict[l1+"_"+id1] = {}
			if(Object.keys(dict[l1+"_"+id1]).indexOf(l2)==-1){
				dict[l1+"_"+id1][l2]=[]
				dict[l1+"_"+id1][l2].push(id2)
			}else{
				dict[l1+"_"+id1][l2].push(id2)
			}	
			//dict[l1+"_"+id1].push(l2+"_"+id2)
		}else{
			// dict[l1+"_"+id1].push(l2+"_"+id2)
			if(Object.keys(dict[l1+"_"+id1]).indexOf(l2)==-1){
				dict[l1+"_"+id1][l2]=[]
				dict[l1+"_"+id1][l2].push(id2)
			}else{
				dict[l1+"_"+id1][l2].push(id2)
			}
		}
		if(Object.keys(dict).indexOf(l2+"_"+id2)==-1){
			dict[l2+"_"+id2] = {}
			if(Object.keys(dict[l2+"_"+id2]).indexOf(l2)==-1){
				dict[l2+"_"+id2][l1]=[]
				dict[l2+"_"+id2][l1].push(id1)
			}else{
				dict[l2+"_"+id2][l1].push(id1)
			}
			
			//dict[l1+"_"+id1].push(l2+"_"+id2)
		}else{
			// dict[l1+"_"+id1].push(l2+"_"+id2)
			if(Object.keys(dict[l2+"_"+id2]).indexOf(l1)==-1){
				dict[l2+"_"+id2][l1]=[]
				dict[l2+"_"+id2][l1].push(id1)
			}else{
				dict[l2+"_"+id2][l1].push(id1)
			}
		}
		links.push({source:l1+"_"+id1,sourceLayer:l1,sourceId:id1,target:l2+"_"+id2,targetLayer:l2,targetId:id2,})
	}
}
//	console.log(dict)

    mapboxgl.accessToken = "pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jjjiia123/ckr5q89fg07qb17tjzrng0lxs",// ,//newest
		// style:"mapbox://styles/jjjiia123/ckoeh9hz9413117qhmh6w4mza",
		zoom: 10,
		preserveDrawingBuffer: true,
		minZoom:9,
		maxZoom:15,// ,
		// maxBounds: maxBounds
		center: [-73.95,40.71]
     });	 //
	 // map.on("mousemove",layers[0],function(d){
	 // 	console.log(d)
	 // })
	 
	// map.getCanvas().style.cursor = "unset";

//
	 map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

      map.on("load",function(){
		//  console.log(map.getStyle().layers)
		  
		  map.on("mousemove",function(e){
 				var features = map.queryRenderedFeatures(e.point, {layers:layersHover})
			  if(features.length==0){
			  	d3.select("#popup").style("visibility","hidden")
			  }else{
			  	d3.select("#popup").style("visibility","visible")
				  var popupLayers = []
				  var popupText = "<strong>"+Math.round(e.lngLat.lng*10000)/10000+","+Math.round(e.lngLat.lat*10000)/10000+"</strong><br>"
				  for(var i in features){
					 var layerName = features[i].layer.id.split("_")[0]
					  if(popupLayers.indexOf(layerName)==-1){
						  popupLayers.push(layerName)
						  var key = layerUniqueIds[layerName]
						  var color = colors[layerName]
						// console.log(layerName)
						  if(key=="UniqueId"){
						  	var value = "<strong>"+features[i].properties[key].split("X")[1]+"</strong>"
				  	
						  }else{
						  	var value = "<strong>"+features[i].properties[key]+"</strong>"
						  }
						  //console.log([layerName,value])
						  var text = "<span style=\"color:"+color+"\">"+layerLabel[layerName]+": "+value+"</span><br>"
						  popupText+=text
					  }
				  }
				  popupText+="<br><i>Click on map for more</i>"
				  d3.select("#popup").html(popupText).style("left",(e.point.x+280)+"px").style("top",(e.point.y+10)+"px")
			  }
			 
			 // d3.select("#popup").style("left",)
			  
		  })
 	 // d3.selectAll(".mapboxgl-ctrl-bottom-right").remove()
//  	 d3.selectAll(".mapboxgl-ctrl-bottom-left").remove()

 		var activeLayer = ""
 		 var geocoder = new MapboxGeocoder({
 				 accessToken:mapboxgl.accessToken,
 				 bbox: [-74.274972,40.498509, -73.67484,40.92322],
 				 mapboxgl: mapboxgl,
				 flyTo:false,
				 marker:false
				 //limit:1
 			 })
			 map.addControl(geocoder)
		//https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder-outside-the-map/
		//https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md#parameters
		//document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
		
//
// 	console.log(map.getStyle().layers)
//
//
		//.addTo(map);
		var filters = {}

		// d3.select("#showAll").on("click",function(){
		// 	if(showAll==true){
		// 		showAll=false
		// 		d3.select(this).html("SHOW<br>ALL")
		// 			for(var i in layers){
		//    			   		 map.setLayoutProperty(layers[i]+"_outline",'visibility',"none");
		// 	   		 map.setLayoutProperty(layers[i],'visibility',"none");
		//
		// 			}
		// 	}else{
		// 		showAll=true
		// 		d3.select(this).html("HIDE<br>ALL")
		// 		for(var i in layers){
		//    		 map.setLayoutProperty(layers[i]+"_outline",'visibility',"visible");
		//    		 map.setLayoutProperty(layers[i],'visibility',"visible");
		//
		// 		}
		// 	}
		// })

	map.on("click","borough_hover",function(e){
		geocoder.clear()
			d3.selectAll(".mapboxgl-marker").remove()
		var marker = new mapboxgl.Marker({
			color:"#fa6614"
		})
			marker.setLngLat([e.lngLat.lng,e.lngLat.lat])
			.addTo(map);
			d3.select("#currentSelection")
				.html("<span class=\"highlight\">"+Math.round(e.lngLat.lng*10000)/10000
					+", "+Math.round(e.lngLat.lat*10000)/10000
					+"</span><br>Your coordinates are in these jurisdictions:" )

			//console.log(marker)
	})
	
	
	var clickedFeatures = []
	// map.setLayoutProperty("road-label",'visibility',"none");
	
	
	for(var i in layers){

		map.setPaintProperty(layers[i]+"_hover",'fill-opacity',0);
		map.setPaintProperty(layers[i],'fill-color',colors[layers[i]]);
		map.setPaintProperty(layers[i]+"_outline",'line-color',colors[layers[i]]);		//
		 map.setLayoutProperty(layers[i]+"_outline",'visibility',"visible");
		 map.setPaintProperty(layers[i]+"_outline",'line-opacity',.1);
		 map.setPaintProperty(layers[i]+"_outline",'line-width',1);
		// map.setPaintProperty(layers[i]+"_outline",'line-offset',parseInt(i));

 
	//	  map.setPaintProperty(layers[i]+"_outline",'line-width',1);

		map.on("click",layers[i]+"_hover",function(c){

		d3.select("#currentSelectionMap").html("")
			

			var feature = c.features[0]
		
			d3.selectAll(".shared").remove()
			d3.selectAll(".bars").style("border","none")

			var layerName = c.features[0].layer.id.replace("_hover","")
			var filterKey = layerUniqueIds[layerName]
			var filterValue = feature.properties[filterKey]

			if(clickedFeatures.length==layers.length){
	 			clickedFeatures = []
				 clickedFeatures.push(feature)
	 		}else{
				 clickedFeatures.push(feature)
	 		}
		
			if(layers.indexOf(layerName)==layers.length-1){
				drawList(clickedFeatures,dict,map)
			
			}
     		 map.setLayoutProperty(layerName+"_intersect",'visibility',"none");

			//displayText+=layerName+" "+filterKey+": "+filterValue
			map.setLayoutProperty(layerName,'visibility',"visible");//
			map.setLayoutProperty(layerName+"_outline",'visibility',"visible");//

			filters[layerName] = {key:filterKey, value:filterValue}
			//console.log([layerName,filterValue])
			d3.select("#key").style("visibility","visible")
			d3.select("#"+layerName+"_text").html(layerName
			+"<br><span style=\"font-size:20px\"><strong>"+filterValue+"</strong></span>")

			//map.setPaintProperty(layerName+"_hover",'fill-opacity',.1);

			map.setPaintProperty(layerName+"_outline",'line-opacity',onOpacity);
			map.setPaintProperty(layerName,'fill-opacity', offOpacity);

			map.setFilter(layerName,["==",filterKey,filterValue])
			map.setFilter(layerName+"_outline",["==",filterKey,filterValue])
		
  	    })
  	}
	
	
	//https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md#parameters
	geocoder.on("results",function(result){
		d3.selectAll(".mapboxgl-marker").remove()
		d3.select("#currentSelection").html("")
		d3.select("#currentSelectionMap").html("")
		for(var i in layers){
      		 map.setPaintProperty(layers[i],'fill-opacity',0);
      		 map.setLayoutProperty(layers[i]+"_intersect",'visibility',"none");
			
		}
	})
 		geocoder.on('result', function(result) {
			// console.log("geo")
			//console.log(result)
			
			d3.select("#currentSelection")
				.html("<span class=\"highlight\">"
					+result.result["place_name"]
					.replace(", New York "," ")
					.replace(", United States","")
					.split(", ").join("<br>")
					+"</span><br>Your address is in these jurisdictions:")
			
 			if(result!=null){
				var center = result.result.center
				var marker = new mapboxgl.Marker({
					color:highlightColor
				})
				marker.setLngLat(center)
					.addTo(map);
					
 				var coords = result.result.geometry.coordinates
 				var features = map.queryRenderedFeatures(map.project(coords), {layers:layersHover})
 				filterOnResult(map,features)
				drawList(features,dict,map)
 			}

 		});
 	// })
       return map
		 })
}
function drawList(features,dict,map){
	//console.log(layers)
	//console.log(features)
	d3.select("#list").remove()
		d3.select("#info")
			.append("div")
			.attr("id","list")
			//.style("margin-top","20px")
	
	var formatted = {}
	for(var i in features){
		//console.log(features[i])
		var layerName = features[i].layer.id.replace("_hover","")
		var layerDisplayName = layerLabel[layerName]
		var keyName = layerUniqueIds[layerName]
		var value = features[i].properties[keyName]
		//var capLayerName = layerName[0].toUpperCase()+layerName.substring(1)
		formatted[layerName]=value
	}
	//console.log(formatted)
	
	//console.log(dict)
	for(var la in layers){
		var layerName = layers[la]
		//var capLayerName = layerName[0].toUpperCase()+layerName.substring(1)
		var key = layerName+"_"+formatted[layerName]
		var intersections = dict[key]
		//console.log([intersections,key])
		var layerDisplayName = layerLabel[layerName]
		//console.log(key)		
		var row = d3.select("#list")
			.append("div")
			.attr("id","row")
			.style("margin-bottom","10px")
			.style("background-color","#000")
			.attr("id",layerName+"_subtitle")//+"_"+value+"_"+keyName)		
		
		row.append("div").attr("class","listSubtitle")	
			.html(function(){
				
				if(layerName=="municipalCourt"){
					var boroCode = String(formatted[layerName].split("X")[0])
					return "Municipal Court "+ boroughDictionary[boroCode]+" District "+formatted[layerName].split("X")[1]
				}
				if(layerName=="fireCompany"){
					return "Fire District "+ formatted[layerName].split("X")[0]+" Company "+formatted[layerName].split("X")[1]
					
				}
				return layerDisplayName+" "+formatted[layerName]
			})
		.	style("display","inline-block")
			.attr("intersections",intersections)
			.style("color",colors[layerName])
			//.style("color","#fff")
			.style("padding","5px")
			.attr("id",layerName+"_subtitle")//+"_"+value+"_"+keyName)
			.attr("oc","c")
			.style("width","200px")
			.style("vertical-align","top")
			
		row.append("div").attr("class","oc").attr("id",layerName+"_oc").html("+").style("display","inline-block")
			.style("color","#fff").style("font-size","14px").style("float","top-right")
			.style("cursor","pointer")
			.style("margin","5px")
			.style("line-height","10px")
		
			.on("click",function(){
				d3.selectAll(".listText").style("display","none")
				var layer = d3.select(this).attr("id").split("_")[0]
				var oc = d3.select(this).attr("oc")
			
				if(oc=="o"){
					console.log("close")
					d3.select("#currentSelectionMap").html("")
					d3.select(this).attr("oc","c")
					d3.select("#"+layer+"_oc").html("+").style('transform',"rotate(0deg)").style("font-size","16px")
					d3.select("#"+layer+"_info").style("display","none")
					map.setPaintProperty(layer,"fill-opacity",offOpacity)
					
					for(var l in layers){
						map.setLayoutProperty(layers[l]+"_outline","visibility","visible")
						map.setLayoutProperty(layers[l],"visibility","visible")
						map.setPaintProperty(layers[l]+"_outline","line-opacity",onOpacity)
						map.setLayoutProperty(layers[l]+"_intersect","visibility","none")
						
					}
				}else{
					for(var l in layers){
						map.setPaintProperty(layers[l],"fill-opacity",offOpacity)
						map.setPaintProperty(layers[l]+"_outline","line-opacity",offOpacity)
						map.setLayoutProperty(layers[l]+"_intersect",'visibility',"none");//
					
						d3.select("#"+layers[l]+"_subtitle").attr("oc","c")
						d3.select("#"+layers[l]+"_oc").html("+").style('transform',"rotate(0deg)").style("font-size","16px")
					
						map.setLayoutProperty(layers[l],'visibility',"visible");//
						map.setLayoutProperty(layers[l]+"_outline",'visibility',"visible");//
				
					}
					d3.select(this).attr("oc","o")
					d3.select("#"+layer+"_oc").style('transform',"rotate(-45deg)").style("font-size","18px")
					d3.select("#"+layer+"_info").style("display","block")
					map.setPaintProperty(layer+"_outline","line-opacity",onOpacity)
					map.setPaintProperty(layer,"fill-opacity",onOpacity)
				}
			})
		
			
		var intersectionLayers = row.append("div").attr("class","listText")
			.attr("id",layerName+"_info")
			.html("intersects with")
		.style("margin-left","5px")
		.style('color',"#fff")
		.style('font-style',"italic")
		.style('padding',"5px")
			
			
			for(var inter in intersections){
				//var formattedL =inter[0].toLowerCase()+inter.substring(1)
				var intersectionLayer = intersectionLayers.append("div")
					.attr('class',"subIntersections")
					.style("cursor","pointer")
					.style("margin-left","20px")
					.attr("id",inter+"_intersections_"+layerName+"_"+formatted[layerName])
					.html(
						function(){
							if(intersections[inter].length==1){
								return intersections[inter].length+" "+ layerLabel[inter]
							}else{
								if(inter=="fireCompany"){
									return intersections[inter].length+" Fire Companies"	
								}else{
									return intersections[inter].length+" "+ layerLabel[inter]+"s"
								}
							}
						}
					)
					.attr("html",intersections[inter].length+" "+ layerLabel[inter])
					.style("color","#fff")
				
					intersectionLayer.on("click",function(){
						d3.selectAll(".mapboxgl-marker").remove()
						
						//d3.selectAll(".subIntersections").style("background-color","#000")
						//add remove maker here
						var clickedLayer = d3.select(this).attr("id").split("_")[0]						
						var originalLayer = d3.select(this).attr("id").split("_")[2]
						var originalLayerValue = d3.select(this).attr("id").split("_")[3]

						d3.selectAll(".subIntersections").style("color","#fff").style("font-weight","200")
						d3.select(this).style("color",colors[clickedLayer]).style("font-weight","700")
						
						var currentIntersections = dict[originalLayer+"_"+originalLayerValue][clickedLayer]
												//
						// console.log(clickedLayer)
						// console.log(currentIntersections)
						// console.log(originalLayer)
						// console.log(originalLayerValue)
						
						d3.select("#currentSelectionMap").html(
							function(){
								if(originalLayer=="municipalCourt"){
									var originalFeature = " <span style=\"color:"+colors[originalLayer]+"; background-color:#000\"> "
									+"Municipal Court "+boroughDictionary[originalLayerValue.split("X")[0]]+" District "+originalLayerValue.split("X")[1]
									+"</span>"
									
								}else if(originalLayer=="fireCompany"){
									var originalFeature = " <span style=\"color:"+colors[originalLayer]+"; background-color:#000\"> "
									+"Fire District "+originalLayerValue.split("X")[0]+" Company "+originalLayerValue.split("X")[1]
									+"</span>"
									
								}else{
									var originalFeature = " <span style=\"color:"+colors[originalLayer]+"; background-color:#000\"> "
									+layerLabel[originalLayer]
									+" "+originalLayerValue
									+" </span>"
								}
								
								
								if(clickedLayer=="municipalCourt"){
									var intersectionList = " <span style=\"color:"+colors[originalLayer]+"; background-color:#000\"> "
									
									for(var ci in currentIntersections){
										var boro = boroughDictionary[currentIntersections[ci].split("X")[0]]
										var district = currentIntersections[ci].split("X")[1]
										intersectionList+=" "+boro+" District "+district+","
									}

									intersectionList = intersectionList.substring(0,intersectionList.length-1)+"</span>"
									
								}else if(clickedLayer=="fireCompany"){
									var intersectionList = " <span style=\"color:"+colors[clickedLayer]+"; background-color:#000\"> "
									+currentIntersections.length
									+" Fire Companies: District "+currentIntersections.join(", District ").split("X").join(" Company ")+"</span>"
									
								}else{
									var intersectionList = " <span style=\"color:"+colors[clickedLayer]+"; background-color:#000\"> "
									+currentIntersections.length
									+" "+layerLabel[clickedLayer]+"s: "+currentIntersections.join(", ")+"</span>"
								}
								
								
								
								
								return originalFeature
								+" <span style=\"color:#fff; background-color:#000\"> "
								+"<br> is shared between <br></span>"+intersectionList
							}
							
						)
						
						//var gids = intersections[clickedLayer]
						var formattedCI = []
												//
						 if(clickedLayer=="neighborhood"|| clickedLayer=="borough"|| clickedLayer=="fireCompany"|| clickedLayer=="municipalCourt"){
						 	for(var g in currentIntersections){
						 		formattedCI.push(currentIntersections[g])
						 	}
						}else{
						 	for(var g in currentIntersections){
						 		formattedCI.push(parseInt(currentIntersections[g]))
						 	}
						 }
					 for(l3 in layers){
						 var interLayer3 = layers[l3]
 						map.setLayoutProperty(interLayer3+"_intersect",'visibility',"none");//
						 
						if(interLayer3!=originalLayer){
	 						map.setLayoutProperty(interLayer3,'visibility',"none");//
	 						map.setLayoutProperty(interLayer3+"_outline",'visibility',"none");//
						}
					 }
						 
						var idKey = layerUniqueIds[clickedLayer]
						var filter = ["in",idKey].concat(formattedCI)
						map.setPaintProperty(clickedLayer+"_intersect","line-color",colors[clickedLayer])
						map.setPaintProperty(clickedLayer+"_intersect","line-width",1)
						map.setLayoutProperty(clickedLayer+"_intersect",'visibility',"visible");//
						map.setFilter(clickedLayer+"_intersect",filter)
						
					})

				
			}
			d3.selectAll(".listText").style("display","none")
	}

}

function filterOnResult(map,features){
	
	// for(var i in features){
	// 	var layerName = features[i].layer.id.replace("_hover","")
	// 	 var idKey = layerUniqueIds[layerName]
	// 	console.log(layerName)
	// 	if(layerName=="borough"){
	// 		console.log(features[i])
	// 		currentBorough = features[i]["properties"][idKey]
	// 		break
	//
	// 	}
	//
	// }
	// 	console.log(currentBorough)
	// var doubleFilterLayers = ["neighborhood","municipalCourt"]
	//
	for(var f in features){
			//console.log(features[f])
			 var layerName = features[f].layer.id.replace("_hover","")  	 	  
			 var idKey = layerUniqueIds[layerName]
			
		
			//console.log(idKey)
			 var gid = features[f]["properties"][idKey]
			//console.log([idKey,gid])
 			map.setFilter(layerName,["==",idKey,gid])
 			map.setFilter(layerName+"_outline",["==",idKey,gid])
   		 	map.setPaintProperty(layerName+"_outline",'line-opacity',onOpacity);
			map.setLayoutProperty(layerName,'visibility',"visible");//
			map.setLayoutProperty(layerName+"_outline",'visibility',"visible");//
		
			
			
		 

		 // map.setPaintProperty(layerName,'fill-color',colors[i]);
		 map.setPaintProperty(layerName,'fill-opacity',offOpacity);
			//map.setFilter(layerName+"_hover",["!=",idKey,gid])
		}
}

