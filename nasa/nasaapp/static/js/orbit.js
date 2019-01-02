var wwd = new WorldWind.WorldWindow("globe");
wwd.addLayer(new WorldWind.BMNGLandsatLayer());
wwd.addLayer(new WorldWind.AtmosphereLayer());
wwd.addLayer(new WorldWind.StarFieldLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));

var formatsLayer = new WorldWind.RenderableLayer("Format Demos");
wwd.addLayer(formatsLayer);

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
placemarkAttributes.imageScale = 0.025;
placemarkAttributes.imageColor = WorldWind.Color.WHITE;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
  WorldWind.OFFSET_FRACTION, 0.5,
  WorldWind.OFFSET_FRACTION, 1.0);
placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

var onConfigureShape = function (attributes, record) {
  var configuration = {};
  configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

  if (record.isPointType()) {
    configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

    configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

    if (attributes.values.pop_max) {
      var population = attributes.values.pop_max;
      configuration.attributes.imageScale = 0.01 * Math.log(population);
    }
  } else if (record.isPolygonType()) {
    configuration.attributes = new WorldWind.ShapeAttributes(null);

    // Fill the polygon with a random pastel color.
    configuration.attributes.interiorColor = new WorldWind.Color(
      0.375 + 0.5 * Math.random(),
      0.375 + 0.5 * Math.random(),
      0.375 + 0.5 * Math.random(),
      1.0);

    // Paint the outline in a darker variant of the interior color.
    configuration.attributes.outlineColor = new WorldWind.Color(
      0.5 * configuration.attributes.interiorColor.red,
      0.5 * configuration.attributes.interiorColor.green,
      0.5 * configuration.attributes.interiorColor.blue,
      1.0);
  }

  return configuration;
};

var shapefileLibrary = "https://worldwind.arc.nasa.gov/web/examples/data/shapefiles/naturalearth";
var worldShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp");
worldShapefile.load(null, onConfigureShape, formatsLayer);