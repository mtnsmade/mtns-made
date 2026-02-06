# Directory Page Filtering - Implementation Plan

## Status: PAUSED

## Goal
Change directory pages (e.g., `/directories/photography`) to:
1. Show ALL members who have selected ANY sub-directory of that parent (instead of requiring explicit parent selection)
2. Convert sub-directory buttons from links to client-side filters
3. Default: show all matching members. Filter: one sub-directory at a time

## Why This Change
Users tend to select all parent directories to appear everywhere. By deriving parent directory membership from sub-directory selections, we remove this issue.

## Technical Approach

### Using Finsweet Attributes
- **CMS Load**: Loads all 330+ members (bypasses Webflow's 100 item limit)
- **CMS Filter**: Client-side filtering by sub-directory

### Scripts to Add (Directory template `<head>`)
```html
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1/cmsload.js"></script>
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js"></script>
```

### Webflow Attribute Setup

**Member collection list wrapper:**
```
fs-cmsload-element = "list"
fs-cmsfilter-element = "list"
fs-cmsload-mode = "render-all"
```

**Member collection item:**
```
fs-cmsfilter-field = "categories"
```
Plus hidden text element with sub-directory slugs/IDs

**Sub-directory filter buttons:**
```
fs-cmsfilter-field = "categories"
fs-cmsfilter-value = {sub-directory slug}
```

**"All" button:**
```
fs-cmsfilter-reset = "true"
```

### Custom Script Needed
A script (`directory-filter.js`) to:
1. Detect current parent directory from URL
2. On page load, hide members who don't have ANY sub-directory of current parent
3. Work alongside Finsweet for the sub-directory filtering

### Data Files Reference
- `/Users/paulmosig/Downloads/MTNS MADE - Directories (1).csv` - Parent directories
- `/Users/paulmosig/Downloads/MTNS MADE - Sub Directories (1).csv` - Sub-directories with parent mapping

### Parent → Sub-Directory Mapping (from CSV)
Photography sub-directories:
- aerial-photography
- animal-photography
- event-photography
- fashion-photography
- food-photography
- interior-photography
- landscape-photography
- portraiture
- product-photography
- sports-photography
- travel-photography
- wedding-photography

(Similar mappings needed for all 10 parent directories)

## Outstanding Questions
1. What format are member categories stored in Webflow? (slugs or IDs?)
2. What field name for the hidden element with member categories?

## To Resume
1. Set up hidden element in Webflow member card with their sub-directory data
2. Reference this plan file
3. Build the custom script to handle parent-level filtering
