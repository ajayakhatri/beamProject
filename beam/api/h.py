list_d=[['d', 3, [14, 0, 40]],['d', 7, [15, 10, 30]]]
#    1: [0, -10],
#     2: [-10, -20],
#     3: [-20, -30],
#     4: [-30, -40],
f=[]

span=3
dl={}
for list in list_d:
            y1=list[2][1]
            y2=list[2][2]
            x1=list[1]
            x2=list[1]+list[2][0]   
            y=lambda x:round(((y2-y1)/(x2-x1))*(x-x1)+(y1),3)

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

            print(s,e)
            print(l)
            print("dl",dl)
            for i in range(len(l)-1):
                if l[i] in dl:
                    print("yes",l[i])
                    dl[l[i]][0]=dl[l[i]][0]-y(l[i])
                    dl[l[i]][1]=dl[l[i]][1]-y(l[i+1])
                else:
                    dl[l[i]]=[-y(l[i]),-y(l[i+1])]
                print(l[i],[-y(l[i]),-y(l[i+1])])

            if x2%span!=0:
                dl[x2]=[0]
            print(dl)


list_d = [["d",key, value] for key, value in dl.items()]
print(list_d)