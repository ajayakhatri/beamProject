import numpy as np

class Beam:
    def __init__(self, len_beam: float, no_nodes: int, young, inertia, bars, nodes):
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
        self.node = nodes
        self.bar = bars

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
        self.plots = {
            "original": [[],[]],
            "deformation": [[],[]],
            "shearForce": [[],[]],
            "bendingMoment": [[],[]],
        }
   

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
            # print("self.young",self.young)
            # print("self.inertia",self.inertia)
            # Global Stiffness Matrix
            global_matrix[np.ix_(index, index)] += k_matrix[i]


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

        # returns stiffness matrix of non supported nodes
        kff = global_matrix[np.ix_(free_dof, free_dof)]
        # np.savetxt('reducedGlobalMatrix.txt', kff)

        p = self.point_load.flatten()

        # returns equivalent load on non supported nodes
        pf = p[free_dof]  # type: ignore

        #  {pf}= [kff]{u}  gives u. For ax = b, x=numpy.linalg.solve(a, b)

        uf = np.linalg.solve(kff, pf) 

        u = self.support.astype(float).flatten()

        # puts deformation due to equivalent load in index of non supported nodes
        u[free_dof] = uf

        # Makes array of deformation due to equivalent load on either end of beam element
        u = u.reshape(n_node, self.dof)

        # Gives deformation (both deflection and displacement) of a beam element on either ends
        u_ele = np.concatenate((u[self.bar[:, 0]], u[self.bar[:, 1]]), axis=1)
        for i in range(n_ele):
            self.force[i] = np.dot(k_matrix[i], u_ele[i]) - eq_load_ele[i]
            self.displacement[i] = u_ele[i]

    def plot(self):
        ne = len(self.bar)

        # Deformed Shape
        for i in range(ne):
            # xi= initial position of ith beam element in x-axis
            # xf= final position of ith beam element in x-axis
            xi, xf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            yi, yf = self.node[self.bar[i, 0], 1], self.node[self.bar[i, 1], 1]
            self.plots["original"][0].extend([xi, xf])
            self.plots["original"][1].extend([yi, yf])


        for i in range(ne):
            dxi, dxf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            dyi = self.node[self.bar[i, 0], 1] + self.displacement[i, 0]
            dyf = self.node[self.bar[i, 1], 1] + self.displacement[i, 2]
            self.plots["deformation"][0].extend([dxi, dxf])
            self.plots["deformation"][1].extend([dyi, dyf])
     

        # Bending Moment
        for i in range(ne):
            m_xi, m_xf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            m_yi = -self.force[i, 1]
            m_yf = self.force[i, 3]
            self.plots["bendingMoment"][0].extend([m_xi, m_xf])
            self.plots["bendingMoment"][1].extend([m_yi, m_yf])
      

        # Shear force   
        for i in range(ne):
            m_xi, m_xf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            m_yi = -self.force[i, 0]
            m_yf = self.force[i, 2]
            self.plots["shearForce"][0].extend([m_xi, m_xf])
            self.plots["shearForce"][1].extend([m_yi, m_yf])


    def add_point_load(self, loadingList):
        for location, load in loadingList.items():
            self.point_load[(location, 0)] = load

    def add_distributed_load(self, loadingList):
        for location, load_array in loadingList.items():
            self.distributed_load[location] = np.array(load_array)

    def assign_support_values(self, index_value_list):
        for index in index_value_list:
            self.support[index] = np.array(0)

    def add_values(self, value):
        print("<----------------------------------------->")
        print("value", value)
        self.add_point_load(value["point_load_input"])
        self.add_distributed_load(value["distributed_load_input"])
        self.assign_support_values(value["support_input"])
