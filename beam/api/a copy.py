import numpy as np

distributedload_ = [
["d", 0, [5, 5000, 1000]],
["d", 5, [5, 10000, 5000]],
]
support_ = {2.5: 1, 7.5: 1, 10: 0}
pointLoad_ = [[3, 12000], [6, 15000]]
    
E: float = 210e9    
I: float = 4.73e-6    
leng=5000
minspan=0.5

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

    s={}
    support_=support_
    for key in support_:
        s[float(key)]=support_[key]
    support_=s
    print(support_)


    a = []
    for dl in distributedload_:
        if dl[2][1] != dl[2][2]:
            min_value = min(dl[2][1], dl[2][2])
            a.append(["d", dl[1], [dl[2][0], min_value, min_value]])
            a.append(["d", dl[1], [dl[2][0], dl[2][1] - min_value, dl[2][2] - min_value]])
        else:
            a.append(dl)


    def dl_to_node(list_d, minspan):
        n ={}
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


    n, a = dl_to_node(a, minspan)
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

no_nodes, bars, n,value_= arrangeData(distributedload_,support_,pointLoad_,minspan,leng)


E = float(input("Enter the modulous of elasticity (E) of beam in N/mm^2: "))
I = float(
    input("Enter the area moment of inertia (I) of the beam cross section in mm^4: ")
)
tl = leng
tn = no_nodes
te = no_nodes-1
L = tl / te
kelist = []
for i in range(te):
    ke = np.array(
        [
            [
                12 * E * I / L**3,
                6 * E * I / L**2,
                -12 * E * I / L**3,
                6 * E * I / L**2,
            ],
            [6 * E * I / L**2, 4 * E * I / L, -6 * E * I / L**2, 2 * E * I / L],
            [
                -12 * E * I / L**3,
                -6 * E * I / L**2,
                12 * E * I / L**3,
                -6 * E * I / L**2,
            ],
            [6 * E * I / L**2, 2 * E * I / L, -6 * E * I / L**2, 4 * E * I / L],
        ]
    )
    kelist.append(ke)
GSM = np.zeros((2 * tn, 2 * tn), dtype=float)


count = 0
for i in range(te):
    ke = kelist[i]
    for m in range(4):
        for n in range(4):
            GSM[m + count, n + count] = GSM[m + count, n + count] + ke[m, n]
    count = count + 2


print("\n##________________________ Boudry Condition ________________________##")

dispvect = np.ones((2 * tn, 1), dtype=float)

stypes = (
    "\nTypes of supports: \nf - Fixed support \np - Pinned support or Roller support \n"
)
print(stypes)
tsup = int(input("Enter the total number of supports to the beam: "))
for i in range(tsup):
    nn = int(input("\nEnter the node number of support " + str(i + 1) + " : "))
    suptype = str(input("Support type : "))
    if suptype == "f":
        dispvect[nn * 2 - 2, 0] = 0
        dispvect[nn * 2 - 1, 0] = 0
    if suptype == "p":
        dispvect[(nn * 2) - 2, 0] = 0

print("\n##________________________ Loading ________________________##")

forcevect = np.zeros((2 * tn, 1), dtype=float)

loadtypes = "\nTypes of loads: \np - Point load \nudl - Uniformly distributed load \n"
print(loadtypes)
tptlds = int(
    input("Enter the total number of point loads on the beam (put zero(0) if none): ")
)
if tptlds != 0:
    for i in range(tptlds):
        nn = int(input("Enter the node number of point load " + str(i + 1) + " : "))
        pl = float(input("Enter the point load in N: "))
        forcevect[nn * 2 - 2, 0] = forcevect[nn * 2 - 2, 0] + pl

tudls = int(
    input(
        "\nEnter the total number of beam elements having udl (put zero(0) if none): "
    )
)
if tudls != 0:
    for i in range(tudls):
        en = int(input("Enter the element number: "))
        udl = float(input("Enter the UDL in N/mm: "))
        eqptl = udl * L / 2
        eqmt = udl * (L**2) / 12
        forcevect[en * 2 - 2, 0] = forcevect[en * 2 - 2, 0] + eqptl
        forcevect[en * 2 - 1, 0] = forcevect[en * 2 - 1, 0] - eqmt
        forcevect[en * 2, 0] = forcevect[en * 2, 0] + eqptl
        forcevect[en * 2 + 1, 0] = forcevect[en * 2 + 1, 0] + eqmt


rcdlist = []
for i in range(tn * 2):
    if dispvect[i, 0] == 0:
        rcdlist.append(i)

rrgsm = np.delete(GSM, rcdlist, 0)  # row reduction
crgsm = np.delete(rrgsm, rcdlist, 1)  # column reduction
rgsm = crgsm  # reduced global stiffness matrix
rforcevect = np.delete(forcevect, rcdlist, 0)  # reduced force mat
rdispvect = np.delete(dispvect, rcdlist, 0)  # reduced disp mat

dispresult = np.matmul(np.linalg.inv(rgsm), rforcevect)

rin = 0
for i in range(tn * 2):
    if dispvect[i, 0] == 1:
        dispvect[i, 0] = dispresult[rin, 0]
        rin = rin + 1
##print(dispmat)

forceresult = np.matmul(GSM, dispvect)
for i in range(tn * 2):
    if dispvect[i, 0] == 0:
        forceresult[i, 0] = forceresult[i, 0] - forcevect[i, 0]

disp = []
rot = []
for i in range(len(dispvect)):
    if i % 2 == 0:
        disp.append(dispvect[i, 0])
    else:
        rot.append(dispvect[i, 0])

print()

##for di in disp:
##	print(np.round(di, decimals=3))

##tdisp = (5000*(4000**3))/(48*25000*337500000)
##print('Beam theory displacement = ',tdisp)


# print(forceresult)
n = 0
bm = []
for i in range(te):
    ke = kelist[i]
    ldisp = dispvect[n : n + 4]
    n = n + 2
    lforce = np.matmul(ke, ldisp)
    bm.append(round(float(lforce[1]), 3))
    if i == te - 1:
        bm.append(round(-1 * float(lforce[3]), 3))

beamlen = np.arange(0, tl + L, L)
##pltaxis = np.arange(-L, tl+L+L, L)
####plt.plot(beamlen, bm)
##plt.plot(beamlen, disp)
##plt.show()
print("\nbeam length\n")
for lenth in beamlen:
    print(round(float(lenth), 3))
print("\ndisplacements\n")
for di in disp:
    print(np.round(di, decimals=3))
print("\nBending moment\n")
for bm in bm:
    print(bm)
