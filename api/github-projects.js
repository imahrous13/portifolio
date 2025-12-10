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
    
    // Helper function to extract description from README content
    const extractDescriptionFromReadme = (readmeContent) => {
      if (!readmeContent) return null;
      
      try {
        // Decode base64 content if needed
        let text = readmeContent;
        if (typeof readmeContent === 'string' && readmeContent.match(/^[A-Za-z0-9+/=]+$/)) {
          text = Buffer.from(readmeContent, 'base64').toString('utf-8');
        }
        
        // Extract first paragraph or first few sentences from README
        // Remove markdown headers, code blocks, and links
        text = text
          .replace(/```[\s\S]*?```/g, '') // Remove code blocks
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
          .replace(/#{1,6}\s+/g, '') // Remove headers
          .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold
          .replace(/\*([^\*]+)\*/g, '$1') // Remove italic
          .replace(/`([^`]+)`/g, '$1') // Remove inline code
          .replace(/\n{2,}/g, '\n\n') // Normalize line breaks
          .trim();
        
        // Get first paragraph (up to 300 characters or first 2 sentences)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
        if (sentences.length > 0) {
          let description = sentences.slice(0, 2).join('. ').trim();
          if (description.length > 300) {
            description = description.substring(0, 297) + '...';
          }
          return description + (sentences.length > 2 ? '.' : '');
        }
        
        // Fallback: first 300 characters
        if (text.length > 300) {
          return text.substring(0, 297) + '...';
        }
        return text;
      } catch (error) {
        console.warn('Error extracting README description:', error.message);
        return null;
      }
    };
    
    // Map GitHub repository data to portfolio project format
    // Show ALL repositories (including forks and archived)
    const projectsArray = await Promise.all(repos.map(async (repo) => {
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
        
        // Get description - prioritize README if repo description is missing or too short
        let description = repo.description || '';
        
        // Only fetch README if description is missing or very short (less than 30 chars)
        if (!description || description.length < 30) {
          try {
            const readmeUrl = `https://api.github.com/repos/${githubUsername}/${repo.name}/readme`;
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
            
            const readmeResponse = await fetch(readmeUrl, { 
              headers,
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (readmeResponse.ok) {
              const readmeData = await readmeResponse.json();
              const readmeDescription = extractDescriptionFromReadme(readmeData.content);
              if (readmeDescription && readmeDescription.length > 50) {
                description = readmeDescription;
              }
            }
          } catch (readmeError) {
            // Silently fail - use repo description or default
            if (readmeError.name !== 'AbortError') {
              console.log(`Could not fetch README for ${repo.name}: ${readmeError.message}`);
            }
          }
        }
        
        // Create a good default description if still missing
        if (!description || description.length < 20) {
          const projectType = category === 'Computer Vision' ? 'computer vision' :
                             category === 'Machine Learning' ? 'machine learning' :
                             category === 'Data Science' ? 'data science' :
                             category === 'Game Development' ? 'game development' :
                             category === 'Operations Research' ? 'operations research' :
                             'full-stack development';
          description = `${formatTitle(repo.name)} - A ${projectType} project${stack.length > 0 ? ` built with ${stack.slice(0, 3).join(', ')}` : ''}.`;
        }
        
        // Ensure description is not too long (max 500 chars for display)
        if (description.length > 500) {
          description = description.substring(0, 497) + '...';
        }
        
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
      }));
    
    // Sort by most recently updated
    const projects = projectsArray.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
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
  
  // Computer Vision - Check first to avoid conflicts with ML
  if (allText.match(/computer.?vision|cv\b|yolo|opencv|image.?process|object.?detect|cnn|convolutional|image.?classif|image.?detect|vision|opencv|albumentations|image.?augment|trashnet|garbage.?classif|squat.?analysis|barbell.?track|pose.?estimat|facial.?detect|face.?detect|video.?process|image.?segment/)) {
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


