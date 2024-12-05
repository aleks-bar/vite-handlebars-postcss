export const getClosest = (elem: HTMLElement | null, searchElem: string) => {
  // @ts-ignore
  return !elem || !elem.closest ? null : elem.closest(searchElem)
}