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
    fs.writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2), "utf8");
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
      return jsonObject;
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
  const defaultMappings = [];
  const gestureKeys = Array.from(ag.keys());
  const controlKeys = Array.from(ac.keys());

  for (let i = 0; i < Math.min(gestureKeys.length, controlKeys.length); i++) {
    defaultMappings.push({
      gesture: gestureKeys[i],
      control: controlKeys[i]
    });
  }

  return defaultMappings;
};

export { saveMappings, loadMappings };
