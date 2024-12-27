const vm = require('vm');
const { mouse, keyboard, Key, Button, screen, straightTo } = require("@nut-tree-fork/nut-js");

const context = vm.createContext({
  mouse,
  keyboard,
  Key,
  Button,
  console,
  screen,
  straightTo,
});


const runCommand = async (userCode) =>{
  const script = new vm.Script(`
    (async () => {
        ${userCode}
    })();
  `);

  try {
      await script.runInContext(context);
  } catch (error) {
      console.error("Error executing command:", error);
  }
}

export default runCommand;