import React from 'react';
// import FixScriptNav from './components/FixScriptNav';
import ScriptNavigator from './ScriptNavigator'; // Make sure ScriptNavigator.jsx exists in same folder

function FixScriptNav() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Script Navigator</h1>
      <ScriptNavigator />
    </div>
  );
}

export default FixScriptNav;