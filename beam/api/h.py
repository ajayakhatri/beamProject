list_d=[['d', 15, [4, 0, 40]]]
#    15: [0, -10],
#     16: [-10, -20],
#     17: [-20, -30],
#     18: [-30, -40],
#     19: [-40, -50],
span=1
for list in list_d:
            y1=list[2][1]
            y2=list[2][2]
            x1=list[1]
            x2=list[1]+list[2][0]
            # x1=list[1]
            # x2=list[1]+list[2][0]
            
            y=lambda x:round(((y2-y1)/(x2-x1))*(x-x1)+(y1),3)

            
            x=list[1]+span
            if list[1]%span!=0:
                x=(int(list[1]/span)+1)*span
        

            dl={list[1]:[list[2][1],y(x)]}
            pre=list[2][1]
            while x<=x2:
                if x+span>x2: 
                    dl[x2]=[y(x),y(x2+span)]
                else:
                    dl[x]=[y(x),y(x+span)]
                x+=span
            print(dl)

