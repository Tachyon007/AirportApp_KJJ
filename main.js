

//TO RUN: "npm start" (runs with Vite)

import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {Style, Circle, Fill, Stroke, Icon} from 'ol/style';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj'

import airportData from './data/datasets/airports.json';
import airports from './data/airports.js';
import { Geometry, LineString } from 'ol/geom';

import OPS from './OP_Styles/OPS1';
import MousePosition from 'ol/control/MousePosition.js';



const fill = new Fill({
  color: 'rgba(255,255,255,0.4)',
});
const stroke = new Stroke({
  color: '#3399CC',
  width: 1.25,//1.25
});

//custom layers
var allActiveLayers = [];

const feaureLayer = new VectorLayer({
  source: new VectorSource(),
  style: {
    'fill-color': 'rgba(25, 0, 255, 0.3)',
    'stroke-color': 'rgba(25, 0, 255, 0.3)',
    'stroke-width': 2,
    'circle-radius': 3,//4
    'circle-fill-color': 'rgba(50, 0, 255, 0.5)',
    'stroke-line-dash': [0.1, 4]
  },
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    feaureLayer
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

map.on('click', function (e) {

  /*let vectorLayer = makePoint(new Point(e.coordinate));
  
  //
  if(allActiveLayers.length > 0){
    map.removeLayer(allActiveLayers[allActiveLayers.length-1]);
    allActiveLayers.splice(0, 1);
  }
  
  map.addLayer(vectorLayer);
  allActiveLayers.push(vectorLayer);
  //console.log(e.coordinate);*/
});


//map.on('pointermove', function (e) {console.log(e.coordinate);});

//returns vectorLayer
function makePoint(pointObj){
  var feat = new Feature(pointObj);

  feat.setStyle(new Style({
     
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: 5,
    }),
    fill: fill,
    stroke: stroke,

  }));

  const source = new VectorSource({features: [feat]});
  const vectorLayer = new VectorLayer({source: source});

  return vectorLayer;
}







//NEW DEV----------------------------------------

let targetSource = feaureLayer.getSource();
/*for(let i = 0; i < airports.length; i++){

  //add point for every airport
  let dot = new Feature({
    name:"" + (Math.floor(Math.random() * 100000)),
    geometry: new Point(airports[i].coordinates)
  })
  targetSource.addFeature(dot);

  //add line to connected destinations
  for(let j = 0; j < airports[i].connections.length; j++){
    let line = new Feature({
      name:"" + (Math.floor(Math.random() * 100000)),
      geometry: new LineString([airports[i].coordinates, airports[i].connections[j]])
    })
    targetSource.addFeature(line);
  }
 
}
*/

//LINE TEST
class Airplane{
  constructor(country, origin, destination){
    this.country = country;
    this.origin = origin;
    this.destination = destination;

    this.position = origin.slice();
    this.stepSize = 0.0001
    this.stepX = -(origin[0] - destination[0]) * this.stepSize;
    this.stepY = -(origin[1] - destination[1]) * this.stepSize;

    this.feature = new Feature({
      name:"" + (Math.floor(Math.random() * 100000)),
      geometry: new Point(this.position),
    });
    this.feature.setStyle(new Style({
      image: new Circle({
        radius: 3,
        fill: new Fill({color: 'rgba(255,0,0,0.5)'}),
        //stroke: new Stroke({color: 'red', width: 1}),
      }),
    }));


    feaureLayer.getSource().addFeature(this.feature);
  }

  step(){
    this.position = [this.position[0] + this.stepX, this.position[1] + this.stepY];
    this.feature.getGeometry().translate(this.stepX, this.stepY);

    let dist = Math.sqrt(Math.pow((this.position[0] - this.destination[0]), 2) + 
        Math.pow((this.position[1] - this.destination[1]), 2));
    if(dist < 100){
      this.stepX = 0;
      this.stepY = 0;
    }
  }
}
let lonLat = [-73.809,42.7426];
let c = olProj.fromLonLat(lonLat);

/*let a = new Airplane("US", c, [ 1611648.4099573484, 6464290.113660861]);
setInterval(()=>{
  a.step();
}, 10);*/


if(true){
  let US_AIRTPORTS = [];
  for(let i = 0; i < airportData.length; i++){
    //if(airportData[i].country === "United States" && JSON.parse(airportData[i].runway_length) > 10000){
      if(JSON.parse(airportData[i].runway_length) > 2000){
      let a = airportData[i];
      let profile = {
          name: a.name,
          coordLonLat: [(a.lon), (a.lat)],
          coordinates: olProj.fromLonLat([JSON.parse(a.lon), JSON.parse(a.lat)]),
          connections:[],
          status:"green"
      }
  
      US_AIRTPORTS.push(profile);
    }
  }

  //add connections
  for(let i = 0; i < US_AIRTPORTS.length; i++){

    //let randomAirport = (Math.floor(Math.random() * US_AIRTPORTS.length));
    //US_AIRTPORTS[i].connections.push(US_AIRTPORTS[randomAirport].coordinates);

    /*if(Math.random() > .5){continue}
    randomAirport = (Math.floor(Math.random() * US_AIRTPORTS.length));
    US_AIRTPORTS[i].connections.push(US_AIRTPORTS[randomAirport].coordinates);
    if(Math.random() > .5){continue}
    randomAirport = (Math.floor(Math.random() * US_AIRTPORTS.length));
    US_AIRTPORTS[i].connections.push(US_AIRTPORTS[randomAirport].coordinates);*/
  }
  
  console.log(US_AIRTPORTS);
  
  
  //draw
  for(let i = 0; i < US_AIRTPORTS.length; i++){
    let currAirport = US_AIRTPORTS[i];
    console.log(currAirport);
  
    //add point for every airport
    let dot = new Feature({
      rID:"" + (Math.floor(Math.random() * 100000)),
      name: currAirport.name,
      lonlat: currAirport.coordLonLat,
      geometry: new Point(currAirport.coordinates)
    })


    targetSource.addFeature(dot);
  
    //add line to connected destinations
    for(let j = 0; j < currAirport.connections.length; j++){
      let line = new Feature({
        name:"" + (Math.floor(Math.random() * 100000)),
        geometry: new LineString([currAirport.coordinates, currAirport.connections[j]])
      })
      targetSource.addFeature(line);
    }
   
  }
}
///////////////////////////Track closest
let closestAirport = null;
let clAirLine = new Feature({
    name:"" + (Math.floor(Math.random() * 100000)),
    geometry: new LineString([[0,0], [0,0]])
  });
targetSource.addFeature(clAirLine);



let ourPlane = new Feature({
  name:"plane",
  geometry: new Point([0,0])
})
targetSource.addFeature(ourPlane);

const iconStyle = new Style({
  image: new Icon({
    anchor: [0, 0],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: './assets/plane2.png',
    imgSize: [25,25],
    displacement: [-25/2, 25/2]
  }),
});
ourPlane.setStyle(iconStyle);//  dot.getStyle().getImage().setRotation(r);


let coords = [0,0];
let lastCoords = [0,1];
let angle = -Math.atan((lastCoords[1] - coords[1]) / (lastCoords[0] - coords[0]));


map.addControl(new MousePosition({
  coordinateFormat: function(coordinate) {

    lastCoords = coords;

    let customModulo = Math.floor((coordinate[0] + 180) / 360);
    customModulo = (coordinate[0]) - customModulo * 360;
    coords = [customModulo, coordinate[1]]
    coords = olProj.fromLonLat(coords);
    
    if(closestAirport != null){closestAirport.setStyle()}
    closestAirport = targetSource.getClosestFeatureToCoordinate(coords, (feat)=>{
        return ((feat.getProperties().name != clAirLine.getProperties().name)
                && (feat.getProperties().name != "plane"));
    });
    closestAirport.setStyle(OPS.s1);

    let claCoord = closestAirport.getGeometry().getFirstCoordinate();
    if(claCoord[0].length != null){
      claCoord = claCoord[0];
    }
    clAirLine.getGeometry().setCoordinates([claCoord, coords]);
    clAirLine.setStyle();

    ourPlane.getGeometry().setCoordinates(coords);

    //map.getView().centerOn(coords, map.getSize(), [2,2]);


    let lastAngle = angle;
    /*angle = -Math.atan((lastCoords[1] - coords[1]) / (lastCoords[0] - coords[0] +0.0001));
    if(lastCoords[0] - coords[0] > 0){angle += Math.PI}*/
    angle = Math.atan2((lastCoords[1] - coords[1]) * -1, lastCoords[0] - coords[0]);
    angle += Math.PI;




    angle = (angle + lastAngle * 6) / 7;
    ourPlane.getStyle().getImage().setRotation(angle);

    document.getElementById("HUD_NA").innerText = closestAirport.getProperties().name;
    document.getElementById("HUD_lon").innerText = closestAirport.getProperties().lonlat[0];
    document.getElementById("HUD_lat").innerText = closestAirport.getProperties().lonlat[1];

  },
  className: 'hide',
  projection: 'EPSG:4326',
}));