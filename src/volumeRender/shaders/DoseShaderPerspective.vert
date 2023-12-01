varying vec4 v_nearpos;
varying vec4 v_farpos;
varying vec3 v_position;

// https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/clipping_planes_pars_vertex.glsl.js
varying mat4 viewtransformf;

void main(){
    // Prepare transforms to map to "camera view". See also:
    // https://threejs.org/docs/#api/renderers/webgl/WebGLProgram
    viewtransformf=modelViewMatrix;
    mat4 viewtransformi=inverse(modelViewMatrix);
    
    // Project local vertex coordinate to camera position. Then do a step
    // backward (in cam coords) to the near clipping plane, and project back. Do
    // the same for the far clipping plane. This gives us all the information we
    // need to calculate the ray and truncate it to the viewing cone.
    vec4 position4=vec4(position,1.);
    vec4 pos_in_cam=viewtransformf*position4;
    vec4 pos_in_cam_div_z=pos_in_cam/pos_in_cam.z;
    
    // Intersection of ray and near clipping plane (z = -1 in clip coords)
    // pos_in_cam=-pos_in_cam_div_z;
    pos_in_cam=vec4(0.);
    pos_in_cam.w=1.;
    v_nearpos=viewtransformi*pos_in_cam;
    
    // Intersection of ray and far clipping plane (z = +1 in clip coords)
    pos_in_cam=pos_in_cam_div_z;
    pos_in_cam.w=1.;
    v_farpos=viewtransformi*pos_in_cam;
    
    // Set varyings and output pos
    v_position=position;
    gl_Position=projectionMatrix*viewMatrix*modelMatrix*position4;
}