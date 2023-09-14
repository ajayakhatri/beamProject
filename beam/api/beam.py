import numpy as np
import matplotlib.pyplot as plt
from typing import List
import json

class Beam:
    def __init__(self, len_beam: float, no_nodes: int, young, inertia,value):
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
        # self.bar = self.gen_bars()
        self.dof = 2

        [self.node,self.bar,self.elements_list] = self.gen_nodes(value)
        # row is position and column is force if 0, if 1 then moment
        self.point_load = np.zeros_like(self.node)
        # 2 column
        self.distributed_load = np.zeros([len(self.bar), 2])
        self.support = np.ones_like(self.node).astype(int)

        # d = self.node[self.bar[:, 1], :] - self.node[self.bar[:, 0], :]
        # print("d",d)

        # # Calculate the lengths of the beam elements using the Euclidean distance formula
        # length = np.sqrt((d**2).sum(axis=1))


        # print("self.point_load",self.point_load)
        # print("self.distributed_load",self.distributed_load)
        # print("self.support",self.support)


        self.add_values(self.elements_list)
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
# pointLoad_input = {5: -1e3, 15: -1e3}

# # beam element no
# distributedload_input = {
#     15: [0, -10],
#     16: [-10, -20],
#     17: [-20, -30],
#     18: [-30, -40],
#     19: [-40, -50],
# }
# # node no
# support_1_input = [(0,), (10, 0), (20,)]
    def dl_to_node(self,list_d,span):
        dl={}
        for list in list_d:
                    y1=list[2][1]
                    y2=list[2][2]
                    x1=list[1]
                    x2=list[1]+list[2][0]   
                    y=lambda x:round(((y2-y1)/(x2-x1))*(x-x1)+(y1),6)

                    s=x1
                    l=[]
                    if list[1]%span!=0:
                        l.append(x1)
                        # dl[x1]=[y(x1)]
                        s=(int(list[1]/span)+1)*span

                    e=x2
                    if x2%span!=0:
                        e=(int(x2/span))*span

                    x=s
                    while x<=e:
                        l.append(x)
                        x+=span 

                    if x2%span!=0:
                        l.append(x2)

                    for i in range(len(l)-1):
                        if l[i] in dl:
                            dl[l[i]][0]=dl[l[i]][0]+y(l[i])
                            dl[l[i]][1]=dl[l[i]][1]+y(l[i+1])
                        else:
                            dl[l[i]]=[y(l[i]),y(l[i+1])]

                    if x2%span!=0:
                        dl[x2]=[0]
                    print(l)
        return [["d",key, value] for key, value in dl.items()]
    
    def gen_nodes(self,value):
       
        # for i in range(len(sorted_pairs)):
        span: float = self.len_beam / (self.no_nodes - 1)
        i: int = 1
        array: List[List[float]] = []
        cumm: float = 0
        baseline: float = 0

        p=value["point_load_input"]
        d=value["distributed_load_input"]
        s=value["support_input"]

        sorted_p = dict(sorted(p.items(), key=lambda x: x[0]))
        # sorted_d = dict(sorted(d.items(), key=lambda x: x[0]))
        sorted_s = dict(sorted(s.items(), key=lambda x: x[0]))
   
        list_p = [["p",key, value] for key, value in sorted_p.items()]
        # list_d = [["d",key, value] for key, value in sorted_d.items()]
        list_d = d
        list_d = self.dl_to_node(list_d,span)
        list_s = [["s",key, value] for key, value in sorted_s.items()]
        combined_list=list_p+list_d+list_s

        # print("list_d 122",list_d)
        # [['d', 50, [3, 0, 10]], ['d', 40, [13, 10, 10]]]           
# pointLoad_ = {9: -1e3, 50: -1e3}
# distributedload_ =  {
#     50: [13, 0, 10],
#     40: [13, 10, 10],
# }
# dictionary = {0:0, 12:1, 22:0}
        pf={}
        df={}
        sf={}
        def check_range(s,e):
            inbetween=[]
            atnode=[]
            pointer=-1
            for list in combined_list:
                if s < list[1] < e:
                    # if list[1]!=pointer:
                        inbetween+=[list]
                    # pointer=list[1]
                elif s==list[1]:
                    atnode+=[list]
            return inbetween,atnode
        bars = []

        barcount: int=0
        nnode=self.no_nodes
        x=self.no_nodes
        added_nodes=0
        while i <= nnode:
            array.append([cumm, baseline])
            # if(cumm+span)
            if(barcount<x - 1):
                bars.append([barcount, barcount + 1])
            
            inbetweenlist,atnode=check_range(cumm,cumm+span)

            if len(atnode)!=0:
                for list in atnode:
                    # print("at node",list)
                    if list[0]=="p":
                        pf[barcount]=list[2]
                    if list[0]=="d":
                        df[barcount]=list[2]
                    if list[0]=="s":
                        sf[barcount]=list[2]
            if len(inbetweenlist)!=0:
                x+= len(inbetweenlist)
                pointer=-1
                for list in inbetweenlist:
                    if list[1]!=pointer:
                        barcount += 1
                        added_nodes += 1
                        array.append([list[1], baseline])
                        bars.append([barcount, barcount + 1])
                        print(list[1], "barcount",barcount)
                    pointer=list[1]
                    

                    print(barcount,list[1],list[2])
                    if list[0]=="p":
                        pf[barcount]=list[2]
                    if list[0]=="s":
                        sf[barcount]=list[2]
                    if list[0]=="d" and len(list[2])==2:
                        df[barcount]=list[2]
            cumm += span
            barcount += 1
            i += 1
        print("added_nodes",added_nodes)
        # # print(combined_list)
        # print("pf",pf)
        # print("df",df)
        # print("sf",sf)
        def transform_dict_to_list(dictionary):
            result = []
            for key, value in dictionary.items():
                if(value==1):
                    result.append((key, 0))
                else:
                    result.append((key, ))
            return result
        elements_list = {
            "point_load_input": pf,
            "distributed_load_input": df,
            "support_input": transform_dict_to_list(sf),
        }
        # self.add_point_load(pf)
        # self.add_distributed_load(df)
        # self.assign_support_values(transform_dict_to_list(sf))
        # print("bars",np.array(bars).astype(int).shape)
        # print("bars",np.array(array).astype(int).shape)
        # print("bars",np.array(bars).astype(int))
        # print("bars",np.array(array).astype(float))
        # print("array",np.array(array).astype(int))
        return [np.array(array).astype(float), np.array(bars).astype(int),elements_list]

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


        print("d",self.node)
        print("d",self.bar)
        # Calculate the differences in y-coordinates between the second node and the first node of each bar
        d = self.node[self.bar[:, 1], :] - self.node[self.bar[:, 0], :]
        return
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
            self.point_load[(location, 0)] = load*-1
        print(self.point_load)
        
    def add_distributed_load(self, loadingList):
        for location, load_array in loadingList.items():
            self.distributed_load[location] = np.array(load_array)*-1
        # print(self.distributed_load)
            

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


# E: float = 30e6
# I: float = 500
# beam_1 = Beam(50, 21, E, I)


# # Given dictionary 'a'
# pointLoad_input = {5: -1e3, 15: -1e3}


# distributedload_input = {
#     15: [0, -10],
#     16: [-10, -20],
#     17: [-20, -30],
#     18: [-30, -40],
#     19: [-40, -50],
# }
# support_1_input = [(0,), (10, 0), (20,)]


# Given dictionary 'a'
# node no
# pointLoad_ = {9: -1e3, 50: -1e3}
# pointLoad_ = {12.5: -1e3, 37.5: -1e3}
pointLoad_ = {4: 10, 9: 11,17:21}
# beam element no
# positionOnBeam [span ls le ]
distributedload_ = [
    ["d",0, [4, 22, 0]],
    ["d",0, [4, 5, 18]],
    ["d",6, [5, 20, 13]],
    ["d",20, [5, 13, 13]]
    # 37.5: [12.5, 0, 50],
    # 20: [11, 10, 10],
]
# list_d=[['d', 3, [14, 0, 40]],['d', 7, [15, 10, 30]]]

# ["d",key, value]
# node no
# support_= {0:0, 25:1, 50:0}
support_= {0:0,4:1,14:0, 20:1, 25:0}
# 17:1 is roller

value_ = {
    "point_load_input": pointLoad_,
    "distributed_load_input": distributedload_,
    "support_input": support_,
}
# Structure input
E: float = 30e6
I: float = 500
beam_1 = Beam(25, 30, E, I,value_)




# pointLoad_input = {5: -1e3, 15: -1e3}

# # beam element no
# distributedload_input = {
#     15: [0, -10],
#     16: [-10, -20],
#     17: [-20, -30],
#     18: [-30, -40],
#     19: [-40, -50],
# }
# # node no
# support_1_input = [(0,), (10, 0), (20,)]


# value = {
#     "point_load_input": pointLoad_input,
#     "distributed_load_input": distributedload_input,
#     "support_input": support_1_input,
# }

# beam_1.add_values(value)


beam_1.analysis()
result = beam_1.results()

beam_1.plot(1)

plots = beam_1.plots_json()

