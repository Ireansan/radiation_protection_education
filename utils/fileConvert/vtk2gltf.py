import pyvista


def vtk2gltf(input_path, out_path, threshold_min=0, threshold_max=0, cell_id=0):
    try:
        threshold_min = float(threshold_min)
        threshold_max = float(threshold_max)
        cell_id = int(cell_id)
    except ValueError:
        return False

    grid = pyvista.RectilinearGrid(input_path)
    # grid.array_names: cell data name list
    # grid.extent: x, y, z size
    # grid.cell_data: cell data

    # cell name
    cell_name = grid.array_names[cell_id]

    # data
    threshold_data = grid.threshold(
        value=[threshold_min, threshold_max], scalars=cell_name, invert=False
    )

    pl = pyvista.Plotter()
    pl.add_mesh(threshold_data)
    pl.export_gltf(out_path)


import sys
import json
import subprocess

if __name__ == "__main__":
    args = sys.argv
    # vtk2tsx(* args[1:])
    with open(args[1]) as f:
        order = json.load(f)

    order_body = order["body"]
    vtk2gltf(
        input_path=order_body["input_path"],
        out_path=order_body["out_path"],
        threshold_min=order_body["threshold_min"],
        threshold_max=order_body["threshold_max"],
        cell_id=order_body["cell_id"],
    )
    subprocess.run(
        [
            "npx",
            "gltfjsx",
            order_body["out_path"],
            "-t",
            "-o",
            order_body["out_path_components"],
        ]
    )

    order_machine = order["machine"]
    vtk2gltf(
        input_path=order_machine["input_path"],
        out_path=order_machine["out_path"],
        threshold_min=order_machine["threshold_min"],
        threshold_max=order_machine["threshold_max"],
        cell_id=order_machine["cell_id"],
    )
    subprocess.run(
        [
            "npx",
            "gltfjsx",
            order_machine["out_path"],
            "-t",
            "-o",
            order_machine["out_path_components"],
        ]
    )
