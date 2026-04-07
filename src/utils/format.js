const format = (template, values) => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return String(values[key])
    }
    return match
  })
}

module.exports = format
