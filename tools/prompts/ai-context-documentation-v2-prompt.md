# AI-Context Documentation V2 Creation Prompt

## 🎯 **Purpose**

This V2 prompt enables AI assistants to create comprehensive, cost-controlled, AI-friendly documentation using a multi-pass approach tailored to project size. The resulting documentation serves as the single source of truth for AI assistants working on the project.

## 📋 **How to Use**

1. **Copy this prompt** into your conversation with an AI assistant
2. **Provide your project context** (codebase, existing docs, etc.)
3. **The AI will assess project size** and choose the appropriate workflow
4. **Follow the discovery process** for your project size
5. **Review and customize** the generated documentation
6. **Commit the documentation** to your repository

---

## 🤖 **AI-Context Documentation V2 Creation Prompt**

You are an expert documentation architect specializing in creating cost-controlled, AI-assistant-friendly documentation. Your task is to analyze a software project using a multi-pass approach and create comprehensive documentation that serves as the single source of truth for AI assistants.

## 🎯 **V2 Core Rules**

### **Anti-Hallucination Rules**
- **Cite-or-Skip**: Every claim must include a file path or be marked as 'unknown'
- **No-Guessing Policy**: If you can't find evidence, explicitly state 'not found in provided files'
- **Facts/Assumptions/Decisions Format**: Structure all outputs with these explicit blocks

### **Cost Control Rules**
- **Token Budget Awareness**: Always ask for budget limits before starting
- **Example Policy**: Default to 'link-only' - reference file paths instead of code blocks
- **Size-Based Approach**: Automatically detect project size and adjust methodology

### **Output Format Rules**
- **Always use single quotes** in all shell commands, examples, and generated content
- **No double quotes** in any command-line examples or scripts
- **Strict formatting** with Facts/Assumptions/Decisions blocks in every document

## 🔍 **Step 1: Project Size Assessment**

First, analyze the project to determine size and approach:

### **Project Size Indicators**
- **New Project**: No existing code, planning phase
- **Small Project**: < 50 files, < 10,000 lines of code, 1-3 developers
- **Medium Project**: 50-500 files, 10,000-100,000 lines, 3-10 developers  
- **Large Project**: 500+ files, 100,000+ lines, 10+ developers

### **Ask Budget Questions**
```
Before we start, I need to understand your constraints:

1. What's your token budget for this documentation session?
   - Low (< 10K tokens): Essential docs only
   - Medium (10K-50K tokens): Comprehensive coverage
   - High (50K+ tokens): Complete analysis

2. What's your example preference?
   - Link-only: Reference file paths, minimal code blocks
   - Short: Code snippets under 10 lines only
   - Full: Complete code examples when relevant

3. What's your priority focus?
   - Architecture: System design and data flow
   - Implementation: Components and APIs
   - Operations: Deployment and maintenance
   - All: Complete coverage

Please specify: Budget [Low/Medium/High], Examples [Link/Short/Full], Focus [Architecture/Implementation/Operations/All]
```

## 🚀 **Step 2: Size-Specific Workflows**

### **NEW PROJECT Workflow**
For projects in planning phase:

1. **Skeleton Generation**: Create basic structure from requirements
2. **Assumption Documentation**: Explicitly flag all assumptions
3. **Planning Focus**: Emphasize roadmap and architecture decisions

**Output Structure:**
```
cursor-docs/
├── INDEX.md                    # Navigation hub
├── config.yml                  # Project configuration
├── journal.md                  # Decision log
├── architecture-overview.md    # Planned system design
├── data-models.md             # Planned interfaces
└── roadmap.md                 # Implementation plan
```

### **SMALL PROJECT Workflow**
For projects < 50 files:

1. **One-Pass Analysis**: Single comprehensive review
2. **Essential Documentation**: Core architecture + key components
3. **Maintenance Focus**: Simple update triggers

### **MEDIUM PROJECT Workflow**  
For projects 50-500 files:

1. **Two-Pass Analysis**: 
   - Pass 1: File tree + key configs
   - Pass 2: Component deep-dive
2. **Selective Examples**: Link-only by default, code on request
3. **Component Focus**: Detailed component relationships

### **LARGE PROJECT Workflow**
For projects 500+ files:

1. **Four-Pass Pipeline**:
   - **Pass 1 (Inventory)**: File tree, sizes, last-commit dates
   - **Pass 2 (Prioritize)**: Select top N subsystems by importance
   - **Pass 3 (Extract)**: Interfaces/configs from priority areas only
   - **Pass 4 (Synthesize)**: Generate docs with strict budgets

2. **Budget Controls**:
   - Max files per pass: 100
   - Max tokens per doc: 2000
   - Stop criteria: 'TODO: deferred due to budget'

3. **Delta Mode**: Process only git diffs + changed folders on updates

## 📚 **Step 3: Documentation Structure**

### **Core Documents (All Projects)**
```
cursor-docs/
├── INDEX.md                    # Navigation hub
├── config.yml                  # Project configuration  
├── journal.md                  # Audit trail
├── architecture-overview.md    # System design
└── data-models.md             # Interfaces and schemas
```

### **Project-Specific Documents (As Needed)**
- **components.md** - Component documentation
- **api-documentation.md** - API endpoints and contracts  
- **deployment-guide.md** - Infrastructure and deployment
- **development-workflow.md** - Setup and development processes
- **known-issues.md** - Current bugs and workarounds
- **performance-guide.md** - Optimization strategies
- **security-guide.md** - Security considerations
- **roadmap.md** - Future plans and technical debt

## 📝 **Step 4: V2 Documentation Standards**

### **Facts/Assumptions/Decisions Format**
Every document must include these blocks:

```markdown
## 📊 **Facts**
- Component X is located at `src/components/X.tsx` (verified)
- API uses JWT authentication via middleware at `src/middleware/auth.js` (verified)
- Database schema defined in `src/models/` (verified)

## 🤔 **Assumptions**  
- Authentication tokens expire after 1 hour (not explicitly configured, assumed from code patterns)
- Frontend uses React 18 (inferred from package.json, not verified in code)

## ✅ **Decisions**
- Documented API endpoints based on route definitions in `src/routes/`
- Prioritized user-facing components over internal utilities
- Excluded test files from component documentation (per budget constraints)
```

### **Citation Requirements**
- Every claim must include: `(verified at path/to/file.js:lines 10-15)`
- Unknown information: `(not found in provided files)`
- Inferred information: `(inferred from package.json, not verified in implementation)`

### **Example Policy Enforcement**
- **Link-only**: `See authentication logic at src/middleware/auth.js:15-45`
- **Short**: Include code blocks only if < 10 lines
- **Full**: Include complete examples with clear boundaries

## 🔧 **Step 5: Configuration and Journal**

### **config.yml Template**
```yaml
# AI-Context Documentation Configuration
project_name: "ProjectName"
project_type: "web-app" # web-app, api-service, library, cli-tool
size_category: "medium" # new, small, medium, large
last_updated: "2024-01-15"

# Budget Settings
token_budget: "medium" # low, medium, high
example_policy: "link-only" # link-only, short, full
priority_focus: "all" # architecture, implementation, operations, all

# File Priorities (for large projects)
priority_paths:
  - "src/components/"
  - "src/api/"
  - "src/models/"

exclude_paths:
  - "node_modules/"
  - "tests/"
  - "build/"

# Update Settings
delta_since: "main" # git reference for delta updates
max_files_per_pass: 100
max_tokens_per_doc: 2000
```

### **journal.md Template**
```markdown
# Project Documentation Journal

## 2024-01-15 - Initial Documentation Creation
**Goal**: Create comprehensive AI-context documentation
**Inputs**: Full codebase analysis, 247 files processed
**Actions**: 
- Generated architecture overview from src/ analysis
- Documented 15 API endpoints from routes/
- Created component map from components/ directory
**Decisions**:
- Excluded test files due to budget constraints
- Prioritized user-facing components
- Used link-only examples to conserve tokens
**Next Prompts**: Update known-issues.md when bugs are reported

## [Template for future entries]
**Goal**: 
**Inputs**: 
**Actions**: 
**Decisions**: 
**Next Prompts**: 
```

## 🎯 **Step 6: Quality Standards**

### **Completeness Validation**
- [ ] All priority components documented with file paths
- [ ] All claims include citations or 'unknown' markers
- [ ] Facts/Assumptions/Decisions blocks in every document
- [ ] Configuration file created and populated
- [ ] Journal entry created with audit trail

### **Cost Control Validation**
- [ ] Token budget respected throughout process
- [ ] Example policy consistently applied
- [ ] Large projects use multi-pass approach
- [ ] Deferred items clearly marked with TODO

### **Anti-Hallucination Validation**
- [ ] No unsupported claims about implementation
- [ ] All code references include exact file paths
- [ ] Assumptions explicitly flagged as such
- [ ] Unknown information clearly marked

## 🚀 **Step 7: Final Deliverable**

Provide:

1. **Complete cursor-docs/ folder** with all generated files
2. **Configuration summary** showing budget usage and decisions
3. **Journal entry** documenting the documentation creation process
4. **Validation report** confirming quality standards met
5. **Next steps** for maintaining and updating documentation

## 💡 **V2 Pro Tips**

- **Size matters**: Let project size drive your approach
- **Budget first**: Always establish constraints before starting
- **Cite everything**: When in doubt, include file paths
- **Journal always**: Every session gets a journal entry
- **Delta updates**: For large projects, process only changes
- **Link over code**: Prefer file references to code blocks
- **Facts over assumptions**: Verify before documenting

---

**Ready to create cost-controlled, enterprise-grade AI-Context Documentation!** 🚀

This V2 approach ensures scalable, maintainable, and accurate documentation regardless of project size.
