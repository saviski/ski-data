const skidataMap = new WeakMap<Node, object>()

export function skidata<T extends object>(node: Node): Readonly<T> {
  let data = skidataMap.get(node)
  if (!data) {
    data = Object.create(
      node.parentNode
        ? skidata(node.parentNode)
        : node instanceof Attr
        ? skidata(node.ownerElement!)
        : Object.prototype
    )
    skidataMap.set(node, data!)
  }
  return <T>data!
}

export function setRootSkidata<T extends object>(node: Node, data: T) {
  skidataMap.set(node, data)
}

export function assignSkidata<T extends object>(node: Node, values: T) {
  const object = skidata(node)
  // ignore __proto__ setters
  for (const key in values) Reflect.set({}, key, values[key], object)
  // Object.defineProperties(
  //   skidata(node),
  //   Object.fromEntries(
  //     Object.entries(values).map<[string, PropertyDescriptor]>(
  //       ([key, value]) => [key, { value, configurable: true, enumerable: true }]
  //     )
  //   )
  // );
}
