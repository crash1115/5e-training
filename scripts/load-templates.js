export const preloadTemplates = async function() {
  const templatePaths = [
    "modules/5e-training/templates/partials/ability.html",
    "modules/5e-training/templates/partials/skill.html",
    "modules/5e-training/templates/partials/tool.html",
    "modules/5e-training/templates/partials/macro.html",
    "modules/5e-training/templates/partials/fixed.html"
  ];
  return loadTemplates(templatePaths);
};
