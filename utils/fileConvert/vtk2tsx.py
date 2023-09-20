import os
import natsort

from nrrd2tsx import nrrd2tsx
from vtk2nrrd import vtk2nrrd


def vtk2tsx(
    input_dir,
    out_dir_public,
    name_nrrd,
    out_dir,
    name_component,
    cell_id=1,
    out_dir_depth=0,
):
    file_paths = []
    tsx_names = []

    # Get a list of all files in the directory
    files = os.listdir(input_dir)
    files.remove(".DS_Store")

    # Sort the files based on their names
    sorted_files = natsort.natsorted(files)

    # Iterate through the sorted files and create the file paths
    for index, file_name in enumerate(sorted_files, start=1):
        file_path = os.path.join(input_dir, file_name)
        nrrd_path = os.path.join(out_dir_public, "{}_{}.nrrd".format(name_nrrd, index))
        nrrd_out_path = os.path.join("../../public", nrrd_path)

        # convert vtk -> nrrd
        vtk2nrrd(input_path=file_path, out_path=nrrd_out_path, cell_id=cell_id)
        # file_paths.append(file_path)

        # generate TSX
        tsx_name = "{}_{}".format(name_component, index)
        tsx_names.append(tsx_name)
        nrrd2tsx(
            model_path=nrrd_path,
            out_dir=out_dir,
            name_component=tsx_name,
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

    order_volume = order["volume"]
    vtk2tsx(
        input_dir=order_volume["input_dir"],
        out_dir_public=order_volume["out_dir_public"],
        name_nrrd=order_volume["name_nrrd"],
        out_dir=order_volume["out_dir"],
        name_component=order_volume["name_component"],
        cell_id=order_volume["cell_id"],
        out_dir_depth=order_volume["out_dir_depth"],
    )
