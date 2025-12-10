module.exports = async (req, res) => {
  try {
    // Use native fetch (Node.js 18+) or dynamic import node-fetch v3
    let fetch;
    if (typeof globalThis.fetch === 'function') {
      // Use native fetch if available (Node.js 18+)
      fetch = globalThis.fetch;
    } else {
      // Fallback to node-fetch v3 via dynamic import
      try {
        const fetchModule = await import('node-fetch');
        fetch = fetchModule.default || fetchModule;
      } catch (importError) {
        console.error('Failed to import node-fetch:', importError);
        throw new Error('Fetch is not available. Please use Node.js 18+ or ensure node-fetch is installed.');
      }
    }
    
    const githubUsername = process.env.GITHUB_USERNAME || 'imahrous13';
    const githubToken = process.env.GITHUB_TOKEN; // Optional, for higher rate limits
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Website'
    };
    
    // Add token if available for higher rate limits
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    // Fetch all repositories with pagination
    let allRepos = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;
    
    while (hasMore) {
      const url = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=${perPage}&page=${page}&type=all`;
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const repos = await response.json();
      
      if (repos.length === 0) {
        hasMore = false;
      } else {
        allRepos = allRepos.concat(repos);
        // If we got less than perPage, we've reached the end
        if (repos.length < perPage) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }
    
    const repos = allRepos;
    
    // Map GitHub repository data to portfolio project format
    // Show ALL repositories (including forks and archived)
    const projects = repos
      .map(repo => {
        // Extract language/tech stack - include primary language and topics
        const languages = [];
        if (repo.language) {
          languages.push(repo.language);
        }
        // Add topics as tech stack items (filter out generic topics)
        if (repo.topics && Array.isArray(repo.topics)) {
          const techTopics = repo.topics.filter(topic => {
            const lower = topic.toLowerCase();
            // Exclude generic/descriptive topics
            return !['portfolio', 'project', 'demo', 'example', 'sample', 'test', 'tutorial', 'learning'].includes(lower);
          });
          languages.push(...techTopics);
        }
        // Remove duplicates and ensure we have at least one item
        const uniqueStack = [...new Set(languages)];
        const stack = uniqueStack.length > 0 ? uniqueStack : ['Various Technologies'];
        
        // Determine category based on repository name, description, and topics
        const category = determineCategory(repo);
        
        // Get description - use repo description or default
        const description = repo.description || 
          `${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')} - A project showcasing ${stack.join(', ')}.`;
        
        return {
          title: formatTitle(repo.name),
          description: description,
          image: repo.owner.avatar_url || '/api/placeholder/600/400',
          stack: stack,
          github: repo.html_url,
          demo: repo.homepage || repo.html_url, // Use homepage if available, otherwise GitHub URL
          category: category,
          updatedAt: repo.updated_at,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics || []
        };
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by most recently updated
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).json({ projects });
    
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    console.error('Error stack:', error.stack);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      error: 'Failed to fetch GitHub projects',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      projects: [] // Return empty array on error
    });
  }
};

// Helper function to determine project category
function determineCategory(repo) {
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const language = (repo.language || '').toLowerCase();
  
  const allText = `${name} ${description} ${topics.join(' ')} ${language}`;
  
  // Computer Vision
  if (allText.match(/computer.?vision|cv|yolo|opencv|image.?process|object.?detect|cnn|convolutional/)) {
    return 'Computer Vision';
  }
  
  // Machine Learning
  if (allText.match(/machine.?learning|ml|neural.?network|tensorflow|pytorch|keras|deep.?learning|ai|artificial.?intelligence/)) {
    return 'Machine Learning';
  }
  
  // Data Science
  if (allText.match(/data.?science|data.?analysis|pandas|numpy|jupyter|notebook|visualization|seaborn|matplotlib/)) {
    return 'Data Science';
  }
  
  // Game Development
  if (allText.match(/game|gaming|unity|unreal|pygame|tictactoe|blackjack|quiz/)) {
    return 'Game Development';
  }
  
  // Operations Research
  if (allText.match(/operations.?research|optimization|linear.?programming|genetic.?algorithm|simulation/)) {
    return 'Operations Research';
  }
  
  // Full-Stack Development (default for web projects)
  if (allText.match(/web|frontend|backend|full.?stack|react|vue|angular|node|express|django|flask|php|java|javascript|typescript/)) {
    return 'Full-Stack Development';
  }
  
  // Default category
  return 'Full-Stack Development';
}

// Helper function to format repository name as title
function formatTitle(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


