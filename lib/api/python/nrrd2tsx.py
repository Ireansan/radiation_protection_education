import re
import os

def nrrd2tsx(filepath_model, component_name=None, out_dir="", file_depth=1):
    name = ""
    if (component_name == None):
        filename = re.findall(".*\/(.*)\.nrrd", filepath_model)
        name = filename.group().capitalize()
    else:
        name = component_name

    relative_path = "../" * file_depth

    tmpText = '''import React from "react";
import {
    extend,
    ReactThreeFiber,
    useThree,
    useLoader,
} from "@react-three/fiber";
import { Volume, NRRDLoader } from "three-stdlib";

import { VolumeObject } from "''' + relative_path +'''volumeRender"; // FIXME: filepath
extend({ VolumeObject });

import { applyBasePath } from "''' + relative_path +'''utils";
const modelURL = applyBasePath(`''' + filepath_model + '''`);

export function ''' + name + '''({
    ...props
}: JSX.IntrinsicElements["volumeObject"]) {
    const { gl } = useThree();
    gl.localClippingEnabled = true;

    // @ts-ignore
    const volume: Volume = useLoader(NRRDLoader, modelURL);

    return (
        <>
            <volumeObject args={[volume]} {...props} />
        </>
    );
}
'''
    # print(tmpText)

    with open(os.path.join(out_dir, name + ".tsx"), mode='w') as fw:
        fw.write(tmpText)

import sys
if __name__ == "__main__":
    args = sys.argv
    # nrrd2tsx(* args[1:])
    nrrd2tsx(args[1], args[2], args[3], int(args[4]))