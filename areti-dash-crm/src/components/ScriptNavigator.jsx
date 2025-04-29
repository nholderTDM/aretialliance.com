// src/components/ScriptNavigator.jsx
import React, { useState, useEffect } from 'react';
import { 
  Phone, X, Save, Calendar, Clock, ChevronDown, ChevronUp, Search, 
  Star, StarOff, Info, FileText, Clipboard, Download, Volume2, UserPlus, BarChart2 
} from 'lucide-react';

const ScriptNavigator = () => {
  // Track conversation state
  const [currentStep, setCurrentStep] = useState('introduction');
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    industry: ''  
  });
  
  // UI state
  const [showScript, setShowScript] = useState(true);
  const [showContact, setShowContact] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [favoriteScripts, setFavoriteScripts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [scriptVariant, setScriptVariant] = useState('standard');
  const [customScriptVersion, setCustomScriptVersion] = useState('v1');
  const [callTimer, setCallTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedName, setSavedName] = useState('');
  const [followUpTasks, setFollowUpTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'medium' });
  const [showKeyPhrases, setShowKeyPhrases] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Analytics tracking
  const [analyticsData, setAnalyticsData] = useState({
    pathsUsed: {},
    objectionCounts: {},
    successRates: {},
    avgCallTime: 0,
    callCount: 0,
    consultationsScheduled: 0,
    leadConversionRate: 0
  });
  
  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favoriteScripts');
      if (savedFavorites) {
        setFavoriteScripts(JSON.parse(savedFavorites));
      }
      
      const savedAnalytics = localStorage.getItem('scriptAnalytics');
      if (savedAnalytics) {
        setAnalyticsData(JSON.parse(savedAnalytics));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);
  
  // Save favorites when they change
  useEffect(() => {
    try {
      localStorage.setItem('favoriteScripts', JSON.stringify(favoriteScripts));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favoriteScripts]);
  
  // Call timer
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCallTimer(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  
  // Format timer display
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Start/stop timer
  const toggleTimer = () => {
    if (!isTimerRunning && callTimer === 0) {
      // Starting a new call - add to analytics
      setAnalyticsData(prev => ({
        ...prev,
        callCount: prev.callCount + 1
      }));
    }
    
    setIsTimerRunning(!isTimerRunning);
  };
  
  // Reset timer
  const resetTimer = () => {
    if (callTimer > 0 && !isTimerRunning) {
      // Update average call time
      setAnalyticsData(prev => {
        const totalTime = (prev.avgCallTime * prev.callCount) + callTimer;
        const newCount = prev.callCount;
        return {
          ...prev,
          avgCallTime: newCount ? totalTime / newCount : 0
        };
      });
    }
    
    setCallTimer(0);
    setIsTimerRunning(false);
  };
  
  // Track step changes for analytics
  const handleStepChange = (nextStep) => {
    // Record the current step in history
    if (currentStep && conversationSteps[currentStep]) {
      setHistory(prev => [...prev, { 
        step: currentStep, 
        title: conversationSteps[currentStep].title,
        timestamp: new Date().toISOString()
      }]);
      
      // Track path usage in analytics
      setAnalyticsData(prev => {
        const pathsUsed = { ...prev.pathsUsed };
        pathsUsed[currentStep] = (pathsUsed[currentStep] || 0) + 1;
        return { ...prev, pathsUsed };
      });
    }
    
    // Track objections
    if (nextStep.includes('handle_') || nextStep.includes('address_')) {
      setAnalyticsData(prev => {
        const objectionCounts = { ...prev.objectionCounts };
        objectionCounts[nextStep] = (objectionCounts[nextStep] || 0) + 1;
        return { ...prev, objectionCounts };
      });
    }
    
    // Track consultations scheduled
    if (nextStep === 'schedule_consultation' || nextStep === 'confirm_appointment') {
      setAnalyticsData(prev => ({
        ...prev,
        consultationsScheduled: prev.consultationsScheduled + 1,
        leadConversionRate: (prev.consultationsScheduled + 1) / (prev.callCount || 1)
      }));
    }
    
    // Set the new current step
    setCurrentStep(nextStep);
  };
  
  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = Object.entries(conversationSteps)
      .filter(([key, step]) => 
        step.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        step.script.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(([key, step]) => ({
        key,
        title: step.title
      }));
      
    setSearchResults(results);
  }, [searchTerm]);
  
  // Toggle favorite script
  const toggleFavorite = (stepKey) => {
    if (favoriteScripts.includes(stepKey)) {
      setFavoriteScripts(favoriteScripts.filter(key => key !== stepKey));
    } else {
      setFavoriteScripts([...favoriteScripts, stepKey]);
    }
  };
  
  // Save current conversation
  const saveConversation = () => {
    // This would connect to your CRM's API in production
    const conversation = {
      name: savedName,
      history: [...history, { 
        step: currentStep, 
        title: conversationSteps[currentStep]?.title || 'Unknown Step'
      }],
      notes,
      contactInfo,
      date: new Date().toISOString(),
      duration: callTimer
    };
    
    // Save to analytics
    const updateAnalytics = { ...analyticsData };
    updateAnalytics.savedCalls = (updateAnalytics.savedCalls || 0) + 1;
    setAnalyticsData(updateAnalytics);
    
    try {
      localStorage.setItem('scriptAnalytics', JSON.stringify(updateAnalytics));
    } catch (error) {
      console.error("Error saving analytics to localStorage:", error);
    }
    
    console.log('Saving conversation:', conversation);
    
    // Mock API call
    setTimeout(() => {
      alert('Conversation saved successfully!');
      setShowSaveModal(false);
    }, 500);
  };
  
  // Add follow-up task
  const addFollowUpTask = () => {
    if (!newTask.title || !newTask.dueDate) return;
    
    setFollowUpTasks([...followUpTasks, {
      ...newTask,
      id: Date.now(),
      completed: false
    }]);
    
    // Reset form
    setNewTask({ title: '', dueDate: '', priority: 'medium' });
    setShowAddTask(false);
  };
  
  // Generate analytics report
  const generateReport = () => {
    // Analytics calculations would happen here
    setShowAnalytics(!showAnalytics);
  };
  
  // Define industry-specific key phrases
  const industryKeyPhrases = {
    retail: [
      "Same-day delivery to increase customer satisfaction",
      "Reduce cart abandonment with reliable delivery options",
      "Compete with Amazon-like delivery experiences"
    ],
    healthcare: [
      "HIPAA-compliant delivery protocols",
      "Temperature-controlled medication transport",
      "Urgent medical supply delivery"
    ],
    food: [
      "Hot food delivered hot, cold food delivered cold",
      "Specialized food transport equipment",
      "Rush hour delivery capacity"
    ],
    manufacturing: [
      "Just-in-time component delivery",
      "Production line continuity",
      "Emergency parts delivery"
    ],
    ecommerce: [
      "Branded delivery experience",
      "Delivery speed as competitive advantage",
      "Last-mile tracking for customer satisfaction"
    ],
    logistics: [
      "Overflow capacity during peak periods",
      "Specialized vehicle capabilities",
      "Route optimization expertise"
    ],
    construction: [
      "On-site delivery with proof of delivery",
      "Heavy and oversized item handling",
      "Time-sensitive material delivery"
    ],
    automotive: [
      "Parts delivery to minimize downtime",
      "Service level agreements for critical components",
      "Inventory management integration"
    ]
  };
  
  // Script variations based on industry or approach
  const scriptVariations = {
    standard: {
      introduction: {
        title: "Introduction",
        script: "Hello, my name is [Your Name] from Areti Alliance. We're a last-mile delivery service provider based in Atlanta. May I ask who I'm speaking with today?",
        options: [
          { label: "They introduce themselves", nextStep: "identify_decision_maker" },
          { label: "They ask what this is about", nextStep: "brief_explanation" },
          { label: "They say they're busy", nextStep: "busy_response" },
          { label: "Gatekeeper blocks access", nextStep: "handle_gatekeeper" }
        ]
      }
      // Other standard script steps would be defined here
    },
    assertive: {
      introduction: {
        title: "Assertive Introduction",
        script: "Hello, I'm [Your Name] with Areti Alliance. We specialize in optimizing last-mile delivery costs for businesses in your industry. Most companies we work with save 15-20% on delivery expenses. I'd like to discuss if we could achieve similar results for you. Who would be the best person to speak with about this?",
        options: [
          { label: "They introduce themselves", nextStep: "identify_decision_maker" },
          { label: "They ask for more details", nextStep: "assertive_value_proposition" },
          { label: "They say they're busy", nextStep: "assertive_busy_response" },
          { label: "Gatekeeper blocks access", nextStep: "handle_gatekeeper_assertively" }
        ]
      }
      // Other assertive script steps would be defined here
    },
    consultative: {
      introduction: {
        title: "Consultative Introduction",
        script: "Hello, my name is [Your Name] from Areti Alliance. We've been researching the logistics challenges in your industry, and I'm reaching out to learn more about how companies like yours are handling last-mile delivery. Would you be the right person to speak with about your delivery operations?",
        options: [
          { label: "They introduce themselves", nextStep: "identify_decision_maker" },
          { label: "They ask what specifically you want to know", nextStep: "consultative_questions" },
          { label: "They say they're busy", nextStep: "busy_response" },
          { label: "Gatekeeper blocks access", nextStep: "handle_gatekeeper_consultatively" }
        ]
      }
      // Other consultative script steps would be defined here
    }
  };
  
  // Main conversation steps
  const conversationSteps = {
    introduction: {
      title: "Introduction",
      script: "Hello, my name is [Your Name] from Areti Alliance. We're a last-mile delivery service provider based in Atlanta. May I ask who I'm speaking with today?",
      options: [
        { label: "They introduce themselves", nextStep: "identify_decision_maker" },
        { label: "They ask what this is about", nextStep: "brief_explanation" },
        { label: "They say they're busy", nextStep: "busy_response" },
        { label: "Gatekeeper blocks access", nextStep: "handle_gatekeeper" }
      ]
    },
    brief_explanation: {
      title: "Brief Explanation",
      script: "I'm reaching out to discuss how Areti Alliance can improve your last-mile delivery logistics. We help businesses like yours reduce costs and increase customer satisfaction with our reliable, tech-enabled delivery services. Is this something that would be valuable to discuss?",
      options: [
        { label: "Yes, they're interested", nextStep: "identify_decision_maker" },
        { label: "No, not interested", nextStep: "handle_not_interested" },
        { label: "Need more information", nextStep: "expand_value_proposition" }
      ]
    },
    // For brevity, I'll include just a few more steps. You can expand this section with more steps
    expand_value_proposition: {
      title: "Expanded Value Proposition",
      script: "Our approach is unique because we start small with specific routes or delivery types to prove our value before expanding. This minimizes risk and lets you see results before making a larger commitment. We offer real-time tracking, reliable drivers, flexible scaling during peaks, and detailed analytics on delivery performance. Many of our clients see improved customer satisfaction and operational efficiency. Which of these aspects would be most valuable to your business?",
      options: [
        { label: "They specify an aspect", nextStep: "address_stated_priorities" },
        { label: "Continue to decision maker", nextStep: "identify_decision_maker" },
        { label: "Need more specifics", nextStep: "industry_specific_benefits" }
      ]
    },
    handle_not_interested: {
      title: "Handle Not Interested",
      script: "I understand this might not be a priority right now. Many businesses come to us when they're experiencing delivery challenges or looking to improve customer satisfaction. Would it be alright if I check back in a few months, or is there a specific time when reviewing your delivery options might be more relevant?",
      options: [
        { label: "OK to follow up later", nextStep: "schedule_future_contact" },
        { label: "Never contact again", nextStep: "respectful_final_close" },
        { label: "They reconsider", nextStep: "pain_point_discovery" },
        { label: "Specific objection raised", nextStep: "address_specific_objection" }
      ]
    },
    respectful_final_close: {
      title: "Respectful Final Close",
      script: "I understand. Thank you for your time today. Should your needs change in the future, you can always reach us through our website at aretialliance.com. Have a great day!",
      options: [
        { label: "End call", nextStep: "reset" }
      ]
    },
    reset: {
      title: "End Call",
      script: "The call has ended. You can start a new call or review this call's history.",
      options: [
        { label: "Start new call", nextStep: "introduction" }
      ]
    },
    // You can add more conversation steps as needed
  };

  // Helper function to get current step's script based on selected variant
  const getCurrentStepScript = () => {
    // Check if the current step exists in the selected variant
    if (scriptVariations[scriptVariant] && scriptVariations[scriptVariant][currentStep]) {
      return scriptVariations[scriptVariant][currentStep];
    }
    
    // Fall back to the standard conversation steps
    return conversationSteps[currentStep] || {
      title: "Error",
      script: "No script found for this step.",
      options: [{ label: "Reset", nextStep: "introduction" }]
    };
  };

  // Render the UI
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Script Navigator</h1>
            <div className="bg-blue-500 px-3 py-1 rounded-full text-sm">
              {isTimerRunning ? 'Active Call' : 'Ready'}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock size={18} />
              <span>{formatTime(callTimer)}</span>
            </div>
            <button 
              onClick={toggleTimer}
              className={`px-3 py-1 rounded ${isTimerRunning ? 'bg-red-500' : 'bg-green-500'}`}
            >
              {isTimerRunning ? 'Pause' : 'Start Call'}
            </button>
            <button 
              onClick={resetTimer}
              className="px-3 py-1 bg-gray-700 rounded"
              disabled={isTimerRunning}
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Script Controls */}
        <div className="w-64 bg-white p-4 shadow-md flex flex-col">
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Script Style</h2>
            <select 
              className="w-full p-2 border rounded"
              value={scriptVariant}
              onChange={(e) => setScriptVariant(e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="assertive">Assertive</option>
              <option value="consultative">Consultative</option>
            </select>
          </div>
          
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Search Scripts</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by keyword..."
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
            {searchResults.length > 0 && (
              <ul className="mt-2 border rounded max-h-40 overflow-y-auto">
                {searchResults.map(result => (
                  <li 
                    key={result.key}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b text-sm"
                    onClick={() => {
                      handleStepChange(result.key);
                      setSearchTerm('');
                    }}
                  >
                    {result.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Favorite Scripts</h2>
              <button 
                onClick={() => setShowKeyPhrases(!showKeyPhrases)}
                className="text-blue-600 text-sm"
              >
                {showKeyPhrases ? 'Hide Key Phrases' : 'Show Key Phrases'}
              </button>
            </div>
            {favoriteScripts.length > 0 ? (
              <ul className="border rounded max-h-40 overflow-y-auto">
                {favoriteScripts.map(key => (
                  conversationSteps[key] && (
                    <li 
                      key={key}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b text-sm flex justify-between"
                      onClick={() => handleStepChange(key)}
                    >
                      <span>{conversationSteps[key].title}</span>
                      <StarOff 
                        size={16} 
                        className="text-yellow-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(key);
                        }}
                      />
                    </li>
                  )
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No favorites yet. Star scripts to save them here.</p>
            )}
          </div>
          
          {showKeyPhrases && contactInfo.industry && industryKeyPhrases[contactInfo.industry.toLowerCase()] && (
            <div className="mb-4">
              <h2 className="font-semibold mb-2">Industry Key Phrases</h2>
              <ul className="border rounded p-2 max-h-40 overflow-y-auto">
                {industryKeyPhrases[contactInfo.industry.toLowerCase()].map((phrase, index) => (
                  <li key={index} className="mb-1 text-sm">• {phrase}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-auto">
            <button
              onClick={generateReport}
              className="w-full p-2 bg-blue-600 text-white rounded flex items-center justify-center"
            >
              <BarChart2 size={18} className="mr-2" />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>
        </div>
        
        {/* Main Script Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Current Script */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{getCurrentStepScript().title}</h2>
              <div className="flex items-center">
                <button
                  onClick={() => toggleFavorite(currentStep)}
                  className="mr-2"
                >
                  {favoriteScripts.includes(currentStep) ? (
                    <StarOff size={18} className="text-yellow-500" />
                  ) : (
                    <Star size={18} className="text-gray-400 hover:text-yellow-500" />
                  )}
                </button>
                <button
                  onClick={() => setShowScript(!showScript)}
                  className="text-gray-500"
                >
                  {showScript ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>
            
            {showScript && (
              <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-4">
                <p className="text-gray-800">{getCurrentStepScript().script}</p>
              </div>
            )}
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Response Options:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getCurrentStepScript().options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepChange(option.nextStep)}
                    className="p-2 bg-gray-100 hover:bg-blue-100 border rounded text-left"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => history.length > 0 && handleStepChange(history[history.length - 1].step)}
                disabled={history.length === 0}
                className={`px-3 py-1 rounded ${history.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
              >
                Back
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-3 py-1 bg-green-600 text-white rounded flex items-center"
              >
                <Save size={16} className="mr-1" />
                Save Conversation
              </button>
            </div>
          </div>
          
          {/* Analytics Section */}
          {showAnalytics && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4">Call Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border rounded p-3">
                  <h3 className="text-sm font-semibold mb-1">Total Calls</h3>
                  <p className="text-2xl">{analyticsData.callCount}</p>
                </div>
                <div className="border rounded p-3">
                  <h3 className="text-sm font-semibold mb-1">Avg. Call Time</h3>
                  <p className="text-2xl">{formatTime(Math.round(analyticsData.avgCallTime))}</p>
                </div>
                <div className="border rounded p-3">
                  <h3 className="text-sm font-semibold mb-1">Consultations Scheduled</h3>
                  <p className="text-2xl">{analyticsData.consultationsScheduled}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Lead Conversion Rate</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-600 h-4 rounded-full" 
                    style={{ width: `${Math.min(100, analyticsData.leadConversionRate * 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{(analyticsData.leadConversionRate * 100).toFixed(1)}%</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Top Objections</h3>
                <ul className="border rounded divide-y">
                  {Object.entries(analyticsData.objectionCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([key, count]) => (
                      <li key={key} className="p-2 flex justify-between">
                        <span className="text-sm">{conversationSteps[key]?.title || key}</span>
                        <span className="text-sm font-semibold">{count}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Contact Info & Notes */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-4 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Contact Information</h2>
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="text-gray-500"
                >
                  {showContact ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              
              {showContact && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Company</label>
                    <input
                      type="text"
                      value={contactInfo.company}
                      onChange={(e) => setContactInfo({...contactInfo, company: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={contactInfo.title}
                      onChange={(e) => setContactInfo({...contactInfo, title: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Industry</label>
                    <select
                      value={contactInfo.industry}
                      onChange={(e) => setContactInfo({...contactInfo, industry: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Industry</option>
                      {Object.keys(industryKeyPhrases).map(industry => (
                        <option key={industry} value={industry}>
                          {industry.charAt(0).toUpperCase() + industry.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            {/* Notes */}
            <div className="bg-white rounded-lg shadow-md p-4 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Call Notes</h2>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-gray-500"
                >
                  {showNotes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              
              {showNotes && (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your call notes here..."
                  className="w-full p-2 border rounded h-40"
                ></textarea>
              )}
            </div>
          </div>
          
          {/* Follow-up Tasks */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Follow-up Tasks</h2>
              <button
                onClick={() => setShowAddTask(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center"
              >
                <UserPlus size={16} className="mr-1" />
                Add Task
              </button>
            </div>
            
            {followUpTasks.length > 0 ? (
              <ul className="divide-y">
                {followUpTasks.map(task => (
                  <li key={task.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          setFollowUpTasks(followUpTasks.map(t => 
                            t.id === task.id ? {...t, completed: !t.completed} : t
                          ));
                        }}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex text-sm text-gray-500 mt-1">
                          <span className="mr-3 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {task.dueDate}
                          </span>
                          <span className={`px-2 rounded-full text-xs 
                            ${task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`
                          }>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFollowUpTasks(followUpTasks.filter(t => t.id !== task.id));
                      }}
                      className="text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No follow-up tasks yet. Add tasks to keep track of next steps.</p>
            )}
            
            {/* Add Task Form */}
            {showAddTask && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">New Task</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowAddTask(false)}
                      className="px-3 py-1 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addFollowUpTask}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      disabled={!newTask.title || !newTask.dueDate}
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - Call History */}
        <div className="w-64 bg-white p-4 shadow-md overflow-y-auto">
          <h2 className="font-semibold mb-4">Call History</h2>
          {history.length > 0 ? (
            <ul className="space-y-2">
              {history.map((item, index) => (
                <li 
                  key={index}
                  className="p-2 border rounded hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleStepChange(item.step)}
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No call history yet.</p>
          )}
        </div>
      </div>
      
      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Save Conversation</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Conversation Name</label>
              <input
                type="text"
                value={savedName}
                onChange={(e) => setSavedName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="E.g., Call with ABC Company"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveConversation}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={!savedName}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptNavigator;