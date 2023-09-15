import numpy

E = float(input("Enter the modulous of elasticity (E) of beam in N/mm^2: "))
I = float(
    input("Enter the area moment of inertia (I) of the beam cross section in mm^4: ")
)
tl = float(input("Enter the total length of the beam in mm: "))
te = int(input("Enter the total number of elements: "))
tn = te + 1
L = tl / te
kelist = []
for i in range(te):
    ke = numpy.array(
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
GSM = numpy.zeros((2 * tn, 2 * tn), dtype=float)


count = 0
for i in range(te):
    ke = kelist[i]
    for m in range(4):
        for n in range(4):
            GSM[m + count, n + count] = GSM[m + count, n + count] + ke[m, n]
    count = count + 2


print("\n##________________________ Boudry Condition ________________________##")

dispvect = numpy.ones((2 * tn, 1), dtype=float)

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

forcevect = numpy.zeros((2 * tn, 1), dtype=float)

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

rrgsm = numpy.delete(GSM, rcdlist, 0)  # row reduction
crgsm = numpy.delete(rrgsm, rcdlist, 1)  # column reduction
rgsm = crgsm  # reduced global stiffness matrix
rforcevect = numpy.delete(forcevect, rcdlist, 0)  # reduced force mat
rdispvect = numpy.delete(dispvect, rcdlist, 0)  # reduced disp mat

dispresult = numpy.matmul(numpy.linalg.inv(rgsm), rforcevect)

rin = 0
for i in range(tn * 2):
    if dispvect[i, 0] == 1:
        dispvect[i, 0] = dispresult[rin, 0]
        rin = rin + 1
##print(dispmat)

forceresult = numpy.matmul(GSM, dispvect)
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
##	print(numpy.round(di, decimals=3))

##tdisp = (5000*(4000**3))/(48*25000*337500000)
##print('Beam theory displacement = ',tdisp)


# print(forceresult)
n = 0
bm = []
for i in range(te):
    ke = kelist[i]
    ldisp = dispvect[n : n + 4]
    n = n + 2
    lforce = numpy.matmul(ke, ldisp)
    bm.append(round(float(lforce[1]), 3))
    if i == te - 1:
        bm.append(round(-1 * float(lforce[3]), 3))

beamlen = numpy.arange(0, tl + L, L)
##pltaxis = numpy.arange(-L, tl+L+L, L)
####plt.plot(beamlen, bm)
##plt.plot(beamlen, disp)
##plt.show()
print("\nbeam length\n")
for lenth in beamlen:
    print(round(float(lenth), 3))
print("\ndisplacements\n")
for di in disp:
    print(numpy.round(di, decimals=3))
print("\nBending moment\n")
for bm in bm:
    print(bm)
