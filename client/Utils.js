const Utils = {

  darkerColor(col, amt) {
    col = col.replace(/^#/, '')
    if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2]

    let [r, g, b] = col.match(/.{2}/g);
    ([r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt])

    r = Math.max(Math.min(255, r), 0).toString(16)
    g = Math.max(Math.min(255, g), 0).toString(16)
    b = Math.max(Math.min(255, b), 0).toString(16)

    const rr = (r.length < 2 ? '0' : '') + r
    const gg = (g.length < 2 ? '0' : '') + g
    const bb = (b.length < 2 ? '0' : '') + b

    return `#${rr}${gg}${bb}`
  },

  adjustPosition(faceIndex, currentPoint, intersectedType) {

    let adjustedPoint = Object.assign({}, currentPoint); // do a real copy

    if(intersectedType === 'standard') {
      if (faceIndex === 2) adjustedPoint.y += 1 // top
      if (faceIndex === 1) adjustedPoint.x -= 1 // WEST
      if (faceIndex === 0) adjustedPoint.x += 1// EST
      if (faceIndex === 4) adjustedPoint.z += 1// SOUTH
      if (faceIndex === 5) adjustedPoint.z -= 1 // NORTH
    }

    if (intersectedType === 'crate') {
      adjustedPoint.y += 1
    }

    return adjustedPoint;
  }

}

export default Utils