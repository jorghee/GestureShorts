const vm = require('vm');
const { mouse, keyboard, Key, Button } = require("@nut-tree/nut-js");

const context = vm.createContext({
  mouse,
  keyboard,
  Key,
  Button,
  console,
});

const script = new vm.Script(userCode);

cont 

script.runInContext(context);