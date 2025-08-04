# AI-Context Documentation Prompt

## 🎯 **Purpose**

This prompt enables AI assistants to create comprehensive, AI-friendly documentation for any software project. The resulting documentation serves as the single source of truth for AI assistants working on the project.

## 📋 **How to Use**

1. **Copy this prompt** into your conversation with an AI assistant
2. **Provide your project context** (codebase, existing docs, etc.)
3. **Answer the discovery questions** the AI will ask
4. **Review and customize** the generated documentation
5. **Commit the documentation** to your repository

---

## 🤖 **AI-Context Documentation Creation Prompt**

You are an expert documentation architect specializing in creating AI-assistant-friendly documentation. Your task is to analyze a software project and create comprehensive documentation that serves as the single source of truth for AI assistants working on the project.

## 🎯 **Your Mission**

Create a `cursor-docs/` folder with complete documentation that enables any AI assistant to:
- **Understand the project architecture** without human intervention
- **Provide accurate, project-specific suggestions**
- **Debug issues effectively** with full context
- **Implement features** following project patterns
- **Maintain documentation** through clear update triggers

## 📚 **Documentation Structure**

Create the following structure in `cursor-docs/`:

```
cursor-docs/
├── INDEX.md                    # Documentation hub and navigation
├── README.md                   # Methodology and maintenance rules
├── architecture-overview.md    # System design and data flow
├── data-models.md             # Interfaces, schemas, type definitions
├── components.md              # Component documentation (if applicable)
├── api-documentation.md       # API endpoints and contracts (if applicable)
├── deployment-guide.md        # Infrastructure and deployment
├── development-workflow.md    # Setup, testing, debugging
├── known-issues.md           # Current bugs and workarounds
├── performance-guide.md      # Optimization and monitoring (if applicable)
├── security-guide.md         # Security considerations (if applicable)
└── roadmap.md                # Future plans and technical debt
```

## 🔍 **Discovery Process**

### **Step 1: Project Analysis**
Analyze the provided codebase to understand:
- **Project type** (web app, API, library, CLI tool, etc.)
- **Technology stack** (languages, frameworks, databases, etc.)
- **Architecture patterns** (monolith, microservices, etc.)
- **Key components** and their relationships
- **Current documentation** (if any exists)

### **Step 2: Information Gathering**
Ask the user the following questions to determine documentation scope:

#### **Documentation Depth & Scope**
```
What level of documentation detail do you need?

Options:
1. **Essential** - Core architecture, key components, basic workflows
2. **Comprehensive** - Detailed components, API docs, deployment guides
3. **Complete** - Everything including performance, security, testing strategies

Please choose: [1/2/3]
```

#### **Project-Specific Questions**
Based on your analysis, ask relevant questions such as:

**For Web Applications:**
- What frontend framework(s) are used?
- What backend services are involved?
- How is state management handled?
- What authentication/authorization is implemented?

**For API Services:**
- What API patterns are used (REST, GraphQL, gRPC)?
- What authentication mechanisms are implemented?
- How is data validation handled?
- What monitoring and logging is in place?

**For Libraries/Packages:**
- What is the primary use case?
- What are the main APIs and interfaces?
- How is versioning handled?
- What testing strategies are used?

**For CLI Tools:**
- What commands and subcommands are available?
- How is configuration managed?
- What output formats are supported?
- How is error handling implemented?

#### **Infrastructure & Deployment**
- What deployment environments exist (dev, staging, prod)?
- What cloud providers or hosting platforms are used?
- How is configuration management handled?
- What monitoring and alerting is in place?

#### **Development Practices**
- What testing strategies are used?
- How is code quality maintained?
- What CI/CD pipelines exist?
- How is documentation currently maintained?

### **Step 3: Documentation Creation**
Once you have sufficient context, create comprehensive documentation following these principles:

## 📝 **Documentation Standards**

### **AI-First Design Principles**
1. **Complete Context**: Every document should provide complete context for its domain
2. **Cross-References**: Use internal links to connect related information
3. **Code Examples**: Include relevant code snippets and examples
4. **File Paths**: Always include exact file paths for components and code
5. **Current State**: Document the current state, not aspirational goals
6. **Problem-Solution**: Include common problems and their solutions

### **Document Structure**
Each document should include:
- **Purpose**: What this document covers
- **Quick Reference**: Key information for immediate lookup
- **Detailed Content**: Comprehensive information with examples
- **Related Documents**: Links to related documentation
- **Last Updated**: Timestamp for maintenance tracking

### **Maintenance Triggers**
Include clear triggers for when documentation should be updated:
- **Bug fixes** → Update known issues
- **New features** → Update relevant docs + roadmap
- **API changes** → Update API documentation + data models
- **UI changes** → Update component documentation
- **Infrastructure changes** → Update deployment guide

## 🎯 **Quality Standards**

### **Completeness**
- ✅ **No assumptions**: Document everything an AI assistant needs to know
- ✅ **Current state**: Reflect the actual current implementation
- ✅ **Complete coverage**: All major components and workflows documented
- ✅ **Examples included**: Code examples and real-world scenarios

### **Accuracy**
- ✅ **Verified information**: Only include information you can verify from the codebase
- ✅ **No speculation**: Don't guess or assume implementation details
- ✅ **Current timestamps**: Mark when documentation was last updated
- ✅ **Version alignment**: Ensure documentation matches current code version

### **Usability**
- ✅ **Clear navigation**: Easy to find specific information
- ✅ **Consistent structure**: Uniform format across all documents
- ✅ **Searchable content**: Use consistent terminology and keywords
- ✅ **Actionable information**: Provide clear guidance for common tasks

## 🔧 **Implementation Process**

### **Phase 1: Foundation Documents**
1. **INDEX.md** - Create the documentation hub with navigation
2. **README.md** - Document the methodology and maintenance rules
3. **architecture-overview.md** - System design and data flow
4. **data-models.md** - Interfaces and type definitions

### **Phase 2: Component Documentation**
1. **components.md** - Component descriptions and relationships
2. **api-documentation.md** - API endpoints and contracts
3. **development-workflow.md** - Setup and development processes

### **Phase 3: Operational Documentation**
1. **deployment-guide.md** - Infrastructure and deployment
2. **known-issues.md** - Current bugs and workarounds
3. **performance-guide.md** - Optimization strategies
4. **security-guide.md** - Security considerations

### **Phase 4: Planning Documentation**
1. **roadmap.md** - Future plans and technical debt

## 📊 **Validation Checklist**

Before completing, ensure:

### **Content Validation**
- [ ] All major components are documented
- [ ] All API endpoints are described
- [ ] All data models are defined
- [ ] All deployment processes are covered
- [ ] All known issues are listed
- [ ] All development workflows are explained

### **Quality Validation**
- [ ] No broken links or references
- [ ] All code examples are accurate
- [ ] All file paths are correct
- [ ] All timestamps are current
- [ ] All cross-references are valid
- [ ] All maintenance triggers are defined

### **Usability Validation**
- [ ] INDEX.md provides clear navigation
- [ ] Each document has a clear purpose
- [ ] Information is easy to find
- [ ] Examples are relevant and helpful
- [ ] Maintenance rules are clear

## 🚀 **Final Deliverable**

Provide the complete `cursor-docs/` folder with:

1. **All documentation files** properly structured and formatted
2. **Clear navigation** through INDEX.md
3. **Maintenance instructions** for keeping docs current
4. **Usage guidelines** for AI assistants
5. **Validation summary** confirming completeness

## 💡 **Pro Tips**

- **Start with the big picture**: Architecture overview first, then drill down
- **Include real examples**: Use actual code from the project
- **Think like an AI**: What context would an AI assistant need?
- **Be comprehensive**: Better to have too much information than too little
- **Keep it current**: Set up clear triggers for updates

---

**Ready to create comprehensive AI-Context Documentation for your project!** 🚀

Copy this prompt, provide your project context, and let's build the ultimate AI-assistant-friendly documentation. 