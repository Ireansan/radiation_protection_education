import numpy as np
import pyvista
import nrrd

# FIXME: filepath
filepath_models = ""
filepath_vtk = "./data/H(10)xy2cm.vtk"
filepath_out = "./data/dose.nrrd"

# load vtk
grid = pyvista.RectilinearGrid(filepath_vtk)

# convert to np.array
new_array = np.array(grid.cell_data['all']).reshape((106, 200, 290))

# set header
# https://pynrrd.readthedocs.io/en/latest/examples.html
header = {'encoding': 'gzip',
    'space directions': np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
    'space origin': np.array([0., 0., 0.])
}

# save nrrd
nrrd.write(filepath_out, new_array, header)