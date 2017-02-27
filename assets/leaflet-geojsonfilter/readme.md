#L.geojsonFilter

This extension of leaflet is inspired by mapbox [featureLayer.setFilter](https://www.mapbox.com/mapbox.js/api/v2.4.0/l-mapbox-featurelayer/#section-featurelayer-setfilter) function.

When you use `setFilter` function in `L.geoJson`, the origin geoJson will not be stored. After changing the filter, markers will becomes less. Therefore I wants to save the geoJson alternatively.  

## Installation

From npm repo

```
npm install leafletgeojsonfilter --save
```

From CDN

```
https://cdn.rawgit.com/brandonxiang/leaflet.geoJsonFilter/develop/src/L.geoJsonFilter.js
```


## Version

0.0.1 L.geoJsonFilter is a extension of L.GeoJSON, so you should call `L.geoJsonFilter`

0.1.0 setFilter is included in L.GeoJSON, so you can call 'L.geoJson'

## Usage

```
marker.setFilter(function(f){
    return f.properties.number === 2;
});
```

### DEMO

[0.0.1 DEMO](http://brandonxiang.github.io/leaflet.geoJsonFilter/0.0.1/)

[0.1.0 DEMO](http://brandonxiang.github.io/leaflet.geoJsonFilter/0.1.0/)

### LICENSE

[MIT](LICENSE)


##进阶插件编写geojsonFilter

----------------------------------

> github源码在此，记得点星:
https://github.com/brandonxiang/leaflet.geoJsonFilter

灵感来源自mapbox的[featureLayer.setFilter](https://www.mapbox.com/mapbox.js/api/v2.4.0/l-mapbox-featurelayer/#section-featurelayer-setfilter)功能。

当然L.geoJson也有setfilter的功能，但是它原始的geojson并不会进行存储，在改变filter后，markers会越来越少。这是由于它并没有存储原型数据，我参考了mapbox.js的featurelayer源码。将输入数据以私有变量的形式存储起来，替换filter时再进行加载。这样，就可以不用mapbox.js的情况下使用setfilter。

###原理

原理很简单，先将geojson存起来。当setfilter完成后重新加载。

###使用方法
```
marker.setFilter(function(f){
   return f.properties.number === 2;
});
```

###例子

[0.0.1 DEMO](http://brandonxiang.github.io/leaflet.geoJsonFilter/0.0.1/)

[0.1.0 DEMO](http://brandonxiang.github.io/leaflet.geoJsonFilter/0.1.0/)

转载，请表明出处。[总目录Awesome GIS](http://www.jianshu.com/p/3b3efa92dd6d)
