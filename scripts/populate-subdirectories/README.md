# MTNS MADE Sub-Directory Content Generator

Automatically populate the 109 sub-directory pages with AI-generated content.

## What it does

For each sub-directory, this script:
1. **Generates a description** (50-80 words) explaining the creative category
2. **Creates an SEO title** (max 60 characters) for search engines
3. **Writes an SEO description** (max 160 characters) for search results
4. **Finds a featured project** from that category to use as the header image
5. **Credits the member** whose project is featured
6. **Updates Webflow CMS** with all the content

## Setup

### 1. Get your API keys

**Webflow API Token:**
1. Go to your Webflow Dashboard
2. Site Settings → Integrations → API Access
3. Generate a new API token with CMS read/write permissions

**Anthropic API Key:**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key

**Webflow Collection IDs:**
1. In Webflow, go to CMS → Your Collection
2. The Collection ID is in the URL: `/cms/collections/[COLLECTION_ID]`

### 2. Configure environment

```bash
cd scripts/populate-subdirectories
cp .env.example .env
```

Edit `.env` with your values:
```
WEBFLOW_API_TOKEN=your_token_here
ANTHROPIC_API_KEY=your_key_here
WEBFLOW_SUBDIRECTORIES_COLLECTION_ID=your_id_here
WEBFLOW_PROJECTS_COLLECTION_ID=64aa150f02bee661d503cf59
WEBFLOW_MEMBERS_COLLECTION_ID=your_id_here
WEBFLOW_SITE_ID=6481b864324e32f8eb266e2f
```

### 3. Install dependencies

```bash
npm install
```

## Usage

### Preview changes (recommended first)

```bash
npm run dry-run
```

This shows what would be generated without making any changes to Webflow.

### Run for real

```bash
npm start
```

### Process specific category only

```bash
node index.js --category=photography
node index.js --category=design --dry-run
```

## Output

- Progress is shown in the terminal
- Results are saved to `results-YYYY-MM-DD.json`
- Any errors are logged and saved

## Cost estimate

- Uses Claude Sonnet for generation (~$0.003 per sub-directory)
- Total for 109 sub-directories: ~$0.33

## Rate limits

The script respects Webflow's rate limits (60 requests/minute) with built-in delays.
Processing all 109 items takes approximately 15-20 minutes.

## Troubleshooting

**"Webflow API error (401)"**
- Check your API token is correct and has CMS permissions

**"Failed to parse JSON"**
- Retry - occasional AI response formatting issues

**"No suitable project found"**
- That category has no projects with feature images yet
- You can manually add a project reference later
