const vm = require('vm');
const { mouse, keyboard, Key, Button } = require("@nut-tree/nut-js");

const context = vm.createContext({
  mouse,
  keyboard,
  Key,
  Button,
  console,
});


const runCommand = async (userCode) =>{
  const script = new vm.Script(userCode);
  script.runInContext(context);
}

export default runCommand;