# Project Structure

This project follows a standardized folder structure for managing requirements, specifications, and application code.

## Folder Structure

```
/project-root
├── product-info/          → Overall product information (modules, descriptions, relationships)
│   └── product-overview.md
├── requirements/      → Module-wise detailed requirements
│   └── module-name/
│        ├── frontend-requirements.md
│        └── backend-requirements.md
├── specs/                 → All specifications (source of truth)
│   └── module-name/
│        ├── frontend-specs.md
│        └── backend-specs.md
├── frontend/              → Frontend application
└── backend/               → Backend application (API, services)
```

## Directory Descriptions

- **product-info/**: Contains overall product information
  - High-level overview of modules and their descriptions
  - How modules work and are linked together
  - Module relationships and integration points
  - Not detailed (detailed info is in requirements/ folder)

- **requirements/**: Contains module-wise detailed requirements documents
  - Organized by module name
  - Separate files for frontend and backend requirements
  
- **specs/**: Contains all technical specifications (source of truth)
  - Organized by module name
  - Separate files for frontend and backend specifications
  
- **frontend/**: Frontend application code
  
- **backend/**: Backend application code (API, services)

## Usage

1. Start with `product-info/` to understand the overall product structure and module relationships
2. Add new modules by creating folders under `requirements/` and `specs/`
3. Maintain requirements and specifications as separate documents
4. Keep specifications as the single source of truth for technical details
