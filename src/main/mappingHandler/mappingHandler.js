const fs = require("fs");
const path = require("path");

const mappingsPath = path.join(
  __dirname,
  "../../src/main/mappingHandler/data/gestureMappings.json"
);

const customHstatesPath = path.join(
  __dirname, "../../renderer/custom/hstates.json"
)
const customInstructionsPath = path.join(
  __dirname, "../../renderer/custom/instructions.json"
)

const ensureDirectoryExists = () => {
  const dirPath = path.dirname(mappingsPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
const ensureDirExists = (dir) =>{
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true})
  }
}

const saveCustom = (name, newHstate) => {
  try {
    ensureDirExists(customHstatesPath.dirname);
    let fullCustomGestures = {};
    if(fs.existsSync(customHstatesPath)){
      const rawData = fs.readFileSync(customHstatesPath, "utf8");
      const jsonObject = JSON.parse(rawData);
      fullCustomGestures = jsonObject;
    }
    fullCustomGestures[name] = newHstate;
    fs.writeFileSync(customHstatesPath, JSON.stringify(fullCustomGestures, null, 2), "utf8");
    console.log("Stored successfully in:", mappingsPath);
  } catch (error) {
    console.log("Error saving  mappings", error);
  }
}
const loadCustom = () => {
  try {
    ensureDirExists(path.dirname(customInstructionsPath));
    if (fs.existsSync(mappingsPath)) {
      const rawData = fs.readFileSync(mappingsPath, "utf8");
      const jsonObject = JSON.parse(rawData);
      return jsonObject;
    } else {
      console.log("JSON file not found. Generating empty map...");
      fs.writeFileSync(customHstatesPath, JSON.stringify({}, null, 2), "utf8");
      return {};
    }
  } catch (error) {
    console.log("Error loading mappings:", error);
    return {};
  }
}
const saveInstruction = (name, newInstruction) => {
  try {
    ensureDirExists(customInstructionsPath.dirname);
    let fullInstrucions = {};
    if(fs.existsSync(customInstructionsPath)){
      const rawData = fs.readFileSync(customInstructionsPath, "utf8");
      const jsonObject = JSON.parse(rawData);
      fullInstrucions = jsonObject;
    }
    fullInstrucions[name] = newInstruction;
    fs.writeFileSync(customInstructionsPath, JSON.stringify(fullInstrucions, null, 2), "utf8");
    console.log("Stored successfully in:", mappingsPath);
  } catch (error) {
    console.log("Error saving  mappings", error);
  }
}
const loadInstruction = (newHstate) => {
  try {
    ensureDirExists(path.dirname(customInstructionsPath));
    if (fs.existsSync(mappingsPath)) {
      const rawData = fs.readFileSync(mappingsPath, "utf8");
      const jsonObject = JSON.parse(rawData);
      return new Map(Object.entries(jsonObject));
    } else {
      console.log("JSON file not found. Generating empty map...");

      return generateDefaultMappings(ag, ac);
    }
  } catch (error) {
    console.log("Error loading mappings:", error);
    return generateDefaultMappings(ag, ac);
  }
}

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

const loadMappings = () => {
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

export { saveMappings, loadMappings, saveCustom, loadCustom, saveInstruction, loadInstruction};
