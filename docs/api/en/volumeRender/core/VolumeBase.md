Object3D &rarr;

# VolumeBase

## Constructor
### VolumeBase(isDose: boolean, isPerspective: Boolean)
isDose — (optional) a flag for processing done only with dose data. Default is `false`.
isPerspective — (optional) a flag to specify shaders to use. Default is `false`.

## Properties
See the base [Object3D](https://threejs.org/docs/?q=Obje#api/en/core/Object3D) class for common properties.

### .coefficient : Number
A coefficient for the original data value. Default value is `1.0`.

### .offset : Number
An offset for the original data value. Default value is `0.0`.

### .opacity : Number
An opacity of volume rendering. Default value is `1.0`.

### .clim1 : Number
A minimum colormap limit ([clim](https://www.mathworks.com/help/matlab/ref/clim.html)). Default value is `0.0`.

### .clim2 : Number
A maximum colormap limit ([clim](https://www.mathworks.com/help/matlab/ref/clim.html)). Default value is `1.0`.

### .colormap : String
The colormap to apply. Default is 'viridis'. Other possibilities are: 'parula', 'heat', 'jet', 'turbo', 'hot', 'gray', 'magma', 'inferno', 'plasma', 'cividis', 'github', and 'cubehelix'. These must be in lower case.

### .renderstyle : String
The render style to apply. Default is 'mip'. Other possibility is: 'iso'. These must be in lower case.

'mip' stands for [Maximum Intensity Projection](https://en.wikipedia.org/wiki/Maximum_intensity_projection), and 'iso' stands for [Iso-Surface](https://en.wikipedia.org/wiki/Isosurface).

### .isothreshold : Number
The threshold specifices the minimum value to be drawn when [renderstyle]() is 'iso'.

### .clipping : Boolean
The change performs the necessary processing for clipping in the shader and enables clipping. Default is `false`.

### .clippingPlanes : Planes
See [Material.clippingPlanes](https://threejs.org/docs/?q=Material#api/en/materials/Material.clippingPlanes)

### .clipIntersection : Boolean
See [Material.clipIntersection](https://threejs.org/docs/?q=Material#api/en/materials/Material.clipIntersection)

<!-- NOTE: Done above -->
### .clippedInitValue : Boolean[]

### .clippingPlanesRegion : Number[]

### .clippedInvert : Boolean[]

### .clippingPlanesObject : ClippingPlanesObject | undefined

### .parentId : String | undefined

### .parentRegionOffset : Number

### .planesLength : Number

### .clippingPlanesObjects : ClippingPlanesObject[]

### .totalClippingPlanesObjects : ClippingPlanesObject[]

### .volumeParamAutoUpdate : Boolean
Default is `true`.

### .volumeClippingAutoUpdate : Boolean
Default is `true`.

### .coefficientAutoUpdate : Boolean
Default is `true`.

### .offsetAutoUpdate : Boolean
Default is `true`.

### .pacityAutoUpdate : Boolean
Default is `true`.

### .clim1AutoUpdate : Boolean
Default is `true`.

### .clim2AutoUpdate : Boolean
Default is `true`.

### .colormapAutoUpdate : Boolean
Default is `true`.

### .renderstyleAutoUpdate : Boolean
Default is `true`.

### .isothresholdAutoUpdate : Boolean
Default is `true`.

### .volumeParamWorldAutoUpdate : Boolean
Default is `true`.

### .volumeClippingWorldAutoUpdate : Boolean
Default is `true`.

### .isPerspective : Boolean
A flag to specify shaders to use.

### .boardEffect : Boolean

### .boardCoefficient : Number

### .boardOffset : Number

### .clippingPlanesIsBoard : Boolean[]

### .boardCoefficientAutoUpdate : Boolean

### .boardOffsetAutoUpdate : Boolean

## Methods
### .updateVolumeParam() : undefined

### .upadteVolumeClipping() : undefined

### .getVolumeValue() : Number
