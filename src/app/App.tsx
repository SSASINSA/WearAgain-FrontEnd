/**
 * WearAgain App
 * Main App Component
 */

import React from 'react';
import RootNavigation from './navigation/RootNavigation';
import {QueryClientProvider} from './providers/QueryClientProvider';

function App() {
  return (
    <QueryClientProvider>
      <RootNavigation />
    </QueryClientProvider>
  );
}

export default App;
