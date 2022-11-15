import * as THREE from "three";

import volumeRenderShader from "../shaders/volumeShader";
import { applyBasePath } from "../../utils";

class volumeObject extends THREE.Mesh {
    volume: any;
    clim1: number;
    clim2: number;
    colormap: string;
    renderstyle: string;
    isothreshold: number;
    clipping: boolean;
    planes: THREE.Plane[];

    constructor(volume: any) {
        const clim1 = 0;
        const clim2 = 1;
        const colormap = "viridis";
        const renderstyle = "mip";
        const isothreshold = 0.1;
        const clipping = false;
        const planes = [];
        
        // Texture
        const texture = new THREE.Data3DTexture( volume.data, volume.xLength, volume.yLength, volume.zLength );
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;

        // Colormap textures
        const cmtextures :{ [index: string]: THREE.Texture }= {
            parula: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_parula.png`)
            ),
            heat: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_heat.png`)
            ),
            jet: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_jet.png`)
            ),
            turbo: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_turbo.png`)
            ),
            hot: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_hot.png`)
            ),
            gray: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_gray.png`)
            ),
            magma: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_magma.png`)
            ),
            inferno: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_inferno.png`)
            ),
            plasma: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_plasma.png`)
            ),
            viridis: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_viridis.png`)
            ),
            cividis: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_cividis.png`)
            ),
            github: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_github.png`)
            ),
            cubehelix: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_cubehelix.png`)
            ),
        };

        // Material
        const uniforms = THREE.UniformsUtils.clone( volumeRenderShader.uniforms );
        uniforms.u_data.value = texture;
        uniforms.u_size.value.set( volume.xLength, volume.yLength, volume.zLength );
        uniforms.u_clim.value.set( clim1, clim2 );
        uniforms.u_renderstyle.value = renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
        uniforms.u_renderthreshold.value = isothreshold; // For ISO renderstyle
        uniforms.u_cmdata.value = cmtextures[ colormap ];

        const material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: volumeRenderShader.vertexShader,
            fragmentShader: volumeRenderShader.fragmentShader,
            side: THREE.BackSide // The volume shader uses the backface as its "reference point"
        } );

        // THREE.Mesh
        const geometry = new THREE.BoxGeometry( volume.xLength, volume.yLength, volume.zLength );
        geometry.translate( volume.xLength / 2 - 0.5, volume.yLength / 2 - 0.5, volume.zLength / 2 - 0.5 );

        super(geometry, material);
        
        this.volume = volume;
        this.clim1 = 0;
        this.clim2 = 1;
        this.colormap = "viridis";
        this.renderstyle = "mip";
        this.isothreshold = 0.1;
        this.clipping = false;
        this.planes = [];
    }
}

export { volumeObject }