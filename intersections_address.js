//TODO
//XXXexport and upload new layers
//XXXconnect new data 
//XXXfix upper/lower case issues

//add hover popup on map- query filtered visible layers - add popup to show district numbers for each
//fix municiple court same code in multiple boroughs
//get second clicks working
//redo text
//get colors working - in groups or sections?
//do a show all option? - offset lines?
var map;
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
	
	var root = "geoData/"
	var layers = [
		"congressionalDistrict",
		"stateSenate",
		"stateAssemblyDistrict",
		"cityCouncil",

		"policePrecinct",
		"fireCompany",
		"schoolDistrict",

		"neighborhood",
	//	"municipalCourt",
		"communityDistrict"//,
		//"borough"
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
		fireCompany:"FireCoNum",

		municipalCourt:"MuniCourt",
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
	
 var colors = {
		borough:"#4ff097",
		neighborhood:"#67e9be",
		// zipcode:"ZIPCODE",
	 
		policePrecinct:"#efbe6c",
		schoolDistrict:"#e7de35",
		fireCompany:"#dadb7a",
	 
		congressionalDistrict:"#4ae0ee",
		stateAssemblyDistrict:"#67e9be",
		stateSenate:"#89e58d",
	 
		cityCouncil:"#b6e57b",
		municipalCourt:"#cde45a",		
		communityDistrict:"#68e957"

 }
var layerSizes = {}
var onOpacity = .8
var offOpacity = .08
	
//	console.log(window.innerWidth)
	d3.select("#map").style("width",(window.innerWidth-270)+"px")
 Promise.all([d3.json("intersections_2.json"),d3.csv("combined-boundaries - combined-boundaries.csv"),d3.json("geoData/policePrecinct.geojson")])
 .then(function(data){
	   var map = drawMap(data[0],data[1],data[2])
})
//click layer
//show a layer
//


function drawMap(intersections,newInter,geoTest){
	
//	console.log(intersections)
	
	for(var j in intersections){
	//	console.log(intersections[j])
		layerSizes[j]=Object.keys(intersections[j]).length
	}
//	console.log(layerSizes)
	//console.log("map")
	//console.log(newInter)
	
	var links = []
	var dict = {}
	for(var i in newInter){
		if(newInter[i]["fileName"]!=undefined){
			
		var layerNames = newInter[i]["fileName"].replace(".geojson","")
		var l1 = layerNames.split("-")[0]
		var l2 = layerNames.split("-")[1]
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
	//console.log(links)
//	console.log(dict)
	
    // d3.select("#map").style("width",window.innerWidth+"px")
 //          .style("height",window.innerHeight+"px")

    mapboxgl.accessToken = "pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jjjiia123/ckr5q89fg07qb17tjzrng0lxs",// ,//newest
		// style:"mapbox://styles/jjjiia123/ckoeh9hz9413117qhmh6w4mza",
		zoom: 10,
		preserveDrawingBuffer: true,
		minZoom:8,
		maxZoom:14,// ,
		// maxBounds: maxBounds
		center: [-73.95,40.71]
     });	 //
	 // map.on("mousemove",layers[0],function(d){
	 // 	console.log(d)
	 // })
	 
	// map.getCanvas().style.cursor = "unset";

//
	 map.addControl(new mapboxgl.NavigationControl(),'top-left');

      map.on("load",function(){
		  console.log(map.getStyle().layers)
		  map.on("click","communityDistrict",function(e){
			  var features = map.queryRenderedFeatures(e.point);
		  		console.log(features)
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
		//https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder-outside-the-map/
		//https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md#parameters
		document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
		
//
// 	console.log(map.getStyle().layers)
//
//
		//.addTo(map);
		var filters = {}
// map.setLayoutProperty("tract",'visibility',"none");// //
// map.setLayoutProperty("tract_outline",'visibility',"none");// //
 // map.setPaintProperty("borough_hover",'fill-color',"#000");
 // map.setPaintProperty('borough_hover','fill-opacity',0.3);


 // map.setPaintProperty('background','color',"#fff");
// map.setPaintProperty('water','fill-color',"#fff");
	map.on("click","borough_hover",function(e){
		//https://docs.mapbox.com/mapbox-gl-js/example/mouse-position/
			// console.log(e.point)
	// 		console.log(e.lngLat.lat)
		// if(marker!=undefined){
		// marker.remove()
		//
		// }
		//d3.select(".mapboxgl-ctrl-geocoder--input input").attr("value","test")
	geocoder.clear()
			d3.selectAll(".mapboxgl-marker").remove()
		var marker = new mapboxgl.Marker({
			color:"#fa6614"
		})
			marker.setLngLat([e.lngLat.lng,e.lngLat.lat])
			.addTo(map);
			d3.select("#presentLocation")
				.html("<span class=\"highlight\">The clicked location </span> "+Math.round(e.lngLat.lng*10000)/10000
					+", "+Math.round(e.lngLat.lat*10000)/10000
					+" <span class=\"highlight\">is in:</span> ")

			//console.log(marker)
	})
	
	
	var clickedFeatures = []
	
	for(var i in layers){

		 // console.log(layers[i])
		// map.setFilter(layers[i]+"_hover",["==","",""])
 
		map.setPaintProperty(layers[i]+"_hover",'fill-opacity',0);
		// map.setPaintProperty(layers[i]+"_hover",'fill-color',colors[layers[i]]);



		map.setPaintProperty(layers[i],'fill-color',colors[layers[i]]);
		map.setPaintProperty(layers[i]+"_outline",'line-color',colors[layers[i]]);

 
		  map.setPaintProperty(layers[i]+"_outline",'line-width',1);
		// map.setPaintProperty(layers[i]+"_outline",'line-opacity',0);

		 // map.setPaintProperty(layers[i],'line-opacity',.1);		//
		//  map.setLayoutProperty("road",'visibility',"none");
	//	map.setPaintProperty(layers[i],'fill-opacity',0.2);

		map.on("click",layers[i]+"_hover",function(c){

			

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

			//displayText+=layerName+" "+filterKey+": "+filterValue
			map.setLayoutProperty(layerName,'visibility',"visible");//
			map.setLayoutProperty(layerName+"_outline",'visibility',"visible");//

			filters[layerName] = {key:filterKey, value:filterValue}
			//console.log([layerName,filterValue])
			d3.select("#key").style("visibility","visible")
			d3.select("#"+layerName+"_text").html(layerName
			+"<br><span style=\"font-size:20px\"><strong>"+filterValue+"</strong></span>")

			//map.setPaintProperty(layerName+"_hover",'fill-opacity',.1);

			map.setPaintProperty(layerName+"_outline",'line-opacity',1);
			map.setPaintProperty(layerName,'fill-opacity', offOpacity);

			map.setFilter(layerName,["==",filterKey,filterValue])
			map.setFilter(layerName+"_outline",["==",filterKey,filterValue])
			//	console.log([layerName,filterValue])

			// map.setPaintProperty(layerName,'line-opacity',1);
			// map.setPaintProperty(layerName,'offset',i);
			//
			// currentAdmins[layerName]=intersections[layerName][filterValue]
			// currentAdmins[layerName]["gid"]=filterValue
  	    })
  	}
	
	
	//https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md#parameters
	geocoder.on("results",function(result){
		d3.selectAll(".mapboxgl-marker").remove()
		for(var i in layers){
      		 map.setPaintProperty(layers[i],'fill-opacity',0);
			
		}
	})
 		geocoder.on('result', function(result) {
			// console.log("geo")
			//console.log(result)
			
			d3.select("#presentLocation")
				.html("The address"
					+result.result["place_name"]
					+" is in")
			
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
	console.log(layers)
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
	
	for(var la in layers){
		var layerName = layers[la]
		//var capLayerName = layerName[0].toUpperCase()+layerName.substring(1)
		var key = layerName+"_"+formatted[layerName]
		var intersections = dict[key]
		var layerDisplayName = layerLabel[layerName]
		console.log(key)		
		var row = d3.select("#list")
			.append("div")
			.attr("id","row")
			.style("margin-bottom","10px")
		
		row.append("div").attr("class","listSubtitle")	
			.html(layerDisplayName+" "+formatted[layerName])
			.style("color",colors[layerName])
			.style("background-color","#000")
			//.style("color","#fff")
			.style("padding","5px")
			.style("cursor","pointer")
			.attr("id",layerName+"_subtitle")//+"_"+value+"_"+keyName)
			.attr("oc","c")
			// .on("mouseover",function(){
// 				var layer = d3.select(this).attr("id").split("_")[0]
// 				map.setPaintProperty(layer,"fill-opacity",onOpacity)
// 			})
// 			.on("mouseout",function(){
// 				var layer = d3.select(this).attr("id").split("_")[0]
// 				var oc = d3.select(this).attr("oc")
//
// 				if(oc=="c"){
// 					map.setPaintProperty(layer,"fill-opacity",offOpacity)
// 				}
// 			})
			.on("click",function(){
				d3.selectAll(".listText").style("display","none")
				var layer = d3.select(this).attr("id").split("_")[0]
				var oc = d3.select(this).attr("oc")
				
				if(oc=="o"){
					d3.select(this).attr("oc","c")
					d3.select("#"+layer+"_info").style("display","none")
					map.setPaintProperty(layer,"fill-opacity",offOpacity)
					return
				}
				
				
				for(var l in layers){
					map.setPaintProperty(layers[l],"fill-opacity",offOpacity)
					d3.select("#"+layers[l]+"_subtitle").attr("oc","c")
					
				}
				d3.select(this).attr("oc","o")
				d3.select("#"+layer+"_info").style("display","block")
			
				map.setPaintProperty(layer,"fill-opacity",onOpacity)
			})
			console.log(intersections)
			
		var intersectionLayers = row.append("div").attr("class","listText")
			.attr("id",layerName+"_info")
			.html("intersects with")
			
			for(var inter in intersections){
				//var formattedL =inter[0].toLowerCase()+inter.substring(1)
				var intersectionLayer = intersectionLayers.append("div")
					.attr("id",inter+"_intersections")
					.on("click",function(){
						var clickedLayer = d3.select(this).attr("id").replace("_intersections","")
						//var formattedClicked = clickedLayer[0].toLowerCase()+clickedLayer.substring(1)
						var gids = intersections[clickedLayer]
						console.log(gids)
						var formattedGids = []
						for(var g in gids){
							formattedGids.push(parseInt(gids[g]))
						}
						
						var idKey = layerUniqueIds[clickedLayer]
						console.log(formattedGids)
						console.log(layerUniqueIds[clickedLayer])
						var filter = ["in",idKey].concat(formattedGids)
						//map.setPaintProperty(formattedClicked+"_intersect","fill-opacity",.5)
						map.setPaintProperty(clickedLayer+"_intersect","line-color",colors[formattedClicked])
						map.setPaintProperty(clickedLayer+"_intersect","line-width",2)
						map.setLayoutProperty(clickedLayer+"_intersect",'visibility',"visible");//
						console.log(filter)
						for(var interLayers in layers){
							var intersectionLayerName = layers[interLayers]
 							map.setFilter(intersectionLayerName+"_intersect",["==",idKey,""])
							
							if(intersectionLayerName!=layerName){
								console.log([intersectionLayerName,layerName])
			 			map.setLayoutProperty(intersectionLayerName+"_outline",'visibility',"none");//
			 		map.setLayoutProperty(intersectionLayerName,'visibility',"none");//
							}
						}
						
 						map.setFilter(clickedLayer+"_intersect",filter)
						
   //     map.setFilter("counties",["in","FIPS"].concat(list))
						
						
					})
				if(intersections[inter].length>1){
					intersectionLayer.html(intersections[inter].length+" "+ layerLabel[formattedL]+"s")	
				}else{
					intersectionLayer.html(intersections[inter].length+" "+ layerLabel[formattedL])
				}
			}
			d3.selectAll(".listText").style("display","none")
	}

}

function filterOnResult(map,features){
	for(var f in features){
			//console.log(features[f])
			 var layerName = features[f].layer.id.replace("_hover","")  	 	  
			 var idKey = layerUniqueIds[layerName]
			
			//console.log(idKey)
			 var gid = features[f]["properties"][idKey]
			//console.log([idKey,gid])
 			map.setFilter(layerName,["==",idKey,gid])
 			map.setFilter(layerName+"_outline",["==",idKey,gid])
   		 	map.setPaintProperty(layerName+"_outline",'line-opacity',1);
			map.setLayoutProperty(layerName,'visibility',"visible");//
			map.setLayoutProperty(layerName+"_outline",'visibility',"visible");//
		 

		 // map.setPaintProperty(layerName,'fill-color',colors[i]);
		 map.setPaintProperty(layerName,'fill-opacity',offOpacity);
			//map.setFilter(layerName+"_hover",["!=",idKey,gid])
		}
}

