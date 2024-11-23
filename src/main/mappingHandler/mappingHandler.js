const fs = require("fs");
const path = require("path");

const mappingsPath = path.join(
  __dirname,
  "../../src/main/mappingHandler/data/gestureMappings.json"
);

const ensureDirectoryExists = () => {
  const dirPath = path.dirname(mappingsPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const saveMappings = (mappings) => {
  try {
    ensureDirectoryExists();
    const jsonObject = Object.fromEntries(mappings);
    fs.writeFileSync(mappingsPath, JSON.stringify(jsonObject, null, 2), "utf8");
    console.log("Stored successfully in:", mappingsPath);
  } catch (error) {
    console.log("Error saving  mappings", error);
  }
};

const loadMappings = (ag, ac) => {
  try {
    ensureDirectoryExists();
    if (fs.existsSync(mappingsPath)) {
      const rawData = fs.readFileSync(mappingsPath, "utf8");
      const jsonObject = JSON.parse(rawData);
      return new Map(Object.entries(jsonObject));
    } else {
      console.log("JSON file not found. Generating default mappings...");
      return generateDefaultMappings(ag, ac);
    }
  } catch (error) {
    console.log("Error loading mappings:", error);
    return generateDefaultMappings(ag, ac);
  }
};

const generateDefaultMappings = (ag, ac) => {
  const defaultMappings = new Map();
  const gestureKeys = Array.from(ag.keys());
  const controlKeys = Array.from(ac.keys());

  for (let i = 0; i < Math.min(gestureKeys.length, controlKeys.length); i++) {
    defaultMappings.set(gestureKeys[i], controlKeys[i]);
  }

  return defaultMappings;
};

export { saveMappings, loadMappings };
