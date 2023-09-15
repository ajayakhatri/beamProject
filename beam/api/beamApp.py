import numpy as np
import matplotlib.pyplot as plt
from typing import List
import json


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
            "original": [],
            "deformation": [],
            "shearForce": [],
            "bendingMoment": [],
        }
        self.p = {
            "original": {},
            "deformation": {},
            "shearForce": {},
            "bendingMoment": {},
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

    def plot(self, scale=1):
        ne = len(self.bar)
        fig, axs = plt.subplots(3)

        # Deformed Shape
        for i in range(ne):
            # xi= initial position of ith beam element in x-axis
            # xf= final position of ith beam element in x-axis
            xi, xf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            yi, yf = self.node[self.bar[i, 0], 1], self.node[self.bar[i, 1], 1]
            axs[0].plot([xi, xf], [yi, yf], "b", linewidth=1)
            self.plots["original"].append([[xi, xf], [yi, yf]])
            self.p["original"][xi]= yi
            self.p["original"][xf]= yf

        for i in range(ne):
            dxi, dxf = self.node[self.bar[i, 0], 0], self.node[self.bar[i, 1], 0]
            dyi = self.node[self.bar[i, 0], 1] + self.displacement[i, 0] * scale
            dyf = self.node[self.bar[i, 1], 1] + self.displacement[i, 2] * scale
            axs[0].plot([dxi, dxf], [dyi, dyf], "r", linewidth=2)
            axs[0].text(dxi, dyi, str(round(dyi / scale, 4)), rotation=90)
            self.plots["deformation"].append([[dxi, dxf], [dyi, dyf]])
            self.p["deformation"][dxi]= dyi
            self.p["deformation"][dxf]= dyf
            
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
            self.plots["bendingMoment"].append([[m_xi, m_xf], [m_yi, m_yf]])
            self.p["bendingMoment"][m_xi]= -1*m_yi
            self.p["bendingMoment"][m_xf]= -1*m_yf
   
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
            self.plots["shearForce"].append([[m_xi, m_xf], [m_yi, m_yf]])

            self.p["shearForce"][m_xi]= 0
            self.p["shearForce"][m_xi]= m_yi
            self.p["shearForce"][m_xf]= m_yf
            self.p["shearForce"][m_xf]= 0
# deformation= {0.0: 0.02386654648646018, 0.5: 0.020587834323300167, 1.0: 0.01713189305849245, 1.5: 0.013058271670190651, 2.0: 0.007662248523440576, 2.5: 0.0, 3.0: -0.010341658906339346, 3.5: -0.021238076361623292, 4.0: -0.030990369853015794, 4.5: -0.038289770629887594, 5.0: -0.04194601224034433, 5.5: -0.04099791519849724, 6.0: -0.03501923827141905, 6.5: -0.024504964512232347, 7.0: -0.011775326982449284, 7.5: 0.0, 8.0: 0.008128497390852281, 8.5: 0.013367845816974236, 9.0: 0.01701580275344892, 9.5: 0.01996113544078776, 10.0: 0.022715081672205272}

# shearForce= {0.0: -1.1641532182693481e-10, 0.5: 2400.000000000058, 1.0: 4599.999999999884, 1.5: 6599.999999999942, 2.0: 8400.0, 2.5: -25500.0, 3.0: -12099.999999999884, 3.5: -10900.000000000116, 4.0: -9900.000000000233, 4.5: -9099.999999999942, 5.0: -6000.000000000335, 5.5: -874.9999999998836, 6.0: 18749.999999999767, 6.5: 23124.999999999767, 7.0: 27250.0, 7.5: -15624.999999999767, 8.0: -11999.999999999767, 8.5: -8624.999999999942, 9.0: -5499.999999999884, 9.5: -2625.0000000001164, 10.0: 0}

# bendingMoment= {0.0: -1.9397816686250735e-11, 0.5: -608.3333333333285, 1.0: -2366.6666666666956, 1.5: -5175.000000000034, 2.0: -8933.333333333372, 2.5: -13541.666666666724, 3.0: -1149.999999999932, 3.5: 4591.666666666948, 4.0: 9783.333333333625, 4.5: 14525.000000000326, 5.0: 18500.000000000113, 5.5: 20187.500000000233, 6.0: 19458.33333333347, 6.5: 8979.166666666706, 7.0: -3624.999999999942, 7.5: -18229.166666666442, 8.0: -11333.333333333178, 8.5: -6187.499999999825, 9.0: -2666.66666666656, 9.5: -645.833333333309, 10.0: 8.246558991231723e-11}

# for i in bendingMoment:
#     print (i)
# for i in bendingMoment:
#     print(",")
        def y(x):
            a=[]
            for i in x:
                a.append(x[i])
            return x
        deformation=y(self.p["deformation"])
        bendingMoment=y(self.p["bendingMoment"])
        x=[]
        for i in self.p["deformation"]:
            x.append(i)

        # print("self.p")
        # print(self.p["deformation"])
        # return self.p
        return x,bendingMoment
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
        # print("dd", self.support)

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
        # json_data = result
        return json_data



# <----------------------INPUT------------------------------->



def arrangeData(distributedload_,support_,pointLoad_input,minspan,leng):
    sum_dict = {}
    for sublist in pointLoad_input:
        key = sublist[0]
        value = sublist[1]
        if key in sum_dict:
            sum_dict[key] += value
        else:
            sum_dict[key] = value
    pointLoad_ = sum_dict


    a = []
    for dl in distributedload_:
        if dl[2][1] != dl[2][2]:
            min_value = min(dl[2][1], dl[2][2])
            a.append(["d", dl[1], [dl[2][0], min_value, min_value]])
            a.append(["d", dl[1], [dl[2][0], dl[2][1] - min_value, dl[2][2] - min_value]])
        else:
            a.append(dl)


    def dl_to_node(list_d, oriN, minspan):
        n = oriN
        a = {}
        span = minspan
        for list in list_d:
            y1 = list[2][1]
            y2 = list[2][2]
            x1 = list[1]
            x2 = list[1] + list[2][0]
            y = lambda x: round(((y2 - y1) / (x2 - x1)) * (x - x1) + (y1), 6)
            s = x1
            if list[1] % span != 0:
                if x1 not in n:
                    n[x1] = x1
                    a[x1] = ["d", y(x1)]
                else:
                    a[x1] = ["d", a[x1][1] + y(x1)]
                s = (int(list[1] / span) + 1) * span

            e = x2
            if x2 % span != 0:
                e = (int(x2 / span)) * span

            x = s
            while x <= e:
                if x not in n:
                    n[x] = x
                    a[x] = ["d", y(x)]
                else:
                    a[x] = ["d", a[x][1] + y(x)]
                x += span

            if x2 % span != 0:
                if x2 not in n:
                    n[x2] = x2
                    a[x2] = ["d", y(x2)]
                else:
                    a[x2] = ["d", a[x2][1] + y(x2)]
        return n, a


    n = {}
    n, a = dl_to_node(a, n, minspan)
    for i in pointLoad_:
        if i not in n:
            n[i] = i

    for i in support_:
        if i not in n:
            n[i] = i
    n = dict(sorted(n.items(), key=lambda x: x[0]))
    dldict_ = dict(sorted(a.items(), key=lambda x: x[0]))
    list_n = [[key, value] for key, value in n.items()]

    if list_n[0][0] != 0:
        x = 0
        while x < list_n[0][0]:
            if x not in n:
                n[x] = 0
            x += minspan

    for i in range(len(list_n) - 1):
        x = list_n[i][0]
        while x <= list_n[i + 1][0]:
            if x not in n:
                n[x] = 0
            x += minspan

    if list_n[-1][0] != leng:
        x = list_n[-1][0]
        while x <= leng:
            if x not in n:
                n[x] = 0
            x += minspan

    n = dict(sorted(n.items(), key=lambda x: x[0]))

    node = 1
    pf = {}
    df = {}
    sf = {}
    location2node = {}
    for i in n:
        location2node[i] = node
        node += 1
    print(location2node)
    for i in list_n:
        if i[0] in pointLoad_:
            pf[location2node[i[0]] - 1] = -1 * pointLoad_[i[0]]
        if i[0] in support_:
            sf[location2node[i[0]] - 1] = support_[i[0]]
        if i[0] in dldict_:
            df[location2node[i[0]] - 1] = dldict_[i[0]]
    print(pf)


    list_df = [[key, value] for key, value in df.items()]
    list_pf = [[key, ["p", value]] for key, value in pf.items()]
    list_sf = [[key, ["s", value]] for key, value in sf.items()]

    combined_list = list_pf + list_df + list_sf

    list_f = sorted(combined_list, key=lambda x: x[0])

    no_nodes = len(n)
    bars = []
    dff = {}
    for i in range(len(list_df) - 1):
        if list_df[i][0] == list_df[i + 1][0] - 1:
            dff[list_df[i][0]] = [-1 * list_df[i][1][1], -1 * list_df[i + 1][1][1]]
    print(dff)


    def gen_bars(no_nodes):
        bars = []
        for i in range(no_nodes - 1):
            bars.append([i + 1, i + 2])
        return np.array(bars).astype(int)


    def transform_dict_to_list(dictionary):
        result = []
        for key, value in dictionary.items():
            if value == 1:
                result.append((key, 0))
            else:
                result.append((key,))
        return result


    sff = transform_dict_to_list(sf)
    bars = gen_bars(no_nodes)

    value_ = {
        "point_load_input": pf,
        "distributed_load_input": dff,
        "support_input": sff,
    }


    array = [[key, 0] for key, value in n.items()]

    for bar in bars:
        bar[0] = bar[0] - 1
        bar[1] = bar[1] - 1
    n = np.array(array).astype(float)
    print("N", n)
    print("N", bars)
    
    return no_nodes,bars, n,value_




distributedload_ = [
]
support_ = {0: 1, 10: 1}
pointLoad_input = [[5, 50]]
# distributedload_ = [
#     ["d", 0, [5, 5000, 1000]],
#     ["d", 5, [5, 10000, 5000]],
# ]
# support_ = {2.5: 1, 7.5: 1}
# pointLoad_input = [[3, 12000], [6, 15000]]
minspan = 0.3
leng = 10

E: float = 210e9
I: float = 4.73e-6

no_nodes, bars, n,value_= arrangeData(distributedload_,support_,pointLoad_input,minspan,leng)
beam_1 = Beam(leng, no_nodes, E, I, bars, n)
beam_1.add_values(value_)

beam_1.analysis()
result = beam_1.results()
beam_1.plot(1)

plots = beam_1.plots_json()
print("<-------------------------------------->")
print(beam_1.p)
print("<-------------------------------------->")
print(beam_1.force)
print(beam_1.distributed_load)
