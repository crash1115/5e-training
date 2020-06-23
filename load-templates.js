export const preloadTemplates = async function() {
  const templatePaths = [
    "modules/5e-training/templates/partials/ability.html",
    "modules/5e-training/templates/partials/simple.html"
  ];
  return loadTemplates(templatePaths);
};
