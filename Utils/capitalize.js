function capitalize(fieldsToCapitalize = []) {
  return function (req, res, next) {
    const formattedQuery = { ...req.query };

    for (const key of Object.keys(formattedQuery)) {
      let value = formattedQuery[key];

      if (typeof value === "string") {
        value = value.trim();

        if (fieldsToCapitalize.includes(key)) {
          formattedQuery[key] = value.charAt(0).toUpperCase() + value.slice(1);
        }
      }
    }

    // Merge the updated query back into req.query
    Object.assign(req.query, formattedQuery);

    console.log("Updated Query:", req.query); // Debugging log
    next();
  };
}

module.exports = capitalize;