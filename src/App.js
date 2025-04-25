import React, { useState, useEffect } from 'react';

const MellowMind = () => {
  // State for app data
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mood, setMood] = useState('neutral');
  const [moodNote, setMoodNote] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [moodEntries, setMoodEntries] = useState([]);
  const [moodSuccessMessage, setMoodSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('journal'); // or 'mood'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasSearchedMoods, setHasSearchedMoods] = useState(false);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedJournalEntries = localStorage.getItem('mellowMindJournalEntries');
    const savedMoodEntries = localStorage.getItem('mellowMindMoodEntries');
    
    if (savedJournalEntries) {
      setJournalEntries(JSON.parse(savedJournalEntries));
    }
    
    if (savedMoodEntries) {
      setMoodEntries(JSON.parse(savedMoodEntries));
    }
  }, []);
  
  // Save data to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('mellowMindJournalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);
  
  useEffect(() => {
    localStorage.setItem('mellowMindMoodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);
  
  // Reset search state when changing tabs
  useEffect(() => {
    if (activeTab !== 'searchMoods') {
      setHasSearchedMoods(false);
    }
  }, [activeTab]);
  
  // Submit journal entry
  const handleSubmitJournal = () => {
    if (!journalEntry.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      content: journalEntry,
    };
    
    setJournalEntries([newEntry, ...journalEntries]);
    setJournalEntry('');
  // Set the success message
    setSuccessMessage('Journal entry submitted successfully!');

  // Hide the message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Submit mood entry
  const handleSubmitMood = () => {
    const newMoodEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood,
      note: moodNote
    };
  
    setMoodEntries([newMoodEntry, ...moodEntries]);  // Add new mood entry
    setMood('neutral');  // Reset the mood
    setMoodNote('');  // Clear the note
  
    // Set success message
    setMoodSuccessMessage('Mood entry submitted successfully!');
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setMoodSuccessMessage('');
    }, 3000);
  };  
  
  // Delete journal entry
  const handleDeleteJournal = (id) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== id);
  setJournalEntries(updatedEntries);
};
  
  // Delete mood entry
  const handleDeleteMood = (id) => {
    const updatedMoods = moodEntries.filter(entry => entry.id !== id);
  setMoodEntries(updatedMoods);
};

  // Filter journal entries based on search term and date filter
  const filteredJournalEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || entry.date.startsWith(filterDate);
    return matchesSearch && matchesDate;
  });
  
  
  // Filter mood entries based on mood and date filters
  const filteredMoodEntries = moodEntries.filter(entry => {
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    const matchesDate = !filterDate || entry.date.startsWith(filterDate);
    return matchesMood && matchesDate;
  });
  
  // Search moods function
  const searchMoods = () => {
    setHasSearchedMoods(true);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Emoji mapping for moods
  const moodEmojis = {
    happy: '😊',
    excited: '🤩',
    relaxed: '😌',
    neutral: '😐',
    sad: '😢',
    anxious: '😰',
    angry: '😠'
  };
  
  // Get mood counts for visualization
  const getMoodCounts = () => {
    const counts = {};
    Object.keys(moodEmojis).forEach(mood => {
      counts[mood] = moodEntries.filter(entry => entry.mood === mood).length;
    });
    return counts;
  };
  
  // Get recent week's moods
  const getRecentMoods = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return moodEntries.filter(entry => new Date(entry.date) >= weekAgo);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      {/* App Header */}
      <header className="bg-white bg-opacity-50 shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-purple-800">
              <span className="mr-2">🧠</span> MellowMind
            </h1>
          </div>
          <div className="text-sm text-purple-500">Track. Reflect. Grow.</div>
        </div>
      </header>
      
      {/* Tab Navigation */}
      <nav className="flex bg-white bg-opacity-60 p-2 flex-wrap">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 mr-2 mb-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-pink-200 text-purple-800' : 'text-purple-600 hover:bg-pink-100'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('moodTracker')}
          className={`px-4 py-2 mr-2 mb-2 rounded-lg ${activeTab === 'moodTracker' ? 'bg-pink-200 text-purple-800' : 'text-purple-600 hover:bg-pink-100'}`}
        >
          Mood Tracker
        </button>
        <button 
          onClick={() => setActiveTab('journal')}
          className={`px-4 py-2 mr-2 mb-2 rounded-lg ${activeTab === 'journal' ? 'bg-pink-200 text-purple-800' : 'text-purple-600 hover:bg-pink-100'}`}
        >
          Journal
        </button>
        <button 
          onClick={() => setActiveTab('searchJournal')}
          className={`px-4 py-2 mr-2 mb-2 rounded-lg ${activeTab === 'searchJournal' ? 'bg-pink-200 text-purple-800' : 'text-purple-600 hover:bg-pink-100'}`}
        >
          Search Journal
        </button>
        <button 
          onClick={() => setActiveTab('moodLog')}
          className={`px-4 py-2 mr-2 mb-2 rounded-lg ${activeTab === 'moodLog' ? 'bg-pink-200 text-purple-800' : 'text-purple-600 hover:bg-pink-100'}`}
        >
          Mood Log
        </button>
        <button 
          onClick={() => setActiveTab('searchMoods')}
          className={`px-4 py-2 mb-2 rounded-lg ${activeTab === 'searchMoods' ? 'bg-pink-200 text-purple-800' : 'text-purple-600 hover:bg-pink-100'}`}
        >
          Search Moods
        </button>
      </nav>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="bg-white bg-opacity-70 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Welcome to MellowMind</h2>
            <p className="text-purple-700 mb-4">Your safe space for mood tracking and journaling.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-pink-50 p-4 rounded-lg shadow">
                <h3 className="font-medium text-purple-700 mb-2">Recent Moods</h3>
                <div className="flex flex-wrap gap-2">
                  {moodEntries.slice(0, 5).map(entry => (
                    <div key={entry.id} className="flex items-center bg-white p-2 rounded">
                      <span className="text-2xl mr-2">{moodEmojis[entry.mood]}</span>
                      <span className="text-xs text-purple-600">{formatDate(entry.date).split(',')[0]}</span>
                    </div>
                  ))}
                  {moodEntries.length === 0 && (
                    <p className="text-purple-400 text-sm">No mood data yet. Start tracking!</p>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab('moodTracker')}
                  className="mt-2 bg-pink-200 hover:bg-pink-300 text-purple-700 px-4 py-1 rounded-full text-sm"
                >
                  Log Mood
                </button>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg shadow">
                <h3 className="font-medium text-purple-700 mb-2">Activity Stats</h3>
                <p className="text-purple-600 mb-1">Total Journal Entries: {journalEntries.length}</p>
                <p className="text-purple-600 mb-1">Total Mood Logs: {moodEntries.length}</p>
                <p className="text-purple-600 mb-1">This Week: {getRecentMoods().length} moods logged</p>
                <div className="flex mt-2 space-x-2">
                  <button 
                    onClick={() => setActiveTab('journal')}
                    className="bg-pink-200 hover:bg-pink-300 text-purple-700 px-4 py-1 rounded-full text-sm"
                  >
                    Write Journal
                  </button>
                  <button 
                    onClick={() => setActiveTab('moodTracker')}
                    className="bg-pink-200 hover:bg-pink-300 text-purple-700 px-4 py-1 rounded-full text-sm"
                  >
                    Log Mood
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg shadow">
                <h3 className="font-medium text-purple-700 mb-2">Recent Journal</h3>
                {journalEntries.slice(0, 1).map(entry => (
                  <div key={entry.id} className="bg-white p-3 rounded">
                    <div className="flex items-center mb-2">
                      <span className="text-xs text-purple-600">{formatDate(entry.date)}</span>
                    </div>
                    <p className="text-purple-800">
                      {entry.content.length > 150 ? entry.content.substring(0, 150) + '...' : entry.content}
                    </p>
                    <button 
                      onClick={() => setActiveTab('journal')}
                      className="mt-2 text-pink-500 hover:text-pink-700 text-sm"
                    >
                      View All Entries →
                    </button>
                  </div>
                ))}
                {journalEntries.length === 0 && (
                  <p className="text-purple-400 text-sm">No journal entries yet. Start writing!</p>
                )}
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg shadow">
                <h3 className="font-medium text-purple-700 mb-2">Mood Distribution</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(getMoodCounts()).map(([mood, count]) => (
                    count > 0 && (
                      <div key={mood} className="flex items-center bg-white p-2 rounded">
                        <span className="text-2xl mr-2">{moodEmojis[mood]}</span>
                        <span className="text-purple-600">{count}</span>
                      </div>
                    )
                  ))}
                  {moodEntries.length === 0 && (
                    <p className="text-purple-400 text-sm">No mood data yet</p>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab('moodLog')}
                  className="mt-4 text-pink-500 hover:text-pink-700 text-sm"
                >
                  View Mood History →
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Mood Tracker Tab */}
        {activeTab === 'moodTracker' && (
          <div className="bg-white bg-opacity-70 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Track Your Mood</h2>
            {/* Display Success Message only in Mood Tracker Tab */}
{activeTab === 'moodTracker' && moodSuccessMessage && (
  <div className="text-green-500 font-bold text-center py-2">
    {moodSuccessMessage}
  </div>
)}

            <div className="mb-4">
              <label className="block text-purple-700 mb-2">How are you feeling right now?</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(moodEmojis).map(([moodName, emoji]) => (
                  <button
                    key={moodName}
                    onClick={() => setMood(moodName)}
                    className={`text-2xl p-3 rounded-full ${mood === moodName ? 'bg-pink-200 shadow' : 'bg-white'}`}
                    title={moodName}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-purple-600 capitalize">Selected: {mood}</div>
            </div>

            <div className="mb-4">
              <label htmlFor="moodNote" className="block text-purple-700 mb-2">Add a quick note (optional)</label>
              <input
                id="moodNote"
                type="text"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="What's contributing to this feeling? (optional)"
                className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmitMood}
                className="px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-purple-800"
              >
                Log Mood
              </button>
            </div>
          </div>
        )}
        
       {/* Journal Tab */}
{activeTab === 'journal' && (
  <div className="bg-white bg-opacity-70 rounded-lg p-6 shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-purple-800">Journal Entries</h2>
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('searchJournal')}
          className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg"
        >
          Search Entries
        </button>
        <button 
          onClick={() => {
            setActiveTab('newJournal');
            setJournalEntry('');
          }}
          className="bg-pink-200 hover:bg-pink-300 text-purple-700 px-4 py-2 rounded-lg"
        >
          New Entry
        </button>
      </div>
    </div>

    {/* ✅ Display Journal Success Message only in Journal Tab */}
    {successMessage && (
      <div className="text-green-500 font-bold text-center py-2">
        {successMessage}
      </div>
    )}

    {/* 🛑 Removed Mood Success Message from Journal Tab */}

    {/* Journal Entries List */}
    <div className="space-y-4">
      {journalEntries.length > 0 ? (
        journalEntries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-purple-600">{formatDate(entry.date)}</span>
              <button 
                      onClick={() => {
                        setEntryToDelete(entry.id);  // Set the entry to delete
                        setDeleteType('journal');
                        setShowDeleteModal(true);    // Show the confirmation modal
                      }}
                    className="text-pink-400 hover:text-pink-600"
                    title="Delete entry"
                  >
                    ✕
                    </button>
            </div>
            <p className="text-purple-700 whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))
      ) : (
        <p className="text-purple-400">No journal entries yet.</p>
      )}
    </div>
  </div>
)}

{/* Search Journal Tab */}
{activeTab === 'searchJournal' && (
  <div className="bg-white bg-opacity-70 rounded-lg p-6 shadow-lg">
    <h2 className="text-xl font-semibold text-purple-800 mb-4">Search Journal Entries</h2>
    
    {/* Search and Filter */}
    <div className="bg-purple-50 p-4 rounded-lg shadow mb-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor="search" className="block text-purple-700 text-sm mb-1">Search</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords..."
            className="w-full p-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-300"
          />
        </div>
        
        <div className="md:w-1/4">
          <label htmlFor="dateFilter" className="block text-purple-700 text-sm mb-1">Date</label>
          <input
            id="dateFilter"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full p-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-300"
          />
        </div>
      </div>
    </div>
    
    {/* Search Results */}
    <div>
      {(searchTerm === '' && filterDate === '') ? (
        <div className="text-center py-8">
          <p className="text-purple-600 mb-2">Enter keywords or select a date to search your journal entries</p>
          <button 
            onClick={() => setActiveTab('journal')}
            className="text-pink-500 hover:text-pink-700"
          >
            View all entries in Journal tab →
          </button>
        </div>
      ) : (
        <>
          <h3 className="font-medium text-purple-700 mb-2">Search Results</h3>
          <div className="space-y-4">
            {filteredJournalEntries.length > 0 ? (
              filteredJournalEntries.map(entry => (
                <div key={entry.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-purple-600">{formatDate(entry.date)}</span>
                    <button 
                      onClick={() => {
                        setEntryToDelete(entry.id);  // Set the entry to delete
                        setDeleteType('mood');
                        setShowDeleteModal(true);    // Show the confirmation modal
                      }}
                    className="text-pink-400 hover:text-pink-600"
                    title="Delete entry"
                  >
                    ✕
                    </button>
                  </div>
                  <p className="text-purple-700 whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))
            ) : (
              <p className="text-purple-400">No matching entries found.</p>
            )}
          </div>
        </>
      )}
    </div>
  </div>
)}
        
{/* New Journal Entry Tab */}
{activeTab === 'newJournal' && (
  <div className="bg-white bg-opacity-70 rounded-lg p-6 shadow-lg">
    <h2 className="text-xl font-semibold text-purple-800 mb-4">New Journal Entry</h2>
    
    <div className="mb-4">
      <label htmlFor="journalEntry" className="block text-purple-700 mb-2">Write about your thoughts, feelings, or experiences</label>
      <div className="w-full">
        <textarea
          id="journalEntry"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          style={{
            minHeight: '400px', 
            width: '100%', 
            maxWidth: '100%', 
            backgroundColor: '#E6D6F0'  // Pastel purple color
          }}
          className="p-4 text-lg text-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-400"
        />
      </div>
    </div>

    <div className="flex justify-between">
      <button
        onClick={() => setActiveTab('journal')}
        className="px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          handleSubmitJournal();
          setActiveTab('journal');
        }}
        disabled={!journalEntry.trim()}
        className={`px-4 py-2 rounded-lg ${journalEntry.trim() ? 'bg-pink-300 hover:bg-pink-400 text-purple-800' : 'bg-pink-100 text-purple-400 cursor-not-allowed'}`}
      >
        Save Entry
      </button>
    </div>
  </div>
)}

{/* Mood Log Tab */}
{activeTab === 'moodLog' && (
  <div className="bg-white bg-opacity-70 rounded-lg p-6 shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-purple-800">Mood History</h2>
      <button 
        onClick={() => setActiveTab('searchMoods')}
        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg"
      >
        Search Moods
      </button>
    </div>
    
    {/* Mood Log List */}
    <div className="space-y-3">
      {moodEntries.length > 0 ? (
        Object.entries(moodEmojis).map(([moodName, emoji]) => {
          const count = moodEntries.filter(e => e.mood === moodName).length;
          return (
            count > 0 && (
              <div key={moodName} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{emoji}</span>
                  <div>
                    <div className="text-sm font-medium capitalize">{moodName}</div>
                    <div className="text-xs text-purple-600">{count} times</div>
                  </div>
                </div>
              </div>
            )
          );
        })
      ) : (
        <p className="text-purple-400">No mood entries yet.</p>
      )}
    </div>
  </div>
)}
     
{/* Search Moods Tab */}
{activeTab === 'searchMoods' && (
  <div className="bg-white bg-opacity-70 rounded-lg p-6 shadow-lg">
    <h2 className="text-xl font-semibold text-purple-800 mb-4">Search Mood Entries</h2>
    
    {/* Filter */}
    <div className="bg-purple-50 p-4 rounded-lg shadow mb-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="md:w-1/3">
          <label htmlFor="moodFilter" className="block text-purple-700 text-sm mb-1">Filter by Mood</label>
          <select
            id="moodFilter"
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="w-full p-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-300"
          >
            <option value="all">All Moods</option>
            {Object.keys(moodEmojis).map(mood => (
              <option key={mood} value={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:w-1/3">
          <label htmlFor="dateFilter" className="block text-purple-700 text-sm mb-1">Filter by Date</label>
          <input
            id="dateFilter"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full p-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-300"
          />
        </div>

        <div className="md:w-1/3 flex items-end">
          <button
            onClick={searchMoods}
            className="w-full p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-1 focus:ring-pink-300"
          >
            Search
          </button>
        </div>
      </div>
    </div>
    
    {/* Search Results */}
    <div>
      <h3 className="font-medium text-purple-700 mb-2">Search Results</h3>
      
      {hasSearchedMoods ? (
        <div className="space-y-3">
          {filteredMoodEntries.length > 0 ? (
            filteredMoodEntries.map(entry => (
              <div key={entry.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{moodEmojis[entry.mood]}</span>
                  <div>
                    <div className="text-sm font-medium capitalize">{entry.mood}</div>
                    <div className="text-xs text-purple-600">{formatDate(entry.date)}</div>
                    {entry.note && <div className="text-sm text-purple-700 mt-1">{entry.note}</div>}
                  </div>
                </div>
                <button
  onClick={() => {
    setEntryToDelete(entry.id);     // Save the ID
    setDeleteType('mood');
    setShowDeleteModal(true);       // Show the modal
  }}
  className="text-pink-400 hover:text-pink-600"
  title="Delete entry"
>
  ✕
</button>
              </div>
            ))
          ) : (
            <p className="text-purple-400">No matching mood entries found.</p>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-purple-500">Use the filters above and click Search to find your mood entries.</p>
        </div>
      )}
    </div>
  </div>
)}
{/* Only show modal in Journal tab if deleting journal entry */}
{showDeleteModal && deleteType === 'journal' && activeTab === 'journal' && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-purple-100">
    <h3
  style={{
    fontSize: '1.25rem',       // same as Tailwind `text-base`
    fontWeight: 'bold',
    color: 'white',
  }}
>
  Are you sure you want to delete this entry?
</h3>
      <div className="flex justify-between">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-purple-500 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleDeleteJournal(entryToDelete);
            setShowDeleteModal(false);
          }}
          className="px-4 py-2 rounded-lg bg-pink-200 hover:bg-pink-300 text-purple-700 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

{/* Only show modal in Search Moods tab if deleting mood entry */}
{showDeleteModal && deleteType === 'mood' && activeTab === 'searchMoods' && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-purple-100">
<h3
  style={{
    fontSize: '1.25rem',       // same as Tailwind `text-base`
    fontWeight: 'bold',
    color: 'white',
  }}
>
  Are you sure you want to delete this entry?
</h3>
      <div className="flex justify-between">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-purple-500 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleDeleteMood(entryToDelete);
            setShowDeleteModal(false);
          }}
          className="px-4 py-2 rounded-lg bg-pink-200 hover:bg-pink-300 text-purple-700 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}                            
<div className="emoji-fall">
  <span className="emoji">🌟</span>
  <span className="emoji">💖</span>
  <span className="emoji">💫</span>
  <span className="emoji">🧠</span>
  <span className="emoji">🌸</span>
  <span className="emoji">🌙</span>
  <span className="emoji">✨</span>
  <span className="emoji">💖</span>
  <span className="emoji">🌟</span>
  <span className="emoji">🌙</span>
  <span className="emoji">💫</span>
  <span className="emoji">🧠</span>
  <span className="emoji">🌸</span>
  <span className="emoji">✨</span>
  <span className="emoji">🌟</span>
</div> 
     
      </main>
    </div>
  );
};

export default MellowMind;
