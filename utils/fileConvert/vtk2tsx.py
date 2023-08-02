import os

from nrrd2tsx import nrrd2tsx
from vtk2nrrd import vtk2nrrd


def vtk2tsx(
    input_dir, public_path, nrrd_name, out_dir, component_name, out_dir_depth=0
):
    file_paths = []
    tsx_names = []

    # Get a list of all files in the directory
    files = os.listdir(input_dir)

    # Sort the files based on their names
    sorted_files = sorted(files)

    # Iterate through the sorted files and create the file paths
    for index, file_name in enumerate(sorted_files, start=1):
        file_path = os.path.join(input_dir, file_name)
        nrrd_path = os.path.join(public_path, "{}_{}.nrrd".format(nrrd_name, index))
        nrrd_out_path = os.path.join("../../public", nrrd_path)

        # convert vtk -> nrrd
        vtk2nrrd(file_path, nrrd_out_path)
        # file_paths.append(file_path)

        # generate TSX
        tsx_name = "{}_{}".format(component_name, index)
        tsx_names.append(tsx_name)
        nrrd2tsx(
            model_path=nrrd_path,
            out_dir=out_dir,
            component_name=tsx_name,
            out_dir_depth=out_dir_depth,
        )

    with open(os.path.join(out_dir, "index.tsx"), mode="w") as f:
        for tsx in tsx_names:
            f.write('export * from "./{}"\n'.format(tsx))


import sys
import json

if __name__ == "__main__":
    args = sys.argv
    # vtk2tsx(* args[1:])
    with open(args[1]) as f:
        order = json.load(f)

    vtk2tsx(
        input_dir=order["input_dir"],
        public_path=order["public_path"],
        nrrd_name=order["nrrd_name"],
        out_dir=order["out_dir"],
        component_name=order["component_name"],
        out_dir_depth=order["out_dir_depth"],
    )
