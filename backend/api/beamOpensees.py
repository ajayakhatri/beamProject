import matplotlib.pyplot as plt
import opsvis as opsv
from openseespy.opensees import *


def plotStructure(title):
    # Pass in optional argument (fig_wi_he) to control plot size
    opsv.plot_model(fig_wi_he=(50, 20))

    # Housekeeping
    plt.title(title)
    plt.xlabel("Distance (m)")
    plt.ylabel("Distance (m)")
    plt.grid()
    plt.show()


# Define a new function to plot loads
def plotLoads(title):
    opsv.plot_loads_2d(nep=10, sfac=True, fig_wi_he=(50, 10))
    plt.title(title)
    plt.xlabel("Distance (m)")
    plt.ylabel("Load (N)")
    plt.grid()
    plt.show()


def beamOpensees(no_nodes, members, nodes, value_, E, A, I):
    # Remove any existing model
    wipe()

    # Set the model builder - 2 dimensions and 2 degrees of freedom per node
    model("basic", "-ndm", 2)

    # Define nodes
    for i, n in enumerate(nodes):
        node(i, float(n[0]), float(n[1]))

    uniaxialMaterial("Elastic", 1, E)

    transfType = "Linear"
    transfTag = 1
    geomTransf(transfType, transfTag)

    # Define beam elements
    for i, mbr in enumerate(members):
        element("elasticBeamColumn", i, int(mbr[0]), int(mbr[1]), A, E, I, transfTag)

    # Add suppports
    for i in value_["support_input"]:
        index = i[0]
        if len(i) == 2:
            fix(index, 1, 1, 0)
        else:
            fix(index, 1, 1, 1)

    # Load definition
    timeSeries("Constant", 1)
    pattern("Plain", 1, 1)

    # Adding distributed loads
    for i, j in value_["distributed_load_input"].items():
        eleLoad("-ele", i, "-type", "-beamUniform", j[0], 0, 0, 1, j[1], 0)

    # Adding point loads
    for i, j in value_["point_load_input"].items():
        load(i, 0,j,0)


    # Create SOE
    system("BandGeneral")  # BandGeneral more general solver than 'BandSPD'

    # Create DOF number
    numberer("RCM")

    # Create constraint handler
    constraints("Transformation")

    # Create integrator
    integrator("LoadControl", 1)

    # Create algorithm
    algorithm("Linear")

    # Create analysis object
    analysis("Static")

    # Perform the analysis (with 1 analysis step)
    analyze(1)

    ori_x = []  # Original x coordinates
    ori_y = []  # Original y coordinates
    deflection = []  # y coordinates for deflections
    moment = []  # y coordinates for moment
    shear = []  # y coordinates for sehar force

    # Gets displacement of all nodes
    num_nodes = len(nodes)
    for i in range(num_nodes):
        disp = nodeDisp(i)
        deflection.append(disp[1])
        ori_x.append(nodes[i][0])
        ori_y.append(0)

    # Gets shear forces of all nodes
    for i, j in enumerate(members):
        shear.append(-eleResponse(i, "force")[1])
    shear.append((eleResponse(len(members) - 1, "force")[4]))

    # Gets moments of all nodes
    for i, j in enumerate(members):
        moment.append(-eleResponse(i, "force")[2])
    moment.append((eleResponse(len(members) - 1, "force")[5]))

    print("shear", shear)
    print("moment", moment)
    plots = {
        "original": [ori_x, ori_y],
        "deformation": [ori_x, deflection],
        "shearForce": [ori_x, shear],
        "bendingMoment": [ori_x, moment],
    }
    return plots
