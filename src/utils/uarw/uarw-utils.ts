export function colination(arr: string[], sortByCount?: SortInfo): ValCount[] {
  const ret: ValCount[] = [];
  if (arr && arr.length > 0) {
    arr.forEach(val => {
      const currElem = ret.find(retEl => retEl.value === val)
      if (!currElem) {
        ret.push(new ValCount(val, 1))
      } else {
        currElem.count++
      }
    })
    // ---
    if (sortByCount && sortByCount.needSort) {
      ret.sort((a, b) => {
        if (sortByCount.ascending) {
          return a.count - b.count
        }
        return b.count - a.count
      })
    }
  }
  return ret;
}

export class ValCount {
  public count: number;

  constructor(readonly value: string, count: number) {
    this.count = count;
  }

  static asValLabels(valCounts: ValCount[]): ValLabel[] {
    return valCounts.map(valCount => {
      return new ValLabel(valCount.value, `${valCount.value} (${valCount.count})`)
    })
  }

}

export class SortInfo {
  constructor(readonly needSort: boolean = false, readonly ascending: boolean = true) {
  }
}

export class ValLabel {
  constructor(readonly value: string, readonly label: string) {
  }
}

export function arrObjectsSortByStringProp(arrObjectsBack: object[], propName: string, ascending: boolean = true): void {
  arrObjectsBack.sort((oj1, oj2) => {
    // @ts-ignore
    const v1 = oj1[propName];
    // @ts-ignore
    const v2 = oj2[propName];
    if (v1 < v2) {
      return ascending ? -1 : 1
    }
    if (v1 > v2) {
      return ascending ? 1 : -1
    }
    return 0
  })
}

export function selectOptionToVusc(fieldName: string, option: { value: string } | { value: string }[] | null): string {
  // --- values
  const values = [];
  if (option) {
    if (Array.isArray(option)) {
      option.forEach(el => values.push(el.value))
    } else {
      values.push(option.value)
    }
  }
  // ---
  const nx = values.map(val => `{${fieldName}} = '${val}'`).join(', ')
  return nx.length > 0 ? `OR(${nx})` : ''
}
