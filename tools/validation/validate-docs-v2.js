#!/usr/bin/env node

/**
 * AI-Context Documentation V2 Validation Script
 * 
 * This script validates the quality and completeness of AI-Context Documentation V2
 * according to the methodology standards, including cost control and quality assurance.
 * 
 * Usage: node validate-docs-v2.js [docs-path] [--budget-report] [--config config.yml]
 * Default docs-path: cursor-docs
 * 
 * V2 Features:
 * - Budget tracking and reporting
 * - Facts/Assumptions/Decisions format validation
 * - Citation requirement checking
 * - Configuration validation
 * - Journal audit trail validation
 * - Single quote enforcement
 * - Anti-hallucination pattern detection
 */

const fs = require('fs');
const path = require('path');

// V2 Configuration
const REQUIRED_FILES = [
  'INDEX.md',
  'config.yml',
  'journal.md',
  'architecture-overview.md',
  'data-models.md'
];

const OPTIONAL_FILES = [
  'components.md',
  'api-documentation.md',
  'deployment-guide.md',
  'development-workflow.md',
  'known-issues.md',
  'performance-guide.md',
  'security-guide.md',
  'roadmap.md'
];

// V2 Quality Standards
const V2_QUALITY_CHECKS = {
  minFileSize: 500, // bytes
  maxFileSize: 50000, // bytes
  
  // V2 Format Requirements
  requiredFADBlocks: ['📊 Facts', '🤔 Assumptions', '✅ Decisions'],
  citationPatterns: [
    /\(verified at [^)]+\)/gi,
    /\(verified in [^)]+\)/gi,
    /\(not found in provided files\)/gi,
    /\(inferred from [^)]+\)/gi,
    /\(unknown\)/gi
  ],
  
  // Anti-hallucination patterns (forbidden)
  forbiddenPatterns: [
    { pattern: /"[^"]*"/, message: 'Use single quotes instead of double quotes', severity: 'warning' },
    { pattern: /probably/gi, message: 'Avoid speculation - use Facts/Assumptions format', severity: 'error' },
    { pattern: /should be/gi, message: 'Document current state, not aspirational', severity: 'error' },
    { pattern: /typically/gi, message: 'Avoid generalizations without evidence', severity: 'warning' },
    { pattern: /usually/gi, message: 'Avoid generalizations without evidence', severity: 'warning' },
    { pattern: /best practices/gi, message: 'Be specific about which practices', severity: 'warning' },
    { pattern: /industry standard/gi, message: 'Specify which standards', severity: 'warning' }
  ],
  
  // Required V2 elements
  requiredPatterns: [
    'Last Updated',
    '📊 Facts',
    '🤔 Assumptions', 
    '✅ Decisions'
  ],
  
  // Budget tracking patterns
  budgetPatterns: {
    tokenUsage: /(\d+)K?\s+tokens/gi,
    budgetAllocation: /budget:\s*(\d+)K?\s+tokens/gi,
    deferredItems: /deferred.*?(\d+)K?\s+tokens/gi
  },
  
  // Citation requirements
  citationRequirements: {
    minCitationRate: 0.8, // 80% of factual claims should be cited
    factualClaimPatterns: [
      /uses? [A-Z][a-z]+/g, // "uses React", "uses MongoDB"
      /implements? [A-Z][a-z]+/g, // "implements JWT"
      /located at/g,
      /defined in/g,
      /configured with/g
    ]
  }
};

class DocumentationV2Validator {
  constructor(docsPath = 'cursor-docs', options = {}) {
    this.docsPath = docsPath;
    this.options = options;
    this.errors = [];
    this.warnings = [];
    this.stats = {
      filesProcessed: 0,
      totalTokensFound: 0,
      citationRate: 0,
      budgetUtilization: 0
    };
  }

  async validate() {
    console.log('🔍 AI-Context Documentation V2 Validation Starting...\n');
    
    try {
      // Check if documentation directory exists
      if (!this.docsPathExists()) {
        this.addError(`Documentation directory '${this.docsPath}' does not exist`);
        return this.generateReport();
      }

      // V2 Validation Steps
      await this.validateConfiguration();
      await this.validateJournal();
      await this.checkRequiredFiles();
      await this.checkOptionalFiles();
      await this.validateContentQuality();
      await this.validateFADFormat();
      await this.validateCitations();
      await this.validateBudgetTracking();
      await this.checkCrossReferences();
      await this.validateSingleQuotes();

      return this.generateReport();
    } catch (error) {
      this.addError(`Validation failed: ${error.message}`);
      return this.generateReport();
    }
  }

  docsPathExists() {
    return fs.existsSync(this.docsPath) && fs.statSync(this.docsPath).isDirectory();
  }

  async validateConfiguration() {
    const configPath = path.join(this.docsPath, 'config.yml');
    
    if (!fs.existsSync(configPath)) {
      this.addError('config.yml is required for V2 documentation');
      return;
    }

    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      // Basic YAML validation
      if (!configContent.includes('project_name:')) {
        this.addError('config.yml missing project_name');
      }
      
      if (!configContent.includes('size_category:')) {
        this.addError('config.yml missing size_category');
      }
      
      if (!configContent.includes('token_budget:')) {
        this.addError('config.yml missing token_budget');
      }

      // Check for V2 specific settings
      if (!configContent.includes('example_policy:')) {
        this.addWarning('config.yml missing example_policy (recommended for cost control)');
      }

      if (!configContent.includes('priority_paths:')) {
        this.addWarning('config.yml missing priority_paths (recommended for large projects)');
      }

      console.log('✅ Configuration validation completed');
    } catch (error) {
      this.addError(`Invalid config.yml format: ${error.message}`);
    }
  }

  async validateJournal() {
    const journalPath = path.join(this.docsPath, 'journal.md');
    
    if (!fs.existsSync(journalPath)) {
      this.addError('journal.md is required for V2 audit trails');
      return;
    }

    const content = fs.readFileSync(journalPath, 'utf8');
    
    // Check for journal entry format
    if (!content.includes('Goal:') && !content.includes('**Goal**:')) {
      this.addWarning('journal.md missing session goals');
    }
    
    if (!content.includes('Budget:') && !content.includes('**Budget**:')) {
      this.addWarning('journal.md missing budget tracking');
    }
    
    if (!content.includes('Facts') || !content.includes('Assumptions') || !content.includes('Decisions')) {
      this.addError('journal.md missing Facts/Assumptions/Decisions structure');
    }

    console.log('✅ Journal validation completed');
  }

  async checkRequiredFiles() {
    console.log('📋 Checking required files...');
    
    for (const filename of REQUIRED_FILES) {
      const filePath = path.join(this.docsPath, filename);
      
      if (!fs.existsSync(filePath)) {
        this.addError(`Required file missing: ${filename}`);
        continue;
      }

      const stats = fs.statSync(filePath);
      if (stats.size < V2_QUALITY_CHECKS.minFileSize) {
        this.addWarning(`File ${filename} is very small (${stats.size} bytes) - may be incomplete`);
      }

      this.stats.filesProcessed++;
    }
    
    console.log(`✅ Required files check completed (${REQUIRED_FILES.length} files)`);
  }

  async checkOptionalFiles() {
    console.log('📄 Checking optional files...');
    
    let optionalFilesFound = 0;
    
    for (const filename of OPTIONAL_FILES) {
      const filePath = path.join(this.docsPath, filename);
      
      if (fs.existsSync(filePath)) {
        optionalFilesFound++;
        this.stats.filesProcessed++;
        
        const stats = fs.statSync(filePath);
        if (stats.size < V2_QUALITY_CHECKS.minFileSize) {
          this.addWarning(`File ${filename} is very small (${stats.size} bytes) - may be incomplete`);
        }
      }
    }
    
    console.log(`✅ Optional files check completed (${optionalFilesFound}/${OPTIONAL_FILES.length} found)`);
  }

  async validateFADFormat() {
    console.log('📊 Validating Facts/Assumptions/Decisions format...');
    
    const mdFiles = [...REQUIRED_FILES, ...OPTIONAL_FILES].filter(f => f.endsWith('.md'));
    let filesWithFAD = 0;
    
    for (const filename of mdFiles) {
      const filePath = path.join(this.docsPath, filename);
      
      if (!fs.existsSync(filePath)) continue;
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip INDEX.md and journal.md for F/A/D requirements
      if (filename === 'INDEX.md' || filename === 'journal.md') continue;
      
      let hasFADBlocks = true;
      const missingBlocks = [];
      
      for (const block of V2_QUALITY_CHECKS.requiredFADBlocks) {
        if (!content.includes(block)) {
          hasFADBlocks = false;
          missingBlocks.push(block);
        }
      }
      
      if (!hasFADBlocks) {
        this.addError(`${filename} missing F/A/D blocks: ${missingBlocks.join(', ')}`);
      } else {
        filesWithFAD++;
      }
    }
    
    console.log(`✅ F/A/D format validation completed (${filesWithFAD} files with proper format)`);
  }

  async validateCitations() {
    console.log('🔗 Validating citation requirements...');
    
    const mdFiles = [...REQUIRED_FILES, ...OPTIONAL_FILES].filter(f => f.endsWith('.md'));
    let totalClaims = 0;
    let citedClaims = 0;
    
    for (const filename of mdFiles) {
      const filePath = path.join(this.docsPath, filename);
      
      if (!fs.existsSync(filePath)) continue;
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Count factual claims
      for (const pattern of V2_QUALITY_CHECKS.citationRequirements.factualClaimPatterns) {
        const matches = content.match(pattern) || [];
        totalClaims += matches.length;
      }
      
      // Count citations
      for (const pattern of V2_QUALITY_CHECKS.citationPatterns) {
        const matches = content.match(pattern) || [];
        citedClaims += matches.length;
      }
    }
    
    const citationRate = totalClaims > 0 ? citedClaims / totalClaims : 0;
    this.stats.citationRate = citationRate;
    
    if (citationRate < V2_QUALITY_CHECKS.citationRequirements.minCitationRate) {
      this.addError(`Citation rate too low: ${(citationRate * 100).toFixed(1)}% (minimum: ${V2_QUALITY_CHECKS.citationRequirements.minCitationRate * 100}%)`);
    }
    
    console.log(`✅ Citation validation completed (${(citationRate * 100).toFixed(1)}% citation rate)`);
  }

  async validateBudgetTracking() {
    console.log('💰 Validating budget tracking...');
    
    const journalPath = path.join(this.docsPath, 'journal.md');
    const configPath = path.join(this.docsPath, 'config.yml');
    
    let budgetInfo = {
      allocated: 0,
      used: 0,
      deferred: 0
    };
    
    // Check journal for budget usage
    if (fs.existsSync(journalPath)) {
      const journalContent = fs.readFileSync(journalPath, 'utf8');
      
      const usageMatches = journalContent.match(V2_QUALITY_CHECKS.budgetPatterns.tokenUsage) || [];
      const deferredMatches = journalContent.match(V2_QUALITY_CHECKS.budgetPatterns.deferredItems) || [];
      
      budgetInfo.used = usageMatches.length;
      budgetInfo.deferred = deferredMatches.length;
      
      this.stats.totalTokensFound = usageMatches.length;
    }
    
    // Check config for budget allocation
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      if (configContent.includes('token_budget:')) {
        budgetInfo.allocated = 1; // Found budget configuration
      }
    }
    
    if (budgetInfo.used === 0) {
      this.addWarning('No token usage tracking found in journal');
    }
    
    if (budgetInfo.allocated === 0) {
      this.addWarning('No budget allocation found in config');
    }
    
    console.log(`✅ Budget tracking validation completed`);
  }

  async validateSingleQuotes() {
    console.log('💬 Validating single quote usage...');
    
    const allFiles = fs.readdirSync(this.docsPath).filter(f => f.endsWith('.md'));
    let doubleQuoteViolations = 0;
    
    for (const filename of allFiles) {
      const filePath = path.join(this.docsPath, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for double quotes in code blocks and commands
      const codeBlockMatches = content.match(/```[\s\S]*?```/g) || [];
      
      for (const codeBlock of codeBlockMatches) {
        const doubleQuotes = (codeBlock.match(/"/g) || []).length;
        if (doubleQuotes > 0) {
          doubleQuoteViolations += doubleQuotes;
          this.addWarning(`${filename} contains ${doubleQuotes} double quotes in code blocks - use single quotes`);
        }
      }
    }
    
    console.log(`✅ Single quote validation completed (${doubleQuoteViolations} violations found)`);
  }

  async validateContentQuality() {
    console.log('📝 Validating content quality...');
    
    const allFiles = fs.readdirSync(this.docsPath).filter(f => f.endsWith('.md'));
    
    for (const filename of allFiles) {
      const filePath = path.join(this.docsPath, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for anti-hallucination patterns
      for (const check of V2_QUALITY_CHECKS.forbiddenPatterns) {
        const matches = content.match(check.pattern) || [];
        
        if (matches.length > 0) {
          const method = check.severity === 'error' ? 'addError' : 'addWarning';
          this[method](`${filename}: ${check.message} (${matches.length} occurrences)`);
        }
      }
      
      // Check file size
      const stats = fs.statSync(filePath);
      if (stats.size > V2_QUALITY_CHECKS.maxFileSize) {
        this.addWarning(`${filename} is very large (${stats.size} bytes) - consider splitting`);
      }
    }
    
    console.log(`✅ Content quality validation completed`);
  }

  async checkCrossReferences() {
    console.log('🔗 Checking cross-references...');
    
    const allFiles = fs.readdirSync(this.docsPath).filter(f => f.endsWith('.md'));
    let brokenLinks = 0;
    
    for (const filename of allFiles) {
      const filePath = path.join(this.docsPath, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Find markdown links
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      
      while ((match = linkPattern.exec(content)) !== null) {
        const linkPath = match[2];
        
        // Check internal links
        if (linkPath.startsWith('./') || linkPath.startsWith('../') || !linkPath.includes('://')) {
          const resolvedPath = path.resolve(path.dirname(filePath), linkPath);
          
          if (!fs.existsSync(resolvedPath)) {
            brokenLinks++;
            this.addError(`${filename} contains broken link: ${linkPath}`);
          }
        }
      }
    }
    
    console.log(`✅ Cross-reference check completed (${brokenLinks} broken links found)`);
  }

  addError(message) {
    this.errors.push(message);
    console.log(`❌ ERROR: ${message}`);
  }

  addWarning(message) {
    this.warnings.push(message);
    console.log(`⚠️  WARNING: ${message}`);
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 AI-CONTEXT DOCUMENTATION V2 VALIDATION REPORT');
    console.log('='.repeat(80));
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log(`Files processed: ${this.stats.filesProcessed}`);
    console.log(`Errors found: ${this.errors.length}`);
    console.log(`Warnings found: ${this.warnings.length}`);
    
    // V2 Specific Metrics
    console.log('\n💰 V2 METRICS:');
    console.log(`Citation rate: ${(this.stats.citationRate * 100).toFixed(1)}%`);
    console.log(`Token references found: ${this.stats.totalTokensFound}`);
    
    // Quality Assessment
    const qualityScore = this.calculateQualityScore();
    console.log(`Overall quality score: ${qualityScore}/100`);
    
    // Errors
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Warnings
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }
    
    // Budget Report (if requested)
    if (this.options.budgetReport) {
      this.generateBudgetReport();
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    this.generateRecommendations();
    
    console.log('\n' + '='.repeat(80));
    
    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      stats: this.stats,
      qualityScore
    };
  }

  calculateQualityScore() {
    let score = 100;
    
    // Deduct points for errors and warnings
    score -= this.errors.length * 10;
    score -= this.warnings.length * 2;
    
    // Citation rate bonus/penalty
    if (this.stats.citationRate >= 0.9) {
      score += 5;
    } else if (this.stats.citationRate < 0.7) {
      score -= 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  generateBudgetReport() {
    console.log('\n💰 BUDGET ANALYSIS:');
    
    const journalPath = path.join(this.docsPath, 'journal.md');
    
    if (fs.existsSync(journalPath)) {
      const content = fs.readFileSync(journalPath, 'utf8');
      
      // Extract budget information
      const budgetMatches = content.match(/budget:\s*(\d+)K?\s+tokens.*?used:\s*(\d+(?:\.\d+)?)K?\s+tokens/gi);
      
      if (budgetMatches && budgetMatches.length > 0) {
        console.log('Recent budget usage:');
        budgetMatches.forEach((match, index) => {
          console.log(`  Session ${index + 1}: ${match}`);
        });
      } else {
        console.log('No detailed budget information found in journal');
      }
    }
    
    // Token distribution analysis
    console.log(`\nToken references found: ${this.stats.totalTokensFound}`);
    console.log('Consider implementing delta updates for cost optimization');
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.errors.length > 0) {
      recommendations.push('Fix all errors before considering documentation complete');
    }
    
    if (this.stats.citationRate < 0.8) {
      recommendations.push('Improve citation rate by adding file references to factual claims');
    }
    
    if (this.warnings.filter(w => w.includes('double quotes')).length > 0) {
      recommendations.push('Replace double quotes with single quotes in all code examples');
    }
    
    if (this.stats.totalTokensFound === 0) {
      recommendations.push('Add budget tracking to journal entries for better cost control');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Documentation meets V2 quality standards! Consider sharing your implementation with the community.');
    }
    
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const docsPath = args[0] || 'cursor-docs';
  const options = {
    budgetReport: args.includes('--budget-report')
  };
  
  const validator = new DocumentationV2Validator(docsPath, options);
  const result = await validator.validate();
  
  process.exit(result.success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DocumentationV2Validator, V2_QUALITY_CHECKS };
