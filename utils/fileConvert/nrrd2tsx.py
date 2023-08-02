import re
import os
import string


def nrrd2tsx(
    model_path, out_dir="", component_name=None, out_dir_depth=0, template_type=0
):
    # Component Name
    name = ""
    if component_name == None:
        filename = re.findall(".*\/(.*)\.nrrd", model_path)
        name = filename.group().capitalize()
    else:
        name = component_name

    # Select template txt
    template_path = ""
    if template_type == 0:
        template_path = "./template/doseTsx.txt"
    elif template_path == 1:
        template_path = "./template/volumeTsx.txt"

    # Attach to template txt
    with open(template_path) as f:
        template = string.Template(f.read())

    tmpText = template.substitute(
        Name=name,
        DirDepth="./" if out_dir_depth == 0 else "../" * out_dir_depth,
        Filepath=model_path,
    )

    # Generate tsx
    with open(os.path.join(out_dir, name + ".tsx"), mode="w") as fw:
        fw.write(tmpText)


import sys

if __name__ == "__main__":
    args = sys.argv
    # nrrd2tsx(* args[1:])
    nrrd2tsx(args[1], args[2], args[3], int(args[4]))
