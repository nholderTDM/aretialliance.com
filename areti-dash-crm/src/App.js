import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
// import Callback from './components/Callback';
// import AuthService from './services/auth';
// import TestScriptNav from './components/TestScriptNav';
import FixScriptNav from './components/FixScriptNav';

function App() {
 // const [isLoading, setIsLoading] = useState(true);

//  useEffect(() => {
//    const initAuth = async () => {
//      await AuthService.init();
//      setIsLoading(false);
//    };

//   initAuth();
//  }, []);

//  if (isLoading) {
//    return (
//      <div className="min-h-screen flex items-center justify-center bg-blue-900">
//        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//      </div>
//   );
// }
  return (
    <Routes>
      <Route path="/fix-script" element={<FixScriptNav />} />
      {/* <Route path="/callback" element={<Callback />} /> */}
      {/* <Route path="/dashboard/*" element={<Dashboard />} /> */}
      <Route path="/*" element={<Dashboard />} /> 
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      {/* <Route path="/test-script" element={<TestScriptNav />} /> */}
    </Routes>
  );
}

export default App;