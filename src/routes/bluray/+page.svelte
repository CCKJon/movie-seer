<script lang="ts">
  // Blu-ray API endpoint is currently empty, so we'll show a coming soon message
</script>

<svelte:head>
  <title>Blu-ray Releases - Movie Seer</title>
  <meta name="description" content="Discover the latest Blu-ray and physical media releases" />
</svelte:head>

<div class="min-h-screen bg-gray-950">
  <div class="max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="px-4 py-8">
      <h1 class="text-4xl font-bold text-white mb-2">Blu-ray Releases</h1>
      <p class="text-gray-400">Discover movies coming to Blu-ray and physical media</p>
    </div>

    <!-- Coming Soon Section -->
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 text-center">
        <div class="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-white font-bold text-4xl">💿</span>
        </div>
        <h2 class="text-3xl font-bold text-white mb-4">Coming Soon</h2>
        <p class="text-gray-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
          We're working on bringing you the latest Blu-ray release information. 
          This feature will be available soon with comprehensive data on new physical media releases.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div class="flex items-center gap-2 text-gray-400">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span class="text-sm">Blu-ray releases</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span class="text-sm">4K Ultra HD</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span class="text-sm">Special editions</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder Grid for Future Content -->
    <div class="max-w-6xl mx-auto px-4 mt-12">
      <h3 class="text-2xl font-bold text-white mb-6 text-center">What to Expect</h3>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-gray-900/30 rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-xl">📅</span>
          </div>
          <h4 class="text-lg font-semibold text-white mb-2">Release Dates</h4>
          <p class="text-gray-400 text-sm">Stay updated with exact Blu-ray release dates and pre-order information.</p>
        </div>
        
        <div class="bg-gray-900/30 rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-xl">🎬</span>
          </div>
          <h4 class="text-lg font-semibold text-white mb-2">Movie Details</h4>
          <p class="text-gray-400 text-sm">Complete information about special features, audio tracks, and bonus content.</p>
        </div>
        
        <div class="bg-gray-900/30 rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-xl">🛒</span>
          </div>
          <h4 class="text-lg font-semibold text-white mb-2">Where to Buy</h4>
          <p class="text-gray-400 text-sm">Direct links to purchase from major retailers and online stores.</p>
        </div>
      </div>
    </div>
  </div>
</div>
