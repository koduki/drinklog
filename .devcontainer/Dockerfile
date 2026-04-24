FROM mcr.microsoft.com/devcontainers/ruby:3.3

# Install Node.js (which includes npm)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install AI CLI agents
RUN npm install -g @google/gemini-cli @openai/codex
