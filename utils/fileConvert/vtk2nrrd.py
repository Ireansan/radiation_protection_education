import numpy as np
import pyvista
import nrrd

def vtk2nrrd(input_path, out_path, cell_id=0):
    grid = pyvista.RectilinearGrid(input_path)
    # grid.array_names: cell data name list
    # grid.extent: x, y, z size
    # grid.cell_data: cell data

    # cell name
    cell_name = grid.array_names[cell_id]
    # size
    sizes = np.array(grid.extent[1::2]) - np.array(grid.extent[0::2])
    sizes = sizes.tolist()
    sizes.reverse() # xyz -> zyx
    # data
    data_array = np.array(grid.cell_data[cell_name]).reshape(sizes)

    # https://pynrrd.readthedocs.io/en/latest/examples.html
    header = {'encoding': 'gzip',
        'space directions': np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
        'space origin': np.array([0., 0., 0.])
    }

    nrrd.write(out_path, data_array, header)

import sys
if __name__ == "__main__":
    args = sys.argv
    vtk2nrrd(* args[1:])