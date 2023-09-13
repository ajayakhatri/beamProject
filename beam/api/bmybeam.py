import numpy as np

class Beam:
    def __init__(self, beam_len: float, nodes_num: int, youngMod, moment_inertia,unit):
        """
        Initializes a Beam object.
        Parameters:
        - young: float, Young's modulus of the material
        - inertia: float, moment of inertia of the beam
        """
        self.beam_len = beam_len
        self.nodes_num = nodes_num
        self.bar_span= beam_len/nodes_num 
        self.youngMod = youngMod
        self.moment_inertia = moment_inertia
        self.unit=unit
        self.bars = self.gen_bars()
        self.dof=2
    def gen_bars(self):
        bars = []
        for i in range(self.nodes_num - 1):
            bars.append([i, i + 1])
        return np.array(bars).astype(int)
  
    def analyis(self):
        # 2 ends in a beam element
        size: int= 2*self.dof
        local_k=np.zeros((size,size))
        matrix_k=np.zeros((self.nodes_num,size,size))
        global_k=np.zeros((size*self.nodes_num,size*self.nodes_num))
        l=self.bar_span
        nodal_index=np.zeros((self.nodes_num,1,size))

        
        # for i in range(self.nodes_num):
        for i in range(self.nodes_num-1):
            aux = self.dof * self.bars[i, :]  # Compute DOF indices for the current bar
            index = np.r_[
                aux[0] : aux[0] + self.dof, aux[1] : aux[1] + self.dof
            ]  
            local_k[0] = [12, 6 * l, -12, 6 * l]
            local_k[1] = [6 * l, 4 * l**2, -6 * l, 2 * l**2]
            local_k[2] = [-12, -6 * l, 12, -6 * l]
            local_k[3] = [6 * l, 2 * l**2, -6 * l, 4 * l**2]
            matrix_k[i] = self.youngMod * self.moment_inertia * local_k / l**3
            global_k[np.ix_(index, index)] += matrix_k[i]
            # print(aux)
            # print(index)
            # print(np.ix_(index, index))
      


E: float = 30e6
I: float = 500
beam_1 = Beam(480, 3, E, I,"m")
beam_1.analyis()
# print( )