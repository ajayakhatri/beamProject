import numpy as np
import matplotlib.pyplot as plt
from typing import List
import json


# class Start:
#     def __init__(self, len_beam: float, no_nodes: int,elastic_modulus, moment_of_intertia):
#     def __init__(self, len_beam: float, no_nodes: int):
#         self.len_beam = len_beam
#         self.no_nodes = no_nodes

#     def gen_nodes(self):
#         span: float = self.len_beam / (self.no_nodes - 1)
#         i: int = 1
#         array: List[List[float]] = []
#         cumm: float = 0
#         baseline: float = 0
#         while i <= self.no_nodes:
#             array.append([cumm, baseline])
#             cumm += span
#             i += 1
#         return np.array(array)

#     def gen_bars(self):
#         bars = []
#         for i in range(self.no_nodes - 1):
#             bars.append([i, i + 1])
#         return np.array(bars)


class Beam:
    def __init__(self, len_beam: float, no_nodes: int, young, inertia):
        """
        Initializes a Beam object.

        Parameters:
        - young: float, Young's modulus of the material
        - inertia: float, moment of inertia of the beam
        """
        self.len_beam = len_beam
        self.no_nodes = no_nodes
        self.young = young
        self.inertia = inertia
        self.node = self.gen_nodes()
        self.bar = self.gen_bars()
        # print(self.bar)
        # print(self.node)
        self.dof = 2
        # row is position and column is force if 0, if 1 then moment
        self.point_load = np.zeros_like(self.node)

        # 2 column
        self.distributed_load = np.zeros([len(self.bar), 2])
        self.support = np.ones_like(self.node).astype(int)

        # section for each bar element
        self.section = np.ones(len(self.bar))

        # 4 columns, 2 for SF and BM at start and end points
        self.force = np.zeros([len(self.bar), 2 * self.dof])
        self.displacement = np.zeros([len(self.bar), 2 * self.dof])
        self.plots={
            "original":[],
            "deformation":[],
            "shearForce":[],
            "bendingMoment":[]
        }
    def gen_nodes(self):
        span: float = self.len_beam / (self.no_nodes - 1)
        i: int = 1
        array: List[List[float]] = []
        cumm: float = 0
        baseline: float = 0
        while i <= self.no_nodes:
            array.append([cumm, baseline])
            cumm += span
            i += 1
        return np.array(array).astype(float)

    def gen_bars(self):
        bars = []
        for i in range(self.no_nodes - 1):
            bars.append([i, i + 1])
        return np.array(bars).astype(int)

    def analysis(self):
        """
        Initializes an Analysis object.

        Parameters:
        - node: numpy array, coordinates of the nodes in the system
        - bar: numpy array, connectivity matrix defining the bars in the system
        - dof: int, degrees of freedom per node
        - young: float, Young's modulus of the material
        - inertia: float, moment of inertia of the bars
        - distributed_load: numpy array, distributed load applied to each bar
        - support: numpy array, support conditions for each node
        """
        n_node = len(self.node)
        n_ele = len(self.bar)
        n_dof = self.dof * n_node

        # Calculate the differences in y-coordinates between the second node and the first node of each bar
        d = self.node[self.bar[:, 1], :] - self.node[self.bar[:, 0], :]

        # Calculate the lengths of the beam elements using the Euclidean distance formula
        length = np.sqrt((d**2).sum(axis=1))

        # Stiffness matrix
        # 4x4 matrix for one beam
        element_matrix = np.zeros([2 * self.dof, 2 * self.dof])
        k_matrix = np.zeros([n_ele, 2 * self.dof, 2 * self.dof])
        global_matrix = np.zeros([n_dof, n_dof])

        for i in range(n_ele):
            # DOF
            aux = self.dof * self.bar[i, :]  # Compute DOF indices for the current bar
            index = np.r_[
                aux[0] : aux[0] + self.dof, aux[1] : aux[1] + self.dof
            ]  # Create an index array
            # print(f"eq_load_ele {index=}\n")

            # for a beam element
            # K = E*I/L^3 * |  12   6*L   -12   6*L     |
            #               |   6*L  4*L^2 -6*L  2*L^2  |
            #               |  -12  -6*L    12  -6*L    |
            #               |   6*L  2*L^2 -6*L  4*L^2  |

            l: float = length[i]
            element_matrix[0] = [12, 6 * l, -12, 6 * l]
            element_matrix[1] = [6 * l, 4 * l**2, -6 * l, 2 * l**2]
            element_matrix[2] = [-12, -6 * l, 12, -6 * l]
            element_matrix[3] = [6 * l, 2 * l**2, -6 * l, 4 * l**2]
            k_matrix[i] = self.young * self.inertia * element_matrix / l**3

            global_matrix[np.ix_(index, index)] += k_matrix[i]
            # print(f"eq_load_ele {k_matrix[i]=}\n")
            # Global Stiffness Matrix

        # np.savetxt("matrix_data.txt", global_matrix)
        # plt.imshow(global_matrix, cmap='viridis')

        # For equivalent load at each node
        # 2 for force and 2 for moment
        eq_load_ele = np.zeros([len(self.bar), 2 * self.dof])
        for i in range(n_ele):
            l: float = length[i]
            pi: float = self.distributed_load[i, 0]
            pf: float = self.distributed_load[i, 1]

            # as fixed beam
            eq_load_ele[i, 0] = l * (21 * pi + 9 * pf) / 60
            eq_load_ele[i, 1] = l * (l * (3 * pi + 2 * pf)) / 60
            eq_load_ele[i, 2] = l * (9 * pi + 21 * pf) / 60
            eq_load_ele[i, 3] = l * (l * (-2 * pi - 3 * pf)) / 60

        # Point load
        # Storing load in [self.bar[i, 0], 0] and moment in [self.bar[i, 0], 0]
        for i in range(n_ele):
            self.point_load[self.bar[i, 0], 0] += eq_load_ele[i, 0]
            self.point_load[self.bar[i, 0], 1] += eq_load_ele[i, 1]
            self.point_load[self.bar[i, 1], 0] += eq_load_ele[i, 2]
            self.point_load[self.bar[i, 1], 1] += eq_load_ele[i, 3]
        # solution

        # returns index of non supported nodes
        free_dof = self.support.flatten().nonzero()[0]
        print("df",self.support)
        # returns stiffness matrix of non supported nodes
        kff = global_matrix[np.ix_(free_dof, free_dof)]
        
        p = self.point_load.flatten()


        # returns equivalent load on non supported nodes
        pf = p[free_dof]  # type: ignore

        #  {pf}= [kff]{u}  gives u. For ax = b, x=numpy.linalg.solve(a, b)   
        uf = np.linalg.solve(kff, pf)

        u = self.support.astype(float).flatten()
        # print(uf.shape)

        # puts deformation due to equivalent load in index of non supported nodes
        u[free_dof] = uf
        
        # Makes array of deformation due to equivalent load on either end of beam element
        u = u.reshape(n_node, self.dof)

        
        # Gives deformation (both deflection and displacement) of a beam element on either ends 
        u_ele = np.concatenate((u[self.bar[:, 0]], u[self.bar[:, 1]]), axis=1)
      
        for i in range(n_ele):
            self.force[i] = np.dot(k_matrix[i], u_ele[i]) - eq_load_ele[i]
            self.displacement[i] = u_ele[i]

    def plot(self, scale=None):
        ne = len(self.bar)
        fig, axs = plt.subplots(3)
    

        # Deformed Shape
        for i in range(ne):
        # xi= initial position of ith beam element in x-axis
        # xf= final position of ith beam element in x-axis
            xi, xf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            yi, yf = self.node[self.bar[i, 0], 1], self.node[self.bar[i, 1], 1]
            axs[0].plot([xi, xf], [yi, yf], "b", linewidth=1)
            self.plots["original"].append([[xi,xf],[yi,yf]])
                  
        for i in range(ne):
            dxi, dxf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            dyi = self.node[self.bar[i, 0], 1] + self.displacement[i, 0] * scale
            dyf = self.node[self.bar[i, 1], 1] + self.displacement[i, 2] * scale
            axs[0].plot([dxi, dxf], [dyi, dyf], "r", linewidth=2)
            axs[0].text(dxi, dyi, str(round(dyi / scale, 4)), rotation=90)
            self.plots["deformation"].append([[dxi,dxf],[dyi,dyf]])

        # Bending Moment
        axs[1].invert_yaxis()
        for i in range(ne):
            mxi, mxf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            myi, myf = self.node[self.bar[i, 0], 1], self.node[self.bar[i, 1], 1]
            axs[1].plot([mxi, mxf], [myi, myf], "b", linewidth=1)


        for i in range(ne):
            m_xi, m_xf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            m_yi = -self.force[i, 1]
            m_yf = self.force[i, 3]
            axs[1].plot([m_xi, m_xi, m_xf, m_xf], [0, m_yi, m_yf, 0], "r", linewidth=2)
            axs[1].fill([m_xi, m_xi, m_xf, m_xf], [0, m_yi, m_yf, 0], "c", alpha=0.3)
            axs[1].text(m_xi, m_yi, str(round(m_yi, 4)), rotation=90)
            self.plots["bendingMoment"].append([[m_xi,m_xf],[m_yi,m_yf]])

        # Shear force
        for i in range(ne):
            mxi, mxf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            myi, myf = self.node[self.bar[i, 0], 1], self.node[self.bar[i, 1], 1]
            axs[1].plot([mxi, mxf], [myi, myf], "b", linewidth=1)

        for i in range(ne):
            m_xi, m_xf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            m_yi = -self.force[i, 0]
            m_yf = self.force[i, 2]
            axs[2].plot([m_xi, m_xi, m_xf, m_xf], [0, m_yi, m_yf, 0], "r", linewidth=2)
            axs[2].fill(
                [m_xi, m_xi, m_xf, m_xf], [0, m_yi, m_yf, 0], "orange", alpha=0.3
            )
            axs[2].text(m_xi, m_yi, str(round(m_yi, 4)), rotation=90)
            self.plots["shearForce"].append([[m_xi,m_xf],[m_yi,m_yf]])

    def add_point_load(self, loadingList):
        for location, load in loadingList.items():
            self.point_load[(location, 0)] = load
        # print(self.point_load)

    def add_distributed_load(self, loadingList):
        for location, load_array in loadingList.items():
            self.distributed_load[location] = np.array(load_array)
    def assign_support_values(self, index_value_list):
        for index in index_value_list:
            self.support[index] = np.array(0)
        print("dd",self.support)
        print("dd")

    def add_values(self, value):
        self.add_point_load(value["point_load_input"])
        self.add_distributed_load(value["distributed_load_input"])
        self.assign_support_values(value["support_input"])

    def results(self):
        result = {
            "force": self.force.tolist(),
            "displacement": self.displacement.tolist(),
        }
        json_data = json.dumps(result)
        # json_data = result
        return json_data
    
    def plots_json(self):
        result = self.plots
        json_data = json.dumps(result)
        json_data = result
        return json_data


# Given dictionary of index and array value for support_1

# Given dictionary of index and array value for distributedload


# a = Length_para(480, 21)
# n = a.gen_nodes()
# b = a.gen_bars()

# Structure input
E: float = 30e6
I: float = 500
beam_1 = Beam(50, 21, E, I)


# Given dictionary 'a'
pointLoad_input = {5: -1e3, 15: -1e3}


distributedload_input = {
    15: [0, -10],
    16: [-10, -20],
    17: [-20, -30],
    18: [-30, -40],
    19: [-40, -50],
}
support_1_input = [(0,), (10, 0), (20,)]

# pointload = beam_1.point_load

# pointload[5, 0] = -1e3
# pointload[15, 0] = -1e3

# distributedload = beam_1.distributed_load
# distributedload[15] = np.array([0, -10])
# distributedload[16] = np.array([-10, -20])
# distributedload[17] = np.array([-20, -30])
# distributedload[18] = np.array([-30, -40])
# distributedload[19] = np.array([-40, -50])

# beam_1.add_point_load(pointLoad_input)
# beam_1.add_distributed_load(distributedload_input)
# beam_1.assign_support_values(support_1_input)

value = {
    "point_load_input": pointLoad_input,
    "distributed_load_input": distributedload_input,
    "support_input": support_1_input,
}

beam_1.add_values(value)

# support_1 = beam_1.support
# # at position 0, fixed so all DOF=O
# # at position 0, fixed so all DOF=O

# # at position 10, rotational
# support_1[0, :] = 0
# support_1[10, 0] = 0

# support_1[20, :] = 0
# at position 20, fixed so all DOF=O


beam_1.analysis()
result = beam_1.results()
# print(result["force"])
# print(result["displacement"])
beam_1.plot(1)

plots = beam_1.plots_json()
print(plots)
# print(beam_1.force)
# print(beam_1.distributed_load)
