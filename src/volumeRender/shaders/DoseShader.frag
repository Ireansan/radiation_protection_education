precision highp float;
precision mediump sampler3D;

uniform vec3 u_size;
uniform int u_renderstyle;
uniform float u_renderthreshold;
uniform float u_coefficient;
uniform float u_offset;
uniform float u_opacity;
uniform vec2 u_clim;

uniform sampler3D u_data;
uniform sampler2D u_cmdata;
uniform mat4 u_modelMatrix;

varying vec3 v_position;
varying vec4 v_nearpos;
varying vec4 v_farpos;

varying mat4 viewtransformf;

// The maximum distance through our rendering volume is sqrt(3).
const int MAX_STEPS=887;// 887 for 512^3, 1774 for 1024^3
const int REFINEMENT_STEPS=4;
const float relative_step_size=1.;
const vec4 ambient_color=vec4(.2,.4,.2,1.);
const vec4 diffuse_color=vec4(.8,.2,.2,1.);
const vec4 specular_color=vec4(1.,1.,1.,1.);
const float shininess=40.;

// https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/clipping_planes_pars_fragment.glsl.js
#if NUM_CLIPPING_PLANES>0
uniform vec4 clippingPlanes[NUM_CLIPPING_PLANES];
uniform bool u_clippedInitValue[NUM_CLIPPING_PLANES];
uniform int u_clippingPlanesRegion[NUM_CLIPPING_PLANES];
uniform bool u_clippingPlanesIsBoard[NUM_CLIPPING_PLANES];
uniform bool u_clippedInvert[NUM_CLIPPING_PLANES];
bool regionResults[NUM_CLIPPING_PLANES];
#endif
struct ClippedResult{
    bool clipped;
    bool guarded;
};

void cast_mip(vec3 start_loc,vec3 step,int nsteps,vec3 view_ray);
void cast_iso(vec3 start_loc,vec3 step,int nsteps,vec3 view_ray);

vec3 clip_position(vec3 position);
ClippedResult within_boundaries(vec3 position);
float sample1(vec3 texcoords,bool guarded);
vec4 apply_colormap(float val);
vec4 add_lighting(float val,vec3 loc,vec3 step,vec3 view_ray,bool guarded);

void main(){
    // Normalize clipping plane info
    vec3 farpos=v_farpos.xyz/v_farpos.w;
    vec3 nearpos=v_nearpos.xyz/v_nearpos.w;
    
    // Calculate unit vector pointing in the view direction through this fragment.
    vec3 view_ray=normalize(nearpos.xyz-farpos.xyz);
    
    // Compute the (negative) distance to the front surface or near clipping plane.
    // v_position is the back face of the cuboid, so the initial distance calculated in the dot
    // product below is the distance from near clip plane to the back of the cuboid
    float distance=dot(nearpos-v_position,view_ray);
    distance=max(distance,min((-.5-v_position.x)/view_ray.x,
    (u_size.x-.5-v_position.x)/view_ray.x));
    distance=max(distance,min((-.5-v_position.y)/view_ray.y,
    (u_size.y-.5-v_position.y)/view_ray.y));
    distance=max(distance,min((-.5-v_position.z)/view_ray.z,
    (u_size.z-.5-v_position.z)/view_ray.z));
    
    // Now we have the starting position on the front surface
    vec3 front=v_position+view_ray*distance;
    
    // Decide how many steps to take
    int nsteps=int(-distance/relative_step_size+.5);
    if(nsteps<1)
    discard;
    
    // Get starting location and step vector in texture coordinates
    vec3 step=((v_position-front)/u_size)/float(nsteps);
    vec3 start_loc=front/u_size;
    
    // For testing: show the number of steps. This helps to establish
    // whether the rays are correctly oriented
    //'gl_FragColor = vec4(0.0, float(nsteps) / 1.0 / u_size.x, 1.0, 1.0);
    //'return;
    
    if(u_renderstyle==0)
    cast_mip(start_loc,step,nsteps,view_ray);
    else if(u_renderstyle==1)
    cast_iso(start_loc,step,nsteps,view_ray);
    
    if(gl_FragColor.a<.05)
    discard;
}

// https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/clipping_planes_vertex.glsl.js
vec3 clip_position(vec3 position){
    vec4 position4=vec4(position,1.);
    vec4 mvPosition=viewMatrix*u_modelMatrix*position4;
    return-mvPosition.xyz;
}

// https://discourse.threejs.org/t/multiple-angle-clipping-in-volume/9242
// https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/clipping_planes_fragment.glsl.js
// https://qiita.com/edo_m18/items/b1bc950ac6965c321e29
ClippedResult within_boundaries(vec3 position){
    bool clipped;
    bool guarded;
    
    #if NUM_CLIPPING_PLANES>0
    regionResults=u_clippedInitValue;
    bool regionResult;
    
    vec4 plane;
    int regionIndex;
    bool isBoard;
    bool initValue;
    
    // then clipIntersection == false
    #pragma unroll_loop_start
    for(int i=0;i<UNION_CLIPPING_PLANES;i++){
        // clipping
        plane=clippingPlanes[i];
        regionIndex=u_clippingPlanesRegion[i];
        
        clipped=clipped||(dot(position,plane.xyz)>plane.w);
        regionResults[regionIndex]=clipped;
    }
    #pragma unroll_loop_end
    
    // then clipIntersection == true
    #if UNION_CLIPPING_PLANES<NUM_CLIPPING_PLANES
    #pragma unroll_loop_start
    for(int i=UNION_CLIPPING_PLANES;i<NUM_CLIPPING_PLANES;i++){
        // clipping
        plane=clippingPlanes[i];
        regionIndex=u_clippingPlanesRegion[i];
        
        clipped=regionResults[regionIndex];
        clipped=clipped&&(dot(position,plane.xyz)>plane.w);
        regionResults[regionIndex]=clipped;
    }
    #pragma unroll_loop_end
    #endif
    
    bool invert;
    clipped=false;
    guarded=false;
    
    // Calclate result and Apply invert
    #pragma unroll_loop_start
    for(int i=0;i<NUM_CLIPPING_PLANES;i++){
        regionResult=regionResults[i];
        
        isBoard=u_clippingPlanesIsBoard[i];
        if(isBoard){
            guarded=guarded||regionResult;
            regionResult=false;
        }
        
        invert=u_clippedInvert[i];
        regionResult=regionResult^^invert;
        
        clipped=regionResult||clipped;
    }
    #pragma unroll_loop_end
    #endif
    
    ClippedResult result;
    result.clipped=clipped;
    result.guarded=guarded;
    return result;
}

float sample1(vec3 texcoords,bool guarded){
    float coefficient=guarded?u_coefficient:1.;
    float offset=guarded?u_offset:0.;
    
    /* Sample float value from a 3D texture. Assumes intensity data. */
    return(coefficient*texture(u_data,texcoords.xyz).r)+offset;
}

vec4 apply_colormap(float val){
    val=(val-u_clim[0])/(u_clim[1]-u_clim[0]);
    return texture2D(u_cmdata,vec2(val,.5));
}

void cast_mip(vec3 start_loc,vec3 step,int nsteps,vec3 view_ray){
    float max_val=-1e6;
    int max_i=100;
    vec3 loc=start_loc;
    bool updated=false;
    
    // Enter the raycasting loop. In WebGL 1 the loop index cannot be compared with
    // non-constant expression. So we use a hard-coded max, and an additional condition
    // inside the loop.
    for(int iter=0;iter<MAX_STEPS;iter++){
        if(iter>=nsteps)
        break;
        
        vec3 uv_position=u_size*loc;
        vec3 vClipPosition=clip_position(uv_position);
        ClippedResult clipped=within_boundaries(vClipPosition);
        
        // Sample from the 3D texture
        float val=sample1(loc,clipped.guarded);
        
        // Apply MIP operation
        if(val>max_val&&!clipped.clipped){
            max_val=val;
            max_i=iter;
            updated=true;
        }
        // Advance location deeper into the volume
        loc+=step;
    }
    
    // Refine location, gives crispier images
    vec3 iloc=start_loc+step*(float(max_i)-.5);
    vec3 istep=step/float(REFINEMENT_STEPS);
    for(int i=0;i<REFINEMENT_STEPS;i++){
        vec3 uv_position=u_size*iloc;
        vec3 vClipPosition=clip_position(uv_position);
        ClippedResult clipped=within_boundaries(vClipPosition);
        
        max_val=max(max_val,sample1(iloc,clipped.guarded));
        iloc+=istep;
    }
    
    // Resolve final color
    if(updated){
        gl_FragColor=apply_colormap(max_val);
        gl_FragColor.a=u_opacity;
        return;
    }
}

void cast_iso(vec3 start_loc,vec3 step,int nsteps,vec3 view_ray){
    
    gl_FragColor=vec4(0.);// init transparent
    vec4 color3=vec4(0.);// final color
    vec3 dstep=1.5/u_size;// step to sample derivative
    vec3 loc=start_loc;
    
    float low_threshold=u_renderthreshold-.02*(u_clim[1]-u_clim[0]);
    
    // Enter the raycasting loop. In WebGL 1 the loop index cannot be compared with
    // non-constant expression. So we use a hard-coded max, and an additional condition
    // inside the loop.
    for(int iter=0;iter<MAX_STEPS;iter++){
        
        if(iter>=nsteps)
        break;
        
        vec3 uv_position=u_size*loc;
        vec3 vClipPosition=clip_position(uv_position);
        ClippedResult clipped=within_boundaries(vClipPosition);
        
        // Sample from the 3D texture
        float val=sample1(loc,clipped.guarded);
        
        if(val>low_threshold&&!clipped.clipped){
            // Take the last interval in smaller steps
            vec3 iloc=loc-.5*step;
            vec3 istep=step/float(REFINEMENT_STEPS);
            for(int i=0;i<REFINEMENT_STEPS;i++){
                vec3 uv_position=u_size*iloc;
                vec3 vClipPosition=clip_position(uv_position);
                ClippedResult clipped=within_boundaries(vClipPosition);
                
                val=sample1(iloc,clipped.guarded);
                
                if(val>u_renderthreshold||clipped.clipped){
                    gl_FragColor=add_lighting(val,iloc,dstep,view_ray,clipped.guarded);
                    gl_FragColor.a=u_opacity;
                    return;
                }
                iloc+=istep;
            }
        }
        
        // Advance location deeper into the volume
        loc+=step;
    }
}

vec4 add_lighting(float val,vec3 loc,vec3 step,vec3 view_ray,bool guarded){
    // Calculate color by incorporating lighting
    
    // View direction
    vec3 V=normalize(view_ray);
    
    // calculate normal vector from gradient
    vec3 N;
    float val1,val2;
    val1=sample1(loc+vec3(-step[0],0.,0.),guarded);
    val2=sample1(loc+vec3(+step[0],0.,0.),guarded);
    N[0]=val1-val2;
    val=max(max(val1,val2),val);
    val1=sample1(loc+vec3(0.,-step[1],0.),guarded);
    val2=sample1(loc+vec3(0.,+step[1],0.),guarded);
    N[1]=val1-val2;
    val=max(max(val1,val2),val);
    val1=sample1(loc+vec3(0.,0.,-step[2]),guarded);
    val2=sample1(loc+vec3(0.,0.,+step[2]),guarded);
    N[2]=val1-val2;
    val=max(max(val1,val2),val);
    
    float gm=length(N);// gradient magnitude
    N=normalize(N);
    
    // Flip normal so it points towards viewer
    float Nselect=float(dot(N,V)>0.);
    N=(2.*Nselect-1.)*N;// ==	Nselect * N - (1.0-Nselect)*N;
    
    // Init colors
    vec4 ambient_color=vec4(0.,0.,0.,0.);
    vec4 diffuse_color=vec4(0.,0.,0.,0.);
    vec4 specular_color=vec4(0.,0.,0.,0.);
    
    // note: could allow multiple lights
    for(int i=0;i<1;i++)
    {
        // Get light direction (make sure to prevent zero devision)
        vec3 L=normalize(view_ray);//lightDirs[i];
        float lightEnabled=float(length(L)>0.);
        L=normalize(L+(1.-lightEnabled));
        
        // Calculate lighting properties
        float lambertTerm=clamp(dot(N,L),0.,1.);
        vec3 H=normalize(L+V);// Halfway vector
        float specularTerm=pow(max(dot(H,N),0.),shininess);
        
        // Calculate mask
        float mask1=lightEnabled;
        
        // Calculate colors
        ambient_color+=mask1*ambient_color;// * gl_LightSource[i].ambient;
        diffuse_color+=mask1*lambertTerm;
        specular_color+=mask1*specularTerm*specular_color;
    }
    
    // Calculate final color by componing different components
    vec4 final_color;
    vec4 color=apply_colormap(val);
    final_color=color*(ambient_color+diffuse_color)+specular_color;
    final_color.a=color.a;
    return final_color;
}