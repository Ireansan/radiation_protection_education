import os
import natsort
import numpy as np
import nrrd


def nrrd2accumulate(input_dir, out_file):
    out_path = os.path.join(input_dir, out_file)

    # Get a list of all files in the directory
    files = os.listdir(input_dir)
    if ".DS_Store" in files:
        files.remove(".DS_Store")
    if out_file in files:
        files.remove(out_file)

    # Sort the files based on their names
    sorted_files = natsort.natsorted(files)

    # init result array
    result = np.zeros(0)

    # Iterate through the sorted files
    for index, file_name in enumerate(sorted_files):
        file_path = os.path.join(input_dir, file_name)
        file_data, file_header = nrrd.read(file_path)

        if index == 0:
            result = file_data
        else:
            result += file_data

    header = {
        "encoding": "gzip",
        "space directions": np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
        "space origin": np.array([0.0, 0.0, 0.0]),
    }

    nrrd.write(out_path, result, header)


import sys
import json

if __name__ == "__main__":
    args = sys.argv
    # vtk2tsx(* args[1:])
    with open(args[1]) as f:
        order = json.load(f)

    order_adding = order["volume"]
    # nrrd2accumulate(
    #     input_dir=os.path.join("../../public", order_adding["out_dir_public"])
    # )
