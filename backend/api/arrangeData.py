import numpy as np
def arrangeData(distributedload_, support_, pointLoad_input, max_element_span, leng):
    sum_dict = {}
    for sublist in pointLoad_input:
        key = sublist[0]
        value = sublist[1]
        if key in sum_dict:
            sum_dict[key] += value
        else:
            sum_dict[key] = value
    pointLoad_ = sum_dict

    s = {}
    support_ = support_
    for key in support_:
        s[float(key)] = support_[key]
    support_ = s

    a = []
    for dl in distributedload_:
        if dl[2][1] != dl[2][2]:
            min_value = min(dl[2][1], dl[2][2])
            a.append(["d", dl[1], [dl[2][0], min_value, min_value]])
            a.append(
                ["d", dl[1], [dl[2][0], dl[2][1] - min_value, dl[2][2] - min_value]]
            )
        else:
            a.append(dl)

    def dl_to_node(list_d, max_element_span):
        n = {}
        a = {}
        span = max_element_span
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

    n, a = dl_to_node(a, max_element_span)
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
            x += max_element_span

    for i in range(len(list_n) - 1):
        x = list_n[i][0]
        while x <= list_n[i + 1][0]:
            if x not in n:
                n[x] = 0
            x += max_element_span

    if list_n[-1][0] != leng:
        x = list_n[-1][0]
        while x <= leng:
            if x not in n:
                n[x] = 0
            x += max_element_span

    n = dict(sorted(n.items(), key=lambda x: x[0]))

    node = 1
    pf = {}
    df = {}
    sf = {}
    location2node = {}
    for i in n:
        location2node[i] = node
        node += 1
    for i in list_n:
        if i[0] in pointLoad_:
            pf[location2node[i[0]] - 1] = -1 * pointLoad_[i[0]]
        if i[0] in support_:
            sf[location2node[i[0]] - 1] = support_[i[0]]
        if i[0] in dldict_:
            df[location2node[i[0]] - 1] = dldict_[i[0]]

    list_df = [[key, value] for key, value in df.items()]
    list_pf = [[key, ["p", value]] for key, value in pf.items()]
    list_sf = [[key, ["s", value]] for key, value in sf.items()]

    combined_list = list_pf + list_df + list_sf


    no_nodes = len(n)
    bars = []
    dff = {}
    for i in range(len(list_df) - 1):
        if list_df[i][0] == list_df[i + 1][0] - 1:
            dff[list_df[i][0]] = [-1 * list_df[i][1][1], -1 * list_df[i + 1][1][1]]

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
    print("-------------------")
    print(distributedload_, support_, pointLoad_input, max_element_span, leng)
    # print(no_nodes, bars, n, value_)
    print("-------------------")
    return no_nodes, bars, n, value_
